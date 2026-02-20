// ==================== ГЛОБАЛЬНОЕ СОСТОЯНИЕ ====================
let currentMode = 'dac'; // 'dac' или 'mac'
let currentUser = 'user'; // Текущий пользователь/контекст
let currentPath = '/'; // Текущий путь

// ==================== ФАЙЛОВАЯ СИСТЕМА ====================
const filesystem = {
  '/': {
    type: 'directory',
    name: '/',
    owner: 'root',
    group: 'root',
    perms: {
      dac: 'rwxr-xr-x', // 755
      mac: 'system_u:object_r:root_t',
    },
    children: ['etc', 'var', 'home', 'usr', 'tmp'],
  },

  '/etc': {
    type: 'directory',
    name: 'etc',
    owner: 'root',
    group: 'root',
    perms: {
      dac: 'rwxr-xr-x', // 755
      mac: 'system_u:object_r:etc_t',
    },
    children: ['passwd', 'shadow', 'hosts'],
  },

  '/etc/passwd': {
    type: 'file',
    name: 'passwd',
    owner: 'root',
    group: 'root',
    perms: {
      dac: 'rw-r--r--', // 644
      mac: 'system_u:object_r:etc_t',
    },
    content:
      'root:x:0:0:root:/root:/bin/bash\nuser:x:1000:1000::/home/user:/bin/bash',
  },

  '/etc/shadow': {
    type: 'file',
    name: 'shadow',
    owner: 'root',
    group: 'shadow',
    perms: {
      dac: 'rw-r-----', // 640
      mac: 'system_u:object_r:shadow_t',
    },
    content:
      'root:$6$salt$hash:18295:0:99999:7:::\nuser:$6$salt$hash:18295:0:99999:7:::',
  },

  '/etc/hosts': {
    type: 'file',
    name: 'hosts',
    owner: 'root',
    group: 'root',
    perms: {
      dac: 'rw-r--r--', // 644
      mac: 'system_u:object_r:etc_t',
    },
    content: '127.0.0.1 localhost\n::1 localhost',
  },

  '/var': {
    type: 'directory',
    name: 'var',
    owner: 'root',
    group: 'root',
    perms: {
      dac: 'rwxr-xr-x', // 755
      mac: 'system_u:object_r:var_t',
    },
    children: ['www', 'log', 'tmp'],
  },

  '/var/www': {
    type: 'directory',
    name: 'www',
    owner: 'www-data',
    group: 'www-data',
    perms: {
      dac: 'rwxr-xr-x', // 755
      mac: 'system_u:object_r:httpd_sys_content_t',
    },
    children: ['html'],
  },

  '/var/www/html': {
    type: 'directory',
    name: 'html',
    owner: 'www-data',
    group: 'www-data',
    perms: {
      dac: 'rwxr-xr-x', // 755
      mac: 'system_u:object_r:httpd_sys_content_t',
    },
    children: ['index.html', 'style.css'],
  },

  '/var/www/html/index.html': {
    type: 'file',
    name: 'index.html',
    owner: 'www-data',
    group: 'www-data',
    perms: {
      dac: 'rw-r--r--', // 644
      mac: 'system_u:object_r:httpd_sys_content_t',
    },
    content:
      '<!DOCTYPE html>\n<html>\n<head><title>Test</title></head>\n<body>Hello World</body>\n</html>',
  },

  '/var/www/html/style.css': {
    type: 'file',
    name: 'style.css',
    owner: 'www-data',
    group: 'www-data',
    perms: {
      dac: 'rw-r--r--', // 644
      mac: 'system_u:object_r:httpd_sys_content_t',
    },
    content: 'body { background: white; }',
  },

  '/home': {
    type: 'directory',
    name: 'home',
    owner: 'root',
    group: 'root',
    perms: {
      dac: 'rwxr-xr-x', // 755
      mac: 'system_u:object_r:home_root_t',
    },
    children: ['user'],
  },

  '/home/user': {
    type: 'directory',
    name: 'user',
    owner: 'user',
    group: 'user',
    perms: {
      dac: 'rwxr-x---', // 750
      mac: 'unconfined_u:object_r:user_home_t',
    },
    children: ['documents', 'downloads', '.bashrc'],
  },

  '/home/user/documents': {
    type: 'directory',
    name: 'documents',
    owner: 'user',
    group: 'user',
    perms: {
      dac: 'rwxr-x---', // 750
      mac: 'unconfined_u:object_r:user_home_t',
    },
    children: ['report.txt', 'notes.md'],
  },

  '/home/user/documents/report.txt': {
    type: 'file',
    name: 'report.txt',
    owner: 'user',
    group: 'user',
    perms: {
      dac: 'rw-r-----', // 640
      mac: 'unconfined_u:object_r:user_home_t',
    },
    content: 'Confidential report content...',
  },

  '/home/user/documents/notes.md': {
    type: 'file',
    name: 'notes.md',
    owner: 'user',
    group: 'user',
    perms: {
      dac: 'rw-r--r--', // 644
      mac: 'unconfined_u:object_r:user_home_t',
    },
    content: '# My Notes\n\nImportant notes here...',
  },

  '/home/user/downloads': {
    type: 'directory',
    name: 'downloads',
    owner: 'user',
    group: 'user',
    perms: {
      dac: 'rwxrwxr-x', // 775
      mac: 'unconfined_u:object_r:user_home_t',
    },
    children: [],
  },

  '/home/user/.bashrc': {
    type: 'file',
    name: '.bashrc',
    owner: 'user',
    group: 'user',
    perms: {
      dac: 'rw-r--r--', // 644
      mac: 'unconfined_u:object_r:user_home_t',
    },
    content: '# .bashrc\nexport PATH=$PATH:/usr/local/bin',
  },

  '/usr': {
    type: 'directory',
    name: 'usr',
    owner: 'root',
    group: 'root',
    perms: {
      dac: 'rwxr-xr-x', // 755
      mac: 'system_u:object_r:usr_t',
    },
    children: ['bin'],
  },

  '/usr/bin': {
    type: 'directory',
    name: 'bin',
    owner: 'root',
    group: 'root',
    perms: {
      dac: 'rwxr-xr-x', // 755
      mac: 'system_u:object_r:bin_t',
    },
    children: ['ls', 'cat', 'sudo'],
  },

  '/usr/bin/ls': {
    type: 'file',
    name: 'ls',
    owner: 'root',
    group: 'root',
    perms: {
      dac: 'rwxr-xr-x', // 755
      mac: 'system_u:object_r:bin_t',
    },
    content: '[binary executable]',
  },

  '/usr/bin/cat': {
    type: 'file',
    name: 'cat',
    owner: 'root',
    group: 'root',
    perms: {
      dac: 'rwxr-xr-x', // 755
      mac: 'system_u:object_r:bin_t',
    },
    content: '[binary executable]',
  },

  '/usr/bin/sudo': {
    type: 'file',
    name: 'sudo',
    owner: 'root',
    group: 'root',
    perms: {
      dac: 'rwsr-xr-x', // 4755 (SUID)
      mac: 'system_u:object_r:sudo_exec_t',
    },
    content: '[binary executable with SUID]',
  },

  '/tmp': {
    type: 'directory',
    name: 'tmp',
    owner: 'root',
    group: 'root',
    perms: {
      dac: 'rwxrwxrwt', // 1777 (sticky bit)
      mac: 'system_u:object_r:tmp_t',
    },
    children: ['tempfile.txt'],
  },

  '/tmp/tempfile.txt': {
    type: 'file',
    name: 'tempfile.txt',
    owner: 'user',
    group: 'user',
    perms: {
      dac: 'rw-r--r--', // 644
      mac: 'system_u:object_r:tmp_t',
    },
    content: 'Temporary file content',
  },
};

