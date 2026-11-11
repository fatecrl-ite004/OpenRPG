// OpenRPG - Gerenciador de Configurações, Acessibilidade e Backup

function obterConfiguracoes() {
  return Object.assign({
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

function aplicarConfiguracoes() {
  const cfg = obterConfiguracoes();
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

// Feedback Sonoro e Leitor de Tela para Dados
function tocarSomDado(resultado) {
  const cfg = obterConfiguracoes();
  if (!cfg.somDados) return;
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    for (let i = 0; i < 4; i++) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(150 + Math.random() * 180, ctx.currentTime + i * 0.05);
      gain.gain.setValueAtTime(0.12, ctx.currentTime + i * 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.05 + 0.05);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + i * 0.05);
      osc.stop(ctx.currentTime + i * 0.05 + 0.06);
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
  if (!camp) return alert('Campanha não encontrada.');
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
}

// Backup: Exportar Campanha Ativa
function exportarBackupCampanha() {
  const campAtiva = JSON.parse(localStorage.getItem('openrpg_campanha_ativa') || 'null');
  if (!campAtiva) return alert('Nenhuma campanha ativa selecionada para exportação.');
  exportarCampanhaPorId(campAtiva.id);
}

// Backup: Importar Campanha
function importarBackupCampanha(event) {
  const file = event.target.files && event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const data = JSON.parse(e.target.result);
      if (!data.campanha || !data.campanha.id) return alert('Arquivo de backup inválido.');
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

      alert(`Campanha "${camp.nome}" importada com sucesso!`);
      window.location.reload();
    } catch (err) {
      alert('Erro ao importar JSON: ' + err.message);
    }
  };
  reader.readAsText(file);
}

// Atalhos Globais e Navegação
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && typeof fecharConfiguracoes === 'function') {
    fecharConfiguracoes();
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
