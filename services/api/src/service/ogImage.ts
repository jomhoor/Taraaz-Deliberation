import sharp from "sharp";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Resolve font file path (works in both dev and production Docker)
function fontPath(filename: string): string {
    const srcPath = path.join(__dirname, "..", "assets", "fonts", filename);
    if (fs.existsSync(srcPath)) return srcPath;
    return path.join(__dirname, "assets", "fonts", filename);
}

const regularFontFile = fontPath("Vazirmatn-Regular.ttf");
const boldFontFile = fontPath("Vazirmatn-Bold.ttf");

interface OgImageParams {
    title: string;
    body: string;
    participantCount: number;
    opinionCount: number;
    voteCount: number;
    authorUsername: string;
    organizationName?: string;
}

// Escape XML special characters
function esc(s: string): string {
    return s
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&apos;");
}

// Create a text layer using sharp's Pango text renderer (proper RTL/BiDi support)
async function textLayer(
    text: string,
    opts: {
        width: number;
        height: number;
        fontfile: string;
        fontSize: number;
        color: string;
        align?: "right" | "left" | "center";
        fontWeight?: "bold" | "normal";
    },
): Promise<Buffer> {
    const weight = opts.fontWeight === "bold" ? "bold" : "normal";
    const pango = `<span font_desc="Vazirmatn ${weight} ${opts.fontSize}" foreground="${opts.color}">${esc(text)}</span>`;

    return sharp({
        text: {
            text: pango,
            font: "Vazirmatn",
            fontfile: opts.fontfile,
            width: opts.width,
            height: opts.height,
            rgba: true,
            align: opts.align ?? "right",
        },
    })
        .png()
        .toBuffer();
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

    const W = 1200;
    const H = 630;

    // Truncate
    const titleText =
        title.length > 90 ? title.slice(0, 87) + "..." : title;
    const plainBody = body
        .replace(/<[^>]*>/g, " ")
        .replace(/\s+/g, " ")
        .trim();
    const bodyPreview =
        plainBody.length > 160 ? plainBody.slice(0, 157) + "..." : plainBody;
    const authorDisplay = organizationName ?? `@${authorUsername}`;

    // Stats line in Persian (LTR numbers mixed with RTL labels)
    const statsText = `${participantCount} مشارکت‌کننده · ${opinionCount} نظر · ${voteCount} رأی`;

    // Create gradient background using SVG
    const bgSvg = `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#0f172a"/>
          <stop offset="50%" stop-color="#1e293b"/>
          <stop offset="100%" stop-color="#0f172a"/>
        </linearGradient>
        <linearGradient id="accent" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#22d3ee"/>
          <stop offset="50%" stop-color="#a78bfa"/>
          <stop offset="100%" stop-color="#f472b6"/>
        </linearGradient>
      </defs>
      <rect width="${W}" height="${H}" fill="url(#bg)"/>
      <rect width="${W}" height="6" fill="url(#accent)"/>
    </svg>`;

    const bgBuffer = await sharp(Buffer.from(bgSvg)).png().toBuffer();

    // Create text layers in parallel using Pango (proper RTL support)
    const [titleBuf, bodyBuf, statsBuf, authorBuf, brandBuf] =
        await Promise.all([
            // Title
            textLayer(titleText, {
                width: W - 112,
                height: 200,
                fontfile: boldFontFile,
                fontSize: 42,
                color: "#f1f5f9",
                fontWeight: "bold",
                align: "right",
            }),
            // Body preview
            bodyPreview
                ? textLayer(bodyPreview, {
                      width: W - 112,
                      height: 120,
                      fontfile: regularFontFile,
                      fontSize: 22,
                      color: "#94a3b8",
                      align: "right",
                  })
                : Promise.resolve(null),
            // Stats (right-aligned, bottom-right area)
            textLayer(statsText, {
                width: 700,
                height: 50,
                fontfile: regularFontFile,
                fontSize: 22,
                color: "#94a3b8",
                align: "right",
            }),
            // Author
            textLayer(authorDisplay, {
                width: 300,
                height: 40,
                fontfile: regularFontFile,
                fontSize: 16,
                color: "#64748b",
                align: "left",
            }),
            // Brand "تراز"
            textLayer("تراز", {
                width: 120,
                height: 50,
                fontfile: boldFontFile,
                fontSize: 28,
                color: "#22d3ee",
                fontWeight: "bold",
                align: "left",
            }),
        ]);

    // Composite all layers onto the background
    const composites: sharp.OverlayOptions[] = [
        { input: titleBuf, left: 56, top: 54 },
    ];
    if (bodyBuf) {
        composites.push({ input: bodyBuf, left: 56, top: 280 });
    }
    composites.push(
        // Stats bottom-right
        { input: statsBuf, left: W - 700 - 56, top: H - 70 },
        // Author bottom-left
        { input: authorBuf, left: 56, top: H - 100 },
        // Brand bottom-left, below author
        { input: brandBuf, left: 56, top: H - 60 },
    );

    const pngBuffer = await sharp(bgBuffer)
        .composite(composites)
        .png()
        .toBuffer();

    return pngBuffer;
}
