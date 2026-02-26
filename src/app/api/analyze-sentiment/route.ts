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

        return NextResponse.json({ 
            mood: detectedMood,
            raw: topEmotion,
            score: result[0].score 
        });

    } catch (error: any) {
        console.error('Sentiment Analysis Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
