import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

// Home-screen icon: the BookKey logo on the brand brown (iOS rounds the corners itself)
export default function AppleIcon() {
    return new ImageResponse(
        (
            <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#6B4F3F" }}>
                <svg width="116" height="116" viewBox="0 0 24 24" fill="none" stroke="#FAF7F3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m19 3 1 1" />
                    <path d="m20 2-4.5 4.5" />
                    <path d="M20 7.898V21a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20" />
                    <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2h7.844" />
                    <circle cx="14" cy="8" r="2" />
                </svg>
            </div>
        ),
        size
    );
}
