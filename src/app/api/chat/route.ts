import { HfInference } from '@huggingface/inference';
import { NextResponse } from 'next/server';

const hfToken = process.env.HUGGING_FACE_TOKEN;

// Failover models in order of preference
const MODELS = [
    'microsoft/Phi-3-mini-4k-instruct',
    'HuggingFaceH4/zephyr-7b-beta',
    'mistralai/Mistral-7B-Instruct-v0.3',
    'Qwen/Qwen2.5-7B-Instruct'
];

async function tryModel(hf: HfInference, model: string, messages: any[]) {
    return await hf.chatCompletion({
        model: model,
        messages: messages,
        max_tokens: 500,
        temperature: 0.7,
        top_p: 0.9,
    }, {
        wait_for_model: true
    } as any);
}

export async function POST(req: Request) {
    if (!hfToken) {
        return NextResponse.json({ error: 'API token missing from .env.local' }, { status: 500 });
    }

    const hf = new HfInference(hfToken);

    try {
        const { messages, detectedMood } = (await req.json()) as { messages: any[], detectedMood?: string };

        // --- Innovation 4: Soul-First Context Injection ---
        let resonancePrefix = "You are a warm, empathic wellness companion. Your primary goal is to validate the user's feelings.";

        if (detectedMood === 'Sad') {
            resonancePrefix = "The user is currently feeling Sad or vulnerable. Be hyper-empathic, use soft language, and prioritize emotional safety. Do not rush into solutions; just hold space for them.";
        } else if (detectedMood === 'Happy') {
            resonancePrefix = "The user is feeling Happy. Mirror their energy with warmth and celebration, but remain grounded and supportive.";
        }

        // Ensure the messages format is correct for the API
        const formattedMessages = messages.map((m: any) => {
            if (m.role === 'system') {
                return { role: 'system', content: `${resonancePrefix}\n\n${m.content}` };
            }
            return {
                role: m.role || 'user',
                content: m.content || m.text || ''
            };
        });

        let response = null;
        let lastError: any = null;

        // Failover loop
        for (const model of MODELS) {
            try {
                console.log(`Attempting AI generation with model: ${model}`);
                response = await tryModel(hf, model, formattedMessages);
                if (response?.choices?.[0]?.message?.content) {
                    console.log(`Success with model: ${model}`);
                    break;
                }
            } catch (err: any) {
                console.error(`Model ${model} failed:`, err.message);
                lastError = err;
                if (err.status === 401) break; // Token is invalid
                continue;
            }
        }

        if (!response || !response.choices || response.choices.length === 0) {
            throw new Error(lastError?.message || 'All AI models failed to respond');
        }

        const content = response.choices?.[0]?.message?.content || "I am here, and I am listening. Tell me more.";

        return NextResponse.json({
            content: content.trim()
        });

    } catch (error: any) {
        console.error('Final AI API Error:', error.message);
        return NextResponse.json({
            error: error.message || 'AI unavailable',
            details: error.message
        }, { status: 500 });
    }
}
