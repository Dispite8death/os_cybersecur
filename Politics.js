// ==================== РЕШЕНИЕ (правильная политика) ====================
const SOLUTION_POLICY = `# Политика для сервиса резервного копирования
# Тип процесса: backupd_t
# Тип файлов резервных копий: backup_data_t

# Разрешить чтение файлов пользователей
allow backupd_t user_home_t:file { read getattr };

# Разрешить поиск в домашних директориях
allow backupd_t user_home_t:dir search;

# Разрешить запись резервных копий в /var/backup
allow backupd_t var_t:file { write create getattr setattr };
allow backupd_t var_t:dir { write add_name remove_name };

# Запретить чтение файлов паролей (критически важно!)
neverallow backupd_t shadow_t:file read;

# Запретить выполнение произвольных исполняемых файлов
neverallow backupd_t bin_t:file execute;`;

// ==================== КРИТЕРИИ ОЦЕНКИ ====================
const evaluationCriteria = {
  excellent: {
    required: [
      /allow backupd_t user_home_t:file.*read/,
      /allow backupd_t var_t.*write/,
      /neverallow backupd_t shadow_t.*read/,
      /neverallow backupd_t bin_t.*execute/,
    ],
    bonus: [
      /getattr/,
      /setattr/,
      /search/,
      /add_name|remove_name/,
      /#.*комментарий|\/\/.*комментарий/,
    ],
    maxMissing: 0,
    description:
      'Отлично! Политика полная, безопасная и хорошо документирована.',
  },
  good: {
    required: [
      /allow backupd_t user_home_t:file.*read/,
      /allow backupd_t var_t.*write/,
      /neverallow backupd_t shadow_t.*read/,
    ],
    bonus: [],
    maxMissing: 1,
    description: 'Хорошо! Основные правила присутствуют, но можно улучшить.',
  },
  poor: {
    required: [],
    bonus: [],
    maxMissing: 999,
    description: 'Плохо. Политика неполная или содержит ошибки.',
  },
};

// ==================== ФУНКЦИИ ====================

function checkPolicy() {
  const policyText = document.getElementById('policy-editor').value.trim();

  if (!policyText) {
    alert('Введите политику для проверки!');
    return;
  }

  const feedbackDiv = document.getElementById('feedback');
  const feedbackContent = document.getElementById('feedback-content');

  // Оценка политики
  const result = evaluatePolicy(policyText);

  // Отображение результата
  feedbackDiv.style.display = 'block';
  feedbackDiv.className = `feedback-${result.grade}`;

  let html = `<div class="feedback-title">${result.title}</div>`;
  html += `<div class="feedback-text">${result.description}</div>`;

  if (result.details.length > 0) {
    html += `<ul class="feedback-list">`;
    result.details.forEach((detail) => {
      html += `<li>${detail}</li>`;
    });
    html += `</ul>`;
  }

  if (result.grade === 'excellent') {
    html += `<div style="margin-top: 1rem; padding: 1rem; background: rgba(0, 204, 106, 0.2); border-radius: 6px;">
            <strong>🏆 Поздравляем!</strong> Ваша политика соответствует лучшим практикам безопасности.
        </div>`;
  }

  feedbackContent.innerHTML = html;
}

function evaluatePolicy(policy) {
  // Проверка на "отлично"
  let missingExcellent = [];
  evaluationCriteria.excellent.required.forEach((rule, i) => {
    if (!rule.test(policy)) {
      missingExcellent.push(i + 1);
    }
  });

  if (missingExcellent.length === 0) {
    let bonusCount = 0;
    evaluationCriteria.excellent.bonus.forEach((rule) => {
      if (rule.test(policy)) bonusCount++;
    });

    const details = [
      '✅ Разрешено чтение файлов пользователей',
      '✅ Разрешена запись в /var/backup',
      '✅ Запрещено чтение /etc/shadow',
      '✅ Запрещено выполнение бинарников',
    ];

    if (bonusCount > 0) {
      details.push(`⭐ Дополнительные улучшения: +${bonusCount}`);
    }

    return {
      grade: 'excellent',
      title: '🎯 Отлично!',
      description: evaluationCriteria.excellent.description,
      details: details,
    };
  }

  // Проверка на "хорошо"
  let missingGood = [];
  evaluationCriteria.good.required.forEach((rule, i) => {
    if (!rule.test(policy)) {
      missingGood.push(i + 1);
    }
  });

  if (missingGood.length <= evaluationCriteria.good.maxMissing) {
    const details = [
      missingGood.includes(1)
        ? '❌ Не разрешено чтение файлов пользователей'
        : '✅ Разрешено чтение файлов пользователей',
      missingGood.includes(2)
        ? '❌ Не разрешена запись в /var/backup'
        : '✅ Разрешена запись в /var/backup',
      missingGood.includes(3)
        ? '❌ Не запрещено чтение /etc/shadow'
        : '✅ Запрещено чтение /etc/shadow',
    ];

    return {
      grade: 'good',
      title: '👍 Хорошо',
      description: evaluationCriteria.good.description,
      details: details,
    };
  }

  // Иначе "плохо"
  return {
    grade: 'poor',
    title: '⚠️ Плохо',
    description: evaluationCriteria.poor.description,
    details: [
      '❌ Отсутствуют критически важные правила',
      '❌ Нет запретов на чтение /etc/shadow',
      '❌ Нет запретов на выполнение бинарников',
      '💡 Совет: изучите примеры в разделе "Как составить политику"',
    ],
  };
}

function resetEditor() {
  document.getElementById('policy-editor').value = '';
  document.getElementById('feedback').style.display = 'none';
}

function showSolution() {
  if (!confirm('Показать правильное решение? Это завершит текущую попытку.')) {
    return;
  }

  document.getElementById('policy-editor').value = SOLUTION_POLICY;
  checkPolicy();

  // Добавить подсказку
  const feedbackContent = document.getElementById('feedback-content');
  feedbackContent.innerHTML += `
        <div style="margin-top: 1.5rem; padding: 1rem; background: rgba(0, 153, 255, 0.2); border-radius: 6px; border-left: 4px solid var(--secondary);">
            <strong>💡 Объяснение решения:</strong>
            <ul style="margin-top: 0.5rem; margin-left: 1.5rem;">
                <li><code>allow backupd_t user_home_t:file read</code> — сервис может читать файлы пользователей</li>
                <li><code>allow backupd_t var_t:file write</code> — сервис может писать резервные копии</li>
                <li><code>neverallow backupd_t shadow_t:file read</code> — сервис НИКОГДА не читает пароли</li>
                <li><code>neverallow backupd_t bin_t:file execute</code> — сервис НИКОГДА не запускает бинарники</li>
            </ul>
        </div>
    `;
}

// ==================== ИНИЦИАЛИЗАЦИЯ ====================

document.addEventListener('DOMContentLoaded', () => {
  // Автоформатирование при вводе (простая подсветка синтаксиса)
  const editor = document.getElementById('policy-editor');
  editor.addEventListener('input', function () {
    // Можно добавить подсветку синтаксиса, но для простоты оставим как есть
  });
});
