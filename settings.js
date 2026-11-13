// OpenRPG - Gerenciador de Configurações, Acessibilidade, Backup e Notificações Customizadas

function obterConfiguracoes() {
  return Object.assign({
    tema: 'dark-obsidian',
    escala: '100',
    altoContraste: false,
    dislexia: false,
    reduzirAnimacoes: false,
    somDados: false,
    atalhos: true
  }, JSON.parse(localStorage.getItem('openrpg_settings') || '{}'));
}

function salvarConfiguracao(chave, valor) {
  const cfg = obterConfiguracoes();
  cfg[chave] = valor;
  localStorage.setItem('openrpg_settings', JSON.stringify(cfg));
  aplicarConfiguracoes();
}

const TEMAS_PADRAO = {
  'dark-obsidian': {
    nome: 'Dark Obsidian',
    vars: {
      '--bg-app': '#0c0f16',
      '--bg-sidebar': '#11151f',
      '--bg-panel': '#151b28',
      '--bg-card': '#1b2333',
      '--bg-card-hover': '#202a3d',
      '--bg-input': '#0e131d',
      '--border-color': '#263145',
      '--border-hover': '#374662',
      '--text-main': '#f1f5f9',
      '--text-muted': '#94a3b8',
      '--accent': '#3b82f6',
      '--accent-hover': '#2563eb',
      '--accent-subtle': 'rgba(59, 130, 246, 0.12)'
    }
  },
  'pergaminho': {
    nome: 'Pergaminho Fantasia',
    vars: {
      '--bg-app': '#1c1813',
      '--bg-sidebar': '#241f18',
      '--bg-panel': '#2b251d',
      '--bg-card': '#352e24',
      '--bg-card-hover': '#433b2e',
      '--bg-input': '#181410',
      '--border-color': '#524636',
      '--border-hover': '#6b5c47',
      '--text-main': '#fbf5e6',
      '--text-muted': '#c7bca6',
      '--accent': '#d97706',
      '--accent-hover': '#b45309',
      '--accent-subtle': 'rgba(217, 119, 6, 0.15)'
    }
  },
  'cyberpunk': {
    nome: 'Cyberpunk Night',
    vars: {
      '--bg-app': '#070913',
      '--bg-sidebar': '#0b0f1f',
      '--bg-panel': '#0f162c',
      '--bg-card': '#141c38',
      '--bg-card-hover': '#1b264d',
      '--bg-input': '#090e1c',
      '--border-color': '#1f2d5a',
      '--border-hover': '#2b3f7d',
      '--text-main': '#f0fdfa',
      '--text-muted': '#94a3b8',
      '--accent': '#06b6d4',
      '--accent-hover': '#0891b2',
      '--accent-subtle': 'rgba(6, 182, 212, 0.15)'
    }
  },
  'grimdark': {
    nome: 'Grimdark Monocromo',
    vars: {
      '--bg-app': '#101010',
      '--bg-sidebar': '#161616',
      '--bg-panel': '#1d1d1d',
      '--bg-card': '#252525',
      '--bg-card-hover': '#2f2f2f',
      '--bg-input': '#121212',
      '--border-color': '#383838',
      '--border-hover': '#4f4f4f',
      '--text-main': '#e5e5e5',
      '--text-muted': '#a3a3a3',
      '--accent': '#e11d48',
      '--accent-hover': '#be123c',
      '--accent-subtle': 'rgba(225, 29, 72, 0.15)'
    }
  }
};

function adjustBrightness(hex, percent) {
  let num = parseInt(hex.replace('#', ''), 16);
  let amt = Math.round(2.55 * percent);
  let R = Math.min(255, Math.max(0, (num >> 16) + amt));
  let G = Math.min(255, Math.max(0, ((num >> 8) & 0x00FF) + amt));
  let B = Math.min(255, Math.max(0, (num & 0x0000FF) + amt));
  return '#' + (0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1);
}

function hexToRgba(hex, alpha) {
  let c = hex.replace('#', '');
  if (c.length === 3) c = c.split('').map(x => x + x).join('');
  const num = parseInt(c, 16);
  return `rgba(${(num >> 16) & 255}, ${(num >> 8) & 255}, ${num & 255}, ${alpha})`;
}

