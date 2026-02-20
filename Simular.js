// ==================== СЦЕНАРИИ ====================

const scenarios = {
  webShell: {
    title: '🌐 Веб-шелл (www-data)',
    description:
      'Хакер получил доступ к веб-серверу через уязвимость (например, RCE в PHP-скрипте). Может ли он прочитать /etc/shadow?',
    lesson:
      'DAC уязвим к ошибкам конфигурации (неправильные права группы). MAC защищает критические файлы даже при таких ошибках — политика явно запрещает веб-серверу доступ к паролям.',

    dac: [
      {
        user: 'www-data',
        action: 'Чтение',
        target: '/etc/shadow',
        result: '✅ РАЗРЕШЁН',
        explanation:
          "www-data состоит в группе 'shadow'. DAC проверяет только права файла (rw-r-----), и доступ разрешён.",
      },
      {
        user: 'user',
        action: 'Чтение',
        target: '/etc/shadow',
        result: '❌ ЗАПРЕЩЁН',
        explanation:
          "Обычный пользователь не в группе 'shadow' и не имеет прав на чтение.",
      },
      {
        user: 'root',
        action: 'Чтение',
        target: '/etc/shadow',
        result: '✅ РАЗРЕШЁН',
        explanation:
          'Root обходит все проверки DAC — суперпользователь может читать любой файл.',
      },
    ],

    mac: [
      {
        context: 'httpd_t',
        target: 'shadow_t',
        action: 'read',
        result: '❌ ЗАПРЕЩЁН',
        explanation:
          'Политика явно запрещает: neverallow httpd_t shadow_t:file read. Даже если права файла разрешают — доступ заблокирован.',
      },
      {
        user_t: 'user_t',
        target: 'shadow_t',
        action: 'read',
        result: '❌ ЗАПРЕЩЁН',
        explanation:
          'Обычный пользователь ограничен политикой и не может читать файлы паролей.',
      },
      {
        context: 'unconfined_t',
        target: 'shadow_t',
        action: 'read',
        result: '✅ РАЗРЕШЁН',
        explanation:
          'Домен unconfined_t (root) не ограничен политикой — полный доступ.',
      },
    ],
  },

  malware: {
    title: '🦠 Вредоносное ПО (root)',
    description:
      'Вредонос запущен с правами суперпользователя (например, через эксплойт ядра). Может ли он удалить системные файлы?',
    lesson:
      'DAC бессилен против атак от имени root — суперпользователь обходит все проверки прав. Только MAC (SELinux/AppArmor) обеспечивает защиту даже при компрометации суперпользователя.',

    dac: [
      {
        user: 'root',
        action: 'Удаление',
        target: '/usr/bin/ls',
        result: '✅ РАЗРЕШЁН',
        explanation:
          'Root обходит все проверки DAC — может удалить любой файл в системе.',
      },
      {
        user: 'user',
        action: 'Удаление',
        target: '/usr/bin/ls',
        result: '❌ ЗАПРЕЩЁН',
        explanation:
          'Обычный пользователь не владелец файла и не имеет прав на запись.',
      },
      {
        user: 'www-data',
        action: 'Удаление',
        target: '/usr/bin/ls',
        result: '❌ ЗАПРЕЩЁН',
        explanation: 'Веб-сервер не имеет прав на запись в системные файлы.',
      },
    ],

    mac: [
      {
        context: 'unconfined_t',
        target: 'bin_t',
        action: 'unlink',
        result: '❌ ЗАПРЕЩЁН',
        explanation:
          'Политика явно запрещает: neverallow unconfined_t bin_t:file unlink. Даже суперпользователь ограничен.',
      },
      {
        context: 'user_t',
        target: 'bin_t',
        action: 'unlink',
        result: '❌ ЗАПРЕЩЁН',
        explanation:
          'Политика разрешает user_t только {read, execute}, но не удаление.',
      },
      {
        context: 'container_t',
        target: 'bin_t',
        action: 'unlink',
        result: '❌ ЗАПРЕЩЁН',
        explanation:
          'Контейнер ограничен профилем — доступ только к своим файлам.',
      },
    ],
  },

  containerEscape: {
    title: '🐳 Побег из контейнера',
    description:
      'Процесс в контейнере (даже с правами root) пытается прочитать файлы хоста через примонтированный том.',
    lesson:
      'DAC бесполезен против контейнерных атак — если процесс в контейнере работает от root, он обходит все проверки. MAC (AppArmor/SELinux) обеспечивает изоляцию на уровне ядра через профили.',

    dac: [
      {
        user: 'root',
        action: 'Чтение',
        target: '/host/etc/shadow',
        result: '✅ РАЗРЕШЁН',
        explanation:
          'Процесс в контейнере работает от имени root. Владелец файла — тоже root. DAC разрешает доступ.',
      },
      {
        user: 'user',
        action: 'Чтение',
        target: '/host/etc/shadow',
        result: '❌ ЗАПРЕЩЁН',
        explanation:
          'Обычный пользователь в контейнере не имеет прав на чтение файлов хоста.',
      },
    ],

    mac: [
      {
        context: 'container_t',
        target: 'shadow_t',
        action: 'read',
        result: '❌ ЗАПРЕЩЁН',
        explanation:
          'AppArmor профиль контейнера разрешает доступ только к /container/**. Доступ к /host заблокирован.',
      },
      {
        context: 'unconfined_t',
        target: 'shadow_t',
        action: 'read',
        result: '✅ РАЗРЕШЁН',
        explanation:
          'Процесс вне контейнера (unconfined_t) не ограничен профилем контейнера.',
      },
    ],
  },

  privilegeEscalation: {
    title: '⚡ Эскалация привилегий',
    description:
      'Пользователь пытается использовать уязвимость в sudo для получения прав администратора.',
    lesson:
      'DAC разрешает эскалацию через механизмы вроде SUID — любой пользователь может запустить sudo. MAC не блокирует запуск, но ограничивает действия после эскалации — даже с правами root процесс ограничен политикой.',

    dac: [
      {
        user: 'user',
        action: 'Выполнение',
        target: '/usr/bin/sudo',
        result: '✅ РАЗРЕШЁН',
        explanation:
          'SUID-бит позволяет любому пользователю запустить sudo с правами root.',
      },
      {
        user: 'root',
        action: 'Выполнение',
        target: '/usr/bin/sudo',
        result: '✅ РАЗРЕШЁН',
        explanation: 'Root может запускать любые программы без ограничений.',
      },
    ],

    mac: [
      {
        context: 'user_t',
        target: 'sudo_exec_t',
        action: 'execute',
        result: '⚠️ ЧАСТИЧНО',
        explanation:
          'Запуск разрешён, но после перехода в домен sudo_t действия ограничены: только {passwd, visudo, shutdown}. Попытка запуска /bin/sh заблокирована.',
      },
      {
        context: 'unconfined_t',
        target: 'sudo_exec_t',
        action: 'execute',
        result: '✅ РАЗРЕШЁН',
        explanation:
          'Суперпользователь в домене unconfined_t не ограничен политикой.',
      },
    ],
  },
};

