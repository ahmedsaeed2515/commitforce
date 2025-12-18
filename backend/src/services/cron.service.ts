import cron from 'node-cron';
import Challenge from '../models/Challenge.model';
import CheckIn from '../models/CheckIn.model';
import User from '../models/User.model';
import * as groupChallengeService from './groupChallenge.service';

const processExpiredChallenges = async () => {
  console.log('🔄 Running daily challenge processor...');
  const now = new Date();

  // Find active challenges that have ended
  const expiredChallenges = await Challenge.find({
    status: 'active',
    endDate: { $lt: now }
  });

  console.log(`Found ${expiredChallenges.length} expired challenges.`);

  for (const challenge of expiredChallenges) {
    try {
      // Calculate stats
      const durationMs = new Date(challenge.endDate).getTime() - new Date(challenge.startDate).getTime();
      const totalDays = Math.ceil(durationMs / (1000 * 60 * 60 * 24));
      
      // Get verified check-ins
      const checkInsCount = await CheckIn.countDocuments({
        challenge: challenge._id,
        verified: true
      });

      const successRate = (checkInsCount / totalDays) * 100;
      const isSuccess = successRate >= 80; // 80% threshold

      // Update Challenge Status
      challenge.status = isSuccess ? 'completed' : 'failed';
      
      if (isSuccess) {
        challenge.completedAt = now;
      } else {
        challenge.failedAt = now;
      }
      
      await challenge.save();

      // Update User Stats (for solo challenges)
      if (challenge.challengeType === 'solo') {
        const updateQuery: Record<string, unknown> = {
          $inc: { 
              activeChallenges: -1,
              [isSuccess ? 'completedChallenges' : 'failedChallenges']: 1
          }
        };
        
        // Update success rate
        const user = await User.findById(challenge.user);
        if (user) {
          const totalChallenges = user.completedChallenges + user.failedChallenges + 1;
          const newSuccessRate = ((user.completedChallenges + (isSuccess ? 1 : 0)) / totalChallenges) * 100;
          updateQuery.successRate = newSuccessRate;
        }
        
        await User.findByIdAndUpdate(challenge.user, updateQuery);

        // Financial Logic for Solo
        if (isSuccess && challenge.deposit.paid) {
          // Return deposit + reward
          await User.findByIdAndUpdate(challenge.user, {
            $inc: { 
              'balance.amount': challenge.deposit.amount + challenge.reward.amount,
              totalEarned: challenge.reward.amount
            }
          });
          console.log(`✅ User ${challenge.user} earned $${challenge.reward.amount}`);
        } else if (!isSuccess && challenge.deposit.paid) {
          // Donate to charity
          challenge.charity.donated = true;
          challenge.charity.amount = challenge.deposit.amount;
          challenge.charity.donatedAt = now;
          await challenge.save();
          
          await User.findByIdAndUpdate(challenge.user, {
            $inc: { totalDonated: challenge.deposit.amount }
          });
          console.log(`💔 User ${challenge.user} lost $${challenge.deposit.amount} (donated)`);
        }
      } 
      // Handle Group Challenges
      else if (challenge.challengeType === 'duel' || challenge.challengeType === 'group') {
        console.log(`🏆 Processing group challenge ${challenge._id}...`);
        
        // Update participant performance
        if (challenge.participants) {
          for (const participant of challenge.participants) {
            const participantCheckIns = await CheckIn.countDocuments({
              challenge: challenge._id,
              user: participant.user,
              verified: true
            });
            
            participant.performance.completedCheckIns = participantCheckIns;
            participant.performance.missedCheckIns = totalDays - participantCheckIns;
          }
          await challenge.save();
        }
        
        // Distribute prize pool
        try {
          const result = await groupChallengeService.distributePrizePool(challenge._id.toString());
          console.log(`💰 Prize pool distributed. Winners: ${result.winners?.length || 0}`);
        } catch (error) {
          console.error(`Failed to distribute prize pool for ${challenge._id}:`, error);
        }
      }

      console.log(`✅ Challenge ${challenge._id} processed. Result: ${isSuccess ? 'Success' : 'Fail'} (${successRate.toFixed(1)}%)`);

    } catch (err) {
      console.error(`❌ Error processing challenge ${challenge._id}:`, err);
    }
  }
  
  console.log('✅ Daily challenge processing complete.');
};

// Run every hour (for robustness)
export const initCronJobs = () => {
    cron.schedule('0 * * * *', processExpiredChallenges);
    console.log('📅 Cron jobs initialized (runs hourly)');
};

// Export for manual testing
export const runDailyTasks = processExpiredChallenges;
