import fs from "fs";
import path from "path";
import puppeteer, { type Browser } from "puppeteer-core";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function loadFontBase64(filename: string): string {
  const candidatePaths = [
    path.join(__dirname, "..", "assets", "fonts", filename),
    path.join(__dirname, "assets", "fonts", filename),
  ];

  for (const candidatePath of candidatePaths) {
    if (fs.existsSync(candidatePath)) {
      return fs.readFileSync(candidatePath).toString("base64");
    }
  }

  throw new Error(`Font file not found: ${filename}`);
}

function loadFirstAvailableFontBase64(...filenames: string[]): string {
  for (const filename of filenames) {
    try {
      return loadFontBase64(filename);
    } catch {
      continue;
    }
  }

  throw new Error(`None of the font files were found: ${filenames.join(", ")}`);
}

const nianRegularB64 = loadFirstAvailableFontBase64(
  "Nian.ttf",
  "Vazirmatn-Regular.ttf",
  "Parastoo-Variable.ttf",
);
const nianBoldB64 = loadFirstAvailableFontBase64(
  "Nian Bold.ttf",
  "Vazirmatn-Bold.ttf",
  "Parastoo-Variable.ttf",
);

// Reuse a single browser instance across requests
let browserInstance: Browser | null = null;

function getChromiumPath(): string {
    // Docker production: system Chromium set via PUPPETEER_EXECUTABLE_PATH
    if (process.env.PUPPETEER_EXECUTABLE_PATH) {
        return process.env.PUPPETEER_EXECUTABLE_PATH;
    }
    // macOS development: use Chrome
    const macPaths = [
        "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
        "/Applications/Chromium.app/Contents/MacOS/Chromium",
    ];
    for (const p of macPaths) {
        if (fs.existsSync(p)) return p;
    }
    throw new Error(
        "Chromium not found. Set PUPPETEER_EXECUTABLE_PATH or install Chrome.",
    );
}

async function getBrowser(): Promise<Browser> {
    if (browserInstance && browserInstance.connected) {
        return browserInstance;
    }
    browserInstance = await puppeteer.launch({
        headless: true,
        executablePath: getChromiumPath(),
        args: [
            "--no-sandbox",
            "--disable-setuid-sandbox",
            "--disable-dev-shm-usage",
            "--disable-gpu",
        ],
    });
    return browserInstance;
}

interface OgImageParams {
    title: string;
    body: string;
    participantCount: number;
    opinionCount: number;
    voteCount: number;
    authorUsername: string;
    organizationName?: string;
}

function escapeHtml(text: string): string {
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}

export async function generateOgImage(params: OgImageParams): Promise<Buffer> {
    const {
        title,
        body,
        participantCount,
        opinionCount,
        voteCount,
        authorUsername,
        organizationName,
    } = params;

    const plainBody = body.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
    const bodyPreview =
        plainBody.length > 180 ? plainBody.slice(0, 177) + "..." : plainBody;
    const titleDisplay =
        title.length > 80 ? title.slice(0, 77) + "..." : title;
    const authorDisplay = organizationName ?? `@${authorUsername}`;

    const html = `<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
<meta charset="utf-8">
<style>
@font-face {
  font-family: 'Nian';
  src: url(data:font/truetype;base64,${nianRegularB64}) format('truetype');
  font-weight: 400;
  font-style: normal;
}
@font-face {
  font-family: 'Nian';
  src: url(data:font/truetype;base64,${nianBoldB64}) format('truetype');
  font-weight: 700;
  font-style: normal;
}
* { margin: 0; padding: 0; box-sizing: border-box; }
body {
  width: 1200px;
  height: 630px;
  font-family: 'Nian', sans-serif;
  direction: rtl;
  text-align: right;
  overflow: hidden;
}
.container {
  width: 1200px;
  height: 630px;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%);
}
.accent-bar {
  width: 100%;
  height: 6px;
  background: linear-gradient(90deg, #22d3ee, #a78bfa, #f472b6);
}
.content {
  flex: 1;
  display: flex;
  flex-direction: column;
  direction: rtl;
  /* Extra bottom padding keeps stats/branding above the chat client's
     link-preview overlay (Telegram/WhatsApp/etc. paint title+description
     in the lower ~140px band of the image). */
  padding: 48px 56px 160px 56px;
  justify-content: space-between;
}
.rtl-text {
  display: block;
  direction: rtl;
  text-align: right;
  unicode-bidi: plaintext;
}
.title {
  font-size: 44px;
  font-weight: 700;
  color: #f1f5f9;
  line-height: 1.4;
  text-align: right;
  overflow: hidden;
  max-height: 130px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
.body-text {
  font-size: 24px;
  color: #94a3b8;
  line-height: 1.6;
  text-align: right;
  margin-top: 16px;
  overflow: hidden;
  max-height: 120px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}
.bottom-row {
  display: flex;
  flex-direction: row-reverse;
  justify-content: space-between;
  align-items: flex-end;
  width: 100%;
}
.branding {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}
.author {
  font-size: 18px;
  color: #64748b;
  direction: rtl;
  text-align: right;
  unicode-bidi: plaintext;
}
.brand-name {
  font-size: 28px;
  font-weight: 700;
  color: #22d3ee;
  margin-top: 8px;
  direction: rtl;
  text-align: right;
}
.stats {
  display: flex;
  flex-direction: row-reverse;
  gap: 32px;
  align-items: center;
}
.stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  direction: rtl;
}
.stat-number {
  font-size: 32px;
  font-weight: 700;
  color: #f1f5f9;
  direction: rtl;
  unicode-bidi: plaintext;
}
.stat-label {
  font-size: 16px;
  color: #64748b;
  margin-top: 4px;
  direction: rtl;
  text-align: center;
}
</style>
</head>
<body>
<div class="container">
  <div class="accent-bar"></div>
  <div class="content">
    <div>
      <div class="title"><span class="rtl-text">${escapeHtml(titleDisplay)}</span></div>
      ${bodyPreview ? `<div class="body-text"><span class="rtl-text">${escapeHtml(bodyPreview)}</span></div>` : ""}
    </div>
    <div class="bottom-row">
      <div class="branding">
        <div class="author"><span class="rtl-text">${escapeHtml(authorDisplay)}</span></div>
        <div class="brand-name"><span class="rtl-text">تراز</span></div>
      </div>
      <div class="stats">
        <div class="stat">
          <div class="stat-number">${voteCount}</div>
          <div class="stat-label">رای</div>
        </div>
        <div class="stat">
          <div class="stat-number">${opinionCount}</div>
          <div class="stat-label">نظر</div>
        </div>
        <div class="stat">
          <div class="stat-number">${participantCount}</div>
          <div class="stat-label">مشارکت‌کننده</div>
        </div>
      </div>
    </div>
  </div>
</div>
</body>
</html>`;

    const browser = await getBrowser();
    const page = await browser.newPage();
    try {
        await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 1 });
        await page.setContent(html, { waitUntil: "domcontentloaded" });
        await page.evaluate(() => document.fonts.ready);
        const screenshot = await page.screenshot({ type: "png" });
        return Buffer.from(screenshot);
    } finally {
        await page.close();
    }
}