// ==================== ПОЛЬЗОВАТЕЛИ И КОНТЕКСТЫ ====================
const users = {
  dac: ['root', 'user', 'www-data'],
  mac: ['unconfined_t', 'user_t', 'httpd_t', 'container_t'],
};

// ==================== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ====================

function log(message, type = 'info') {
  const logs = document.getElementById('logs');
  const timestamp = new Date().toLocaleTimeString();
  const entry = document.createElement('div');
  entry.className = `log-entry log-${type}`;
  entry.textContent = `[${timestamp}] ${message}`;
  logs.appendChild(entry);
  logs.scrollTop = logs.scrollHeight;
}

function getFullPath(path, name) {
  if (path === '/') return `/${name}`;
  return `${path}/${name}`;
}

function getParentPath(path) {
  if (path === '/') return '/';
  const parts = path.split('/').filter((p) => p);
  parts.pop();
  return parts.length === 0 ? '/' : `/${parts.join('/')}`;
}

// ==================== ПРОВЕРКА ПРАВ ====================

// Проверка прав в DAC
function checkDACPermissions(path, user, action) {
  const item = filesystem[path];
  if (!item) return { allowed: false, reason: 'Файл не найден' };

  const perms = item.perms.dac;
  const owner = item.owner;
  const group = item.group;

  // Root может всё
  if (user === 'root') {
    return { allowed: true, reason: 'Root обходит все проверки DAC' };
  }

  // Определяем позицию в правах
  let pos;
  if (user === owner) {
    pos = 0; // владелец
  } else if (group === 'shadow' && user === 'www-data') {
    pos = 1; // www-data в группе shadow (для демонстрации)
  } else if (user === 'user' && group === 'user') {
    pos = 1; // user в своей группе
  } else {
    pos = 2; // остальные
  }

  // Проверка действия
  let requiredBit;
  if (action === 'read')
    requiredBit = 0; // r
  else if (action === 'write')
    requiredBit = 1; // w
  else if (action === 'execute')
    requiredBit = 2; // x
  else if (action === 'delete') {
    // Для удаления нужна запись в родительской директории
    const parent = getParentPath(path);
    return checkDACPermissions(parent, user, 'write');
  }

  const hasPermission = perms.charAt(pos * 3 + requiredBit) !== '-';

  if (!hasPermission) {
    return {
      allowed: false,
      reason: `Нет прав на ${action} (${owner}/${group}: ${perms})`,
    };
  }

  return {
    allowed: true,
    reason: `Права ${perms} разрешают ${action} для ${user}`,
  };
}

