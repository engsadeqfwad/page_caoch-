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
  const requests = [];
  window.fetch = async (url, options) => {
    assert.match(String(url), /\/functions\/v1\/submit-registration$/);
    requests.push(JSON.parse(options.body));
    return new window.Response(JSON.stringify({
      success: true, registrationId: '11111111-1111-4111-8111-111111111111',
      notificationStatus: 'pending',
    }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  };
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
  return { window, errors, button, requests };
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

async function fillInput(window, element, value) {
  const prototype = element.tagName === 'TEXTAREA'
    ? window.HTMLTextAreaElement.prototype : window.HTMLInputElement.prototype;
  Object.getOwnPropertyDescriptor(prototype, 'value').set.call(element, value);
  element.dispatchEvent(new window.Event('input', { bubbles: true }));
  await settle();
}

for (const missing of ['none', 'randomUUID', 'timeout', 'hasOwn']) {
  test(`full mobile submission works without ${missing}`, async () => {
    const { window, errors, button, requests } = await assessment(390);
    try {
      button('ابدئي الآن').click();
      await settle();
      for (let question = 0; question < 7; question++) {
        button('متابعة').click();
        await settle();
      }
      assert.match(window.document.querySelector('h2').textContent, /الاعتبارات الصحية/);
      await fillInput(window, window.document.querySelector('textarea'), 'لا يوجد');
      await fillInput(window, window.document.querySelector('input[maxlength="1000"]'), 'لا يوجد');
      button('متابعة').click();
      await settle();
      assert.match(window.document.querySelector('h2').textContent, /وسائل التواصل/);
      await fillInput(window, window.document.querySelector('[autocomplete="country-name"]'), 'السعودية');
      await fillInput(window, window.document.querySelector('[type="tel"]'), '0512345678');
      await fillInput(window, window.document.querySelector('input[placeholder="username"]'), 'registration_test');
      button('إظهار التوصية والنتيجة ✨').click();
      await settle();
      if (missing === 'randomUUID') window.crypto.randomUUID = undefined;
      if (missing === 'timeout') window.AbortSignal.timeout = undefined;
      if (missing === 'hasOwn') window.eval('Object.hasOwn = undefined');
      const confirm = [...window.document.querySelectorAll('button')]
        .find((item) => item.textContent.includes('واعتمدي بياناتكِ'));
      assert.ok(confirm, window.document.body.textContent.slice(-500));
      confirm.click();
      await settle();
      assert.equal(requests.length, 1, window.document.body.textContent.slice(0,700));
      assert.match(requests[0].submissionId, /^[0-9a-f-]{36}$/i);
      assert.ok(window.document.body.textContent.includes('11111111-1111-4111-8111-111111111111'));
      assert.deepEqual(errors, []);
    } finally {
      await window.happyDOM.close();
    }
  });
}
