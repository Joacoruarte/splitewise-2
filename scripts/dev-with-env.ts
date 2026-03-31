#!/usr/bin/env bun
import * as fs from 'fs';
import { spawnSync } from 'node:child_process';

type MenuOption = {
  label: string;
  value: string;
};

const ENV_OPTIONS: MenuOption[] = [
  { label: 'local       (.env.local)', value: '.env.local' },
  { label: 'development (.env.development)', value: '.env.development' },
  { label: 'production  (.env.production)', value: '.env.production' },
];

const DEV_OPTIONS: MenuOption[] = [
  { label: 'next dev (script: dev)', value: 'dev' },
  { label: 'next dev --turbopack (script: dev:turbo)', value: 'dev:turbo' },
];

const RESET = '\x1b[0m';
const BOLD = '\x1b[1m';
const CYAN = '\x1b[36m';
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const RED = '\x1b[31m';
const DIM = '\x1b[2m';

function renderMenu(
  fd: number,
  title: string,
  subtitle: string,
  options: MenuOption[],
  selected: number
) {
  fs.writeSync(fd, `\r\n${BOLD}${CYAN}  ⬡ ${title}${RESET}\r\n`);
  fs.writeSync(fd, `${DIM}  ${subtitle}${RESET}\r\n\r\n`);

  options.forEach((opt, i) => {
    const isSelected = i === selected;
    const cursor = isSelected ? `${GREEN}❯${RESET}` : ' ';
    const label = isSelected ? `${BOLD}${GREEN}${opt.label}${RESET}` : `${DIM}${opt.label}${RESET}`;
    fs.writeSync(fd, `  ${cursor} ${label}\r\n`);
  });

  fs.writeSync(
    fd,
    `\r\n${DIM}  ↑ ↓ para mover  •  Enter para confirmar  •  q para salir${RESET}\r\n\r\n`
  );
}

function loadEnvFile(path: string): Record<string, string> {
  if (!fs.existsSync(path)) return {};

  const content = fs.readFileSync(path, 'utf-8');
  const vars: Record<string, string> = {};

  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    const eqIndex = trimmed.indexOf('=');
    if (eqIndex === -1) continue;

    const key = trimmed.slice(0, eqIndex).trim();
    let value = trimmed.slice(eqIndex + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    vars[key] = value;
  }

  return vars;
}

async function selectOption(
  title: string,
  subtitle: string,
  options: MenuOption[]
): Promise<MenuOption | null> {
  let selected = 0;
  const tty = fs.openSync('/dev/tty', 'r+');

  fs.writeSync(tty, '\r\x1b[s');
  renderMenu(tty, title, subtitle, options, selected);
  fs.writeSync(tty, '\x1b[?25l');

  const sttyOriginal = spawnSync('stty', ['-g'], { stdio: [tty, 'pipe', 'pipe'] });
  const originalSettings = sttyOriginal.stdout?.toString().trim() ?? '';
  spawnSync('stty', ['raw', '-echo'], { stdio: [tty, 'ignore', 'ignore'] });

  return new Promise(resolve => {
    const cleanup = (result: MenuOption | null) => {
      spawnSync('stty', [originalSettings], { stdio: [tty, 'ignore', 'ignore'] });
      fs.writeSync(tty, '\x1b[?25h');
      fs.writeSync(tty, '\x1b[u\r\x1b[J');
      fs.closeSync(tty);
      resolve(result);
    };

    const buf = Buffer.alloc(3);

    const readKey = () => {
      fs.read(tty, buf, 0, 3, null, (_, bytesRead) => {
        if (bytesRead === 0) {
          readKey();
          return;
        }

        const key = buf.slice(0, bytesRead).toString();

        if (key === '\u001b[A' || key === 'k') {
          selected = (selected - 1 + options.length) % options.length;
          fs.writeSync(tty, '\x1b[u\r\x1b[J');
          renderMenu(tty, title, subtitle, options, selected);
          readKey();
        } else if (key === '\u001b[B' || key === 'j') {
          selected = (selected + 1) % options.length;
          fs.writeSync(tty, '\x1b[u\r\x1b[J');
          renderMenu(tty, title, subtitle, options, selected);
          readKey();
        } else if (key === '\r' || key === '\n') {
          cleanup(options[selected]);
        } else if (key === 'q' || key === '\u0003') {
          cleanup(null);
        } else {
          readKey();
        }
      });
    };

    readKey();
  });
}

async function main() {
  const chosenEnv = await selectOption(
    'next dev runner',
    'Seleccioná el entorno a usar:',
    ENV_OPTIONS
  );

  if (!chosenEnv) {
    process.stdout.write(`\n${YELLOW}  Cancelado.${RESET}\n\n`);
    process.exit(0);
  }

  if (!fs.existsSync(chosenEnv.value)) {
    process.stdout.write(`\n${RED}  ✗ No se encontró el archivo ${chosenEnv.value}${RESET}\n\n`);
    process.exit(1);
  }

  const chosenDevMode = await selectOption(
    'next dev runner',
    'Elegí cómo arrancar Next:',
    DEV_OPTIONS
  );

  if (!chosenDevMode) {
    process.stdout.write(`\n${YELLOW}  Cancelado.${RESET}\n\n`);
    process.exit(0);
  }

  const baseEnvExists = fs.existsSync('.env');
  const mergedEnv = {
    ...process.env,
    ...loadEnvFile('.env'),
    ...loadEnvFile(chosenEnv.value),
  };

  process.stdout.write(
    `\n${GREEN}  ✓ Entorno: ${BOLD}${chosenEnv.value}${RESET}${baseEnvExists ? `${DIM} + .env (base)${RESET}` : ''}\n`
  );
  process.stdout.write(`${GREEN}  ✓ Modo: ${BOLD}${chosenDevMode.value}${RESET}\n`);
  process.stdout.write(`${CYAN}  ▶ Ejecutando bun run ${chosenDevMode.value}...${RESET}\n\n`);

  const result = spawnSync('bun', ['run', chosenDevMode.value], {
    env: mergedEnv,
    stdio: 'inherit',
  });

  process.exit(result.status ?? 0);
}

main();
