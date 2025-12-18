
// Import Google Cloud Vision
let vision: any;
try {
    const visionLib = require('@google-cloud/vision');
    vision = new visionLib.ImageAnnotatorClient();
} catch (error) {
    console.warn('⚠️ Google Cloud Vision not configured. AI verification will run in MOCK mode.');
}

interface AIAnalysisResult {
    verified: boolean;
    confidence: number; // 0 to 100
    labels: string[];
    reason: string;
    isSafe: boolean;
    isOriginal: boolean; // Not stolen from web
}

export const analyzeImage = async (imageUrl: string, category: string): Promise<AIAnalysisResult> => {
    // ---------------------------------------------------------
    // 1. MOCK MODE (If no API Key)
    // ---------------------------------------------------------
    if (!vision) {
        console.log('🤖 [AI MOCK] Skipping real analysis.');
        return { 
            verified: true, 
            confidence: 85, 
            labels: ['mock_gym', 'mock_verified'], 
            reason: 'Mock verification passed (No API Key)',
            isSafe: true,
            isOriginal: true
        };
    }

    try {
        console.log(`🧠 AI Analyzing: ${category} image...`);

        // Perform multiple detections in parallel
        const [result] = await vision.annotateImage({
            image: { source: { imageUri: imageUrl } },
            features: [
                { type: 'LABEL_DETECTION', maxResults: 15 },
                { type: 'SAFE_SEARCH_DETECTION' },
                { type: 'WEB_DETECTION', maxResults: 5 }, // Check if stolen
                { type: 'TEXT_DETECTION' }, // For reading/coding
                { type: 'FACE_DETECTION' }  // For selfies
            ]
        });

        // ---------------------------------------------------------
        // 2. SAFETY CHECK (NSFW Filter)
        // ---------------------------------------------------------
        const safe = result.safeSearchAnnotation;
        const isSafe = 
            safe.adult !== 'LIKELY' && safe.adult !== 'VERY_LIKELY' &&
            safe.violence !== 'LIKELY' && safe.violence !== 'VERY_LIKELY';

        if (!isSafe) {
            return {
                verified: false,
                confidence: 0,
                labels: [],
                reason: 'Image flagged as inappropriate/unsafe from SafeSearch.',
                isSafe: false,
                isOriginal: true
            };
        }

        // ---------------------------------------------------------
        // 3. ANTI-CHEAT (Web Detection)
        // ---------------------------------------------------------
        const web = result.webDetection;
        // If we find full matching images on the web, it's likely downloaded
        const isOriginal = !web.fullMatchingImages || web.fullMatchingImages.length === 0;

        // ---------------------------------------------------------
        // 4. CATEGORY SPECIFIC SCORING
        // ---------------------------------------------------------
        const labels = result.labelAnnotations?.map((l: any) => l.description?.toLowerCase()) || [];
        const text = result.fullTextAnnotation?.text?.toLowerCase() || '';

        let score = 0;
        let matchedKeywords: string[] = [];

        // ---------------------------------------------------------
        // 5. ADVANCED FEATURES (Face & Quality)
        // ---------------------------------------------------------
        const faceAnnotations = result.faceAnnotations || [];
        const hasFace = faceAnnotations.length > 0;
        
        // Quality Heuristics (Simple approximation based on label count)
        const isLowQuality = labels.length < 3; 

        if (isLowQuality) {
            score -= 20; // Penalty for bad quality
        }

        switch (category.toLowerCase()) {
            case 'fitness':
            case 'sports':
                const gymKeywords = ['gym', 'fitness', 'muscle', 'dumbbells', 'weight', 'running', 'sport', 'athlete', 'leggings', 'shorts', 'yoga'];
                score = calculateScore(labels, gymKeywords, matchedKeywords);
                
                // Bonus if a person/face is detected (Selfie proof)
                if (hasFace) {
                    score += 15;
                    matchedKeywords.push('face_detected');
                }
                break;

            case 'reading':
            case 'study':
                const bookKeywords = ['book', 'novel', 'text', 'paper', 'page', 'library', 'reading'];
                score = calculateScore(labels, bookKeywords, matchedKeywords);
                
                // Deep OCR: Look for structure
                if (text.length > 50) score += 30;
                if (/chapter|page|section|introduction|author/i.test(text)) {
                    score += 20;
                    matchedKeywords.push('book_structure_detected');
                }
                break;

            case 'coding':
            case 'programming':
                const techKeywords = ['monitor', 'screen', 'laptop', 'computer', 'keyboard', 'code', 'text'];
                score = calculateScore(labels, techKeywords, matchedKeywords);
                
                // Deep OCR: Look for syntax
                const syntaxScore = (text.match(/function|const|var|import|class|return|\{|\}/g) || []).length;
                if (syntaxScore > 3) {
                    score += 40;
                    matchedKeywords.push('code_syntax_detected');
                }
                break;

            case 'nutrition':
                 const foodKeywords = ['food', 'meal', 'dish', 'plate', 'fruit', 'vegetable', 'healthy', 'protein'];
                 score = calculateScore(labels, foodKeywords, matchedKeywords);
                 break;

            default:
                score = 50;
                break;
        }

        // Penalty for stolen images (Severe)
        if (!isOriginal) {
            score = 0; // Automatic fail for stolen images in Ultra mode
            return {
                verified: false,
                confidence: 0,
                labels: labels.slice(0, 5),
                reason: '🚨 REJECTED: Image found on the web (Anti-Cheat triggered).',
                isSafe: true,
                isOriginal: false
            };
        }

        score = Math.min(score, 100);
        const threshold = 75; // Stricter threshold
        const verified = score >= threshold;

        return {
            verified,
            confidence: score,
            labels: labels.slice(0, 5),
            reason: verified 
                ? `✅ Excellent Match! (${matchedKeywords.join(', ')})` 
                : `⚠️ Low Confidence (${score}%). Found: ${labels.slice(0,3).join(', ')}. Try better lighting or framing.`,
            isSafe: true,
            isOriginal: true
        };

    } catch (error) {
        console.error('❌ AI Error:', error);
        return { verified: false, confidence: 0, labels: [], reason: 'AI Analysis Error', isSafe: true, isOriginal: true };
    }
};

// Helper: Scoring Logic
function calculateScore(foundLabels: string[], targetKeywords: string[], foundMatches: string[]): number {
    let score = 0;
    foundLabels.forEach(label => {
        targetKeywords.forEach(keyword => {
            if (label.includes(keyword)) {
                if (!foundMatches.includes(keyword)) {
                    score += 25; // Each unique keyword match adds points
                    foundMatches.push(keyword);
                }
            }
        });
    });
    return score;
}
