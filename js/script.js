// Persistência de dados
let tentativas = JSON.parse(localStorage.getItem("tentativas")) || {};
let acertos = JSON.parse(localStorage.getItem("acertos")) || {};

// Salvar no localStorage
function salvarProgresso() {
  localStorage.setItem("tentativas", JSON.stringify(tentativas));
  localStorage.setItem("acertos", JSON.stringify(acertos));
}

// Função geral para atualizar placar
function atualizarPlacar() {
  const totalAcertos = Object.values(acertos).filter(v => v === true).length;
  const totalQuestoes = document.querySelectorAll("main section").length;
  const placar = document.getElementById("placar");
  if (placar) {
    placar.textContent = `Pontuação: ${totalAcertos} / ${totalQuestoes}`;
  }
}

// Função para desativar uma seção após responder
function desativarSecao(secao) {
  const botoes = secao.querySelectorAll("button, input, select");
  botoes.forEach(el => el.disabled = true);
}

// Função para marcar feedback automaticamente
function marcarFeedback(secao, correto, respostaCorreta) {
  secao.querySelector(".feedback").textContent = correto
    ? "✅ Correto!"
    : `❌ Errado! A resposta correta é "${respostaCorreta}"`;
  desativarSecao(secao);
}

// Função para verificar resposta de radio (única escolha)
function verificarResposta(nomeQuestao, respostaCorreta) {
  const secao = document.getElementById(nomeQuestao);
  const radios = secao.querySelectorAll(`input[name="${nomeQuestao}"]`);
  let respostaSelecionada = '';
  for (let radio of radios) {
    if (radio.checked) respostaSelecionada = radio.value;
  }

  if (!respostaSelecionada) {
    alert('Selecione uma opção!');
    return;
  }

  const correto = respostaSelecionada === respostaCorreta;
  acertos[nomeQuestao] = correto;
  tentativas[nomeQuestao] = (tentativas[nomeQuestao] || 0) + 1;
  salvarProgresso();

  marcarFeedback(secao, correto, respostaCorreta);
  atualizarPlacar();
}

// Função para verificar resposta múltipla (checkbox)
function verificarMultipla(nomeQuestao, respostasCorretas) {
  const secao = document.getElementById(nomeQuestao);
  const checkboxes = secao.querySelectorAll(`input[name="${nomeQuestao}"]`);
  let respostasSelecionadas = [];
  checkboxes.forEach(c => { if (c.checked) respostasSelecionadas.push(c.value); });

  respostasSelecionadas.sort();
  respostasCorretas.sort();

  const correto = JSON.stringify(respostasSelecionadas) === JSON.stringify(respostasCorretas);
  acertos[nomeQuestao] = correto;
  tentativas[nomeQuestao] = (tentativas[nomeQuestao] || 0) + 1;
  salvarProgresso();

  marcarFeedback(secao, correto, respostasCorretas.join(', '));
  atualizarPlacar();
}

// Função para verificar resposta de combobox (select)
function verificarCombobox(idSelect, respostaCorreta) {
  const select = document.getElementById(idSelect);
  const secao = select.closest("section");
  const valorSelecionado = select.value;

  if (!valorSelecionado) {
    alert('Selecione uma opção!');
    return;
  }

  const correto = valorSelecionado === respostaCorreta;
  acertos[idSelect] = correto;
  tentativas[idSelect] = (tentativas[idSelect] || 0) + 1;
  salvarProgresso();

  marcarFeedback(secao, correto, respostaCorreta);
  atualizarPlacar();
}

// Restaurar progresso ao carregar a página
window.onload = function() {
  // Percorrer todas as seções
  document.querySelectorAll("main section").forEach(secao => {
    const questaoId = secao.id;

    // Restaurar radio
    const radios = secao.querySelectorAll("input[type=radio]");
    if (radios.length > 0) {
      radios.forEach(radio => {
        if (acertos[questaoId] !== undefined && radio.value === getRespostaCorreta(questaoId)) {
          // Marcar a resposta correta selecionada anteriormente
          if (acertos[questaoId] === true) radio.checked = true;
        }
      });
    }

    // Restaurar checkbox
    const checkboxes = secao.querySelectorAll("input[type=checkbox]");
    if (checkboxes.length > 0) {
      const respostasCorretas = getRespostaCorreta(questaoId, true);
      if (acertos[questaoId] !== undefined && acertos[questaoId] !== null) {
        checkboxes.forEach(cb => {
          if (respostasCorretas.includes(cb.value)) cb.checked = true;
        });
      }
    }

    // Restaurar select
    const select = secao.querySelector("select");
    if (select && acertos[questaoId] !== undefined) {
      select.value = getRespostaCorreta(questaoId);
    }

    // Marcar feedback e desativar se já respondido
    if (acertos[questaoId] !== undefined) {
      const correto = acertos[questaoId];
      const respostaCorreta = getRespostaCorreta(questaoId, checkboxes.length > 0);
      marcarFeedback(secao, correto, Array.isArray(respostaCorreta) ? respostaCorreta.join(', ') : respostaCorreta);
    }
  });

  atualizarPlacar();
};

// Função auxiliar para retornar a resposta correta de cada questão
function getRespostaCorreta(questaoId, multipla=false) {
  switch(questaoId) {
    case "q1": return "C";               // Questão 1
    case "q2": return multipla ? ["A","B","C"] : "A";  // Questão 2
    case "q3": return "C";               // Questão 3
    default: return "";
  }
}
