// Persistência de dados
let tentativas = JSON.parse(localStorage.getItem("tentativas")) || {};
let acertos = JSON.parse(localStorage.getItem("acertos")) || {};

// Salvar no localStorage
function salvarProgresso() {
  localStorage.setItem("tentativas", JSON.stringify(tentativas));
  localStorage.setItem("acertos", JSON.stringify(acertos));
}

// Atualizar placar
function atualizarPlacar() {
  const totalAcertos = Object.values(acertos).filter(v => v === true).length;
  const totalQuestoes = document.querySelectorAll("main section").length;
  const placar = document.getElementById("placar");
  if (placar) {
    placar.textContent = `Pontuação: ${totalAcertos} / ${totalQuestoes}`;
  }
}

// Desativar inputs após responder
function desativarSecao(secao) {
  const botoes = secao.querySelectorAll("button, input, select");
  botoes.forEach(el => el.disabled = true);
}

// Marcar feedback
function marcarFeedback(secao, correto, respostaCorreta) {
  secao.querySelector(".feedback").textContent = correto
    ? "✅ Correto!"
    : `❌ Errado! A resposta correta é "${respostaCorreta}"`;
  desativarSecao(secao);
}

// Resposta única (radio)
function verificarResposta(questaoId, respostaCorreta) {
  const secao = document.getElementById(questaoId);
  const radios = secao.querySelectorAll(`input[name="${questaoId}"]`);
  let selecionada = '';
  radios.forEach(r => { if(r.checked) selecionada = r.value; });

  if(!selecionada){ alert('Selecione uma opção!'); return; }

  const correto = selecionada === respostaCorreta;
  acertos[questaoId] = correto;
  tentativas[questaoId] = (tentativas[questaoId] || 0) + 1;
  salvarProgresso();

  marcarFeedback(secao, correto, respostaCorreta);
  atualizarPlacar();
}

// Resposta múltipla (checkbox)
function verificarMultipla(questaoId, respostasCorretas) {
  const secao = document.getElementById(questaoId);
  const checkboxes = secao.querySelectorAll(`input[name="${questaoId}"]`);
  let selecionadas = [];
  checkboxes.forEach(cb => { if(cb.checked) selecionadas.push(cb.value); });

  selecionadas.sort();
  respostasCorretas.sort();

  const correto = JSON.stringify(selecionadas) === JSON.stringify(respostasCorretas);
  acertos[questaoId] = correto;
  tentativas[questaoId] = (tentativas[questaoId] || 0) + 1;
  salvarProgresso();

  marcarFeedback(secao, correto, respostasCorretas.join(', '));
  atualizarPlacar();
}

// Resposta combobox (select)
function verificarCombobox(questaoId, respostaCorreta) {
  const select = document.getElementById(questaoId);
  const secao = select.closest("section");
  const selecionado = select.value;

  if(!selecionado){ alert('Selecione uma opção!'); return; }

  const correto = selecionado === respostaCorreta;
  acertos[questaoId] = correto;
  tentativas[questaoId] = (tentativas[questaoId] || 0) + 1;
  salvarProgresso();

  marcarFeedback(secao, correto, respostaCorreta);
  atualizarPlacar();
}

// Restaurar progresso ao carregar a página
window.onload = function() {
  document.querySelectorAll("main section").forEach(secao => {
    const questaoId = secao.id;
    if(acertos[questaoId] !== undefined){
      const correto = acertos[questaoId];
      const respostaCorreta = getRespostaCorreta(questaoId);
      
      // Restaurar respostas
      const radios = secao.querySelectorAll("input[type=radio]");
      radios.forEach(r => { if(r.value === respostaCorreta) r.checked = true; });

      const checkboxes = secao.querySelectorAll("input[type=checkbox]");
      const respostasCorretas = getRespostaCorreta(questaoId, true);
      checkboxes.forEach(cb => { if(respostasCorretas.includes(cb.value)) cb.checked = true; });

      const select = secao.querySelector("select");
      if(select) select.value = respostaCorreta;

      // Feedback e desativar
      marcarFeedback(secao, correto, Array.isArray(respostaCorreta) ? respostasCorretas.join(', ') : respostaCorreta);
    }
  });

  atualizarPlacar();
};

// Retorna respostas corretas
function getRespostaCorreta(questaoId, multipla=false){
  switch(questaoId){
    case "q1": return "C";
    case "q2": return multipla ? ["A","B","C"] : "A";
    case "q3": return "C";
    default: return "";
  }
}
