// ===== Simulador 2: Fruição da renda =====
document.getElementById("calcular2").addEventListener("click", function () {
  const valorInicial = parseFloat(document.getElementById("valorInicial2").value);
  const taxaMensal = parseFloat(document.getElementById("taxaMensal2").value) / 100;
  const retiradaMensal = parseFloat(document.getElementById("retiradaMensal2").value);
  const resultado = document.getElementById("resultado2");
  const botao = document.getElementById("calcular2");

  if (isNaN(valorInicial) || isNaN(taxaMensal) || isNaN(retiradaMensal) || taxaMensal <= 0) {
    resultado.innerHTML = "Preencha todos os campos corretamente!";
    resultado.style.color = "#ff4d4d";
    botao.textContent = "Preencha todos os campos!";
    return;
  }

  if (retiradaMensal <= valorInicial * taxaMensal) {
    resultado.style.color = "#4CAF50";
    resultado.innerHTML = "O seu dinheiro nunca irá acabar com base neste cenário proposto.";
    botao.textContent = "Total em Anos: ∞";
    return;
  }

  const numerador = Math.log(retiradaMensal / (retiradaMensal - valorInicial * taxaMensal));
  const denominador = Math.log(1 + taxaMensal);
  const n = numerador / denominador;

  if (!isFinite(n) || isNaN(n)) {
    resultado.style.color = "#4CAF50";
    resultado.innerHTML = "O seu dinheiro nunca irá acabar com base neste cenário proposto.";
    botao.textContent = "Total em Anos: ∞";
    return;
  }

  const anos = Math.floor(n / 12);
  const meses = Math.round(n % 12);

  botao.textContent = `Total em Anos: ${anos}`;
  resultado.style.color = "#4CAF50";
  resultado.innerHTML = `Com R$ ${valorInicial.toLocaleString("pt-BR")} aplicados, retirando R$ ${retiradaMensal.toLocaleString("pt-BR")} por mês a ${(
    taxaMensal * 100
  ).toFixed(2)}% ao mês, o dinheiro durará cerca de ${anos} anos e ${meses} meses.`;
});
