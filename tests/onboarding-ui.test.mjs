import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { build } from 'vite';
import { Window } from 'happy-dom';

// Exercise the real production bundle, including the router, provider, and pickers.
const result = await build({
  root: fileURLToPath(new URL('..', import.meta.url)),
  logLevel: 'silent',
  build: { write: false },
});
const bundle = result.output.find((item) => item.type === 'chunk' && item.isEntry);
assert.ok(bundle);
const stylesheet = result.output
  .filter((item) => item.type === 'asset' && item.fileName.endsWith('.css'))
  .map((item) => String(item.source)).join('\n');

const settle = () => new Promise((resolve) => setTimeout(resolve, 50));

async function assessment(width, lang = 'ar') {
  const window = new Window({
    url: 'https://registration.example/', width, height: 844,
    settings: {
      enableJavaScriptEvaluation: true,
      disableCSSFileLoading: true,
      disableJavaScriptFileLoading: true,
      suppressInsecureJavaScriptEnvironmentWarning: true,
    },
  });
  const errors = [];
  window.addEventListener('error', (event) => {
    errors.push(event.error ?? event.message);
    event.preventDefault();
  });
  window.localStorage.setItem('lang', lang);
  const style = window.document.createElement('style');
  style.textContent = stylesheet;
  window.document.head.append(style);
  window.document.body.innerHTML = '<div id="root"></div>';
  // Window.eval is a script context; supply the module URL used by React Router.
  window.eval(bundle.code.replaceAll('import.meta', '({ url: location.href })'));
  await settle();
  const button = (text) => [...window.document.querySelectorAll('button')]
    .find((item) => item.textContent.trim() === text);
  return { window, errors, button };
}

for (const [width, lang] of [[390, 'ar'], [360, 'ar'], [390, 'en'], [1280, 'ar']]) {
  test(`assessment starts and navigates at ${width}px in ${lang}`, async () => {
    const { window, errors, button } = await assessment(width, lang);
    try {
      button(lang === 'ar' ? 'ابدئي الآن' : 'Start Now').click();
      await settle();
      assert.match(window.document.querySelector('h2').textContent,
        lang === 'ar' ? /كم عمرك/ : /How old are you/);
      assert.equal(window.document.querySelectorAll('[role="listbox"]').length, 1);
      const trap = window.document.querySelector('[name="website"]');
      assert.ok(trap);
      // A bot-only field must not create an off-screen scroll area on RTL phones.
      assert.equal(window.getComputedStyle(trap.parentElement).display, 'none');

      button(lang === 'ar' ? 'متابعة' : 'Continue').click();
      await settle();
      assert.equal(window.document.querySelectorAll('[role="listbox"]').length, 2);
      button(lang === 'ar' ? 'السابق' : 'Back').click();
      await settle();
      assert.equal(window.document.querySelectorAll('[role="listbox"]').length, 1);
      button(lang === 'ar' ? 'السابق' : 'Back').click();
      await settle();
      assert.ok(button(lang === 'ar' ? 'ابدئي الآن' : 'Start Now'));
      assert.deepEqual(errors, []);
    } finally {
      await window.happyDOM.close();
    }
  });
}
