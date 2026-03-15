import QRCode from 'qrcode';

type QRCategory = 'website' | 'vcard' | 'text' | 'wifi' | 'pdf' | 'appstore';

let currentCategory: QRCategory = 'website';

export function render(container: HTMLElement): void {
    container.innerHTML = `
    <style>
        .qr-tabs {
            display: flex;
            flex-wrap: wrap;
            gap: var(--space-2);
            margin-bottom: var(--space-6);
            border-bottom: 1px solid var(--color-border);
            padding-bottom: var(--space-4);
        }
        .qr-tab {
            padding: var(--space-2) var(--space-4);
            border-radius: var(--radius-md);
            cursor: pointer;
            font-size: var(--font-sm);
            font-weight: 600;
            color: var(--color-text-muted);
            transition: all 0.2s;
            border: 1px solid transparent;
            display: flex;
            align-items: center;
            gap: var(--space-2);
            text-transform: uppercase;
            white-space: nowrap;
        }
        .qr-tab:hover {
            color: var(--color-text);
            background: var(--color-surface-hover);
        }
        .qr-tab.active {
            color: var(--color-primary);
            background: var(--color-primary-alpha, rgba(var(--color-primary-rgb), 0.1));
            border-color: var(--color-primary);
        }
        .input-container {
            display: none;
        }
        .input-container.active {
            display: block;
        }
    </style>
    
    <div class="section-gap">
        <div class="qr-tabs" id="qr-category-tabs">
            <div class="qr-tab active" data-category="website">🌐 WEBSITE</div>
            <div class="qr-tab" data-category="vcard">📇 DIGITAL BUSINESS CARD</div>
            <div class="qr-tab" data-category="text">📄 TEXT</div>
            <div class="qr-tab" data-category="wifi">📶 WIFI</div>
            <div class="qr-tab" data-category="pdf">📑 PDF</div>
            <div class="qr-tab" data-category="appstore">🅰️ APP STORE</div>
        </div>

        <div id="inputs-website" class="input-container active">
            <div class="input-group">
                <label for="qr-url">Website URL</label>
                <input type="text" class="input-field" id="qr-url" placeholder="https://example.com" value="https://toolrepository.com" />
            </div>
        </div>

        <div id="inputs-vcard" class="input-container">
            <div class="tool-grid-2">
                <div class="input-group">
                    <label for="vc-first">First Name</label>
                    <input type="text" class="input-field" id="vc-first" placeholder="John" />
                </div>
                <div class="input-group">
                    <label for="vc-last">Last Name</label>
                    <input type="text" class="input-field" id="vc-last" placeholder="Doe" />
                </div>
            </div>
            <div class="input-group">
                <label for="vc-phone">Phone Number</label>
                <input type="text" class="input-field" id="vc-phone" placeholder="+1 234 567 890" />
            </div>
            <div class="input-group">
                <label for="vc-email">Email Address</label>
                <input type="email" class="input-field" id="vc-email" placeholder="john.doe@example.com" />
            </div>
            <div class="input-group">
                <label for="vc-org">Organization</label>
                <input type="text" class="input-field" id="vc-org" placeholder="Acme Corp" />
            </div>
        </div>

        <div id="inputs-text" class="input-container">
            <div class="input-group">
                <label for="qr-text">Plain Text</label>
                <textarea class="input-field" id="qr-text" rows="4" placeholder="Enter your text here..."></textarea>
            </div>
        </div>

        <div id="inputs-wifi" class="input-container">
            <div class="input-group">
                <label for="wifi-ssid">Network Name (SSID)</label>
                <input type="text" class="input-field" id="wifi-ssid" placeholder="My Home Network" />
            </div>
            <div class="tool-grid-2">
                <div class="input-group">
                    <label for="wifi-pass">Password</label>
                    <input type="password" class="input-field" id="wifi-pass" placeholder="••••••••" />
                </div>
                <div class="input-group">
                    <label for="wifi-enc">Encryption</label>
                    <select class="input-field" id="wifi-enc">
                        <option value="WPA">WPA/WPA2</option>
                        <option value="WEP">WEP</option>
                        <option value="nopass">None</option>
                    </select>
                </div>
            </div>
        </div>

        <div id="inputs-pdf" class="input-container">
            <div class="input-group">
                <label for="qr-pdf">Link to PDF File</label>
                <input type="text" class="input-field" id="qr-pdf" placeholder="https://example.com/file.pdf" />
            </div>
        </div>

        <div id="inputs-appstore" class="input-container">
            <div class="input-group">
                <label for="qr-app">App Store / Play Store URL</label>
                <input type="text" class="input-field" id="qr-app" placeholder="https://apps.apple.com/..." />
            </div>
        </div>

        <div class="tool-grid-2" style="margin-top:var(--space-6);">
            <div class="input-group">
                <label for="qr-size">Size (px)</label>
                <input type="number" class="input-field" id="qr-size" value="256" min="64" max="512" step="32" />
            </div>
            <div class="input-group">
                <label for="qr-color">Foreground Color</label>
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

    const tabs = document.querySelectorAll('.qr-tab');
    const containers = document.querySelectorAll('.input-container');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            containers.forEach(c => c.classList.remove('active'));

            tab.classList.add('active');
            const category = tab.getAttribute('data-category') as QRCategory;
            currentCategory = category;
            document.getElementById(`inputs-${category}`)?.classList.add('active');
            generateQR();
        });
    });

    document.getElementById('btn-generate')!.addEventListener('click', generateQR);
    document.getElementById('btn-download')!.addEventListener('click', () => {
        const canvas = document.getElementById('qr-canvas') as HTMLCanvasElement;
        const link = document.createElement('a');
        link.download = `qrcode_${currentCategory}.png`;
        link.href = canvas.toDataURL();
        link.click();
    });

    generateQR(); // auto-generate on load
}

async function generateQR(): Promise<void> {
    const size = parseInt((document.getElementById('qr-size') as HTMLInputElement).value) || 256;
    const color = (document.getElementById('qr-color') as HTMLInputElement).value || '#000000';
    const canvas = document.getElementById('qr-canvas') as HTMLCanvasElement;

    let data = '';

    switch (currentCategory) {
        case 'website':
            data = (document.getElementById('qr-url') as HTMLInputElement).value || 'https://toolrepository.com';
            break;
        case 'vcard':
            const first = (document.getElementById('vc-first') as HTMLInputElement).value;
            const last = (document.getElementById('vc-last') as HTMLInputElement).value;
            const phone = (document.getElementById('vc-phone') as HTMLInputElement).value;
            const email = (document.getElementById('vc-email') as HTMLInputElement).value;
            const org = (document.getElementById('vc-org') as HTMLInputElement).value;
            data = `BEGIN:VCARD\nVERSION:3.0\nN:${last};${first};;;\nFN:${first} ${last}\nORG:${org}\nTEL;TYPE=CELL:${phone}\nEMAIL:${email}\nEND:VCARD`;
            break;
        case 'text':
            data = (document.getElementById('qr-text') as HTMLTextAreaElement).value || 'Hello';
            break;
        case 'wifi':
            const ssid = (document.getElementById('wifi-ssid') as HTMLInputElement).value;
            const pass = (document.getElementById('wifi-pass') as HTMLInputElement).value;
            const enc = (document.getElementById('wifi-enc') as HTMLSelectElement).value;
            
            const escape = (val: string) => val.replace(/([\\;:,])/g, '\\$1');
            const escapedSsid = escape(ssid);
            const escapedPass = escape(pass);
            
            data = `WIFI:S:${escapedSsid};T:${enc};P:${enc === 'nopass' ? '' : escapedPass};;`;
            break;
        case 'pdf':
            data = (document.getElementById('qr-pdf') as HTMLInputElement).value || '';
            break;
        case 'appstore':
            data = (document.getElementById('qr-app') as HTMLInputElement).value || '';
            break;
    }

    if (!data.trim()) {
        try {
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.fillStyle = '#f3f4f6';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.fillStyle = '#9ca3af';
                ctx.font = '14px Inter, sans-serif';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText('Enter data to generate QR', canvas.width / 2, canvas.height / 2);
            }
        } catch (e) {
            console.error('Placeholder failed:', e);
        }
        return;
    }

    try {
        await QRCode.toCanvas(canvas, data, {
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