// ==================== ФУНКЦИИ ОТОБРАЖЕНИЯ ====================

function renderTable(data, tableId) {
  const tbody = document.querySelector(`#${tableId} tbody`);
  tbody.innerHTML = '';

  data.forEach((row) => {
    const tr = document.createElement('tr');

    // Определяем класс результата
    let resultClass = '';
    if (row.result.includes('✅')) resultClass = 'result-success';
    else if (row.result.includes('❌')) resultClass = 'result-danger';
    else if (row.result.includes('⚠️')) resultClass = 'result-warning';

    // Для DAC
    if (tableId === 'table-dac') {
      tr.innerHTML = `
                <td><strong>${row.user}</strong></td>
                <td>${row.action}</td>
                <td><code>${row.target}</code></td>
                <td class="${resultClass}">${row.result}</td>
                <td>${row.explanation}</td>
            `;
    }
    // Для MAC
    else {
      tr.innerHTML = `
                <td><code>${row.context}</code></td>
                <td><code>${row.target}</code></td>
                <td>${row.action}</td>
                <td class="${resultClass}">${row.result}</td>
                <td>${row.explanation}</td>
            `;
    }

    tbody.appendChild(tr);
  });
}

function selectScenario(scenarioKey) {
  // Сброс выделения
  document.querySelectorAll('.scenario-card').forEach((card) => {
    card.classList.remove('selected');
  });

  // Выделение текущего
  event.currentTarget.classList.add('selected');

  // Получение сценария
  const scenario = scenarios[scenarioKey];
  if (!scenario) {
    console.error(`Сценарий ${scenarioKey} не найден`);
    return;
  }

  // Показ контента
  document.getElementById('scenario-content').style.display = 'block';

  // Заголовок и описание
  document.getElementById('scenario-title').textContent = scenario.title;
  document.getElementById('scenario-description').textContent =
    scenario.description;

  // Таблицы
  renderTable(scenario.dac, 'table-dac');
  renderTable(scenario.mac, 'table-mac');

  // Вывод
  document.getElementById('lesson-text').textContent = scenario.lesson;
  document.getElementById('lesson-card').style.display = 'block';
}

// ==================== ИНИЦИАЛИЗАЦИЯ ====================

document.addEventListener('DOMContentLoaded', () => {
  // Обработчики кликов на сценарии
  document.querySelectorAll('.scenario-card').forEach((card) => {
    card.addEventListener('click', () => {
      const scenarioKey = card.getAttribute('data-scenario');
      selectScenario(scenarioKey);
    });
  });
});
