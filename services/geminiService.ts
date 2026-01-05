import { GoogleGenAI } from "@google/genai";
import { CyberPathRequest, CyberPathResponse, Payload } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set. Please configure it to connect to the CyberPath Engine.");
}
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

export const sendToCyberPathEngine = async (payload: CyberPathRequest): Promise<CyberPathResponse> => {
    try {
        const prompt = JSON.stringify(payload);

        const response = await ai.models.generateContent({
            model: 'gemini-flash-latest',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                temperature: 0.1,
                systemInstruction: `Eres el "CyberPath Engine", el núcleo de IA de una plataforma de entrenamiento de ciberseguridad.
                
                TU OBJETIVO: Evaluar comandos del usuario o generar nuevas lecciones de hacking ético.
                
                FORMATO DE RESPUESTA (ESTRICTO JSON):
                {
                  "header": {
                    "status": "success",
                    "timestamp": "ISO-STRING"
                  },
                  "payload": {
                    "evaluation": {
                      "is_correct": boolean,
                      "score": number,
                      "feedback": "Texto detallado y socrático",
                      "technical_details": "Explicación técnica profunda"
                    },
                    "next_content": { 
                      "theory": "Explicación teórica BREVE y DIRECTA.",
                      "lab_setup": "OBJETIVO CLARO: 'Tu objetivo es escanear la IP 192.168.1.5'. Define SIEMPRE una IP o dominio objetivo."
                    },
                    "hints": ["pista 1", "pista 2"]
                  }
                }

                REGLAS DE COMPORTAMIENTO:
                1. MENTOR PRÁCTICO: No des largas clases teóricas. Da una misión concreta.
                2. SIEMPRE define un TARGET (IP, Dominio, Archivo) en 'lab_setup' y 'theory'. Ejemplo: "Target: 192.168.1.5".
                3. Si la acción es 'generate_lesson', crea un escenario de laboratorio inmediato.
                4. Si la acción es 'evaluate', simula la salida del comando como si fueras un sistema Linux real y analiza la eficacia.
                5. Nunca reveles la flag final directamente.`,
                topK: 64,
                topP: 0.95,
            },
        });

        const responseText = response.text;
        if (!responseText) {
            throw new Error("Received an empty response from the CyberPath Engine.");
        }

        const cleanedJson = responseText.replace(/^```json\n|```$/g, '').trim();
        let parsedResponse: any;
        try {
            parsedResponse = JSON.parse(cleanedJson);
        } catch (e) {
            console.error("Failed to parse JSON from AI:", cleanedJson, e);
            throw new Error("Invalid JSON structure received from engine.");
        }

        // Basic recovery: if the AI forgot the header but sent the payload content directly
        if (!parsedResponse.header && (parsedResponse.evaluation || parsedResponse.next_content)) {
            return {
                header: { status: 'success', timestamp: new Date().toISOString() },
                payload: parsedResponse
            };
        }

        return parsedResponse as CyberPathResponse;

    } catch (error) {
        console.error("Error communicating with CyberPath Engine:", error);
        let errorMessage = "An unknown error occurred.";
        if (error instanceof Error) errorMessage = error.message;

        return {
            header: { status: 'error', timestamp: new Date().toISOString() },
            payload: {
                evaluation: {
                    is_correct: false, score: 0,
                    feedback: `Engine Communication Error: ${errorMessage}`,
                    technical_details: `Failed to process request: ${JSON.stringify(payload)}`,
                },
                trainee_graph_update: { current_node: 'error_state', edge_type: 'mistake', concept_drift: 'api_error' },
                hints: ["Check the browser console for detailed error logs.", "Verify the API key is valid and has permissions."],
            }
        };
    }
};