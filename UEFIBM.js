// Состояние приложения
let currentStage = 0;
let totalStages = 6;
let autoPlayInterval = null;
let isPlaying = false;
let bootEntries = [
  {
    id: '0001',
    name: 'Windows Boot Manager',
    path: '\\EFI\\Microsoft\\Boot\\bootmgfw.efi',
    active: true,
  },
  {
    id: '0002',
    name: 'ubuntu',
    path: '\\EFI\\ubuntu\\grubx64.efi',
    active: false,
  },
  {
    id: '0003',
    name: 'Fedora',
    path: '\\EFI\\fedora\\shimx64.efi',
    active: false,
  },
  { id: '0004', name: 'Network Boot', path: 'PXE Network', active: false },
];

// Инициализация
document.addEventListener('DOMContentLoaded', function () {
  renderBootEntries();

  // Добавляем обработчики кликов на этапы
  document.querySelectorAll('.flow-stage').forEach((stage, index) => {
    stage.addEventListener('click', () => {
      goToStage(index);
    });
  });

  // Инициализируем первый этап
  goToStage(0);
});

// Рендер загрузочных записей
function renderBootEntries() {
  const container = document.getElementById('boot-entries');
  container.innerHTML = bootEntries
    .map(
      (entry) => `
        <div class="boot-entry ${entry.active ? 'active' : ''}">
            <span class="entry-number">${entry.id}</span>
            <span class="entry-name">${entry.name}</span>
            <span class="entry-path"><code>${entry.path}</code></span>
        </div>
    `,
    )
    .join('');
}

// Перейти к этапу
function goToStage(stageIndex) {
  // Снимаем активный класс со всех
  document.querySelectorAll('.flow-stage').forEach((stage) => {
    stage.classList.remove('active');
  });

  // Добавляем активный класс к выбранному
  document.querySelectorAll('.flow-stage')[stageIndex].classList.add('active');

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

// Демо-функция для добавления записи
function addBootEntry() {
  const id = '000' + (bootEntries.length + 1);
  bootEntries.push({
    id: id,
    name: 'Custom OS',
    path: '\\EFI\\custom\\bootx64.efi',
    active: false,
  });
  renderBootEntries();
}

// Демо-функция для удаления записи
function removeBootEntry(id) {
  bootEntries = bootEntries.filter((entry) => entry.id !== id);
  renderBootEntries();
}
