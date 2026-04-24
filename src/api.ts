import express, { Request, Response } from 'express';
import { celsiusToFahrenheit, fahrenheitToCelsius, scoreGuess } from './converter';

export const app = express();
app.use(express.json());

const GAME_TEMPS_C = [-20, -10, 0, 10, 20, 25, 30, 37, 40, 50, 60, 75, 100, 120, 150];

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
    .subtitle { font-size: 0.9rem; color: #8b949e; margin-bottom: 24px; }
    .tabs { display: flex; gap: 0; margin-bottom: 28px; border: 1px solid #30363d; border-radius: 6px; overflow: hidden; }
    .tab { flex: 1; padding: 10px; background: #21262d; color: #8b949e; border: none; font-size: 0.9rem; font-weight: 600; cursor: pointer; transition: all 0.15s; }
    .tab.active { background: #00DB74; color: #0d1117; }
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
    .question-box {
      font-size: 1.2rem; font-weight: 700; text-align: center;
      padding: 20px; background: #0d1117; border: 1px solid #30363d;
      border-radius: 8px; margin-bottom: 20px; letter-spacing: -0.01em;
    }
    .score-row { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 20px; }
    .score-label { font-size: 0.8rem; color: #8b949e; text-transform: uppercase; letter-spacing: 0.06em; }
    .score-value { font-size: 1.8rem; font-weight: 700; color: #00DB74; }
    .feedback {
      margin-top: 20px; padding: 20px;
      background: #0d1117; border: 1px solid #30363d;
      border-radius: 8px; text-align: center; display: none;
    }
    .feedback-points { font-size: 1.5rem; font-weight: 700; margin-bottom: 8px; }
    .feedback-detail { font-size: 0.9rem; color: #8b949e; margin-bottom: 16px; }
    .btn-secondary { background: #21262d; color: #e6edf3; border: 1px solid #30363d; }
    .btn-secondary:hover { background: #30363d; }
  </style>
</head>
<body>
  <div class="card">
    <div class="wordmark">Orbit</div>
    <h1>Temperature Converter</h1>
    <p class="subtitle">Convert temperatures or test your knowledge.</p>

    <div class="tabs">
      <button class="tab active" id="tab-convert" onclick="switchTab('convert')">Convert</button>
      <button class="tab" id="tab-game" onclick="switchTab('game')">Play</button>
    </div>

    <!-- Convert section -->
    <div id="convert-section">
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

    <!-- Game section -->
    <div id="game-section" style="display:none;">
      <div class="score-row">
        <span class="score-label">Score</span>
        <span class="score-value" id="score-display">0</span>
      </div>
      <div class="question-box" id="question">—</div>
      <label for="game-input">Your answer</label>
      <input type="number" id="game-input" placeholder="Enter temperature" step="any">
      <button id="submit-btn" onclick="submitAnswer()">Submit</button>
      <div class="feedback" id="feedback">
        <div class="feedback-points" id="feedback-points"></div>
        <div class="feedback-detail" id="feedback-detail"></div>
        <button class="btn-secondary" onclick="nextQuestion()">Next question →</button>
      </div>
    </div>
  </div>

  <script>
    // Convert tab
    let convertMode = 'c-to-f';
    function setMode(m) {
      convertMode = m;
      const isCtoF = convertMode === 'c-to-f';
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
      if (convertMode === 'c-to-f') {
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

    // Tab switching
    function switchTab(tab) {
      document.getElementById('convert-section').style.display = tab === 'convert' ? 'block' : 'none';
      document.getElementById('game-section').style.display = tab === 'game' ? 'block' : 'none';
      document.getElementById('tab-convert').classList.toggle('active', tab === 'convert');
      document.getElementById('tab-game').classList.toggle('active', tab === 'game');
      if (tab === 'game' && document.getElementById('question').textContent === '—') loadQuestion();
    }

    // Game tab
    let currentAnswer = null;
    let totalScore = 0;

    async function loadQuestion() {
      const res = await fetch('/game/question');
      const q = await res.json();
      currentAnswer = q.correctAnswer;
      document.getElementById('question').textContent = q.prompt;
      document.getElementById('game-input').value = '';
      document.getElementById('feedback').style.display = 'none';
      document.getElementById('submit-btn').style.display = 'block';
      document.getElementById('game-input').focus();
    }

    async function submitAnswer() {
      const guess = parseFloat(document.getElementById('game-input').value);
      if (isNaN(guess)) return;
      const res = await fetch('/game/score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ guess, actual: currentAnswer })
      });
      const data = await res.json();
      totalScore += data.points;
      document.getElementById('score-display').textContent = totalScore;

      const pointsEl = document.getElementById('feedback-points');
      if (data.points === 10) { pointsEl.textContent = '+10 — Perfect!'; pointsEl.style.color = '#00DB74'; }
      else if (data.points === 5) { pointsEl.textContent = '+5 — Close'; pointsEl.style.color = '#00DB74'; }
      else if (data.points === 2) { pointsEl.textContent = '+2 — Near'; pointsEl.style.color = '#e3b341'; }
      else { pointsEl.textContent = '+0 — Miss'; pointsEl.style.color = '#f85149'; }

      document.getElementById('feedback-detail').textContent =
        'Correct: ' + currentAnswer.toFixed(1) + ' · Off by ' + data.diff + '°';
      document.getElementById('feedback').style.display = 'block';
      document.getElementById('submit-btn').style.display = 'none';
    }

    function nextQuestion() { loadQuestion(); }

    document.getElementById('game-input').addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        if (document.getElementById('submit-btn').style.display !== 'none') submitAnswer();
        else nextQuestion();
      }
    });
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

app.get('/game/question', (_req: Request, res: Response) => {
  const celsius = GAME_TEMPS_C[Math.floor(Math.random() * GAME_TEMPS_C.length)];
  const useCtoF = Math.random() > 0.5;
  if (useCtoF) {
    res.json({
      prompt: `Convert ${celsius}°C → °F`,
      correctAnswer: celsiusToFahrenheit(celsius),
    });
  } else {
    const fahrenheit = Math.round(celsiusToFahrenheit(celsius));
    res.json({
      prompt: `Convert ${fahrenheit}°F → °C`,
      correctAnswer: fahrenheitToCelsius(fahrenheit),
    });
  }
});

app.post('/game/score', (req: Request, res: Response) => {
  const { guess, actual } = req.body as { guess: number; actual: number };
  if (typeof guess !== 'number' || typeof actual !== 'number') {
    return res.status(400).json({ error: 'guess and actual must be numbers' });
  }
  const points = scoreGuess(guess, actual);
  const diff = Math.round(Math.abs(guess - actual) * 10) / 10;
  return res.json({ points, diff });
});

app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', version: '0.1.0', service: 'orbit' });
});
