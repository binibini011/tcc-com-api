// script.js
import { papeis } from './api.js';

let currentPage = 1;
const itemsPerPage = 5;

const fiisContainer = document.getElementById('fiis-container');
const prevPageBtn = document.getElementById('prev-page');
const nextPageBtn = document.getElementById('next-page');
const pageInfo = document.getElementById('page-info');

function formatCurrency(value) {
  if (!value || value === null || value === undefined) return '-';
  return 'R$ ' + value.toFixed(2).replace('.', ',');
}

function formatNumber(value) {
  if (!value || value === null || value === undefined) return '-';
  if (value >= 1000000000) {
    return (value / 1000000000).toFixed(2).replace('.', ',') + ' BI';
  }
  if (value >= 1000000) {
    return (value / 1000000).toFixed(2).replace('.', ',') + ' M';
  }
  if (value >= 1000) {
    return (value / 1000).toFixed(2).replace('.', ',') + ' K';
  }
  return value.toFixed(2).replace('.', ',');
}

function formatPercentage(value) {
  if (!value || value === null || value === undefined) return '-';
  return value.toFixed(2).replace('.', ',') + '%';
}

function formatPatrimonio(value) {
  if (!value || value === null || value === undefined) return '-';
  if (value >= 1000000000) {
    return (value / 1000000000).toFixed(2).replace('.', ',') + ' BI';
  }
  if (value >= 1000000) {
    return (value / 1000000).toFixed(2).replace('.', ',') + ' M';
  }
  return value.toFixed(2).replace('.', ',');
}

function prepararFiis() {
  return papeis
    .filter(papel => 
      papel.sector !== 'Indefinido' && 
      papel.sector !== 'N/A' && 
      papel.paper !== null
    )
    .map(papel => ({
      ...papel,
      patrimonio: papel.amountOfAssets ? papel.amountOfAssets * 1000000 : null
    }));
}

function renderFiis() {
  const fiis = prepararFiis();
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentFiis = fiis.slice(startIndex, endIndex);

  fiisContainer.innerHTML = '';

  currentFiis.forEach(fii => {
    const fiiRow = `
      <div class="fii-row">
        <div>
          <div class="fii-ticker">
            <i class="fas fa-building building-icon"></i>
            ${fii.paper}
          </div>
          <div class="fii-name">${fii.sector}</div>
        </div>
        <div class="metric-value">${formatPatrimonio(fii.patrimonio)}</div>
        <div class="metric-value">${formatPercentage(fii.dividendYield)}</div>
        <div class="metric-value">${fii.pVpa ? fii.pVpa.toFixed(2).replace('.', ',') : '-'}</div>
        <div class="metric-value">${formatNumber(fii.liquidity)}</div>
        <div class="metric-value">${formatCurrency(fii.paperValue)}</div>
      </div>
    `;
    fiisContainer.innerHTML += fiiRow;
  });

  const totalPages = Math.ceil(fiis.length / itemsPerPage);
  pageInfo.textContent = `Página ${currentPage} de ${totalPages}`;
  prevPageBtn.disabled = currentPage === 1;
  nextPageBtn.disabled = currentPage === totalPages;

  // Renderizar o Radar do Mercado
  renderizarRadarMercado();
}

// Função para o Radar do Mercado
function renderizarRadarMercado() {
  const fiis = prepararFiis();
  
  console.log('Total de FIIs disponíveis:', fiis.length);
  console.log('Primeiros FIIs:', fiis.slice(0, 3));
  
  // Maiores Dividendos (top 5 por dividendYield)
  const maioresDividendos = [...fiis]
    .filter(fii => fii.dividendYield && fii.dividendYield > 0)
    .sort((a, b) => b.dividendYield - a.dividendYield)
    .slice(0, 5);
  
  console.log('Maiores Dividendos:', maioresDividendos);
  
  // Maior Valor do Mercado (top 5 por patrimonio)
  const maiorValorMercado = [...fiis]
    .filter(fii => fii.patrimonio && fii.patrimonio > 0)
    .sort((a, b) => b.patrimonio - a.patrimonio)
    .slice(0, 5);
  
  console.log('Maior Valor Mercado:', maiorValorMercado);
  
  // Maiores Receitas (top 5 por liquidity - como proxy para receita)
  const maioresReceitas = [...fiis]
    .filter(fii => fii.liquidity && fii.liquidity > 0)
    .sort((a, b) => b.liquidity - a.liquidity)
    .slice(0, 5);
  
  console.log('Maiores Receitas:', maioresReceitas);
  
  // Renderizar Maiores Dividendos
  const dividendosContainer = document.getElementById('maiores-dividendos');
  dividendosContainer.innerHTML = '';
  
  if (maioresDividendos.length === 0) {
    dividendosContainer.innerHTML = '<div class="text-center p-3 text-muted">Nenhum dado disponível</div>';
  } else {
    maioresDividendos.forEach((fii, index) => {
      const row = `
        <div class="fii-row radar-row">
          <div class="fii-ticker">
            <i class="fas fa-building building-icon"></i>
            ${fii.paper}
          </div>
          <div class="metric-value text-success">
            ${formatPercentage(fii.dividendYield)}
          </div>
        </div>
      `;
      dividendosContainer.innerHTML += row;
    });
  }
  
  // Renderizar Maior Valor do Mercado
  const valorMercadoContainer = document.getElementById('maior-valor-mercado');
  valorMercadoContainer.innerHTML = '';
  
  if (maiorValorMercado.length === 0) {
    valorMercadoContainer.innerHTML = '<div class="text-center p-3 text-muted">Nenhum dado disponível</div>';
  } else {
    maiorValorMercado.forEach((fii, index) => {
      const row = `
        <div class="fii-row radar-row">
          <div class="fii-ticker">
            <i class="fas fa-building building-icon"></i>
            ${fii.paper}
          </div>
          <div class="metric-value text-warning">
            ${formatPatrimonio(fii.patrimonio)}
          </div>
        </div>
      `;
      valorMercadoContainer.innerHTML += row;
    });
  }
  
  // Renderizar Maiores Receitas
  const receitasContainer = document.getElementById('maiores-receitas');
  receitasContainer.innerHTML = '';
  
  if (maioresReceitas.length === 0) {
    receitasContainer.innerHTML = '<div class="text-center p-3 text-muted">Nenhum dado disponível</div>';
  } else {
    maioresReceitas.forEach((fii, index) => {
      const row = `
        <div class="fii-row radar-row">
          <div class="fii-ticker">
            <i class="fas fa-building building-icon"></i>
            ${fii.paper}
          </div>
          <div class="metric-value text-info">
            ${formatNumber(fii.liquidity)}
          </div>
        </div>
      `;
      receitasContainer.innerHTML += row;
    });
  }
}

prevPageBtn.addEventListener('click', () => {
  if (currentPage > 1) {
    currentPage--;
    renderFiis();
  }
});

nextPageBtn.addEventListener('click', () => {
  const fiis = prepararFiis();
  const totalPages = Math.ceil(fiis.length / itemsPerPage);
  
  if (currentPage < totalPages) {
    currentPage++;
    renderFiis();
  }
});

// Inicializar quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM carregado, iniciando renderização...');
  renderFiis();
});

// Também tenta renderizar após um pequeno delay como fallback
setTimeout(() => {
  if (fiisContainer.innerHTML === '') {
    console.log('Tentando renderização fallback...');
    renderFiis();
  }
}, 1000);