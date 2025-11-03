import { papeis } from './api.js';

document.addEventListener("DOMContentLoaded", () => {
  const btnAdicionar = document.getElementById('btnAdicionar');
  const modal = new bootstrap.Modal(document.getElementById('modalAdicionarFII'));
  const inputBusca = document.getElementById('inputBuscaFII');
  const filtroSelect = document.getElementById('filtroFII');
  const listaModal = document.getElementById('listaFIIsModal');
  const carteiraLista = document.getElementById('carteiraLista');

  let carteira = [];

  // --- Abrir modal ---
  btnAdicionar.addEventListener('click', () => {
    modal.show();
    renderListaModal(papeis);
  });

  // --- Filtro e busca ---
  if (inputBusca) inputBusca.addEventListener('input', aplicarFiltros);
  if (filtroSelect) filtroSelect.addEventListener('change', aplicarFiltros);

  function aplicarFiltros() {
    const termo = inputBusca.value.toLowerCase();
    let lista = papeis.filter(p => p.paper.toLowerCase().includes(termo));

    switch (filtroSelect.value) {
      case 'maiorValor':
        lista.sort((a, b) => (b.paperValue || 0) - (a.paperValue || 0));
        break;
      case 'maiorDY':
        lista.sort((a, b) => (b.dividendYield || 0) - (a.dividendYield || 0));
        break;
      case 'maiorPL':
        lista.sort((a, b) => (b.amountOfAssets || 0) - (a.amountOfAssets || 0));
        break;
      case 'maiorLiquidez':
        lista.sort((a, b) => (b.liquidity || 0) - (a.liquidity || 0));
        break;
    }

    renderListaModal(lista);
  }

  // --- Renderizar lista no modal ---
 function renderListaModal(lista) {
  listaModal.innerHTML = '';

  if (lista.length === 0) {
    listaModal.innerHTML = `<p class="text-center text-muted mt-3">Nenhum FII encontrado.</p>`;
    return;
  }

  lista.slice(0, 60).forEach(papel => {
    const valor = papel.paperValue?.toFixed(2) ?? '-';
    const dy = papel.dividendYield?.toFixed(2) ?? '-';
    const patrimonio = papel.amountOfAssets
      ? (papel.amountOfAssets * 1_000_000).toLocaleString('pt-BR')
      : '-';
    const liquidez = papel.liquidity
      ? papel.liquidity.toLocaleString('pt-BR')
      : '-';

    const item = document.createElement('div');
    item.className = 'fii-item';
    item.innerHTML = `
      <div class="fii-nome">${papel.paper}</div>
      <div class="metric">R$ ${valor}</div>
      <div class="metric"> ${dy}%</div>
      <div class="metric"> ${patrimonio}</div>
      <div class="metric"> ${liquidez}</div>
      <button class="btn btn-success btn-sm">
        <i class="bi bi-plus-circle"></i>
      </button>
    `;

    item.querySelector('button').addEventListener('click', () => adicionarFii(papel));
    listaModal.appendChild(item);
  });
}


  // --- Adicionar FII ---
  function adicionarFii(papel) {
    if (carteira.find(p => p.paper === papel.paper)) {
      alert('Este FII já foi adicionado!');
      return;
    }

    carteira.push({ ...papel, status: 'acompanhando' });
    renderCarteira();
    modal.hide();
  }

  // --- Renderizar FIIs da Carteira ---
  function renderCarteira() {
    carteiraLista.innerHTML = '';

    carteira.forEach((fii, index) => {
      const patrimonio = fii.amountOfAssets ? (fii.amountOfAssets * 1_000_000).toLocaleString('pt-BR') : '-';
      const dividendYield = fii.dividendYield ? fii.dividendYield.toFixed(2) + '%' : '-';
      const pvp = fii.pVpa ? fii.pVpa.toFixed(2) : '-';
      const liquidez = fii.liquidity ? fii.liquidity.toLocaleString('pt-BR') : '-';
      const cotacao = fii.paperValue ? 'R$ ' + fii.paperValue.toFixed(2) : '-';

      const item = document.createElement('div');
      item.className = 'fii-item';
      item.innerHTML = `
        <div class="fii-nome">${fii.paper}</div>
        <div class="metric">${patrimonio}</div>
        <div class="metric">${dividendYield}</div>
        <div class="metric">${pvp}</div>
        <div class="metric">${liquidez}</div>
        <div class="metric">${cotacao}</div>
        <div class="fii-acoes">
          <span class="status ${fii.status}">
            ${fii.status === 'acompanhando' ? 'Acompanhando' : 'Possuo'}
          </span>
          <button class="fii-btn edit" title="Editar"><i class="bi bi-pencil"></i></button>
          <button class="fii-btn delete" title="Remover"><i class="bi bi-trash"></i></button>
        </div>
      `;

      item.querySelector('.edit').addEventListener('click', () => alternarStatus(index));
      item.querySelector('.delete').addEventListener('click', () => removerFii(index));

      carteiraLista.appendChild(item);
    });
  }

  // --- Alternar status (possuo/acompanhando) ---
  function alternarStatus(index) {
    carteira[index].status = carteira[index].status === 'acompanhando' ? 'possuo' : 'acompanhando';
    renderCarteira();
  }

  // --- Remover FII ---
  function removerFii(index) {
    carteira.splice(index, 1);
    renderCarteira();
  }
});
