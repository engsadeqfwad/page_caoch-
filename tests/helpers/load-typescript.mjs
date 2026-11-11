import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { createRequire } from 'node:module';
import { webcrypto } from 'node:crypto';
import ts from 'typescript';

export function loadTypescript(entry, { globals = {}, overrides = {} } = {}) {
  const cache = new Map();
  const context = vm.createContext({
    console: { ...console, error() {} }, crypto: webcrypto, Request, Response, Headers,
    TextEncoder, TextDecoder, AbortSignal, URL, setTimeout, clearTimeout, fetch, ...globals,
  });
  function load(filename) {
    filename = path.resolve(filename);
    if (cache.has(filename)) return cache.get(filename).exports;
    const module = { exports: {} };
    cache.set(filename, module);
    const localRequire = createRequire(filename);
    const require = (name) => {
      if (Object.hasOwn(overrides, name)) return overrides[name];
      if (name.startsWith('.')) {
        let target = path.resolve(path.dirname(filename), name);
        if (!path.extname(target)) target += '.ts';
        return load(target);
      }
      return localRequire(name);
    };
    const code = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
      compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS },
    }).outputText;
    const run = vm.runInContext(`(function(require, module, exports) {${code}\n})`, context, { filename });
    run(require, module, module.exports);
    return module.exports;
  }
  return load(entry);
}
