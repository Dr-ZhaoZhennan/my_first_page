const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// In-memory store (for demo purpose)
const messages = [];

// Middleware
app.use(cors());
app.use(express.json());

// Serve static frontend
app.use('/', express.static(path.join(__dirname, 'frontend')));

// Health check
app.get('/api/ping', (req, res) => {
  res.json({ ok: true, time: new Date().toISOString() });
});

// Echo endpoint
app.post('/api/echo', (req, res) => {
  res.json({ you_sent: req.body });
});

// Messages endpoints
app.get('/api/messages', (req, res) => {
  res.json({ messages });
});

app.post('/api/messages', (req, res) => {
  const { text } = req.body || {};
  if (!text || typeof text !== 'string') {
    return res.status(400).json({ error: 'text is required' });
  }
  const item = { id: Date.now(), text, ip: req.ip, time: new Date().toISOString() };
  messages.push(item);
  res.status(201).json(item);
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});