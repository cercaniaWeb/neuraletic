import { CyberPathRequest, CyberPathResponse } from '../types';

export const sendToCyberPathEngine = async (payload: CyberPathRequest): Promise<CyberPathResponse> => {
    try {
        const prompt = JSON.stringify(payload);
        const systemInstruction = `Eres el "CyberPath Engine", el núcleo de IA de una plataforma de entrenamiento de ciberseguridad.
                
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
                5. Nunca reveles la flag final directamente.`;

        const response = await fetch('http://localhost:3001/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                prompt,
                systemInstruction
            })
        });

        if (!response.ok) {
            throw new Error(`Server returned ${response.status}: ${response.statusText}`);
        }

        const jsonResponse = await response.json();

        if (jsonResponse.status === 'success' && jsonResponse.data) {
            const parsedResponse = jsonResponse.data;

            // Ensure header exists just in case the AI omitted it
            if (!parsedResponse.header && (parsedResponse.evaluation || parsedResponse.next_content)) {
                return {
                    header: { status: 'success', timestamp: new Date().toISOString() },
                    payload: parsedResponse
                } as CyberPathResponse;
            }
            return parsedResponse as CyberPathResponse;
        } else {
            throw new Error(jsonResponse.error || "Invalid response format from Rotating API");
        }

    } catch (error) {
        console.error("Error communicating with CyberPath Rotating Engine:", error);
        let errorMessage = "An unknown error occurred.";
        if (error instanceof Error) errorMessage = error.message;

        return {
            header: { status: 'error', timestamp: new Date().toISOString() },
            payload: {
                evaluation: {
                    is_correct: false, score: 0,
                    feedback: `Engine Communication Error: ${errorMessage}`,
                    technical_details: `Failed to process request. Is the local server running?`,
                },
                hints: ["Check if 'npm run server' is running in a separate terminal.", "The offline mode will activate automatically."],
            }
        };
    }
};