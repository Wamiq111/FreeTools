import QRCode from 'qrcode';

export function render(container: HTMLElement): void {
    container.innerHTML = `
    <div class="section-gap">
      <div class="input-group">
        <label for="qr-input">Enter URL or text</label>
        <input type="text" class="input-field" id="qr-input" placeholder="https://example.com" value="https://toolrepository.com" />
      </div>
      <div class="tool-grid-2">
        <div class="input-group">
          <label for="qr-size">Size (px)</label>
          <input type="number" class="input-field" id="qr-size" value="256" min="64" max="512" step="32" />
        </div>
        <div class="input-group">
          <label for="qr-color">Color</label>
          <input type="color" class="input-field" id="qr-color" value="#000000" style="padding:var(--space-1);height:44px;" />
        </div>
      </div>
      <button class="btn btn--primary btn--block" id="btn-generate">📱 Generate QR Code</button>
      <div style="text-align:center;padding:var(--space-6);">
        <canvas id="qr-canvas" style="border:1px solid var(--color-border);border-radius:var(--radius-lg);max-width:100%;"></canvas>
      </div>
      <button class="btn btn--secondary btn--block" id="btn-download">⬇️ Download PNG</button>
    </div>
  `;

    document.getElementById('btn-generate')!.addEventListener('click', generateQR);
    document.getElementById('btn-download')!.addEventListener('click', () => {
        const canvas = document.getElementById('qr-canvas') as HTMLCanvasElement;
        const link = document.createElement('a');
        link.download = 'qrcode.png';
        link.href = canvas.toDataURL();
        link.click();
    });

    generateQR(); // auto-generate on load
}

async function generateQR(): Promise<void> {
    const text = (document.getElementById('qr-input') as HTMLInputElement).value || 'Hello';
    const size = parseInt((document.getElementById('qr-size') as HTMLInputElement).value) || 256;
    const color = (document.getElementById('qr-color') as HTMLInputElement).value || '#000000';
    const canvas = document.getElementById('qr-canvas') as HTMLCanvasElement;

    try {
        await QRCode.toCanvas(canvas, text, {
            width: size,
            margin: 2,
            color: {
                dark: color,
                light: '#ffffff'
            }
        });
    } catch (err) {
        console.error('QR Generation failed:', err);
    }
}
