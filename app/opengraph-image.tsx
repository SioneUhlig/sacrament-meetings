import { ImageResponse } from 'next/og';

// Next.js turns this file into /opengraph-image and adds the og:image and
// twitter:image tags to every page automatically.
export const alt = 'Cedar Ridge Ward Sacrament Meetings';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '80px',
          background: '#1e3a5f',
          color: '#ffffff',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ fontSize: 36, opacity: 0.8 }}>Cedar Ridge Ward</div>
        <div style={{ fontSize: 80, fontWeight: 700, marginTop: 16, lineHeight: 1.1 }}>
          Sacrament Meeting Programs
        </div>
        <div style={{ fontSize: 34, marginTop: 32, opacity: 0.9 }}>
          Speakers, hymns, prayers, and announcements for each Sunday
        </div>
      </div>
    ),
    size
  );
}