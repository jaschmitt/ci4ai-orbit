import express, { Request, Response } from 'express';
import { celsiusToFahrenheit, classifySensorReading } from './converter';

export const app = express();
app.use(express.json());

app.get('/', (_req: Request, res: Response) => {
  res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Orbit — Temperature Converter</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #0d1117;
      color: #e6edf3;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
    }
    .card {
      background: #161b22;
      border: 1px solid #30363d;
      border-radius: 12px;
      padding: 40px;
      width: 100%;
      max-width: 400px;
    }
    .wordmark { font-size: 0.75rem; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: #00DB74; margin-bottom: 20px; }
    h1 { font-size: 1.5rem; font-weight: 700; margin-bottom: 8px; }
    .subtitle { font-size: 0.9rem; color: #8b949e; margin-bottom: 32px; }
    label { display: block; font-size: 0.8rem; font-weight: 500; color: #8b949e; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 8px; }
    input[type="number"] {
      width: 100%; padding: 11px 14px;
      background: #0d1117; border: 1px solid #30363d;
      border-radius: 6px; color: #e6edf3; font-size: 1rem; outline: none;
      transition: border-color 0.15s; margin-bottom: 20px;
    }
    input[type="number"]:focus { border-color: #00DB74; }
    button {
      width: 100%; padding: 13px;
      background: #00DB74; border: none; border-radius: 6px;
      color: #0d1117; font-size: 1rem; font-weight: 700; cursor: pointer;
      transition: background 0.15s;
    }
    button:hover { background: #00c466; }
    .result {
      margin-top: 28px; padding: 24px;
      background: #0d1117; border: 1px solid #30363d;
      border-radius: 8px; text-align: center; display: none;
    }
    .result-label { font-size: 0.8rem; font-weight: 500; text-transform: uppercase; letter-spacing: 0.06em; color: #8b949e; margin-bottom: 10px; }
    .result-value { font-size: 2.4rem; font-weight: 700; color: #00DB74; letter-spacing: -0.02em; }
    .status { margin-top: 16px; padding: 10px 16px; border-radius: 6px; font-size: 0.85rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; display: inline-block; }
    .status-normal   { background: #0d3b25; color: #00DB74; }
    .status-warning  { background: #3b2e00; color: #f0a500; }
    .status-critical { background: #3b0d0d; color: #f04040; }
  </style>
</head>
<body>
  <div class="card">
    <div class="wordmark">Orbit</div>
    <h1>Temperature Converter</h1>
    <p class="subtitle">Convert Celsius to Fahrenheit.</p>
    <label for="celsius">Temperature (°C)</label>
    <input type="number" id="celsius" value="100" step="any">
    <button onclick="convert()">Convert</button>
    <div class="result" id="result">
      <div class="result-label">Fahrenheit</div>
      <div class="result-value" id="result-value"></div>
      <div id="status-badge"></div>
    </div>
  </div>
  <script>
    async function convert() {
      const celsius = parseFloat(document.getElementById('celsius').value);
      const res = await fetch('/convert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ celsius })
      });
      const data = await res.json();
      document.getElementById('result-value').textContent = data.fahrenheit.toFixed(1) + '°F';
      const badge = document.getElementById('status-badge');
      badge.className = 'status status-' + data.status;
      badge.textContent = data.status;
      document.getElementById('result').style.display = 'block';
    }
  </script>
</body>
</html>`);
});

app.post('/convert', (req: Request, res: Response) => {
  const { celsius } = req.body as { celsius: number };
  if (typeof celsius !== 'number') {
    return res.status(400).json({ error: 'celsius must be a number' });
  }
  return res.json({ fahrenheit: celsiusToFahrenheit(celsius), status: classifySensorReading(celsius) });
});

app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', version: '0.1.0', service: 'orbit' });
});