// Проверка прав в MAC
function checkMACPermissions(path, context, action) {
  const item = filesystem[path];
  if (!item) return { allowed: false, reason: 'Файл не найден' };

  const itemType = item.perms.mac.split(':')[2] || item.perms.mac.split(':')[1]; // Например: shadow_t, bin_t

  // Политики
  const policies = {
    httpd_t: {
      allowed: ['httpd_sys_content_t'],
      denied: ['shadow_t', 'etc_t', 'user_home_t', 'bin_t'],
      actions: {
        httpd_sys_content_t: ['read', 'execute'],
        shadow_t: [],
        etc_t: [],
        user_home_t: [],
        bin_t: [],
      },
    },
    user_t: {
      allowed: ['user_home_t', 'etc_t', 'bin_t', 'tmp_t'],
      denied: ['shadow_t'],
      actions: {
        user_home_t: ['read', 'write', 'execute'],
        etc_t: ['read'],
        bin_t: ['read', 'execute'],
        tmp_t: ['read', 'write'],
        shadow_t: [],
      },
    },
    unconfined_t: {
      allowed: ['*'], // Полный доступ
      denied: [],
      actions: {
        '*': ['read', 'write', 'execute', 'delete'],
      },
    },
    container_t: {
      allowed: ['container_file_t', 'tmp_t'], // ← Добавлено container_file_t
      denied: [
        'shadow_t',
        'etc_t',
        'user_home_t',
        'bin_t',
        'httpd_sys_content_t',
      ],
      actions: {
        container_file_t: ['read', 'write'], // ← Разрешены действия с собственными файлами
        tmp_t: ['read', 'write'],
        shadow_t: [],
        etc_t: [],
        user_home_t: [],
        bin_t: [],
        httpd_sys_content_t: [],
      },
    },
  };

  const policy = policies[context];
  if (!policy) {
    return { allowed: false, reason: `Неизвестный контекст: ${context}` };
  }

  // Проверка типа
  if (policy.denied.includes(itemType)) {
    return {
      allowed: false,
      reason: `Политика запрещает ${context} доступ к ${itemType}`,
    };
  }

  if (policy.allowed.includes('*')) {
    return {
      allowed: true,
      reason: `${context} имеет полный доступ (unconfined)`,
    };
  }

  if (!policy.allowed.includes(itemType)) {
    return {
      allowed: false,
      reason: `${context} не имеет доступа к типу ${itemType}`,
    };
  }

  // Проверка действия
  const allowedActions = policy.actions[itemType] || policy.actions['*'] || [];
  if (!allowedActions.includes(action)) {
    return {
      allowed: false,
      reason: `Политика не разрешает ${action} для ${context} → ${itemType}`,
    };
  }

  return {
    allowed: true,
    reason: `Политика разрешает ${context} → ${itemType} (${action})`,
  };
}

