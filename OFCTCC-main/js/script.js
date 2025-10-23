// ===== Simulador 1: Atingir um valor =====
document.getElementById("calcular1").addEventListener("click", function () {
  const t = parseFloat(document.getElementById("taxa1").value) / 100;
  const a = parseInt(document.getElementById("anos1").value);
  const al = parseFloat(document.getElementById("alvo1").value);
  const botao = document.getElementById("calcular1");

  if (isNaN(t) || isNaN(a) || isNaN(al) || t <= 0 || a <= 0 || al <= 0) {
    botao.textContent = "Preencha todos os campos!";
    return;
  }

  const n = a * 12;
  const P = al * (t / ((1 + t) ** n - 1));

  botao.textContent =
    "Total do Aporte: R$ " +
    P.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
});

