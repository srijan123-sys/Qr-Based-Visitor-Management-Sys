// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  🎨 PRESENTATION LOGGER — Colorful Terminal Output
//  Makes the terminal look ALIVE during demo
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// ANSI 256-color escape codes (no external dependency)
const c = {
  reset:      '\x1b[0m',
  bold:       '\x1b[1m',
  dim:        '\x1b[2m',
  underline:  '\x1b[4m',
  blink:      '\x1b[5m',

  // Foreground
  black:      '\x1b[30m',
  red:        '\x1b[31m',
  green:      '\x1b[32m',
  yellow:     '\x1b[33m',
  blue:       '\x1b[34m',
  magenta:    '\x1b[35m',
  cyan:       '\x1b[36m',
  white:      '\x1b[37m',

  // Bright Foreground
  brightRed:    '\x1b[91m',
  brightGreen:  '\x1b[92m',
  brightYellow: '\x1b[93m',
  brightBlue:   '\x1b[94m',
  brightMagenta:'\x1b[95m',
  brightCyan:   '\x1b[96m',
  brightWhite:  '\x1b[97m',

  // Background
  bgRed:      '\x1b[41m',
  bgGreen:    '\x1b[42m',
  bgYellow:   '\x1b[43m',
  bgBlue:     '\x1b[44m',
  bgMagenta:  '\x1b[45m',
  bgCyan:     '\x1b[46m',
  bgWhite:    '\x1b[47m',
  bgBlack:    '\x1b[40m',

  // Bright Background
  bgBrightRed:    '\x1b[101m',
  bgBrightGreen:  '\x1b[102m',
  bgBrightYellow: '\x1b[103m',
  bgBrightBlue:   '\x1b[104m',
  bgBrightCyan:   '\x1b[106m',
};

const timestamp = () => {
  const now = new Date();
  return `${c.dim}${c.white}[${now.toLocaleTimeString('en-US', { hour12: false })}.${String(now.getMilliseconds()).padStart(3, '0')}]${c.reset}`;
};

const divider = (char = '─', len = 60, color = c.dim + c.cyan) => {
  console.log(`${color}${char.repeat(len)}${c.reset}`);
};