// ==================== ОТОБРАЖЕНИЕ ====================

function updateUserSelector() {
  const userSelect = document.getElementById('current-user');
  const userList = currentMode === 'dac' ? users.dac : users.mac;

  // Сохраняем текущего пользователя, если он есть в новом списке
  if (!userList.includes(currentUser)) {
    currentUser = currentMode === 'dac' ? 'user' : 'user_t';
  }

  // Очищаем и заполняем селект
  userSelect.innerHTML = '';
  userList.forEach((u) => {
    const option = document.createElement('option');
    option.value = u;
    option.textContent = u;
    if (u === currentUser) option.selected = true;
    userSelect.appendChild(option);
  });

  // Обновляем отображение файлов
  renderFileList();
}

function renderFileList() {
  const fileList = document.getElementById('file-list');
  fileList.innerHTML = '';

  const currentDir = filesystem[currentPath];
  if (!currentDir || currentDir.type !== 'directory') {
    log(`Ошибка: ${currentPath} не является директорией`, 'danger');
    return;
  }

  // ".." для перехода вверх
  if (currentPath !== '/') {
    const parentItem = document.createElement('div');
    parentItem.className = 'file-item directory';
    parentItem.innerHTML = `
            <div class="file-header" onclick="navigateTo('${getParentPath(currentPath)}')">
                <span class="file-icon">⬆️</span>
                <span class="file-name">..</span>
            </div>
            <div class="file-owner">Родительская директория</div>
        `;
    fileList.appendChild(parentItem);
  }

  // Файлы и папки
  currentDir.children.forEach((name) => {
    const fullPath = getFullPath(currentPath, name);
    const item = filesystem[fullPath];
    if (!item) return;

    const perms = item.perms[currentMode];
    const isDir = item.type === 'directory';

    // Проверка прав для текущего пользователя
    const readCheck =
      currentMode === 'dac'
        ? checkDACPermissions(fullPath, currentUser, 'read')
        : checkMACPermissions(fullPath, currentUser, 'read');

    const writeCheck =
      currentMode === 'dac'
        ? checkDACPermissions(fullPath, currentUser, 'write')
        : checkMACPermissions(fullPath, currentUser, 'write');

    const deleteCheck =
      currentMode === 'dac'
        ? checkDACPermissions(fullPath, currentUser, 'delete')
        : checkMACPermissions(fullPath, currentUser, 'delete');

    const itemElement = document.createElement('div');
    itemElement.className = `file-item ${isDir ? 'directory' : 'file'}`;

    itemElement.innerHTML = `
            <div class="file-header" onclick="${isDir ? `navigateTo('${fullPath}')` : `readFile('${fullPath}')`}">
                <span class="file-icon">${isDir ? '📁' : item.name.endsWith('.html') || item.name.endsWith('.css') ? '📄' : '⚙️'}</span>
                <span class="file-name">${item.name}</span>
                <span class="file-perms">${perms}</span>
            </div>
            <div class="file-owner">Владелец: ${item.owner} ${item.group ? `(${item.group})` : ''}</div>
            <div class="file-actions">
                <button class="action-btn read" ${readCheck.allowed ? '' : 'disabled'}
                    onclick="event.stopPropagation(); readFile('${fullPath}')" title="${readCheck.reason}">
                    👀 Чтение
                </button>
                <button class="action-btn write" ${writeCheck.allowed ? '' : 'disabled'}
                    onclick="event.stopPropagation(); writeFile('${fullPath}')" title="${writeCheck.reason}">
                    ✏️ Запись
                </button>
                <button class="action-btn delete" ${deleteCheck.allowed ? '' : 'disabled'}
                    onclick="event.stopPropagation(); deleteFile('${fullPath}')" title="${deleteCheck.reason}">
                    🗑️ Удалить
                </button>
            </div>
        `;

    fileList.appendChild(itemElement);
  });

  // Обновление пути
  document.getElementById('current-path').textContent = currentPath;
}

function navigateTo(path) {
  currentPath = path;
  renderFileList();
  log(`Переход в: ${path}`, 'info');
}

