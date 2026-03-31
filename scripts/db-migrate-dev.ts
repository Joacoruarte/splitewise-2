#!/usr/bin/env bun
import * as fs from 'fs';
import { spawnSync } from 'node:child_process';

const ENV_OPTIONS = [
  { label: 'local       (.env.local)', file: '.env.local' },
  { label: 'development (.env.development)', file: '.env.development' },
  { label: 'production  (.env.production)', file: '.env.production' },
];

const RESET = '\x1b[0m';
const BOLD = '\x1b[1m';
const CYAN = '\x1b[36m';
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const RED = '\x1b[31m';
const DIM = '\x1b[2m';

function renderMenu(fd: number, selected: number) {
  fs.writeSync(fd, `\r\n${BOLD}${CYAN}  ⬡ prisma migrate dev${RESET}\r\n`);
  fs.writeSync(fd, `${DIM}  Seleccioná el entorno a usar:${RESET}\r\n\r\n`);

  ENV_OPTIONS.forEach((opt, i) => {
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

async function selectEnv(): Promise<{ label: string; file: string } | null> {
  let selected = 0;

  // Open /dev/tty directly for guaranteed interactive TTY
  const tty = fs.openSync('/dev/tty', 'r+');

  // Save cursor position where the menu starts; each redraw restores and repaints.
  fs.writeSync(tty, '\r\x1b[s');
  renderMenu(tty, selected);

  fs.writeSync(tty, '\x1b[?25l'); // hide cursor

  // Save and set raw mode
  const sttyOriginal = spawnSync('stty', ['-g'], { stdio: [tty, 'pipe', 'pipe'] });
  const originalSettings = sttyOriginal.stdout?.toString().trim() ?? '';
  spawnSync('stty', ['raw', '-echo'], { stdio: [tty, 'ignore', 'ignore'] });

  return new Promise(resolve => {
    const cleanup = (result: { label: string; file: string } | null) => {
      spawnSync('stty', [originalSettings], { stdio: [tty, 'ignore', 'ignore'] });
      fs.writeSync(tty, '\x1b[?25h'); // show cursor
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
          // Arrow up / vim k
          selected = (selected - 1 + ENV_OPTIONS.length) % ENV_OPTIONS.length;
          fs.writeSync(tty, '\x1b[u\r\x1b[J');
          renderMenu(tty, selected);
          readKey();
        } else if (key === '\u001b[B' || key === 'j') {
          // Arrow down / vim j
          selected = (selected + 1) % ENV_OPTIONS.length;
          fs.writeSync(tty, '\x1b[u\r\x1b[J');
          renderMenu(tty, selected);
          readKey();
        } else if (key === '\r' || key === '\n') {
          // Enter
          cleanup(ENV_OPTIONS[selected]);
        } else if (key === 'q' || key === '\u0003') {
          // q or Ctrl+C
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
  const chosen = await selectEnv();

  if (!chosen) {
    process.stdout.write(`\n${YELLOW}  Cancelado.${RESET}\n\n`);
    process.exit(0);
  }

  const baseEnvExists = fs.existsSync('.env');
  const chosenEnvExists = fs.existsSync(chosen.file);

  if (!chosenEnvExists) {
    process.stdout.write(`\n${RED}  ✗ No se encontró el archivo ${chosen.file}${RESET}\n\n`);
    process.exit(1);
  }

  process.stdout.write(
    `\n${GREEN}  ✓ Usando: ${BOLD}${chosen.file}${RESET}${baseEnvExists ? `${DIM} + .env (base)${RESET}` : ''}\n`
  );
  process.stdout.write(`${CYAN}  ▶ Ejecutando prisma migrate dev...${RESET}\n\n`);

  const mergedEnv = {
    ...process.env,
    ...loadEnvFile('.env'),
    ...loadEnvFile(chosen.file),
  };

  const result = spawnSync('bunx', ['prisma', 'migrate', 'dev'], {
    env: mergedEnv,
    stdio: 'inherit',
  });

  process.exit(result.status ?? 0);
}

main();