function aplicarTema(id) {
  const cfg = obterConfiguracoes();
  const temaId = id || cfg.tema || 'dark-obsidian';

  if (temaId === 'custom') {
    const custom = JSON.parse(localStorage.getItem('openrpg_custom_theme') || 'null');
    if (custom && custom.vars) {
      Object.entries(custom.vars).forEach(([k, v]) => document.documentElement.style.setProperty(k, v));
      if (custom.bgImage) {
        const op = custom.bgOpacity != null ? Number(custom.bgOpacity) : 85;
        const alpha = (op / 100).toFixed(2);
        const bgApp = custom.vars['--bg-app'] || '#0c0f16';
        const overlay = hexToRgba(bgApp, alpha);
        document.body.style.backgroundImage = `linear-gradient(${overlay}, ${overlay}), url("${custom.bgImage}")`;
        document.body.classList.add('has-bg-image');
      } else {
        document.body.style.backgroundImage = '';
        document.body.classList.remove('has-bg-image');
      }
    }
  } else if (TEMAS_PADRAO[temaId]) {
    Object.entries(TEMAS_PADRAO[temaId].vars).forEach(([k, v]) => document.documentElement.style.setProperty(k, v));
    document.body.style.backgroundImage = '';
    document.body.classList.remove('has-bg-image');
  }

  document.querySelectorAll('.theme-card-option').forEach(card => {
    const cardTema = card.getAttribute('data-theme');
    card.classList.toggle('current', cardTema === temaId);
  });

  const customCard = document.getElementById('theme-card-custom');
  if (customCard) {
    customCard.classList.toggle('current', temaId === 'custom');
    const custom = JSON.parse(localStorage.getItem('openrpg_custom_theme') || 'null');
    const nomeEl = document.getElementById('theme-custom-active-name');
    if (nomeEl) nomeEl.innerText = custom ? `🛠️ ${custom.nome || 'Personalizado'}` : '🛠️ Nenhum criado';
  }
}

function selecionarTema(id) {
  if (id === 'custom') {
    const custom = localStorage.getItem('openrpg_custom_theme');
    if (!custom) return abrirCriadorTema();
  }
  salvarConfiguracao('tema', id);
  aplicarTema(id);
  const nome = id === 'custom'
    ? (JSON.parse(localStorage.getItem('openrpg_custom_theme') || '{}').nome || 'Personalizado')
    : (TEMAS_PADRAO[id] ? TEMAS_PADRAO[id].nome : id);
  mostrarToast(`Tema "${nome}" ativado!`);
}

function deletarTemaCustomizado() {
  const custom = localStorage.getItem('openrpg_custom_theme');
  if (!custom) return mostrarToast('Nenhum tema personalizado para excluir.', 'aviso');
  localStorage.removeItem('openrpg_custom_theme');
  customBgDataUrl = '';
  const modalCustom = document.getElementById('custom-theme-modal');
  if (modalCustom && modalCustom.classList.contains('active')) {
    modalCustom.classList.remove('active');
  }
  snapshotTema = null;
  salvarConfiguracao('tema', 'dark-obsidian');
  aplicarTema('dark-obsidian');
  mostrarToast('Tema personalizado excluído com sucesso!');
}

let snapshotTema = null;
let customBgDataUrl = '';

