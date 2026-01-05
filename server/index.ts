import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
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

// Client-side routing: serve index.html for any non-API route
app.get('*', (req, res) => {
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
