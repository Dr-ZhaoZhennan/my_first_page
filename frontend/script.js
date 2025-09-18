(function(){
  const logEl = document.getElementById('log');
  const listEl = document.getElementById('msgList');
  const inputEl = document.getElementById('msgInput');
  const formEl = document.getElementById('msgForm');
  const pingBtn = document.getElementById('btnPing');
  const baseUrlInput = document.getElementById('baseUrl');
  const saveBaseUrlBtn = document.getElementById('saveBaseUrl');

  function log(msg){
    const text = typeof msg === 'string' ? msg : JSON.stringify(msg, null, 2);
    logEl.textContent += `\n${text}`;
    logEl.scrollTop = logEl.scrollHeight;
  }

  function getBaseUrl(){
    return localStorage.getItem('API_BASE_URL') || '';
  }

  function setBaseUrl(url){
    if(url){ localStorage.setItem('API_BASE_URL', url.replace(/\/$/, '')); }
    baseUrlInput.value = getBaseUrl();
  }

  function api(path){
    const base = getBaseUrl();
    if(base){
      return `${base}${path}`;
    }
    return path; // same-origin fallback
  }

  async function fetchMessages(){
    try{
      const res = await fetch(api('/api/messages'));
      const data = await res.json();
      renderMessages(data.messages || []);
    }catch(err){
      log(err.message || err);
    }
  }

  function renderMessages(items){
    listEl.innerHTML = '';
    (items||[]).forEach(m => {
      const li = document.createElement('li');
      li.textContent = `#${m.id} ${m.text} (${m.time})`;
      listEl.appendChild(li);
    });
  }

  pingBtn.addEventListener('click', async () => {
    try{
      const res = await fetch(api('/api/ping'));
      const data = await res.json();
      log(data);
    }catch(err){
      log(err.message || err);
    }
  });

  formEl.addEventListener('submit', async (e) => {
    e.preventDefault();
    const text = (inputEl.value||'').trim();
    if(!text) return;
    try{
      const res = await fetch(api('/api/messages'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });
      const data = await res.json();
      log(data);
      inputEl.value = '';
      await fetchMessages();
    }catch(err){
      log(err.message || err);
    }
  });

  saveBaseUrlBtn.addEventListener('click', () => {
    const url = baseUrlInput.value.trim();
    setBaseUrl(url);
    log(`已保存 Base URL: ${getBaseUrl() || '(同源)'}`);
  });

  // init
  setBaseUrl(getBaseUrl());
  fetchMessages();
})();