import satori from "satori";
import sharp from "sharp";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load the Parastoo font once at startup
const fontPath = path.join(__dirname, "..", "assets", "fonts", "Parastoo-Variable.ttf");
let parastooFont: Buffer;
try {
    parastooFont = fs.readFileSync(fontPath);
} catch {
    // Fallback: try dist layout (production Docker)
    const altPath = path.join(__dirname, "assets", "fonts", "Parastoo-Variable.ttf");
    parastooFont = fs.readFileSync(altPath);
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

    // Truncate body text for preview
    const plainBody = body.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
    const bodyPreview = plainBody.length > 180
        ? plainBody.slice(0, 177) + "..."
        : plainBody;

    const authorDisplay = organizationName ?? `@${authorUsername}`;

    const svg = await satori(
        {
            type: "div",
            props: {
                style: {
                    width: "1200px",
                    height: "630px",
                    display: "flex",
                    flexDirection: "column",
                    background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)",
                    fontFamily: "Parastoo",
                    direction: "rtl",
                    padding: "0",
                },
                children: [
                    // Top accent bar
                    {
                        type: "div",
                        props: {
                            style: {
                                width: "100%",
                                height: "6px",
                                background: "linear-gradient(90deg, #22d3ee, #a78bfa, #f472b6)",
                            },
                        },
                    },
                    // Main content area
                    {
                        type: "div",
                        props: {
                            style: {
                                display: "flex",
                                flexDirection: "column",
                                flex: 1,
                                padding: "48px 56px 40px 56px",
                                justifyContent: "space-between",
                            },
                            children: [
                                // Title
                                {
                                    type: "div",
                                    props: {
                                        style: {
                                            fontSize: "44px",
                                            fontWeight: 700,
                                            color: "#f1f5f9",
                                            lineHeight: 1.4,
                                            textAlign: "right",
                                            display: "flex",
                                            overflow: "hidden",
                                        },
                                        children: title.length > 80 ? title.slice(0, 77) + "..." : title,
                                    },
                                },
                                // Body preview
                                bodyPreview
                                    ? {
                                          type: "div",
                                          props: {
                                              style: {
                                                  fontSize: "24px",
                                                  color: "#94a3b8",
                                                  lineHeight: 1.6,
                                                  textAlign: "right",
                                                  marginTop: "16px",
                                                  display: "flex",
                                                  overflow: "hidden",
                                              },
                                              children: bodyPreview,
                                          },
                                      }
                                    : {
                                          type: "div",
                                          props: { style: { display: "none" }, children: "" },
                                      },
                                // Spacer
                                {
                                    type: "div",
                                    props: { style: { flex: 1 }, children: "" },
                                },
                                // Bottom row: stats + branding
                                {
                                    type: "div",
                                    props: {
                                        style: {
                                            display: "flex",
                                            flexDirection: "row",
                                            justifyContent: "space-between",
                                            alignItems: "flex-end",
                                            width: "100%",
                                        },
                                        children: [
                                            // Right side: branding
                                            {
                                                type: "div",
                                                props: {
                                                    style: {
                                                        display: "flex",
                                                        flexDirection: "column",
                                                        alignItems: "flex-end",
                                                    },
                                                    children: [
                                                        {
                                                            type: "div",
                                                            props: {
                                                                style: {
                                                                    fontSize: "18px",
                                                                    color: "#64748b",
                                                                },
                                                                children: authorDisplay,
                                                            },
                                                        },
                                                        {
                                                            type: "div",
                                                            props: {
                                                                style: {
                                                                    fontSize: "28px",
                                                                    fontWeight: 700,
                                                                    color: "#22d3ee",
                                                                    marginTop: "8px",
                                                                },
                                                                children: "تراز",
                                                            },
                                                        },
                                                    ],
                                                },
                                            },
                                            // Left side: stats
                                            {
                                                type: "div",
                                                props: {
                                                    style: {
                                                        display: "flex",
                                                        flexDirection: "row",
                                                        gap: "32px",
                                                        alignItems: "center",
                                                    },
                                                    children: [
                                                        // Votes
                                                        {
                                                            type: "div",
                                                            props: {
                                                                style: {
                                                                    display: "flex",
                                                                    flexDirection: "column",
                                                                    alignItems: "center",
                                                                },
                                                                children: [
                                                                    {
                                                                        type: "div",
                                                                        props: {
                                                                            style: {
                                                                                fontSize: "32px",
                                                                                fontWeight: 700,
                                                                                color: "#f1f5f9",
                                                                            },
                                                                            children: String(voteCount),
                                                                        },
                                                                    },
                                                                    {
                                                                        type: "div",
                                                                        props: {
                                                                            style: {
                                                                                fontSize: "16px",
                                                                                color: "#64748b",
                                                                                marginTop: "4px",
                                                                            },
                                                                            children: "رأی",
                                                                        },
                                                                    },
                                                                ],
                                                            },
                                                        },
                                                        // Opinions
                                                        {
                                                            type: "div",
                                                            props: {
                                                                style: {
                                                                    display: "flex",
                                                                    flexDirection: "column",
                                                                    alignItems: "center",
                                                                },
                                                                children: [
                                                                    {
                                                                        type: "div",
                                                                        props: {
                                                                            style: {
                                                                                fontSize: "32px",
                                                                                fontWeight: 700,
                                                                                color: "#f1f5f9",
                                                                            },
                                                                            children: String(opinionCount),
                                                                        },
                                                                    },
                                                                    {
                                                                        type: "div",
                                                                        props: {
                                                                            style: {
                                                                                fontSize: "16px",
                                                                                color: "#64748b",
                                                                                marginTop: "4px",
                                                                            },
                                                                            children: "نظر",
                                                                        },
                                                                    },
                                                                ],
                                                            },
                                                        },
                                                        // Participants
                                                        {
                                                            type: "div",
                                                            props: {
                                                                style: {
                                                                    display: "flex",
                                                                    flexDirection: "column",
                                                                    alignItems: "center",
                                                                },
                                                                children: [
                                                                    {
                                                                        type: "div",
                                                                        props: {
                                                                            style: {
                                                                                fontSize: "32px",
                                                                                fontWeight: 700,
                                                                                color: "#f1f5f9",
                                                                            },
                                                                            children: String(participantCount),
                                                                        },
                                                                    },
                                                                    {
                                                                        type: "div",
                                                                        props: {
                                                                            style: {
                                                                                fontSize: "16px",
                                                                                color: "#64748b",
                                                                                marginTop: "4px",
                                                                            },
                                                                            children: "مشارکت‌کننده",
                                                                        },
                                                                    },
                                                                ],
                                                            },
                                                        },
                                                    ],
                                                },
                                            },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                ],
            },
        },
        {
            width: 1200,
            height: 630,
            fonts: [
                {
                    name: "Parastoo",
                    data: parastooFont,
                    weight: 400,
                    style: "normal",
                },
                {
                    name: "Parastoo",
                    data: parastooFont,
                    weight: 700,
                    style: "normal",
                },
            ],
        },
    );

    // Convert SVG to PNG via sharp
    const pngBuffer = await sharp(Buffer.from(svg)).png().toBuffer();
    return pngBuffer;
}