function injetarModalCriadorTema() {
  if (document.getElementById('custom-theme-modal')) return;
  const div = document.createElement('div');
  div.id = 'custom-theme-modal';
  div.className = 'modal-overlay';
  div.onclick = function(e) { if (e.target.id === 'custom-theme-modal') cancelarCriadorTema(); };
  div.innerHTML = `
    <div class="modal-container" style="max-width: 520px;" onclick="event.stopPropagation()">
      <div class="modal-header">
        <h3>🎨 Personalizador de Tema</h3>
        <button class="btn-close-modal" type="button" onclick="cancelarCriadorTema()">✕</button>
      </div>
      <div class="modal-body" style="display: flex; flex-direction: column; gap: 12px;">
        <div>
          <label style="font-size: 11.5px; font-weight: 600; color: var(--text-muted); display: block; margin-bottom: 4px;">Nome do Tema</label>
          <input type="text" id="theme-custom-name" class="modal-input" placeholder="Ex: Masmorra Arcana" value="Meu Tema" style="width: 100%;">
        </div>

        <div>
          <label style="font-size: 11.5px; font-weight: 600; color: var(--text-muted); display: block; margin-bottom: 6px;">Paleta de Cores (Pré-visualização em Tempo Real)</label>
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 6px;">
            <div class="theme-color-row">
              <div class="theme-color-label"><strong>Fundo Geral</strong><small>Base da página</small></div>
              <input type="color" id="thm-col-bg-app" class="theme-color-input" value="#0c0f16">
            </div>
            <div class="theme-color-row">
              <div class="theme-color-label"><strong>Cards & Painéis</strong><small>Caixas e tabelas</small></div>
              <input type="color" id="thm-col-bg-card" class="theme-color-input" value="#1b2333">
            </div>
            <div class="theme-color-row">
              <div class="theme-color-label"><strong>Sidebar & Topo</strong><small>Navegação</small></div>
              <input type="color" id="thm-col-bg-sidebar" class="theme-color-input" value="#11151f">
            </div>
            <div class="theme-color-row">
              <div class="theme-color-label"><strong>Texto Principal</strong><small>Títulos e textos</small></div>
              <input type="color" id="thm-col-text-main" class="theme-color-input" value="#f1f5f9">
            </div>
            <div class="theme-color-row">
              <div class="theme-color-label"><strong>Destaque & Ações</strong><small>Botões primários</small></div>
              <input type="color" id="thm-col-accent" class="theme-color-input" value="#3b82f6">
            </div>
            <div class="theme-color-row">
              <div class="theme-color-label"><strong>Bordas</strong><small>Linhas e divisões</small></div>
              <input type="color" id="thm-col-border" class="theme-color-input" value="#263145">
            </div>
          </div>
        </div>

        <div>
          <label style="font-size: 11.5px; font-weight: 600; color: var(--text-muted); display: block; margin-bottom: 4px;">Imagem de Fundo (Opcional)</label>
          <div style="display: flex; gap: 6px;">
            <input type="url" id="theme-custom-bg-url" class="modal-input" placeholder="URL da imagem (https://...)" style="flex: 1;">
            <label class="btn-secondary" style="margin: 0; padding: 6px 10px; cursor: pointer; font-size: 11.5px; display: inline-flex; align-items: center; white-space: nowrap;">
              📁 Arquivo
              <input type="file" id="theme-custom-bg-file" accept="image/*" style="display: none;">
            </label>
            <button type="button" class="btn-secondary" onclick="removerImagemFundoTema()" title="Remover imagem" style="padding: 6px 10px;">🗑️</button>
          </div>
        </div>

        <div>
          <label style="font-size: 11.5px; font-weight: 600; color: var(--text-muted); display: block; margin-bottom: 6px;">Controles de Opacidade (%)</label>
          <div style="display: flex; flex-direction: column; gap: 8px;">
            <div>
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2px;">
                <label style="font-size: 11px; color: var(--text-muted);">Cor do Fundo Geral</label>
                <span id="theme-custom-opacity-val" style="font-size: 11.5px; font-weight: 600; color: var(--text-main);">85%</span>
              </div>
              <input type="range" id="theme-custom-opacity" min="0" max="100" value="85" style="width: 100%; accent-color: var(--accent); cursor: pointer;">
            </div>

            <div>
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2px;">
                <label style="font-size: 11px; color: var(--text-muted);">Sidebar & Topo</label>
                <span id="theme-custom-sidebar-opacity-val" style="font-size: 11.5px; font-weight: 600; color: var(--text-main);">100%</span>
              </div>
              <input type="range" id="theme-custom-sidebar-opacity" min="10" max="100" value="100" style="width: 100%; accent-color: var(--accent); cursor: pointer;">
            </div>

            <div>
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2px;">
                <label style="font-size: 11px; color: var(--text-muted);">Cards & Painéis</label>
                <span id="theme-custom-cards-opacity-val" style="font-size: 11.5px; font-weight: 600; color: var(--text-main);">100%</span>
              </div>
              <input type="range" id="theme-custom-cards-opacity" min="10" max="100" value="100" style="width: 100%; accent-color: var(--accent); cursor: pointer;">
            </div>
          </div>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; gap: 8px; margin-top: 6px; padding-top: 10px; border-top: 1px solid var(--border-color);">
          <button type="button" class="btn-secondary" style="color: var(--danger); font-size: 11.5px; padding: 6px 10px;" onclick="deletarTemaCustomizado()">🗑️ Excluir Tema</button>
          <div style="display: flex; gap: 8px;">
            <button type="button" class="btn-secondary" onclick="cancelarCriadorTema()">Cancelar</button>
            <button type="button" class="btn-primary" onclick="salvarCriadorTema()">Salvar Tema</button>
          </div>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(div);

  ['thm-col-bg-app', 'thm-col-bg-card', 'thm-col-bg-sidebar', 'thm-col-text-main', 'thm-col-accent', 'thm-col-border'].forEach(id => {
    document.getElementById(id).addEventListener('input', atualizarLivePreviewCores);
  });

  [
    { id: 'theme-custom-opacity', lbl: 'theme-custom-opacity-val' },
    { id: 'theme-custom-sidebar-opacity', lbl: 'theme-custom-sidebar-opacity-val' },
    { id: 'theme-custom-cards-opacity', lbl: 'theme-custom-cards-opacity-val' }
  ].forEach(item => {
    const el = document.getElementById(item.id);
    if (el) {
      el.addEventListener('input', (e) => {
        const valEl = document.getElementById(item.lbl);
        if (valEl) valEl.innerText = `${e.target.value}%`;
        atualizarLivePreviewCores();
      });
    }
  });

  document.getElementById('theme-custom-bg-url').addEventListener('input', (e) => {
    customBgDataUrl = '';
    atualizarLivePreviewCores();
  });

  document.getElementById('theme-custom-bg-file').addEventListener('change', (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      customBgDataUrl = ev.target.result;
      document.getElementById('theme-custom-bg-url').value = '';
      atualizarLivePreviewCores();
    };
    reader.readAsDataURL(file);
  });
}

function obterHexEstilo(varName, padrao) {
  const val = getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
  if (val && val.startsWith('#') && (val.length === 7 || val.length === 4)) {
    return val.length === 4 ? '#' + val[1]+val[1]+val[2]+val[2]+val[3]+val[3] : val;
  }
  return padrao;
}

function atualizarLivePreviewCores() {
  const bgApp = document.getElementById('thm-col-bg-app').value;
  const bgCard = document.getElementById('thm-col-bg-card').value;
  const bgSidebar = document.getElementById('thm-col-bg-sidebar').value;
  const textMain = document.getElementById('thm-col-text-main').value;
  const accent = document.getElementById('thm-col-accent').value;
  const border = document.getElementById('thm-col-border').value;

  const opacityVal = Number(document.getElementById('theme-custom-opacity')?.value ?? 85);
  const sidebarOp = Number(document.getElementById('theme-custom-sidebar-opacity')?.value ?? 100);
  const cardsOp = Number(document.getElementById('theme-custom-cards-opacity')?.value ?? 100);

  const sidebarBg = sidebarOp < 100 ? hexToRgba(bgSidebar, (sidebarOp / 100).toFixed(2)) : bgSidebar;
  const cardBg = cardsOp < 100 ? hexToRgba(bgCard, (cardsOp / 100).toFixed(2)) : bgCard;
  const cardHover = cardsOp < 100 ? hexToRgba(adjustBrightness(bgCard, 15), (cardsOp / 100).toFixed(2)) : adjustBrightness(bgCard, 15);

  const root = document.documentElement;
  root.style.setProperty('--bg-app', bgApp);
  root.style.setProperty('--bg-sidebar', sidebarBg);
  root.style.setProperty('--bg-panel', cardBg);
  root.style.setProperty('--bg-card', cardBg);
  root.style.setProperty('--bg-card-hover', cardHover);
  root.style.setProperty('--bg-input', adjustBrightness(bgApp, 6));
  root.style.setProperty('--text-main', textMain);
  root.style.setProperty('--text-muted', adjustBrightness(textMain, -30));
  root.style.setProperty('--accent', accent);
  root.style.setProperty('--accent-hover', adjustBrightness(accent, -15));
  root.style.setProperty('--accent-subtle', hexToRgba(accent, 0.15));
  root.style.setProperty('--border-color', border);
  root.style.setProperty('--border-hover', adjustBrightness(border, 20));

  const urlVal = (document.getElementById('theme-custom-bg-url')?.value || '').trim();
  const activeBg = customBgDataUrl || urlVal;
  if (activeBg) {
    const alpha = (opacityVal / 100).toFixed(2);
    const overlay = hexToRgba(bgApp, alpha);
    document.body.style.backgroundImage = `linear-gradient(${overlay}, ${overlay}), url("${activeBg}")`;
    document.body.classList.add('has-bg-image');
  } else {
    document.body.style.backgroundImage = '';
    document.body.classList.remove('has-bg-image');
  }
}

function abrirCriadorTema() {
  injetarModalCriadorTema();
  const cfg = obterConfiguracoes();
  
  snapshotTema = {
    tema: cfg.tema || 'dark-obsidian',
    styleAttr: document.documentElement.getAttribute('style') || '',
    bgImage: document.body.style.backgroundImage || '',
    hasBgClass: document.body.classList.contains('has-bg-image')
  };

  const custom = JSON.parse(localStorage.getItem('openrpg_custom_theme') || 'null');
  if (custom) {
    document.getElementById('theme-custom-name').value = custom.nome || 'Meu Tema';
    const raw = custom.rawColors || {};
    if (raw.bgApp || custom.vars?.['--bg-app']) document.getElementById('thm-col-bg-app').value = raw.bgApp || custom.vars['--bg-app'];
    if (raw.bgCard || custom.vars?.['--bg-card']) document.getElementById('thm-col-bg-card').value = raw.bgCard || custom.vars['--bg-card'];
    if (raw.bgSidebar || custom.vars?.['--bg-sidebar']) document.getElementById('thm-col-bg-sidebar').value = raw.bgSidebar || custom.vars['--bg-sidebar'];
    if (raw.textMain || custom.vars?.['--text-main']) document.getElementById('thm-col-text-main').value = raw.textMain || custom.vars['--text-main'];
    if (raw.accent || custom.vars?.['--accent']) document.getElementById('thm-col-accent').value = raw.accent || custom.vars['--accent'];
    if (raw.border || custom.vars?.['--border-color']) document.getElementById('thm-col-border').value = raw.border || custom.vars['--border-color'];

    const op = custom.bgOpacity != null ? custom.bgOpacity : 85;
    const sOp = custom.sidebarOpacity != null ? custom.sidebarOpacity : 100;
    const cOp = custom.cardsOpacity != null ? custom.cardsOpacity : 100;

    const slOp = document.getElementById('theme-custom-opacity');
    if (slOp) { slOp.value = op; document.getElementById('theme-custom-opacity-val').innerText = `${op}%`; }
    const slSOp = document.getElementById('theme-custom-sidebar-opacity');
    if (slSOp) { slSOp.value = sOp; document.getElementById('theme-custom-sidebar-opacity-val').innerText = `${sOp}%`; }
    const slCOp = document.getElementById('theme-custom-cards-opacity');
    if (slCOp) { slCOp.value = cOp; document.getElementById('theme-custom-cards-opacity-val').innerText = `${cOp}%`; }

    if (custom.bgImage) {
      if (custom.bgImage.startsWith('data:')) {
        customBgDataUrl = custom.bgImage;
        document.getElementById('theme-custom-bg-url').value = '';
      } else {
        customBgDataUrl = '';
        document.getElementById('theme-custom-bg-url').value = custom.bgImage;
      }
    } else {
      customBgDataUrl = '';
      document.getElementById('theme-custom-bg-url').value = '';
    }
  } else {
    document.getElementById('theme-custom-name').value = 'Meu Tema Customizado';
    document.getElementById('thm-col-bg-app').value = obterHexEstilo('--bg-app', '#0c0f16');
    document.getElementById('thm-col-bg-card').value = obterHexEstilo('--bg-card', '#1b2333');
    document.getElementById('thm-col-bg-sidebar').value = obterHexEstilo('--bg-sidebar', '#11151f');
    document.getElementById('thm-col-text-main').value = obterHexEstilo('--text-main', '#f1f5f9');
    document.getElementById('thm-col-accent').value = obterHexEstilo('--accent', '#3b82f6');
    document.getElementById('thm-col-border').value = obterHexEstilo('--border-color', '#263145');
    
    document.getElementById('theme-custom-opacity').value = 85;
    document.getElementById('theme-custom-opacity-val').innerText = '85%';
    document.getElementById('theme-custom-sidebar-opacity').value = 100;
    document.getElementById('theme-custom-sidebar-opacity-val').innerText = '100%';
    document.getElementById('theme-custom-cards-opacity').value = 100;
    document.getElementById('theme-custom-cards-opacity-val').innerText = '100%';
    customBgDataUrl = '';
    document.getElementById('theme-custom-bg-url').value = '';
  }

  atualizarLivePreviewCores();
  document.getElementById('custom-theme-modal').classList.add('active');
}

function cancelarCriadorTema() {
  if (snapshotTema) {
    document.documentElement.setAttribute('style', snapshotTema.styleAttr);
    document.body.style.backgroundImage = snapshotTema.bgImage;
    document.body.classList.toggle('has-bg-image', snapshotTema.hasBgClass);
    aplicarTema(snapshotTema.tema);
    snapshotTema = null;
  }
  const modal = document.getElementById('custom-theme-modal');
  if (modal) modal.classList.remove('active');
}

function removerImagemFundoTema() {
  customBgDataUrl = '';
  const urlInp = document.getElementById('theme-custom-bg-url');
  if (urlInp) urlInp.value = '';
  atualizarLivePreviewCores();
}

function salvarCriadorTema() {
  const nome = (document.getElementById('theme-custom-name').value || 'Tema Customizado').trim();
  const bgApp = document.getElementById('thm-col-bg-app').value;
  const bgCard = document.getElementById('thm-col-bg-card').value;
  const bgSidebar = document.getElementById('thm-col-bg-sidebar').value;
  const textMain = document.getElementById('thm-col-text-main').value;
  const accent = document.getElementById('thm-col-accent').value;
  const border = document.getElementById('thm-col-border').value;
  const bgUrl = (document.getElementById('theme-custom-bg-url').value || '').trim();
  const bgImage = customBgDataUrl || bgUrl;

  const bgOpacity = Number(document.getElementById('theme-custom-opacity')?.value ?? 85);
  const sidebarOpacity = Number(document.getElementById('theme-custom-sidebar-opacity')?.value ?? 100);
  const cardsOpacity = Number(document.getElementById('theme-custom-cards-opacity')?.value ?? 100);

  const sidebarBg = sidebarOpacity < 100 ? hexToRgba(bgSidebar, (sidebarOpacity / 100).toFixed(2)) : bgSidebar;
  const cardBg = cardsOpacity < 100 ? hexToRgba(bgCard, (cardsOpacity / 100).toFixed(2)) : bgCard;
  const cardHover = cardsOpacity < 100 ? hexToRgba(adjustBrightness(bgCard, 15), (cardsOpacity / 100).toFixed(2)) : adjustBrightness(bgCard, 15);

  const vars = {
    '--bg-app': bgApp,
    '--bg-sidebar': sidebarBg,
    '--bg-panel': cardBg,
    '--bg-card': cardBg,
    '--bg-card-hover': cardHover,
    '--bg-input': adjustBrightness(bgApp, 6),
    '--text-main': textMain,
    '--text-muted': adjustBrightness(textMain, -30),
    '--accent': accent,
    '--accent-hover': adjustBrightness(accent, -15),
    '--accent-subtle': hexToRgba(accent, 0.15),
    '--border-color': border,
    '--border-hover': adjustBrightness(border, 20)
  };

  const rawColors = { bgApp, bgCard, bgSidebar, textMain, accent, border };
  const payload = { nome, vars, bgImage, bgOpacity, sidebarOpacity, cardsOpacity, rawColors };
  localStorage.setItem('openrpg_custom_theme', JSON.stringify(payload));
  snapshotTema = null;

  salvarConfiguracao('tema', 'custom');
  aplicarTema('custom');

  const modal = document.getElementById('custom-theme-modal');
  if (modal) modal.classList.remove('active');
  mostrarToast(`Tema "${nome}" salvo com sucesso!`);
}

function exportarTemaJSON() {
  const custom = JSON.parse(localStorage.getItem('openrpg_custom_theme') || 'null');
  const cfg = obterConfiguracoes();
  let temaParaExportar = custom;

  if (!temaParaExportar) {
    const idPadrao = cfg.tema || 'dark-obsidian';
    const def = TEMAS_PADRAO[idPadrao] || TEMAS_PADRAO['dark-obsidian'];
    temaParaExportar = { nome: def.nome, vars: def.vars, bgImage: '', bgOpacity: 85, sidebarOpacity: 100, cardsOpacity: 100 };
  }

  const blob = new Blob([JSON.stringify(temaParaExportar, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  const slug = (temaParaExportar.nome || 'tema').toLowerCase().replace(/[^a-z0-9]/gi, '_');
  a.download = `tema_${slug}.json`;
  a.click();
  mostrarToast(`Tema "${temaParaExportar.nome}" exportado!`);
}

function importarTemaJSON(event) {
  const file = event.target.files && event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const data = JSON.parse(e.target.result);
      if (!data || !data.vars) return mostrarToast('Arquivo de tema inválido.', 'erro');
      const temaFormatado = {
        nome: data.nome || 'Tema Importado',
        vars: data.vars,
        bgImage: data.bgImage || '',
        bgOpacity: data.bgOpacity != null ? Number(data.bgOpacity) : 85,
        sidebarOpacity: data.sidebarOpacity != null ? Number(data.sidebarOpacity) : 100,
        cardsOpacity: data.cardsOpacity != null ? Number(data.cardsOpacity) : 100,
        rawColors: data.rawColors || null
      };
      localStorage.setItem('openrpg_custom_theme', JSON.stringify(temaFormatado));
      salvarConfiguracao('tema', 'custom');
      aplicarTema('custom');
      mostrarToast(`Tema "${temaFormatado.nome}" importado com sucesso!`);
    } catch (err) {
      mostrarToast('Erro ao importar arquivo: ' + err.message, 'erro');
    }
  };
  reader.readAsText(file);
}

function aplicarConfiguracoes() {
  const cfg = obterConfiguracoes();
  aplicarTema(cfg.tema);
  document.body.dataset.fontScale = cfg.escala;
  document.body.classList.toggle('high-contrast', !!cfg.altoContraste);
  document.body.classList.toggle('dyslexic-font', !!cfg.dislexia);
  document.body.classList.toggle('reduce-motion', !!cfg.reduzirAnimacoes);

  const selEscala = document.getElementById('cfg-escala');
  if (selEscala) selEscala.value = cfg.escala;
  const chkContraste = document.getElementById('cfg-contraste');
  if (chkContraste) chkContraste.checked = !!cfg.altoContraste;
  const chkDislexia = document.getElementById('cfg-dislexia');
  if (chkDislexia) chkDislexia.checked = !!cfg.dislexia;
  const chkAnim = document.getElementById('cfg-animacoes');
  if (chkAnim) chkAnim.checked = !!cfg.reduzirAnimacoes;
  const chkSom = document.getElementById('cfg-som');
  if (chkSom) chkSom.checked = !!cfg.somDados;
  const chkAtalhos = document.getElementById('cfg-atalhos');
  if (chkAtalhos) chkAtalhos.checked = !!cfg.atalhos;
}

// Pop-up / Toast customizado do sistema (substitui alerts padrão)
function mostrarToast(mensagem, tipo = 'sucesso') {
  let toastContainer = document.getElementById('openrpg-toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'openrpg-toast-container';
    toastContainer.className = 'openrpg-toast-container';
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement('div');
  toast.className = `openrpg-toast ${tipo}`;
  const icon = tipo === 'erro' ? '⚠️' : tipo === 'aviso' ? 'ℹ️' : '✓';
  toast.innerHTML = `<span class="toast-icon">${icon}</span><span class="toast-msg">${mensagem}</span>`;
  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('visible');
  }, 10);

  setTimeout(() => {
    toast.classList.remove('visible');
    setTimeout(() => {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 300);
  }, 3200);
}

// Feedback Sonoro e Leitor de Tela para Dados
let audioCtxGlobal = null;
function obterAudioContext() {
  if (!audioCtxGlobal) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) audioCtxGlobal = new AudioContextClass();
  }
  if (audioCtxGlobal && audioCtxGlobal.state === 'suspended') {
    audioCtxGlobal.resume();
  }
  return audioCtxGlobal;
}

function tocarSomDado(resultado) {
  const cfg = obterConfiguracoes();
  if (!cfg.somDados) return;
  try {
    const ctx = obterAudioContext();
    if (ctx) {
      for (let i = 0; i < 4; i++) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(160 + Math.random() * 200, ctx.currentTime + i * 0.05);
        gain.gain.setValueAtTime(0.14, ctx.currentTime + i * 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.05 + 0.06);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + i * 0.05);
        osc.stop(ctx.currentTime + i * 0.05 + 0.07);
      }
    }
    if ('speechSynthesis' in window && resultado !== undefined) {
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(String(resultado));
      utter.lang = 'pt-BR';
      window.speechSynthesis.speak(utter);
    }
  } catch (e) {}
}

// Backup: Exportar Campanha por ID
function exportarCampanhaPorId(id) {
  let camps = JSON.parse(localStorage.getItem('openrpg_campanhas') || '[]');
  const camp = camps.find(c => String(c.id) === String(id));
  if (!camp) return mostrarToast('Campanha não encontrada.', 'erro');
  const backup = {
    versao: '1.0',
    data: new Date().toISOString(),
    campanha: camp,
    fichas: JSON.parse(localStorage.getItem(`openrpg_fichas_${id}`) || '[]'),
    parametros: JSON.parse(localStorage.getItem(`openrpg_parametros_${id}`) || '[]'),
    notas: localStorage.getItem(`openrpg_gm_notes_${id}`) || localStorage.getItem(`openrpg_gm_notes${id}`) || '',
    combate: JSON.parse(localStorage.getItem(`openrpg_combat_sim_${id}`) || 'null'),
    combatentesLegado: JSON.parse(localStorage.getItem(`openrpg_personagens_${id}`) || '[]')
  };
  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `openrpg_${(camp.nome || 'campanha').toLowerCase().replace(/\s+/g, '_')}.json`;
  a.click();
  mostrarToast(`Campanha "${camp.nome}" exportada!`);
}

// Backup: Exportar Campanha Ativa
function exportarBackupCampanha() {
  const campAtiva = JSON.parse(localStorage.getItem('openrpg_campanha_ativa') || 'null');
  if (!campAtiva) return mostrarToast('Nenhuma campanha ativa selecionada.', 'aviso');
  exportarCampanhaPorId(campAtiva.id);
}

// Backup: Exportar Ficha Individual
function exportarFichaIndividual(ficha, campNome = '') {
  if (!ficha) return mostrarToast('Ficha inválida para exportação.', 'erro');
  const payload = {
    tipo: 'openrpg_ficha_individual',
    versao: '1.0',
    data: new Date().toISOString(),
    origemCampanha: campNome,
    ficha: ficha
  };
  const nomeArquivo = (ficha.personagem || ficha.jogador || 'ficha')
    .toLowerCase().replace(/[^a-z0-9]/gi, '_');
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `ficha_${nomeArquivo}.json`;
  a.click();
  mostrarToast(`Ficha "${ficha.personagem || ficha.jogador}" exportada!`);
}

// Backup: Importar Campanha
function importarBackupCampanha(event) {
  const file = event.target.files && event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const data = JSON.parse(e.target.result);
      if (!data.campanha || !data.campanha.id) {
        return mostrarToast('Arquivo de campanha inválido.', 'erro');
      }
      const camp = data.campanha;
      const id = camp.id;
      let camps = JSON.parse(localStorage.getItem('openrpg_campanhas') || '[]');
      const idx = camps.findIndex(c => c.id === id);
      if (idx >= 0) camps[idx] = camp; else camps.push(camp);
      localStorage.setItem('openrpg_campanhas', JSON.stringify(camps));
      localStorage.setItem('openrpg_campanha_ativa', JSON.stringify(camp));

      if (data.fichas) localStorage.setItem(`openrpg_fichas_${id}`, JSON.stringify(data.fichas));
      if (data.parametros) localStorage.setItem(`openrpg_parametros_${id}`, JSON.stringify(data.parametros));
      if (data.notas != null) {
        localStorage.setItem(`openrpg_gm_notes_${id}`, data.notas);
        localStorage.setItem(`openrpg_gm_notes${id}`, data.notas);
      }
      if (data.combate) localStorage.setItem(`openrpg_combat_sim_${id}`, JSON.stringify(data.combate));
      if (data.combatentesLegado) localStorage.setItem(`openrpg_personagens_${id}`, JSON.stringify(data.combatentesLegado));

      mostrarToast(`Campanha "${camp.nome}" importada com sucesso!`);
      setTimeout(() => window.location.reload(), 900);
    } catch (err) {
      mostrarToast('Erro ao importar JSON: ' + err.message, 'erro');
    }
  };
  reader.readAsText(file);
}

// Atalhos Globais e Navegação
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    const modalCustom = document.getElementById('custom-theme-modal');
    if (modalCustom && modalCustom.classList.contains('active')) {
      cancelarCriadorTema();
      return;
    }
    if (typeof fecharConfiguracoes === 'function') {
      fecharConfiguracoes();
    }
  }
  const cfg = obterConfiguracoes();
  if (!cfg.atalhos) return;
  const tag = (e.target.tagName || '').toLowerCase();
  if (tag === 'input' || tag === 'textarea' || tag === 'select' || e.target.isContentEditable) return;

  // Atalhos de Combate (Próximo / Anterior)
  if (e.code === 'Space' || e.key === 'ArrowRight') {
    if (typeof proximoTurno === 'function') {
      e.preventDefault();
      proximoTurno();
    } else if (typeof avancarTurno === 'function') {
      e.preventDefault();
      avancarTurno();
    }
  } else if (e.key === 'ArrowLeft') {
    if (typeof turnoAnterior === 'function') {
      e.preventDefault();
      turnoAnterior();
    } else if (typeof voltarTurno === 'function') {
      e.preventDefault();
      voltarTurno();
    }
  }

  // Atalhos do Mestre (1 a 7 para dados)
  if (typeof rolarDado === 'function') {
    const mapa = { '1': 4, '2': 6, '3': 8, '4': 10, '5': 12, '6': 20, '7': 100 };
    if (mapa[e.key]) {
      e.preventDefault();
      rolarDado(mapa[e.key]);
    }
  }
});

document.addEventListener('DOMContentLoaded', aplicarConfiguracoes);
