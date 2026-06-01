// ── State ────────────────────────────────────────────────────

let currentBase64 = null;
let currentMime   = 'image/jpeg';

// ── File handling ─────────────────────────────────────────────

function handleFile(file) {
  if (!file || !file.type.startsWith('image/')) return;
  currentMime = file.type || 'image/jpeg';

  const reader = new FileReader();
  reader.onload = e => {
    currentBase64 = e.target.result.split(',')[1];

    const preview = document.getElementById('preview');
    preview.src = e.target.result;
    preview.style.display = 'block';

    document.getElementById('analyzeBtn').disabled = false;
    document.getElementById('results').style.display = 'none';
    hideError();
  };
  reader.readAsDataURL(file);
}

function clearAll() {
  currentBase64 = null;
  currentMime   = 'image/jpeg';

  const preview = document.getElementById('preview');
  preview.style.display = 'none';
  preview.src = '';

  document.getElementById('fileInput').value = '';
  document.getElementById('analyzeBtn').disabled = true;
  document.getElementById('results').style.display = 'none';
  document.getElementById('customPrompt').value = '';
  hideError();
}

// ── Analyze ───────────────────────────────────────────────────

async function analyze() {
  const apiKey = document.getElementById('apiKey').value.trim();
  if (!apiKey) { showError('Please enter your Anthropic API key above.'); return; }
  if (!currentBase64) return;

  setLoading(true);
  hideError();
  document.getElementById('results').style.display = 'none';

  try {
    const data = await callPredictionAPI({
      apiKey,
      base64: currentBase64,
      mimeType: currentMime,
      customInstruction: document.getElementById('customPrompt').value.trim(),
    });
    renderResults(data);
  } catch (err) {
    showError('Error: ' + err.message);
  } finally {
    setLoading(false);
  }
}

// ── Drag & drop / click to upload ────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  const drop      = document.getElementById('dropZone');
  const fileInput = document.getElementById('fileInput');

  drop.addEventListener('click', () => fileInput.click());
  drop.addEventListener('dragover', e => { e.preventDefault(); drop.classList.add('active'); });
  drop.addEventListener('dragleave', () => drop.classList.remove('active'));
  drop.addEventListener('drop', e => {
    e.preventDefault();
    drop.classList.remove('active');
    handleFile(e.dataTransfer.files[0]);
  });
  fileInput.addEventListener('change', () => handleFile(fileInput.files[0]));
});
