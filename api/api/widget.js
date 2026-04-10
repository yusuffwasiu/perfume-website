(function () {
  const BACKEND_URL = window.PERFUME_API_URL || '/api/chat';
  let history = [];
  let isOpen = false;
  let isLoading = false;

  const style = document.createElement('style');
  style.textContent = `
    #pf-launcher {
      position: fixed; bottom: 24px; right: 24px; z-index: 9999;
      width: 56px; height: 56px; border-radius: 50%;
      background: #1C1A17; border: 2px solid rgba(201,168,76,0.4);
      cursor: pointer; font-size: 22px;
      display: flex; align-items: center; justify-content: center;
      box-shadow: 0 4px 20px rgba(0,0,0,0.25); transition: transform 0.2s;
    }
    #pf-launcher:hover { transform: scale(1.08); }
    #pf-window {
      position: fixed; bottom: 90px; right: 24px; z-index: 9999;
      width: 360px; height: 520px; border-radius: 16px;
      background: #FAF8F4; border: 1px solid rgba(180,155,100,0.25);
      box-shadow: 0 8px 40px rgba(0,0,0,0.18);
      display: flex; flex-direction: column; overflow: hidden;
      font-family: sans-serif; opacity: 0; pointer-events: none;
      transform: translateY(12px); transition: opacity 0.25s, transform 0.25s;
    }
    #pf-window.open { opacity: 1; pointer-events: all; transform: translateY(0); }
    #pf-header {
      background: #1C1A17; padding: 14px 18px; flex-shrink: 0;
      color: #F5EED8; font-size: 15px;
      display: flex; justify-content: space-between; align-items: center;
    }
    #pf-header-left { display: flex; align-items: center; gap: 10px; }
    #pf-dot {
      width: 7px; height: 7px; border-radius: 50%; background: #C9A84C;
      animation: pf-pulse 2s infinite;
    }
    @keyframes pf-pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
    #pf-close {
      background: none; border: none; color: #C9A84C;
      cursor: pointer; font-size: 18px;
    }
    #pf-messages {
      flex: 1; overflow-y: auto; padding: 16px;
      display: flex; flex-direction: column; gap: 12px;
    }
    .pf-msg { display: flex; gap: 8px; align-items: flex-end; }
    .pf-msg.user { flex-direction: row-reverse; }
    .pf-avatar {
      width: 28px; height: 28px; border-radius: 50%; flex-shrink: 0;
      display: flex; align-items: center; justify-content: center; font-size: 11px;
    }
    .pf-avatar.ai { background: #1C1A17; color: #C9A84C; border: 1px solid rgba(201,168,76,0.3); font-size: 13px; }
    .pf-avatar.user { background: #C9A84C; color: #1C1A17; font-weight: 500; }
    .pf-bubble {
      max-width: 78%; padding: 10px 13px; font-size: 13.5px;
      line-height: 1.6; color: #1C1A17; border: 0.5px solid rgba(180,155,100,0.2);
    }
    .pf-bubble.ai { background: #fff; border-radius: 12px 12px 12px 3px; }
    .pf-bubble.user { background: #F0EBE1; border-radius: 12px 12px 3px 12px; }
    .pf-typing { display: flex; gap: 4px; align-items: center; padding: 4px 0; }
    .pf-typing span {
      width: 5px; height: 5px; background: #C9A84C; border-radius: 50%;
      animation: pf-bounce 1.2s infinite ease-in-out;
    }
    .pf-typing span:nth-child(2){animation-delay:0.2s}
    .pf-typing span:nth-child(3){animation-delay:0.4s}
    @keyframes pf-bounce { 0%,60%,100%{transform:translateY(0)} 30%{transform:translateY(-5px)} }
    #pf-chips { padding: 0 12px 10px; display: flex; flex-wrap: wrap; gap: 6px; flex-shrink: 0; }
    .pf-chip {
      font-size: 11.5px; color: #7A7060; background: #fff;
      border: 0.5px solid rgba(180,155,100,0.3); border-radius: 20px;
      padding: 5px 11px; cursor: pointer; transition: all 0.18s; font-family: sans-serif;
    }
    .pf-chip:hover { border-color: rgba(201,168,76,0.6); color: #8B6914; background: rgba(201,168,76,0.07); }
    #pf-input-row {
      padding: 12px; border-top: 0.5px solid rgba(180,155,100,0.15);
      display: flex; gap: 8px; background: #fff; flex-shrink: 0;
    }
    #pf-input {
      flex: 1; border: 1px solid rgba(180,155,100,0.3); border-radius: 8px;
      padding: 9px 13px; font-size: 13px; outline: none; resize: none;
      font-family: sans-serif; color: #1C1A17; background: #FAF8F4; line-height: 1.5;
    }
    #pf-input:focus { border-color: rgba(201,168,76,0.5); }
    #pf-input::placeholder { color: #B0A898; }
    #pf-send {
      width: 38px; height: 38px; background: #1C1A17; border: none;
      border-radius: 8px; cursor: pointer; color: #C9A84C; font-size: 15px;
      display: flex; align-items: center; justify-content: center; transition: all 0.2s;
    }
    #pf-send:hover { background: #C9A84C; color: #1C1A17; }
    #pf-send:disabled { opacity: 0.35; cursor: default; }
  `;
  document.head.appendChild(style);

  document.body.insertAdjacentHTML('beforeend', `
    <button id="pf-launcher">🌸</button>
    <div id="pf-window">
      <div id="pf-header">
        <div id="pf-header-left">
          <div id="pf-dot"></div>
          <span>✦ Perfume Advisor</span>
        </div>
        <button id="pf-close">✕</button>
      </div>
      <div id="pf-messages"></div>
      <div id="pf-chips">
        <div class="pf-chip" onclick="pfChip(this)">Fresh & citrusy</div>
        <div class="pf-chip" onclick="pfChip(this)">Warm & sensual</div>
        <div class="pf-chip" onclick="pfChip(this)">Woody & earthy</div>
        <div class="pf-chip" onclick="pfChip(this)">Floral & romantic</div>
        <div class="pf-chip" onclick="pfChip(this)">Looking for a gift</div>
      </div>
      <div id="pf-input-row">
        <textarea id="pf-input" rows="1" placeholder="Describe the scent you imagine…"></textarea>
        <button id="pf-send">➤</button>
      </div>
    </div>
  `);

  const launcher = document.getElementById('pf-launcher');
  const win      = document.getElementById('pf-window');
  const msgs     = document.getElementById('pf-messages');
  const input    = document.getElementById('pf-input');
  const sendBtn  = document.getElementById('pf-send');
  const chipsDiv = document.getElementById('pf-chips');

  function addBubble(role, text) {
    const div = document.createElement('div');
    div.className = `pf-msg ${role}`;
    div.innerHTML = `
      <div class="pf-avatar ${role}">${role === 'ai' ? '✦' : 'Y'}</div>
      <div class="pf-bubble ${role}">${text.replace(/\n/g, '<br>')}</div>
    `;
    msgs.appendChild(div);
    msgs.scrollTop = msgs.scrollHeight;
  }

  function showTyping() {
    const div = document.createElement('div');
    div.className = 'pf-msg ai';
    div.id = 'pf-typing-row';
    div.innerHTML = `
      <div class="pf-avatar ai">✦</div>
      <div class="pf-bubble ai">
        <div class="pf-typing"><span></span><span></span><span></span></div>
      </div>
    `;
    msgs.appendChild(div);
    msgs.scrollTop = msgs.scrollHeight;
  }

  function removeTyping() {
    const el = document.getElementById('pf-typing-row');
    if (el) el.remove();
  }

  async function sendToBackend(userText) {
    if (isLoading) return;
    isLoading = true;
    sendBtn.disabled = true;
    history.push({ role: 'user', content: userText });
    showTyping();

    try {
      const res = await fetch(BACKEND_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history })
      });
      const data = await res.json();
      const reply = data.reply || 'Sorry, something went wrong.';
      history.push({ role: 'assistant', content: reply });
      removeTyping();
      addBubble('ai', reply);
    } catch (err) {
      removeTyping();
      addBubble('ai', 'Connection issue — please try again.');
    }

    isLoading = false;
    sendBtn.disabled = false;
  }

  launcher.onclick = () => {
    isOpen = !isOpen;
    win.classList.toggle('open', isOpen);
    if (isOpen && history.length === 0) sendToBackend('Hello, I need help finding a perfume.');
  };

  document.getElementById('pf-close').onclick = () => {
    isOpen = false;
    win.classList.remove('open');
  };

  sendBtn.onclick = () => {
    const text = input.value.trim();
    if (!text || isLoading) return;
    chipsDiv.style.display = 'none';
    addBubble('user', text);
    input.value = '';
    input.style.height = '';
    sendToBackend(text);
  };

  input.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendBtn.click(); }
  });

  input.addEventListener('input', function () {
    this.style.height = '';
    this.style.height = Math.min(this.scrollHeight, 100) + 'px';
  });

  window.pfChip = function (el) {
    if (isLoading) return;
    chipsDiv.style.display = 'none';
    addBubble('user', el.textContent);
    sendToBackend(el.textContent);
  };

})();