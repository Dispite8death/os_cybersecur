// ==================== ЦЕПОЧКА ДОВЕРИЯ ====================

const chainSteps = [
  {
    number: 0,
    title: 'Boot ROM / CRTM',
    desc: 'Аппаратный корень доверия — неизменяемый код в процессоре',
    pcr: 'PCR 0-1',
    status: 'valid',
  },
  {
    number: 1,
    title: 'UEFI Firmware',
    desc: 'Инициализация памяти, загрузка драйверов',
    pcr: 'PCR 0-3',
    status: 'valid',
  },
  {
    number: 2,
    title: 'UEFI Boot Manager',
    desc: 'Выбор загрузочного устройства, верификация загрузчика',
    pcr: 'PCR 4-5',
    status: 'valid',
  },
  {
    number: 3,
    title: 'OS Bootloader',
    desc: 'GRUB2 / shim (Linux) или bootmgfw.efi (Windows)',
    pcr: 'PCR 4-7',
    status: 'valid',
  },
  {
    number: 4,
    title: 'Ядро ОС',
    desc: 'Загрузка ядра, верификация модулей',
    pcr: 'PCR 8-9',
    status: 'valid',
  },
  {
    number: 5,
    title: 'Пользовательское окружение',
    desc: 'Инициализация сервисов, запуск приложений',
    pcr: 'PCR 10+',
    status: 'valid',
  },
];

function renderChain() {
  const container = document.getElementById('chain-visualization');
  let html = '';

  chainSteps.forEach((step, index) => {
    const nextStep = index < chainSteps.length - 1;

    html += `
            <div class="chain-step ${step.status}" onclick="showChainDetails(${index})">
                <div class="chain-number">${step.number}</div>
                <div class="chain-info">
                    <div class="chain-title">${step.title}</div>
                    <div class="chain-desc">${step.desc}</div>
                    <div class="chain-pcr" style="color:#666; font-size:0.85rem; margin-top:0.5rem;">
                        PCR регистры: ${step.pcr}
                    </div>
                </div>
                <div class="chain-status ${step.status}">
                    ${step.status === 'valid' ? '✅ Верифицировано' : '❌ Скомпрометировано'}
                </div>
            </div>
        `;

    if (nextStep) {
      html += `<div class="chain-arrow">→</div>`;
    }
  });

  container.innerHTML = html;
}

function showChainDetails(index) {
  const step = chainSteps[index];
  const details = {
    0: 'Boot ROM (Core Root of Trust for Measurement) — первый код, выполняемый процессором после включения. Зашит в аппаратное обеспечение, не может быть изменён.',
    1: 'UEFI Firmware инициализирует оборудование и загружает драйверы. Измерения сохраняются в PCR 0-3. Уязвимости на этом уровне (например, LogoFAIL) критичны.',
    2: 'UEFI Boot Manager выбирает загрузочное устройство и проверяет подпись загрузчика. Secure Boot верифицирует каждую подпись против базы данных db/dbx.',
    3: 'Загрузчик (shim/GRUB для Linux, bootmgfw.efi для Windows) загружает ядро и проверяет его подпись. Shim содержит ключ дистрибутива для верификации.',
    4: 'Ядро ОС загружается и проверяет подписи модулей. В Linux используется CONFIG_MODULE_SIG_FORCE, в Windows — Driver Signature Enforcement (DSE).',
    5: 'Пользовательское окружение инициализируется. На этом этапе уже работают механизмы защиты времени выполнения (PatchGuard, SELinux, AppArmor).',
  };
  switch (index) {
    case 0: window.open("BootRom.html");
    break;
    case 1: window.open("UEFI.html");
    break;
    case 2: window.open("UEFIBM.html");
    break;
    case 3: window.open("OSBL.html");
    break;
    case 4: window.open("Core.html");
    break;
    default:
      alert(`${step.title}\n\n${details[index]}`);
      break;
  }
  //alert(`${step.title}\n\n${details[index]}`);
}

// ==================== СИМУЛЯТОР ТЕРМИНАЛА ====================

