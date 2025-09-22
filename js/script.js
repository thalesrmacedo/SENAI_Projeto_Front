// Persistência de dados
let tentativasRestantes = JSON.parse(localStorage.getItem("tentativasRestantes")) || {};
let acertos = JSON.parse(localStorage.getItem("acertos")) || {};
const MAX_TENTATIVAS = 3;

// Inicializar tentativasRestantes
document.querySelectorAll("main section").forEach(secao => {
  const id = secao.id;
  if (tentativasRestantes[id] === undefined) tentativasRestantes[id] = MAX_TENTATIVAS;
});

// Salvar progresso
function salvarProgresso() {
  localStorage.setItem("tentativasRestantes", JSON.stringify(tentativasRestantes));
  localStorage.setItem("acertos", JSON.stringify(acertos));
}

// Atualizar placar
function atualizarPlacar() {
  const totalAcertos = Object.values(acertos).filter(v => v === true).length;
  const totalQuestoes = document.querySelectorAll("main section").length;
  document.getElementById("placar").textContent = `Pontuação: ${totalAcertos} / ${totalQuestoes}`;
}

// Atualizar tentativas na tela
function atualizarTentativasSecao(questaoId) {
  const secao = document.getElementById(questaoId);
  const tentativasEl = secao.querySelector(".tentativas");
  tentativasEl.textContent = `Tentativas restantes: ${tentativasRestantes[questaoId]}`;
}

// Desativar inputs e botão
function desativarSecao(secao) {
  const botoes = secao.querySelectorAll("button, input, select");
  botoes.forEach(el => el.disabled = true);
}

// Mostrar feedback
function mostrarFeedback(secao, correto, respostaCorreta) {
  secao.querySelector(".feedback").textContent = correto
    ? "✅ Correto!"
    : `❌ Errado! ${tentativasRestantes[secao.id] === 0 ? 'Resposta correta: ' + (Array.isArray(respostaCorreta) ? respostaCorreta.join(', ') : respostaCorreta) : ''}`;
}

// Processar resposta
function processarResposta(questaoId, respostaSelecionada, respostaCorreta, multipla=false) {
  const secao = document.getElementById(questaoId);

  if (acertos[questaoId]) return; // Já acertou

  // Diminuir tentativas
  tentativasRestantes[questaoId]--;
  salvarProgresso();
  atualizarTentativasSecao(questaoId);

  let correto = false;
  if (multipla) {
    let selOrdenada = respostaSelecionada.slice().sort();
    let corOrdenada = respostaCorreta.slice().sort();
    correto = JSON.stringify(selOrdenada) === JSON.stringify(corOrdenada);
  } else {
    correto = respostaSelecionada === respostaCorreta;
  }

  if (correto) {
    acertos[questaoId] = true;
    salvarProgresso();
    mostrarFeedback(secao, true, respostaCorreta);
    desativarSecao(secao);
  } else {
    mostrarFeedback(secao, false, respostaCorreta);
    if (tentativasRestantes[questaoId] === 0) desativarSecao(secao);
  }

  atualizarPlacar();
}

// Funções específicas
function verificarResposta(questaoId, respostaCorreta) {
  const radios = document.querySelectorAll(`#${questaoId} input[name="${questaoId}"]`);
  let selecionada = '';
  radios.forEach(r => { if(r.checked) selecionada = r.value; });

  if (!selecionada) { alert('Selecione uma opção!'); return; }

  processarResposta(questaoId, selecionada, respostaCorreta);
}

function verificarMultipla(questaoId, respostasCorretas) {
  const checkboxes = document.querySelectorAll(`#${questaoId} input[name="${questaoId}"]`);
  let selecionadas = [];
  checkboxes.forEach(cb => { if(cb.checked) selecionadas.push(cb.value); });

  if (selecionadas.length === 0) { alert('Selecione pelo menos uma opção!'); return; }

  processarResposta(questaoId, selecionadas, respostasCorretas, true);
}

function verificarCombobox(questaoId, respostaCorreta) {
  const select = document.getElementById(questaoId);
  const selecionada = select.value;

  if (!selecionada) { alert('Selecione uma opção!'); return; }

  processarResposta(questaoId, selecionada, respostaCorreta);
}

// Restaurar progresso ao carregar a página
window.onload = function() {
  document.querySelectorAll("main section").forEach(secao => {
    const id = secao.id;
    const respostaCorreta = getRespostaCorreta(id);

    // Só restaurar se a questão já foi respondida (acertos ou tentativas < MAX_TENTATIVAS)
    if (acertos[id] || tentativasRestantes[id] < MAX_TENTATIVAS) {
      // Restaurar respostas do usuário
      if (acertos[id]) {
        const radios = secao.querySelectorAll("input[type=radio]");
        radios.forEach(r => { if(r.value === respostaCorreta) r.checked = true; });

        const checkboxes = secao.querySelectorAll("input[type=checkbox]");
        if (Array.isArray(respostaCorreta)) {
          checkboxes.forEach(cb => { if(respostaCorreta.includes(cb.value)) cb.checked = true; });
        }

        const select = secao.querySelector("select");
        if(select) select.value = respostaCorreta;
      }

      mostrarFeedback(secao, acertos[id] || false, respostaCorreta);
      atualizarTentativasSecao(id);
      if (tentativasRestantes[id] === 0 || acertos[id]) desativarSecao(secao);
    } else {
      // Questão não respondida: resetar feedback e tentativas
      secao.querySelector(".feedback").textContent = '';
      atualizarTentativasSecao(id);
    }
