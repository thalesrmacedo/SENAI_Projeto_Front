// Persistência de dados
let tentativas = JSON.parse(localStorage.getItem("tentativas")) || {};
let acertos = JSON.parse(localStorage.getItem("acertos")) || {};

function salvarProgresso() {
  localStorage.setItem("tentativas", JSON.stringify(tentativas));
  localStorage.setItem("acertos", JSON.stringify(acertos));
}

// Exercício 1 - Escolha Única
function verificarResposta(nomeQuestao, respostaCorreta) {
  const selecionado = document.querySelector(`input[name=${nomeQuestao}]:checked`);
  const secao = document.querySelector(`#${nomeQuestao}`).closest("section");
  const feedback = secao.querySelector(".feedback");

  if (!selecionado) {
    alert("Selecione uma opção!");
    return;
  }

  if (!tentativas[nomeQuestao]) tentativas[nomeQuestao] = 0;
  tentativas[nomeQuestao]++;

  if (selecionado.value === respostaCorreta) {
    feedback.textContent = "✅ Correto!";
    feedback.style.color = "green";
    desativarSecao(secao);
    acertos[nomeQuestao] = true;
  } else if (tentativas[nomeQuestao] >= 3) {
    feedback.textContent = `❌ Incorreto. Resposta correta: ${respostaCorreta}`;
    feedback.style.color = "red";
    desativarSecao(secao);
  } else {
    feedback.textContent = "⚠️ Tente novamente!";
    feedback.style.color = "orange";
  }

  salvarProgresso();
  atualizarPontuacao();
}

// Exercício 2 - Múltipla Escolha
function verificarMultipla(nomeQuestao, respostasCorretas) {
  const selecionados = Array.from(document.querySelectorAll(`input[name=${nomeQuestao}]:checked`)).map(el => el.value);
  const secao = document.querySelector(`#${nomeQuestao}`).closest("section");
  const feedback = secao.querySelector(".feedback");

  if (selecionados.length === 0) {
    alert("Selecione pelo menos uma opção!");
    return;
  }

  if (!tentativas[nomeQuestao]) tentativas[nomeQuestao] = 0;
  tentativas[nomeQuestao]++;

  const corretas = JSON.stringify(selecionados.sort()) === JSON.stringify(respostasCorretas.sort());

  if (corretas) {
    feedback.textContent = "✅ Correto!";
    feedback.style.color = "green";
    desativarSecao(secao);
    acertos[nomeQuestao] = true;
  } else if (tentativas[nomeQuestao] >= 3) {
    feedback.textContent = `❌ Incorreto. Resposta correta: ${respostasCorretas.join(", ")}`;
    feedback.style.color = "red";
    desativarSecao(secao);
  } else {
    feedback.textContent = "⚠️ Tente novamente!";
    feedback.style.color = "orange";
  }

  salvarProgresso();
  atualizarPontuacao();
}

// Exercício 3 - Combobox
function verificarCombobox(idSelect, respostaCorreta) {
  const select = document.getElementById(idSelect);
  const secao = document.querySelector(`#${idSelect}`).closest("section");
  const feedback = secao.querySelector(".feedback");

  if (!select.value) {
    alert("Selecione uma opção!");
    return;
  }

  if (!tentativas[idSelect]) tentativas[idSelect] = 0;
  tentativas[idSelect]++;

  if (select.value === respostaCorreta) {
    feedback.textContent = "✅ Correto!";
    feedback.style.color = "green";
    desativarSecao(secao);
    acertos[idSelect] = true;
  } else if (tentativas[idSelect] >= 3) {
    feedback.textContent = `❌ Incorreto. Resposta correta: ${respostaCorreta}`;
    feedback.style.color = "red";
    desativarSecao(secao);
  } else {
    feedback.textContent = "⚠️ Tente novamente!";
    feedback.style.color = "orange";
  }

  salvarProgresso();
  atualizarPontuacao();
}

// Auxiliares
function desativarSecao(secao) {
  const botoes = secao.querySelectorAll("button, input, select");
  botoes.forEach(el => el.disabled = true);
}

function atualizarPontuacao() {
  const totalAcertos = Object.values(acertos).filter(v => v === true).length;
  const totalQuestoes = document.querySelectorAll("main section").length;
  const placar = document.getElementById("placar");

  if (placar) {
    placar.textContent = `Pontuação: ${totalAcertos} / ${totalQuestoes}`;
  }
}

// Restaurar progresso
window.onload = function() {
  atualizarPontuacao();
};
