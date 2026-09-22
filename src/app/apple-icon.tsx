import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

// Home-screen icon: the three-spine mark on navy (iOS rounds the corners itself)
export default function AppleIcon() {
    return new ImageResponse(
        (
            <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#141B34" }}>
                <svg width="116" height="116" viewBox="0 0 24 24">
                    <rect x="3" y="5" width="4" height="16" fill="#F5F6F2" />
                    <rect x="8.5" y="3" width="4" height="18" fill="#D9480F" />
                    <rect x="15" y="6" width="4" height="15.5" fill="#F5F6F2" transform="rotate(-14 17 21)" />
                </svg>
            </div>
        ),
        size
    );
}
