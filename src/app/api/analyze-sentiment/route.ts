import { HfInference } from '@huggingface/inference';
import { NextResponse } from 'next/server';

const hfToken = process.env.HUGGING_FACE_TOKEN;

export async function POST(req: Request) {
    if (!hfToken) {
        return NextResponse.json({ error: 'API token missing' }, { status: 500 });
    }

    try {
        const { text } = await req.json();
        const hf = new HfInference(hfToken);

        // Using a highly accurate emotion classification model
        const result = await hf.textClassification({
            model: 'j-hartmann/emotion-english-distilroberta-base',
            inputs: text,
        });

        // Map the results to our app's Happy/Neutral/Sad labels
        // joy -> Happy
        // neutral -> Neutral
        // surprise -> Neutral
        // anger, disgust, fear, sadness -> Sad

        const topEmotion = result[0].label;

        let detectedMood: 'Happy' | 'Neutral' | 'Sad' = 'Neutral';

        if (topEmotion === 'joy') {
            detectedMood = 'Happy';
        } else if (['anger', 'disgust', 'fear', 'sadness'].includes(topEmotion)) {
            detectedMood = 'Sad';
        } else {
            detectedMood = 'Neutral';
        }

        // --- Innovation 3: Cognitive Distortion Detection (Rule-based) ---
        const distortions: string[] = [];
        const lowerText = text.toLowerCase();

        if (lowerText.includes('always') || lowerText.includes('never') || lowerText.includes('everyone') || lowerText.includes('no one') || lowerText.includes('every time')) {
            distortions.push('Overgeneralization');
        }
        if (lowerText.includes('should') || lowerText.includes('must') || lowerText.includes('ought to') || lowerText.includes('have to')) {
            distortions.push('Should Statements');
        }
        if (lowerText.includes('worst') || lowerText.includes('failure') || lowerText.includes('disaster') || lowerText.includes('ruined') || lowerText.includes('horrible')) {
            distortions.push('Catastrophizing');
        }
        if (lowerText.includes('totally') || lowerText.includes('completely') || lowerText.includes('either') || lowerText.includes('entirely')) {
            distortions.push('All-or-Nothing Thinking');
        }
        if (lowerText.includes('i feel') && (lowerText.includes('worthless') || lowerText.includes('stupid') || lowerText.includes('loser'))) {
            distortions.push('Emotional Reasoning');
        }

        return NextResponse.json({
            mood: detectedMood,
            raw: topEmotion,
            score: result[0].score,
            distortions: distortions
        });

    } catch (error: any) {
        console.error('Sentiment Analysis Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
