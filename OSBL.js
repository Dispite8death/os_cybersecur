// Простой скрипт для анимации и интерактивности

document.addEventListener('DOMContentLoaded', function () {
  // Анимация появления карточек
  const cards = document.querySelectorAll(
    '.card, .config-card, .kernel-stage, .boot-component, .grub-stage',
  );

  cards.forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';

    setTimeout(() => {
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    }, 200 * index);
  });

  // Интерактивность для этапов загрузки
  const kernelStages = document.querySelectorAll('.kernel-stage');

  kernelStages.forEach((stage, index) => {
    stage.addEventListener('click', function () {
      // Снимаем активный класс со всех
      kernelStages.forEach((s) => s.classList.remove('active'));

      // Добавляем активный класс к текущему
      this.classList.add('active');

      // Показываем информацию (можно расширить)
      console.log(`Этап ${index + 1} выбран`);
    });
  });

  // Плавная прокрутка к якорям
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();

      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 100,
          behavior: 'smooth',
        });
      }
    });
  });

  // Анимация при наведении на таблицу
  const tableCells = document.querySelectorAll('.table-cell');

  tableCells.forEach((cell) => {
    cell.addEventListener('mouseenter', function () {
      this.style.backgroundColor = 'rgba(0, 255, 136, 0.05)';
    });

    cell.addEventListener('mouseleave', function () {
      this.style.backgroundColor = '';
    });
  });
});