const terminalCommands = {
  'mokutil --sb-state': `
SecureBoot enabled
Platform is in User Mode
`,
  'tpm2_pcrread sha256:0,2,4,7': `
sha256:
  0: 0x1234567890ABCDEF1234567890ABCDEF1234567890ABCDEF1234567890ABCDEF
  2: 0xFEDCBA0987654321FEDCBA0987654321FEDCBA0987654321FEDCBA0987654321
  4: 0xABCDEF1234567890ABCDEF1234567890ABCDEF1234567890ABCDEF1234567890
  7: 0x9876543210FEDCBA9876543210FEDCBA9876543210FEDCBA9876543210FEDCBA
`,
  'systemd-cryptenroll --tpm2-device=auto --tpm2-pcrs=0,2,7 /dev/sda2': `
Enrolling TPM2 PCR-based authentication in cryptsetup device /dev/sda2.
New TPM2 PCR-based authentication enrolled successfully.
`,
  'efibootmgr -v': `
BootCurrent: 0001
Timeout: 5 seconds
BootOrder: 0001,0002,0003
Boot0001* ubuntu HD(1,GPT,abc-123,0x800,0x100000)/File(\\EFI\\ubuntu\\shimx64.efi)
Boot0002* Windows Boot Manager HD(2,GPT,def-456,0x800,0x100000)/File(\\EFI\\Microsoft\\Boot\\bootmgfw.efi)
`,
  'dmesg | grep -i secure': `
[    0.000000] secureboot: Secure boot enabled
[    0.000000] secureboot: UEFI Secure Boot is enabled.
[    1.234567] integrity: Loading X.509 certificate
[    1.345678] integrity: Loaded X.509 cert 'Ubuntu Secure Boot CA'
`,
};

function runCommand(cmd) {
  const output = document.getElementById('terminal-output');
  const input = document.getElementById('terminal-input');

  // Показать команду
  const cmdLine = document.createElement('div');
  cmdLine.className = 'terminal-line command';
  cmdLine.textContent = `$ ${cmd}`;
  output.appendChild(cmdLine);

  // Показать результат
  const result = terminalCommands[cmd] || 'Command not found';
  const resultLine = document.createElement('div');
  resultLine.className = 'terminal-line output';
  resultLine.textContent = result;
  output.appendChild(resultLine);

  // Прокрутить вниз
  output.scrollTop = output.scrollHeight;

  // Очистить поле ввода
  input.value = '';
}

// Обработка ввода в терминале
document.addEventListener('DOMContentLoaded', () => {
  const terminalInput = document.getElementById('terminal-input');

  terminalInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      const cmd = terminalInput.value.trim();
      if (cmd) {
        runCommand(cmd);
      }
    }
  });

  // Инициализация цепочки доверия
  renderChain();
});

// ==================== ДЕМОНСТРАЦИЯ АТАК ====================

function simulateAttack(attackName) {
  const chain = document.querySelectorAll('.chain-step');

  if (attackName === 'logofail') {
    // Компрометация прошивки
    chain[0].classList.remove('valid');
    chain[0].classList.add('invalid');
    chain[0].querySelector('.chain-status').textContent =
      '❌ Скомпрометировано';

    alert(
      'LogoFAIL: Уязвимость в парсере изображений позволяет выполнить код на этапе DXE.\n\nЦепочка доверия нарушена на уровне прошивки — все последующие проверки бесполезны.',
    );
  }

  if (attackName === 'boothole') {
    // Компрометация загрузчика
    chain[3].classList.remove('valid');
    chain[3].classList.add('invalid');
    chain[3].querySelector('.chain-status').textContent =
      '❌ Скомпрометировано';

    alert(
      'BootHole: Уязвимость в GRUB2 позволяет обойти проверку подписи.\n\nЗагрузчик скомпрометирован — ядро может быть заменено.',
    );
  }

  // Прокрутить к цепочке
  document
    .getElementById('chain-visualization')
    .scrollIntoView({ behavior: 'smooth' });
}

// ==================== ИНИЦИАЛИЗАЦИЯ ====================

document.addEventListener('DOMContentLoaded', () => {
  // Добавить кнопки атак
  const attackSection = document.querySelector('#attacks .card');

  const attackButtons = document.createElement('div');
  attackButtons.style.marginTop = '2rem';
  attackButtons.style.display = 'flex';
  attackButtons.style.gap = '1rem';
  attackButtons.style.flexWrap = 'wrap';

  attackButtons.innerHTML = `
        <button class="cmd-btn" onclick="simulateAttack('logofail')" style="background:rgba(255,77,77,0.3); border-color:var(--danger);">
            🎯 LogoFAIL (Прошивка)
        </button>
        <button class="cmd-btn" onclick="simulateAttack('boothole')" style="background:rgba(255,193,7,0.3); border-color:var(--warning);">
            🎯 BootHole (Загрузчик)
        </button>
        <button class="cmd-btn" onclick="resetChain()" style="background:rgba(0,204,106,0.3);">
            🔁 Сбросить цепочку
        </button>
    `;

  attackSection.appendChild(attackButtons);
});

function resetChain() {
  chainSteps.forEach((step) => {
    step.status = 'valid';
  });
  renderChain();
}
