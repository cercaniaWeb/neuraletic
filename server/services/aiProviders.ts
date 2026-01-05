import Groq from 'groq-sdk';
import Cerebras from '@cerebras/cerebras_cloud_sdk';
import dotenv from 'dotenv';

dotenv.config();

export interface AiService {
    name: string;
    generateResponse(prompt: string, systemInstruction: string): Promise<string>;
}

// --- Groq Implementation ---
class GroqService implements AiService {
    name = 'Groq (Llama-3.3-70b)';
    private client: Groq;

    constructor() {
        if (!process.env.GROQ_API_KEY) console.warn("Missing GROQ_API_KEY");
        this.client = new Groq({ apiKey: process.env.GROQ_API_KEY });
    }

    async generateResponse(prompt: string, systemInstruction: string): Promise<string> {
        const completion = await this.client.chat.completions.create({
            messages: [
                { role: 'system', content: systemInstruction },
                { role: 'user', content: prompt }
            ],
            model: 'llama-3.3-70b-versatile',
            temperature: 0.1,
            response_format: { type: 'json_object' }
        });
        return completion.choices[0]?.message?.content || "";
    }
}

// --- Cerebras Implementation ---
class CerebrasService implements AiService {
    name = 'Cerebras (Llama-3.1-70b)';
    private client: Cerebras;

    constructor() {
        if (!process.env.CEREBRAS_API_KEY) console.warn("Missing CEREBRAS_API_KEY");
        this.client = new Cerebras({ apiKey: process.env.CEREBRAS_API_KEY });
    }

    async generateResponse(prompt: string, systemInstruction: string): Promise<string> {
        const completion = await this.client.chat.completions.create({
            messages: [
                { role: 'system', content: systemInstruction },
                { role: 'user', content: prompt }
            ],
            model: 'llama3.1-70b',
            temperature: 0.1,
            response_format: { type: 'json_object' }
        });
        return completion.choices[0]?.message?.content || "";
    }
}

export const groqService = new GroqService();
export const cerebrasService = new CerebrasService();
