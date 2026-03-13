import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "SXSW 2026 Sessions Explorer — Find your perfect sessions across AI, Design, Tech, and more";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#FF5733",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* Top bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            padding: "32px 48px",
            gap: "16px",
          }}
        >
          <div
            style={{
              display: "flex",
              backgroundColor: "#1A1A1A",
              color: "#FFFFFF",
              padding: "8px 20px",
              border: "4px solid #1A1A1A",
              fontSize: "18px",
              fontWeight: 900,
              letterSpacing: "2px",
              textTransform: "uppercase" as const,
            }}
          >
            March 12–18, 2026 · Austin, TX
          </div>
        </div>

        {/* Main title */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            padding: "0 48px",
            flex: 1,
          }}
        >
          <div
            style={{
              fontSize: "120px",
              fontWeight: 900,
              lineHeight: 0.9,
              color: "#1A1A1A",
              textTransform: "uppercase" as const,
              letterSpacing: "-2px",
            }}
          >
            SXSW
          </div>
          <div
            style={{
              fontSize: "120px",
              fontWeight: 900,
              lineHeight: 0.9,
              color: "#FFFFFF",
              textTransform: "uppercase" as const,
              letterSpacing: "-2px",
            }}
          >
            2026
          </div>
          <div
            style={{
              fontSize: "28px",
              fontWeight: 600,
              color: "rgba(26, 26, 26, 0.8)",
              marginTop: "24px",
              maxWidth: "700px",
              lineHeight: 1.3,
            }}
          >
            4,000+ sessions are hard to navigate. We made it easier — filter, search, bookmark, and map your SXSW.
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "24px 48px",
            borderTop: "4px solid #1A1A1A",
            backgroundColor: "#1A1A1A",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: "12px",
              alignItems: "center",
            }}
          >
            <div
              style={{
                fontSize: "16px",
                fontWeight: 900,
                color: "#FFFFFF",
                textTransform: "uppercase" as const,
                letterSpacing: "2px",
              }}
            >
              Sessions Explorer
            </div>
          </div>
          <div
            style={{
              display: "flex",
              gap: "24px",
              alignItems: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                gap: "8px",
              }}
            >
              {["AI", "Design", "Tech", "Marketing", "Health"].map((tag) => (
                <div
                  key={tag}
                  style={{
                    fontSize: "12px",
                    fontWeight: 900,
                    color: "#FFFFFF",
                    backgroundColor: "rgba(255, 255, 255, 0.15)",
                    padding: "4px 10px",
                    textTransform: "uppercase" as const,
                    letterSpacing: "1px",
                    border: "2px solid rgba(255, 255, 255, 0.3)",
                  }}
                >
                  {tag}
                </div>
              ))}
            </div>
            <div
              style={{
                fontSize: "14px",
                color: "rgba(255, 255, 255, 0.5)",
              }}
            >
              made by sw3ll
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
