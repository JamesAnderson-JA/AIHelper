import express from 'express';
import cors from 'cors';
import Anthropic from '@anthropic-ai/sdk';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json({ limit: '2mb' }));

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

let policyCorpus = '';
try {
  policyCorpus = fs.readFileSync(join(__dirname, '../frontend/src/data/policy.md'), 'utf8');
} catch {
  policyCorpus = 'Policy corpus not found.';
}

app.get('/api/health', (_req, res) => {
  const key = process.env.ANTHROPIC_API_KEY;
  res.json({
    status: 'ok',
    apiKey: key ? `set (starts with ${key.slice(0, 10)}…)` : 'MISSING — add ANTHROPIC_API_KEY in Railway Variables',
    policyCorpus: policyCorpus.length > 0 ? `loaded (${policyCorpus.length} chars)` : 'missing',
  });
});

app.post('/api/policy-chat', async (req, res) => {
  try {
    const { messages } = req.body;
    const response = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      system: `You are the MT Finance Policy Assistant. Answer questions about lending policy across Bridging, Commercial Mortgages, and Buy-to-Let. Use only the policy corpus below. Cite the section you draw from. If the answer isn't covered, say so plainly.\n\n--- POLICY CORPUS ---\n${policyCorpus}`,
      messages,
    });
    res.json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/case-chat', async (req, res) => {
  try {
    const { messages, caseData } = req.body;
    const response = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      system: `You are the MT Finance Case Helper. You are answering questions about a specific live case. Use the case data and policy corpus below. Be concise and specific. Cite policy sections when relevant.\n\n--- CASE DATA ---\n${JSON.stringify(caseData, null, 2)}\n\n--- POLICY CORPUS ---\n${policyCorpus}`,
      messages,
    });
    res.json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Serve the built frontend in production
const distPath = join(__dirname, '../frontend/dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get(/.*/, (_req, res) => res.sendFile(join(distPath, 'index.html')));
}

const PORT = process.env.PORT || 3001;
const server = app.listen(PORT, () => console.log(`MT Finance backend on :${PORT}`));

process.on('SIGTERM', () => server.close(() => process.exit(0)));
process.on('SIGINT', () => server.close(() => process.exit(0)));
