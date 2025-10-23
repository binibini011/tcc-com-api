// Configuração do carrossel
function initCarousel() {
  const carousel = document.getElementById('newsCarousel');
  const slides = carousel.querySelectorAll('.news-slide');
  const indicatorsContainer = document.getElementById('carouselIndicators');
  
  // Criar indicadores
  slides.forEach((_, index) => {
    const indicator = document.createElement('div');
    indicator.className = 'carousel-indicator' + (index === 0 ? ' active' : '');
    indicator.addEventListener('click', () => {
      scrollToSlide(index);
    });
    indicatorsContainer.appendChild(indicator);
  });
  
  // Atualizar indicadores ao rolar
  carousel.addEventListener('scroll', updateIndicators);
}

function scrollCarousel(direction) {
  const carousel = document.getElementById('newsCarousel');
  const slideWidth = carousel.querySelector('.news-slide').offsetWidth + 20; // largura + gap
  const scrollAmount = slideWidth * direction;
  
  carousel.scrollBy({
    left: scrollAmount,
    behavior: 'smooth'
  });
}

function scrollToSlide(index) {
  const carousel = document.getElementById('newsCarousel');
  const slides = carousel.querySelectorAll('.news-slide');
  const slideWidth = slides[0].offsetWidth + 20; // largura + gap
  
  carousel.scrollTo({
    left: slideWidth * index,
    behavior: 'smooth'
  });
}

function updateIndicators() {
  const carousel = document.getElementById('newsCarousel');
  const slides = carousel.querySelectorAll('.news-slide');
  const indicators = document.querySelectorAll('.carousel-indicator');
  
  const scrollPosition = carousel.scrollLeft;
  const slideWidth = slides[0].offsetWidth + 20;
  const activeIndex = Math.round(scrollPosition / slideWidth);
  
  indicators.forEach((indicator, index) => {
    indicator.classList.toggle('active', index === activeIndex);
  });
}

// Inicializar quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', initCarousel);