// Состояние таймлайна
let currentStage = 0;
let totalStages = 6;
let autoPlayInterval = null;
let isPlaying = false;

// Инициализация
document.addEventListener('DOMContentLoaded', function () {
  // Добавляем обработчики кликов на этапы
  document.querySelectorAll('.timeline-stage').forEach((stage, index) => {
    stage.addEventListener('click', () => {
      goToStage(index);
    });
  });

  // Инициализируем первый этап
  goToStage(0);
});

// Перейти к этапу
function goToStage(stageIndex) {
  // Снимаем активный класс со всех
  document.querySelectorAll('.timeline-stage').forEach((stage) => {
    stage.classList.remove('active');
  });

  // Добавляем активный класс к выбранному
  document
    .querySelectorAll('.timeline-stage')
    [stageIndex].classList.add('active');

  // Обновляем текущий этап
  currentStage = stageIndex;
}

// Следующий этап
function nextStage() {
  if (currentStage < totalStages - 1) {
    goToStage(currentStage + 1);
  }
}

// Предыдущий этап
function prevStage() {
  if (currentStage > 0) {
    goToStage(currentStage - 1);
  }
}

// Автовоспроизведение
function toggleAutoPlay() {
  const playBtn = document.querySelector('.play-btn');
  const playIcon = document.getElementById('play-icon');

  if (isPlaying) {
    // Остановить
    clearInterval(autoPlayInterval);
    isPlaying = false;
    playBtn.classList.remove('playing');
    playIcon.textContent = '▶';
  } else {
    // Запустить
    isPlaying = true;
    playBtn.classList.add('playing');
    playIcon.textContent = '⏸';

    autoPlayInterval = setInterval(() => {
      if (currentStage < totalStages - 1) {
        goToStage(currentStage + 1);
      } else {
        // Сбросить на начало
        goToStage(0);
        clearInterval(autoPlayInterval);
        isPlaying = false;
        playBtn.classList.remove('playing');
        playIcon.textContent = '▶';
      }
    }, 2000);
  }
}

// Добавляем горячие клавиши
document.addEventListener('keydown', function (e) {
  if (e.key === 'ArrowRight') {
    nextStage();
  } else if (e.key === 'ArrowLeft') {
    prevStage();
  } else if (e.key === ' ') {
    toggleAutoPlay();
  }
});
