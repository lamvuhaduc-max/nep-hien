'use client';

export default function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      style={{
        padding: '14px 32px', background: '#C0562C', color: '#fff',
        border: 'none', borderRadius: '3px', fontSize: '14px',
        letterSpacing: '.08em', cursor: 'pointer', fontWeight: 600,
      }}
    >
      🖨️ In QR Code
    </button>
  );
}
