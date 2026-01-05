import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';
import { groqService, cerebrasService, AiService } from './services/aiProviders';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
// Serve static files from the React app build directory
app.use(express.static(path.join(__dirname, '../dist')));

// Load Balancer State
const services: AiService[] = [groqService, cerebrasService];
let currentServiceIndex = 0;

function getNextService(): AiService {
    const service = services[currentServiceIndex];
    currentServiceIndex = (currentServiceIndex + 1) % services.length;
    return service;
}

app.post('/api/generate', async (req, res) => {
    try {
        const { prompt, systemInstruction } = req.body;

        // Simple Round Robin
        const service = getNextService();
        console.log(`[LoadBalancer] Routing request to: ${service.name}`);

        try {
            const responseText = await service.generateResponse(prompt, systemInstruction);
            res.json({
                status: 'success',
                provider: service.name,
                data: JSON.parse(responseText)
            });
        } catch (providerError) {
            console.error(`[LoadBalancer] Error with ${service.name}:`, providerError);
            // Failover logic could go here (try next service)
            // For now, simple error return
            res.status(500).json({ error: `Provider ${service.name} failed`, details: providerError });
        }

    } catch (error) {
        console.error("Server Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Real System Execution Endpoint
app.post('/api/terminal/exec', (req, res) => {
    const { command } = req.body;

    if (!command || typeof command !== 'string') {
        res.status(400).json({ error: 'Valid command required' });
        return;
    }

    // Safety Blocklist for "Real Mode"
    const blocked = ['rm ', 'mv ', 'shutdown', 'reboot', ':(){:|:&};:', 'dd '];
    if (blocked.some(b => command.includes(b))) {
        res.json({ output: '\x1b[1;31m🚫 SYSTEM ALERT: Comando bloqueado por protocolos de seguridad del laboratorio.\x1b[0m' });
        return;
    }

    let finalCommand = command;

    // Cloud Environment Adaptor: Inject flags for non-root network access if needed
    if (finalCommand.trim().startsWith('nmap')) {
        if (!finalCommand.includes('--unprivileged') && !finalCommand.includes('-sT')) {
            finalCommand += ' --unprivileged';
        }
    }

    console.log(`[RealTerminal] Executing: ${finalCommand}`);

    // Execution with timeout and constrained buffer
    exec(finalCommand, { timeout: 45000, maxBuffer: 1024 * 1024 }, (error, stdout, stderr) => {
        let output = stdout;
        if (stderr) {
            output += `\n\x1b[33m[STDERR]\n${stderr}\x1b[0m`;
        }
        if (error) {
            // If the command failed (exit code != 0), we still return the output (like nmap failing to find host)
            // but we might want to append the error message if stdout is empty
            if (!output) output = `Error executing command: ${error.message}`;
        }
        res.json({ output: output || '' });
    });
});

// Client-side routing: serve index.html for any non-API route
app.get(/.*/, (req, res) => {
    if (req.path.startsWith('/api')) {
        res.status(404).json({ error: 'Endpoint not found' });
        return;
    }
    res.sendFile(path.join(__dirname, '../dist/index.html'));
});

app.listen(PORT, () => {
    console.log(`CyberPath Rotating API Server running on port ${PORT}`);
    console.log(`Available Providers: ${services.map(s => s.name).join(', ')}`);
});