function readFile(path) {
  const item = filesystem[path];
  if (!item) {
    log(`Файл не найден: ${path}`, 'danger');
    return;
  }

  const check =
    currentMode === 'dac'
      ? checkDACPermissions(path, currentUser, 'read')
      : checkMACPermissions(path, currentUser, 'read');

  if (!check.allowed) {
    log(`❌ Отказано в чтении ${path}: ${check.reason}`, 'danger');
    alert(`Отказано в доступе!\nПричина: ${check.reason}`);
    return;
  }

  log(`✅ Чтение ${path}: ${check.reason}`, 'success');
  alert(`Содержимое ${item.name}:\n\n${item.content}`);
}

function writeFile(path) {
  const item = filesystem[path];
  if (!item) {
    log(`Файл не найден: ${path}`, 'danger');
    return;
  }

  const check =
    currentMode === 'dac'
      ? checkDACPermissions(path, currentUser, 'write')
      : checkMACPermissions(path, currentUser, 'write');

  if (!check.allowed) {
    log(`❌ Отказано в записи ${path}: ${check.reason}`, 'danger');
    alert(`Отказано в доступе!\nПричина: ${check.reason}`);
    return;
  }

  const content = prompt(`Редактирование ${item.name}:`, item.content);
  if (content !== null) {
    item.content = content;
    log(`✅ Запись в ${path}: ${check.reason}`, 'success');
    alert('Файл успешно обновлён!');
    renderFileList();
  }
}

function deleteFile(path) {
  const item = filesystem[path];
  if (!item) {
    log(`Файл не найден: ${path}`, 'danger');
    return;
  }

  const check =
    currentMode === 'dac'
      ? checkDACPermissions(path, currentUser, 'delete')
      : checkMACPermissions(path, currentUser, 'delete');

  if (!check.allowed) {
    log(`❌ Отказано в удалении ${path}: ${check.reason}`, 'danger');
    alert(`Отказано в доступе!\nПричина: ${check.reason}`);
    return;
  }

  if (!confirm(`Удалить ${item.name}?`)) return;

  // Удаление из родительской директории
  const parentPath = getParentPath(path);
  const parent = filesystem[parentPath];
  if (parent && parent.children) {
    const index = parent.children.indexOf(item.name);
    if (index > -1) {
      parent.children.splice(index, 1);
    }
  }

  // Удаление из filesystem
  delete filesystem[path];

  log(`✅ Удаление ${path}: ${check.reason}`, 'success');
  alert('Файл успешно удалён!');
  renderFileList();
}

function createFile() {
  const fileName = prompt('Имя нового файла:');
  if (!fileName) return;

  const fullPath = getFullPath(currentPath, fileName);
  if (filesystem[fullPath]) {
    alert('Файл уже существует!');
    return;
  }

  // Проверка прав на запись в текущую директорию
  const writeCheck =
    currentMode === 'dac'
      ? checkDACPermissions(currentPath, currentUser, 'write')
      : checkMACPermissions(currentPath, currentUser, 'write');

  if (!writeCheck.allowed) {
    log(
      `❌ Нет прав на создание файла в ${currentPath}: ${writeCheck.reason}`,
      'danger',
    );
    alert(`Отказано в доступе!\nПричина: ${writeCheck.reason}`);
    return;
  }

  const content = prompt('Содержимое файла (опционально):', '');

  // Определяем владельца и группу в зависимости от режима и пользователя
  let owner, group;
  if (currentMode === 'dac') {
    owner = currentUser; // Ключевое исправление: владелец = текущий пользователь
    group = currentUser === 'root' ? 'root' : currentUser;
  } else {
    // MAC: упрощённо
    owner = currentUser === 'unconfined_t' ? 'root' : 'user';
    group = currentUser === 'unconfined_t' ? 'root' : 'user';
  }

  // Определяем права в зависимости от владельца
  const isRoot = owner === 'root';
  const dacPermsFile = isRoot ? 'rw-r--r--' : 'rw-rw-r--';

  // Определяем метку MAC в зависимости от контекста
  let macLabel = '';
  if (currentMode === 'mac') {
    if (currentUser.includes('httpd')) {
      macLabel = 'system_u:object_r:httpd_sys_content_t';
    } else if (currentUser === 'unconfined_t') {
      macLabel = 'system_u:object_r:admin_home_t';
    } else if (currentUser === 'container_t') {
      // Критическое исправление: правильная метка для контейнера
      macLabel = 'system_u:object_r:container_file_t';
    } else if (currentUser === 'user_t') {
      macLabel = 'unconfined_u:object_r:user_home_t';
    } else {
      // Fallback для неизвестных контекстов
      macLabel = 'system_u:object_r:tmp_t';
    }
  }

  filesystem[fullPath] = {
    type: 'file',
    name: fileName,
    owner: owner,
    group: group,
    perms: {
      dac: dacPermsFile,
      mac: macLabel,
    },
    content: content || '',
  };

  // Добавление в родительскую директорию
  const parent = filesystem[currentPath];
  if (parent && parent.children) {
    parent.children.push(fileName);
  }

  log(`✅ Создан файл ${fullPath} (владелец: ${owner})`, 'success');
  alert('Файл успешно создан!');
  renderFileList();
}

