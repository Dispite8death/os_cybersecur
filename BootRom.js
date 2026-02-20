let currentMode = 'production';
let bootStage = 0;
let hashValue = 0x00000000;
const targetHash = 0xa3f7c912;

// Автовоспроизведение видео при загрузке
window.addEventListener('load', function () {
  const coreVideo = document.getElementById('core-video');
  const plateVideo = document.getElementById('plate-video');

  // Запуск видео без звука
  coreVideo.play().catch((e) => console.log('Autoplay prevented:', e));
  plateVideo.play().catch((e) => console.log('Autoplay prevented:', e));

  // Запуск анимации хэша
  animateHash();
});

// Анимация хэша
function animateHash() {
  const hashElement = document.getElementById('current-hash');
  const statusElement = document.getElementById('hash-status');

  if (hashValue < targetHash) {
    hashValue += Math.floor(Math.random() * 0x100000);
    if (hashValue > targetHash) hashValue = targetHash;

    hashElement.textContent =
      '0x' + hashValue.toString(16).toUpperCase().padStart(8, '0');

    if (hashValue === targetHash) {
      statusElement.textContent = '✅ Успешно!';
      statusElement.style.color = '#00cc6a';
    } else {
      statusElement.textContent = '⏳ Прожиг...';
      statusElement.style.color = '#ffc107';
    }

    setTimeout(animateHash, 50);
  }
}

// Анимация загрузки
function animateBoot() {
  const stages = document.querySelectorAll('#boot-log .stage-item');
  const processorLayers = document.querySelectorAll('.processor-layer');

  if (bootStage < stages.length) {
    stages.forEach((s) => s.classList.remove('active'));
    stages[bootStage].classList.add('active');

    // Показ слоёв процессора поэтапно
    if (bootStage < processorLayers.length) {
      processorLayers[bootStage].classList.remove('hidden');
    }

    bootStage++;
    setTimeout(animateBoot, 1000);
  } else {
    // Завершение — все этапы успешны
    stages.forEach((s) => {
      s.classList.remove('active');
      s.classList.add('success');
    });
  }
}

// Переключение режимов
function switchMode(mode) {
  document.querySelectorAll('.mode-btn').forEach((btn) => {
    btn.classList.remove('active');
  });
  event.currentTarget.classList.add('active');

  document.getElementById('production-mode').style.display =
    mode === 'production' ? 'grid' : 'none';
  document.getElementById('boot-mode').style.display =
    mode === 'boot' ? 'grid' : 'none';

  currentMode = mode;

  // Сброс и запуск анимаций
  if (mode === 'production') {
    hashValue = 0x00000000;
    document.getElementById('current-hash').textContent = '0x00000000';
    document.getElementById('hash-status').textContent = 'Ожидание...';
    document.getElementById('hash-status').style.color = '#999';

    animateHash();
  } else if (mode === 'boot') {
    bootStage = 0;
    document.querySelectorAll('.processor-layer').forEach((layer, i) => {
      if (i > 0) layer.classList.add('hidden');
      else layer.classList.remove('hidden');
    });
    document.querySelectorAll('#boot-log .stage-item').forEach((s) => {
      s.classList.remove('active', 'success');
    });

    animateBoot();
  }
}
