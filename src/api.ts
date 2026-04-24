import express, { Request, Response } from 'express';
import { celsiusToFahrenheit, fahrenheitToCelsius } from './converter';

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
  </style>
</head>
<body>
  <div class="card">
    <div class="wordmark">Orbit</div>
    <h1>Temperature Converter</h1>
    <p class="subtitle">Convert between Celsius and Fahrenheit.</p>
    <div style="display:flex;gap:8px;margin-bottom:20px;">
      <button id="btn-ctof" onclick="setMode('c-to-f')" style="flex:1;background:#00DB74;color:#0d1117;">°C → °F</button>
      <button id="btn-ftoc" onclick="setMode('f-to-c')" style="flex:1;background:#21262d;color:#e6edf3;border:1px solid #30363d;">°F → °C</button>
    </div>
    <label for="temp-input" id="input-label">Temperature (°C)</label>
    <input type="number" id="temp-input" value="100" step="any">
    <button onclick="convert()">Convert</button>
    <div class="result" id="result">
      <div class="result-label" id="result-label">Fahrenheit</div>
      <div class="result-value" id="result-value"></div>
    </div>
  </div>
  <script>
    let mode = 'c-to-f';
    function setMode(m) {
      mode = m;
      const isCtoF = mode === 'c-to-f';
      document.getElementById('input-label').textContent = isCtoF ? 'Temperature (°C)' : 'Temperature (°F)';
      document.getElementById('result-label').textContent = isCtoF ? 'Fahrenheit' : 'Celsius';
      document.getElementById('temp-input').value = isCtoF ? '100' : '212';
      document.getElementById('result').style.display = 'none';
      document.getElementById('btn-ctof').style.background = isCtoF ? '#00DB74' : '#21262d';
      document.getElementById('btn-ctof').style.color = isCtoF ? '#0d1117' : '#e6edf3';
      document.getElementById('btn-ftoc').style.background = isCtoF ? '#21262d' : '#00DB74';
      document.getElementById('btn-ftoc').style.color = isCtoF ? '#e6edf3' : '#0d1117';
    }
    async function convert() {
      const val = parseFloat(document.getElementById('temp-input').value);
      if (mode === 'c-to-f') {
        const res = await fetch('/convert', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ celsius: val }) });
        const data = await res.json();
        document.getElementById('result-value').textContent = data.fahrenheit.toFixed(1) + '°F';
      } else {
        const res = await fetch('/convert/f-to-c', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ fahrenheit: val }) });
        const data = await res.json();
        document.getElementById('result-value').textContent = data.celsius.toFixed(1) + '°C';
      }
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
  return res.json({ fahrenheit: celsiusToFahrenheit(celsius) });
});

app.post('/convert/f-to-c', (req: Request, res: Response) => {
  const { fahrenheit } = req.body as { fahrenheit: number };
  if (typeof fahrenheit !== 'number') {
    return res.status(400).json({ error: 'fahrenheit must be a number' });
  }
  return res.json({ celsius: fahrenheitToCelsius(fahrenheit) });
});

app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', version: '0.1.0', service: 'orbit' });
});
