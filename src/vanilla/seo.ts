import { ToolEntry } from './types';

export function updateSEO(tool?: ToolEntry): void {
    if (tool) {
        document.title = `${tool.name} — Free Online Tool | FreeToolsHub`;
        setMeta('description', `${tool.description} Free, no signup, works in your browser.`);
        setMeta('og:title', `${tool.name} — FreeToolsHub`);
        setMeta('og:description', tool.description);
    } else {
        document.title = 'FreeToolsHub — Free Online Tools for Everyday Use';
        setMeta(
            'description',
            'FreeToolsHub offers 32 free online tools — text utilities, calculators, generators, and developer tools. No signup, no backend, 100% browser-based.'
        );
        setMeta('og:title', 'FreeToolsHub — Free Online Tools');
        setMeta('og:description', '32 free browser-based utility tools. No signup required.');
    }
}

function setMeta(name: string, content: string): void {
    const isOg = name.startsWith('og:');
    const selector = isOg
        ? `meta[property="${name}"]`
        : `meta[name="${name}"]`;
    let el = document.querySelector(selector) as HTMLMetaElement | null;
    if (!el) {
        el = document.createElement('meta');
        if (isOg) {
            el.setAttribute('property', name);
        } else {
            el.setAttribute('name', name);
        }
        document.head.appendChild(el);
    }
    el.content = content;
}
