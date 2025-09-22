// Persistência de dados
let tentativasRestantes = JSON.parse(localStorage.getItem("tentativasRestantes")) || {};
let acertos = JSON.parse(localStorage.getItem("acertos")) || {};
const MAX_TENTATIVAS = 3;

// Inicializa tentativasRestantes
document.querySelectorAll("main section").forEach(secao => {
  const id = secao.id;
  if (tentativasRestantes[id] === undefined) tentativasRestantes[id] = MAX_TENTATIVAS;
  atualizarTentativasSecao(id);
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

// Atualizar tentativas restantes
function atualizarTentativasSecao(questaoId) {
  const secao = document.getElementById(questaoId);
  secao.querySelector(".tentativas").textContent = `Tentativas restantes: ${tentativasRestantes[questaoId]}`;
}

// Desativa inputs e botão
function desativarSecao(secao) {
  const botoes = secao.querySelectorAll("button, input, select");
  botoes.forEach(el => el.disabled = true);
}

// Mostra feedback
function mostrarFeedback(secao, correto, respostaCorreta) {
  secao.querySelector(".feedback").textContent = correto
    ? "✅ Correto!"
    : `❌ Errado! ${tentativasRestantes[secao.id] === 0 ? 'Resposta correta: ' + (Array.isArray(respostaCorreta) ? respostaCorreta.join(', ') : respostaCorreta) : ''}`;
}

// Processa qualquer tipo de resposta
function processarResposta(questaoId, respostaSelecionada, respostaCorreta, multipla=false) {
  const secao = document.getElementById(questaoId);
  if (acertos[questaoId]) return; // já acertou

  // Diminuir tentativas
  tentativasRestantes[questaoId]--;
  salvarProgresso();
  atualizarTentativasSecao(questaoId);

  // Verifica se está correto
  let correto = false;
  if (multipla) {
    correto = JSON.stringify(respostaSelecionada.slice().sort()) === JSON.stringify(respostaCorreta.slice().sort());
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

// Funções específicas para cada tipo de questão
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
  const secao = document.getElementById(questaoId);
  const select = secao.querySelector("select"); // pega o select DENTRO da seção
  const selecionada = select.value;

  if (!selecionada) { // vazio = nenhuma opção selecionada
    alert('Selecione uma opção!');
    return;
  }

  processarResposta(questaoId, selecionada, respostaCorreta);
}

// Restaurar progresso
window.onload = function() {
  document.querySelectorAll("main section").forEach(secao => {
    const id = secao.id;
    const respostaCorreta = getRespostaCorreta(id);

    // Restaurar feedback e inputs **apenas se já houver tentativa**
    if (acertos[id] || tentativasRestantes[id] < MAX_TENTATIVAS) {
      // Restaurar respostas do usuário
      const radios = secao.querySelectorAll("input[type=radio]");
      radios.forEach(r => { if(r.checked && acertos[id]) r.checked = true; });

      const checkboxes = secao.querySelectorAll("input[type=checkbox]");
      if (Array.isArray(respostaCorreta)) {
        checkboxes.forEach(cb => { if(cb.checked && acertos[id]) cb.checked = true; });
      }

      const select = secao.querySelector("select");
      if(select && acertos[id]) select.value = respostaCorreta;

      mostrarFeedback(secao, acertos[id] || false, respostaCorreta);
      atualizarTentativasSecao(id);
      if(tentativasRestantes[id] === 0 || acertos[id]) desativarSecao(secao);
    } else {
      // Se ainda não respondeu, limpa feedback
      secao.querySelector(".feedback").textContent = '';
      atualizarTentativasSecao(id);
    }
  });

  atualizarPlacar();
};

// Respostas corretas
function getRespostaCorreta(questaoId){
  switch(questaoId){
    case "q1": return "C";
    case "q2": return ["A","B","C"];
    case "q3": return "C";
    default: return "";
  }
}