const logger = {
  // ── Server startup ──────────────────────────────────────
  serverStart: (port) => {
    console.log('');
    divider('━', 60, c.brightGreen);
    console.log(`${c.bgGreen}${c.black}${c.bold}  ⚡ QR MANAGEMENT SYSTEM — SERVER ONLINE  ${c.reset}`);
    divider('━', 60, c.brightGreen);
    console.log(`${timestamp()}  ${c.green}►${c.reset} ${c.bold}Port:${c.reset}     ${c.brightCyan}${port}${c.reset}`);
    console.log(`${timestamp()}  ${c.green}►${c.reset} ${c.bold}Mode:${c.reset}     ${c.brightYellow}${process.env.NODE_ENV || 'development'}${c.reset}`);
    console.log(`${timestamp()}  ${c.green}►${c.reset} ${c.bold}Base URL:${c.reset} ${c.underline}${c.brightCyan}http://localhost:${port}${c.reset}`);
    divider('─', 60, c.dim + c.green);
    console.log('');
  },

  // ── Database connection ──────────────────────────────────
  dbConnect: (dbName) => {
    console.log(`${timestamp()}  ${c.bgBlue}${c.white}${c.bold} DB ${c.reset} ${c.brightGreen}✔ MongoDB connected${c.reset} → ${c.dim}${dbName}${c.reset}`);
    divider('─', 60, c.dim + c.blue);
  },

  dbError: (err) => {
    console.log(`${timestamp()}  ${c.bgBrightRed}${c.white}${c.bold} DB ${c.reset} ${c.brightRed}✘ MongoDB connection FAILED${c.reset}`);
    console.log(`${timestamp()}     ${c.red}${err.message}${c.reset}`);
  },

  // ── API Requests ─────────────────────────────────────────
  request: (method, path, statusCode = 200) => {
    const methodColors = {
      GET:    `${c.bgCyan}${c.black}${c.bold}`,
      POST:   `${c.bgGreen}${c.black}${c.bold}`,
      PUT:    `${c.bgYellow}${c.black}${c.bold}`,
      DELETE: `${c.bgBrightRed}${c.white}${c.bold}`,
      PATCH:  `${c.bgMagenta}${c.white}${c.bold}`,
    };
    const statusColor = statusCode < 400 ? c.brightGreen : c.brightRed;
    const methodTag = methodColors[method] || `${c.bgWhite}${c.black}`;

    console.log(
      `${timestamp()}  ${methodTag} ${method.padEnd(6)} ${c.reset} ` +
      `${c.white}${path}${c.reset}  ${statusColor}[${statusCode}]${c.reset}`
    );
  },

  // ── QR Code Generated ───────────────────────────────────
  qrGenerated: (qrId, targetUrl) => {
    console.log('');
    divider('┈', 60, c.brightMagenta);
    console.log(`${timestamp()}  ${c.bgMagenta}${c.white}${c.bold} QR:NEW ${c.reset} ${c.brightMagenta}★ Dynamic QR Created${c.reset}`);
    console.log(`${timestamp()}     ${c.bold}ID:${c.reset}     ${c.brightCyan}${qrId}${c.reset}`);
    console.log(`${timestamp()}     ${c.bold}Target:${c.reset} ${c.underline}${c.brightWhite}${targetUrl}${c.reset}`);
    divider('┈', 60, c.brightMagenta);
    console.log('');
  },

  // ── QR Scan — THE BIG ONE (Presentation Wow) ────────────
  qrScanned: (qrId, targetUrl, userAgent, ip) => {
    console.log('');
    divider('═', 60, c.brightYellow);
    console.log(`${c.bgBrightYellow}${c.black}${c.bold}  🔥 LIVE SCAN DETECTED — QR CODE ACTIVATED  ${c.reset}`);
    divider('═', 60, c.brightYellow);
    console.log(`${timestamp()}  ${c.bgBrightCyan}${c.black}${c.bold} SCAN ${c.reset}  ${c.brightGreen}✔ Scan logged to database${c.reset}`);
    console.log(`${timestamp()}  ${c.bold}  QR ID:${c.reset}      ${c.brightCyan}${qrId}${c.reset}`);
    console.log(`${timestamp()}  ${c.bold}  Redirect →:${c.reset} ${c.underline}${c.brightWhite}${targetUrl}${c.reset}`);
    console.log(`${timestamp()}  ${c.bold}  User-Agent:${c.reset} ${c.dim}${userAgent ? userAgent.substring(0, 70) + '...' : 'N/A'}${c.reset}`);
    console.log(`${timestamp()}  ${c.bold}  IP Address:${c.reset} ${c.yellow}${ip}${c.reset}`);
    console.log(`${timestamp()}  ${c.brightGreen}  ► Redirecting user NOW...${c.reset}`);
    divider('═', 60, c.brightYellow);
    console.log('');
  },

  // ── Database Save ────────────────────────────────────────
  dbSave: (collection, docId) => {
    console.log(
      `${timestamp()}  ${c.bgBlue}${c.white}${c.bold} DB:SAVE ${c.reset} ` +
      `${c.brightGreen}✔${c.reset} ${c.white}${collection}${c.reset} → ${c.dim}${docId}${c.reset}`
    );
  },

  // ── Auth Events ──────────────────────────────────────────
  authSignup: (email) => {
    console.log(
      `${timestamp()}  ${c.bgGreen}${c.black}${c.bold} AUTH:SIGNUP ${c.reset} ` +
      `${c.brightGreen}✔ New user registered:${c.reset} ${c.brightCyan}${email}${c.reset}`
    );
  },

  authLogin: (email) => {
    console.log(
      `${timestamp()}  ${c.bgCyan}${c.black}${c.bold} AUTH:LOGIN ${c.reset} ` +
      `${c.brightGreen}✔ User authenticated:${c.reset} ${c.brightCyan}${email}${c.reset}`
    );
  },

  // ── Dashboard Fetch ──────────────────────────────────────
  dashboardFetch: (count) => {
    console.log(
      `${timestamp()}  ${c.bgBrightBlue}${c.white}${c.bold} DASH ${c.reset} ` +
      `${c.brightCyan}📊 Dashboard loaded — ${c.bold}${count} QR codes${c.reset} fetched`
    );
  },

  // ── Error ────────────────────────────────────────────────
  error: (context, err) => {
    console.log('');
    divider('!', 60, c.brightRed);
    console.log(`${timestamp()}  ${c.bgBrightRed}${c.white}${c.bold} ERROR ${c.reset} ${c.brightRed}${context || 'Server Error'}${c.reset}`);
    if (err) {
      console.log(`${timestamp()}     ${c.red}${err.message || err}${c.reset}`);
    }
    divider('!', 60, c.brightRed);
    console.log('');
  },

  // ── Custom Tag ───────────────────────────────────────────
  custom: (tag, msg, color = '\x1b[36m') => {
    console.log(`${timestamp()}  ${color}[${tag}]${c.reset} ${msg}`);
  },

  // ── Generic Info ─────────────────────────────────────────
  info: (msg) => {
    console.log(`${timestamp()}  ${c.bgWhite}${c.black}${c.bold} INFO ${c.reset} ${c.white}${msg}${c.reset}`);
  },
};

module.exports = logger;