function createDirectory() {
  const dirName = prompt('Имя новой директории:');
  if (!dirName) return;

  const fullPath = getFullPath(currentPath, dirName);
  if (filesystem[fullPath]) {
    alert('Директория уже существует!');
    return;
  }

  // Проверка прав на запись в текущую директорию
  const writeCheck =
    currentMode === 'dac'
      ? checkDACPermissions(currentPath, currentUser, 'write')
      : checkMACPermissions(currentPath, currentUser, 'write');

  if (!writeCheck.allowed) {
    log(
      `❌ Нет прав на создание директории в ${currentPath}: ${writeCheck.reason}`,
      'danger',
    );
    alert(`Отказано в доступе!\nПричина: ${writeCheck.reason}`); // ✅ Исправлена опечатка \н → \n
    return;
  }

  // Определяем владельца и группу в зависимости от режима и пользователя
  let owner, group;
  if (currentMode === 'dac') {
    owner = currentUser; // Ключевое исправление: владелец = текущий пользователь
    group = currentUser === 'root' ? 'root' : currentUser;
  } else {
    // MAC: упрощённо
    owner = currentUser === 'unconfined_t' ? 'root' : 'user';
    group = currentUser === 'unconfined_t' ? 'root' : 'user';
  }

  // Определяем права в зависимости от владельца
  const isRoot = owner === 'root';
  const dacPermsDir = isRoot ? 'rwxr-xr-x' : 'rwxrwxr-x';

  // Определяем метку MAC в зависимости от контекста
  let macLabel = '';
  if (currentMode === 'mac') {
    if (currentUser.includes('httpd')) {
      macLabel = 'system_u:object_r:httpd_sys_content_t';
    } else if (currentUser === 'unconfined_t') {
      macLabel = 'system_u:object_r:admin_home_t';
    } else if (currentUser === 'container_t') {
      // Критическое исправление: правильная метка для контейнера
      macLabel = 'system_u:object_r:container_file_t';
    } else if (currentUser === 'user_t') {
      macLabel = 'unconfined_u:object_r:user_home_t';
    } else {
      // Fallback для неизвестных контекстов
      macLabel = 'system_u:object_r:tmp_t';
    }
  }

  filesystem[fullPath] = {
    type: 'directory',
    name: dirName,
    owner: owner,
    group: group,
    perms: {
      dac: dacPermsDir,
      mac: macLabel,
    },
    children: [],
  };

  // Добавление в родительскую директорию
  const parent = filesystem[currentPath];
  if (parent && parent.children) {
    parent.children.push(dirName);
  }

  log(`✅ Создана директория ${fullPath} (владелец: ${owner})`, 'success');
  alert('Директория успешно создана!');
  renderFileList();
}

function switchMode(mode) {
  currentMode = mode;
  document
    .getElementById('mode-dac')
    .classList.toggle('active', mode === 'dac');
  document
    .getElementById('mode-mac')
    .classList.toggle('active', mode === 'mac');

  updateUserSelector();
  log(`Режим переключён на: ${mode.toUpperCase()}`, 'info');
}

// ==================== ИНИЦИАЛИЗАЦИЯ ====================

document.addEventListener('DOMContentLoaded', () => {
  // Инициализация селекта пользователей
  const userSelect = document.getElementById('current-user');
  userSelect.addEventListener('change', function () {
    currentUser = this.value;
    renderFileList();
    log(`Пользователь изменён на: ${currentUser}`, 'info');
  });

  // Инициализация интерфейса
  updateUserSelector();
  log(
    'Файловый менеджер запущен. Выберите режим и исследуйте систему!',
    'info',
  );
});
