import Challenge from '../models/Challenge.model';
import User from '../models/User.model';
import mongoose from 'mongoose';

/**
 * Create a Group Challenge or Duel
 */
export const createGroupChallenge = async (
    creatorId: string,
    challengeData: any,
    invitedUserIds: string[] = []
) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const creator = await User.findById(creatorId);
        if (!creator) throw new Error('Creator not found');

        // Calculate prize pool
        const depositAmount = challengeData.deposit.amount;
        const totalParticipants = invitedUserIds.length + 1; // +1 for creator
        const prizePoolTotal = depositAmount * totalParticipants;

        // Create participants array
        const participants = [
            {
                user: creatorId,
                joinedAt: new Date(),
                status: 'joined',
                deposit: {
                    amount: depositAmount,
                    paid: false
                },
                performance: {
                    completedCheckIns: 0,
                    missedCheckIns: 0
                }
            },
            ...invitedUserIds.map(userId => ({
                user: userId,
                joinedAt: new Date(),
                status: 'invited',
                deposit: {
                    amount: depositAmount,
                    paid: false
                },
                performance: {
                    completedCheckIns: 0,
                    missedCheckIns: 0
                }
            }))
        ];

        const challenge = await Challenge.create([{
            ...challengeData,
            challengeType: challengeData.challengeType || 'group',
            maxParticipants: totalParticipants,
            participants,
            prizePool: {
                total: prizePoolTotal,
                distribution: challengeData.prizeDistribution || 'winner_takes_all',
                winners: [],
                distributed: false
            }
        }], { session });

        await session.commitTransaction();
        return challenge[0];

    } catch (error) {
        await session.abortTransaction();
        throw error;
    } finally {
        session.endSession();
    }
};

/**
 * Join a Group Challenge
 */
export const joinGroupChallenge = async (challengeId: string, userId: string) => {
    const challenge = await Challenge.findById(challengeId);
    if (!challenge) throw new Error('Challenge not found');

    if (challenge.challengeType === 'solo') {
        throw new Error('Cannot join a solo challenge');
    }

    const participant = challenge.participants?.find(p => p.user.toString() === userId);
    if (!participant) throw new Error('User not invited to this challenge');

    if (participant.status !== 'invited') {
        throw new Error('Invitation already responded to');
    }

    participant.status = 'joined';
    participant.joinedAt = new Date();

    await challenge.save();
    return challenge;
};

/**
 * Calculate and Distribute Prize Pool
 */
export const distributePrizePool = async (challengeId: string) => {
    const challenge = await Challenge.findById(challengeId).populate('participants.user');
    if (!challenge || !challenge.prizePool) throw new Error('Challenge or prize pool not found');

    if (challenge.prizePool.distributed) {
        throw new Error('Prize pool already distributed');
    }

    // Get successful participants (those who completed)
    const successfulParticipants = challenge.participants?.filter(p => 
        p.status === 'joined' && 
        p.performance.completedCheckIns >= (challenge.requiredCheckIns * 0.8) // 80% threshold
    ) || [];

    if (successfulParticipants.length === 0) {
        // No winners - donate to charity
        challenge.charity.donated = true;
        challenge.charity.amount = challenge.prizePool.total;
        challenge.charity.donatedAt = new Date();
        challenge.prizePool.distributed = true;
        await challenge.save();
        return { winners: [], donated: true };
    }

    // Sort by performance
    successfulParticipants.sort((a, b) => 
        b.performance.completedCheckIns - a.performance.completedCheckIns
    );

    let winners: mongoose.Types.ObjectId[] = [];
    const prizePerWinner = challenge.prizePool.total / successfulParticipants.length;

    switch (challenge.prizePool.distribution) {
        case 'winner_takes_all':
            winners = [successfulParticipants[0].user];
            // Award full prize to winner
            await User.findByIdAndUpdate(winners[0], {
                $inc: { 'balance.amount': challenge.prizePool.total }
            });
            break;

        case 'equal_split':
            winners = successfulParticipants.map(p => p.user);
            // Award equal share to all
            for (const participant of successfulParticipants) {
                await User.findByIdAndUpdate(participant.user, {
                    $inc: { 'balance.amount': prizePerWinner }
                });
            }
            break;

        case 'top_performers':
            // Top 3 get prizes
            const topCount = Math.min(3, successfulParticipants.length);
            winners = successfulParticipants.slice(0, topCount).map(p => p.user);
            const topPrize = challenge.prizePool.total / topCount;
            for (let i = 0; i < topCount; i++) {
                await User.findByIdAndUpdate(successfulParticipants[i].user, {
                    $inc: { 'balance.amount': topPrize }
                });
            }
            break;
    }

    challenge.prizePool.winners = winners;
    challenge.prizePool.distributed = true;
    await challenge.save();

    return { winners, distributed: true };
};
