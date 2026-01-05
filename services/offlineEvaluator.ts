import { ACADEMIC_CURRICULUM, ModuleContent } from '../data/curriculum';
import { CyberPathResponse } from '../types';

export const evaluateOffline = (command: string, moduleKey: string): CyberPathResponse => {
    const moduleContent = ACADEMIC_CURRICULUM[moduleKey];

    // Default fallback response if module not found or no rules
    const defaultResponse: CyberPathResponse = {
        header: {
            status: 'error',
            timestamp: new Date().toISOString()
        },
        payload: {
            evaluation: {
                is_correct: false,
                score: 0,
                feedback: "Módulo no reconocido o sin reglas de validación offline.",
                technical_details: "Offline Validator - No Rules Found"
            }
        }
    };

    if (!moduleContent || !moduleContent.validation_rules) {
        return defaultResponse;
    }

    const { allowed_commands, expected_output_match } = moduleContent.validation_rules;

    // Check if command matches any regex
    const isCommandValid = allowed_commands.some(regex => regex.test(command));

    if (isCommandValid) {
        // Select a random simulated output or a generic success message
        const outputSimulation = expected_output_match
            ? expected_output_match[Math.floor(Math.random() * expected_output_match.length)]
            : "Command executed successfully.";

        return {
            header: {
                status: 'success',
                timestamp: new Date().toISOString()
            },
            payload: {
                evaluation: {
                    is_correct: true,
                    score: 100,
                    feedback: `[OFFLINE] Comando válido detectado. El sistema responde: "${outputSimulation}"`,
                    technical_details: `Matched pattern for module ${moduleKey}`
                },
                next_content: {
                    theory: moduleContent.theory_block,
                    lab_setup: "Continuar con el siguiente objetivo."
                }
            }
        };
    } else {
        return {
            header: {
                status: 'success', // Status is success (network-wise), but evaluation is failure
                timestamp: new Date().toISOString()
            },
            payload: {
                evaluation: {
                    is_correct: false,
                    score: 0,
                    feedback: "[OFFLINE] Comando no reconocido o sintaxis incorrecta para este objetivo.",
                    technical_details: "Offline Validator - Pattern Mismatch"
                },
                hints: ["Revisa la sintaxis del comando.", "Asegúrate de usar las flags correctas mencionadas en la teoría."]
            }
        };
    }
};
