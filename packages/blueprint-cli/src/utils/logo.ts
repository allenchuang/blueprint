const LOGO_LINES = [
  " ██████╗ ██╗     ██╗   ██╗███████╗██████╗ ██████╗ ██╗███╗   ██╗████████╗",
  " ██╔══██╗██║     ██║   ██║██╔════╝██╔══██╗██╔══██╗██║████╗  ██║╚══██╔══╝",
  " ██████╔╝██║     ██║   ██║█████╗  ██████╔╝██████╔╝██║██╔██╗ ██║   ██║   ",
  " ██╔══██╗██║     ██║   ██║██╔══╝  ██╔═══╝ ██╔══██╗██║██║╚██╗██║   ██║   ",
  " ██████╔╝███████╗╚██████╔╝███████╗██║     ██║  ██║██║██║ ╚████║   ██║   ",
  " ╚═════╝ ╚══════╝ ╚═════╝ ╚══════╝╚═╝     ╚═╝  ╚═╝╚═╝╚═╝  ╚═══╝   ╚═╝   ",
  "                                                                        ",
];

const LOGO_WIDTH = 72;

const BLUE_GRADIENT = [
  "\x1b[38;2;60;120;255m",
  "\x1b[38;2;55;130;255m",
  "\x1b[38;2;50;145;250m",
  "\x1b[38;2;45;160;245m",
  "\x1b[38;2;40;175;240m",
  "\x1b[38;2;35;190;235m",
  "\x1b[38;2;30;200;230m",
];

const RESET = "\x1b[0m";
const DIM = "\x1b[2m";

function centerText(text: string, width: number): string {
  const pad = Math.max(0, Math.floor((width - text.length) / 2));
  return " ".repeat(pad) + text;
}

export function printLogo(version?: string): void {
  const inner = version
    ? ` IDEATION OPERATING SYSTEM  v${version} `
    : " IDEATION OPERATING SYSTEM ";
  const remaining = Math.max(0, LOGO_WIDTH - inner.length);
  const left = Math.floor(remaining / 2);
  const right = remaining - left;
  const tagline = "=".repeat(left) + inner + "=".repeat(right);

  console.log();
  for (let i = 0; i < LOGO_LINES.length; i++) {
    console.log(`  ${BLUE_GRADIENT[i]}${LOGO_LINES[i]}${RESET}`);
  }
  console.log(`  ${BLUE_GRADIENT[BLUE_GRADIENT.length - 1]}${tagline}${RESET}`);
  console.log();
}
