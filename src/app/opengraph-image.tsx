import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'ScaleJade — Built to perform, built to last.';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
    return new ImageResponse(
        (
            <div
                style={{
                    background: '#0f1a13',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    padding: '72px 80px',
                    fontFamily: 'sans-serif',
                }}
            >
                {/* Top: logo wordmark area */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div
                        style={{
                            width: 36,
                            height: 36,
                            background: '#22c55e',
                            borderRadius: 8,
                        }}
                    />
                    <span style={{ color: '#ffffff', fontSize: 24, fontWeight: 700, letterSpacing: '-0.5px' }}>
                        ScaleJade
                    </span>
                </div>

                {/* Middle: headline */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    <div
                        style={{
                            color: '#22c55e',
                            fontSize: 16,
                            fontWeight: 600,
                            letterSpacing: '3px',
                            textTransform: 'uppercase',
                        }}
                    >
                        Enterprise Technology Partner
                    </div>
                    <div
                        style={{
                            color: '#ffffff',
                            fontSize: 62,
                            fontWeight: 800,
                            lineHeight: 1.1,
                            letterSpacing: '-2px',
                            maxWidth: 820,
                        }}
                    >
                        Building Reliable Technology, Together.
                    </div>
                    <div
                        style={{
                            color: '#94a3b8',
                            fontSize: 22,
                            fontWeight: 400,
                            lineHeight: 1.5,
                            maxWidth: 700,
                        }}
                    >
                        Software Engineering · AI · Data Analytics · Cloud · Blockchain
                    </div>
                </div>

                {/* Bottom: tagline + offices */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <span style={{ color: '#475569', fontSize: 16, letterSpacing: '1px' }}>
                        Built to perform, built to last.
                    </span>
                    <span style={{ color: '#475569', fontSize: 16 }}>
                        Singapore · Jakarta
                    </span>
                </div>
            </div>
        ),
        { ...size }
    );
}
