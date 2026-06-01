// ── UI helpers ──────────────────────────────────────────────

function showError(msg) {
  const el = document.getElementById('errorMsg');
  el.textContent = msg;
  el.style.display = 'block';
}

function hideError() {
  document.getElementById('errorMsg').style.display = 'none';
}

function toggleKeyVisibility() {
  const input = document.getElementById('apiKey');
  const icon  = document.getElementById('keyToggleIcon');
  const isHidden = input.type === 'password';
  input.type  = isHidden ? 'text' : 'password';
  icon.className = isHidden ? 'ti ti-eye' : 'ti ti-eye-off';
  icon.style.cssText = 'font-size:16px; cursor:pointer; color:var(--text-secondary)';
}

function toggleJson(btn) {
  const block = document.getElementById('jsonBlock');
  block.classList.toggle('open');
  btn.innerHTML = block.classList.contains('open')
    ? '<i class="ti ti-code"></i> Hide JSON'
    : '<i class="ti ti-code"></i> View API response JSON';
}

function setLoading(loading) {
  const btn = document.getElementById('analyzeBtn');
  btn.disabled = loading;
  btn.innerHTML = loading
    ? '<div class="spinner"></div> Analyzing…'
    : '<i class="ti ti-brain"></i> Analyze image';
}

// ── Result rendering ─────────────────────────────────────────

function renderResults(data) {
  const el = document.getElementById('results');
  el.style.display = 'block';

  const labels = data.labels || [];
  const description = data.description || '';
  const meta = data.meta || {};

  let html = '';

  // Label tags
  if (labels.length) {
    html += `<p class="section-label">Detected labels</p><div class="tags">`;
    labels.slice(0, 8).forEach((l, i) => {
      const bg = COLORS.backgrounds[i % COLORS.backgrounds.length];
      const fg = COLORS.fills[i % COLORS.fills.length];
      html += `<span class="tag" style="background:${bg};color:${fg};border-color:${fg}40">
        <span class="color-chip" style="background:${fg}"></span>${l.label}
        <span class="conf">${Math.round(l.confidence * 100)}%</span>
      </span>`;
    });
    html += `</div>`;

    // Confidence bars
    html += `<p class="section-label" style="margin-top:1.25rem">Confidence scores</p>`;
    labels.slice(0, 6).forEach((l, i) => {
      const pct = Math.round(l.confidence * 100);
      html += `<div class="bar-row">
        <span class="bar-name">${l.label}</span>
        <div class="bar-track">
          <div class="bar-fill" id="bar-${i}" style="width:0%;background:${COLORS.fills[i % COLORS.fills.length]}"></div>
        </div>
        <span class="bar-pct">${pct}%</span>
      </div>`;
    });
  }

  // Description
  if (description) {
    html += `<hr><p class="section-label">Scene description</p>
      <div class="desc-block">${description}</div>`;
  }

  // Metadata
  const metaEntries = Object.entries(meta);
  if (metaEntries.length) {
    html += `<hr><p class="section-label">Image attributes</p><div class="meta-grid">`;
    metaEntries.forEach(([k, v]) => {
      html += `<div class="meta-card">
        <p class="meta-key">${k}</p>
        <p class="meta-val">${v}</p>
      </div>`;
    });
    html += `</div>`;
  }

  // Raw JSON
  const jsonStr = JSON.stringify(data, null, 2).replace(/</g, '&lt;');
  html += `<hr>
    <button class="json-toggle" onclick="toggleJson(this)">
      <i class="ti ti-code"></i> View API response JSON
    </button>
    <pre class="json-block" id="jsonBlock">${jsonStr}</pre>`;

  el.innerHTML = html;

  // Animate bars after DOM update
  setTimeout(() => {
    labels.slice(0, 6).forEach((l, i) => {
      const bar = document.getElementById('bar-' + i);
      if (bar) bar.style.width = Math.round(l.confidence * 100) + '%';
    });
  }, 80);
}
