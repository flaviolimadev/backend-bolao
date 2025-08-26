// src/polyfills.ts
// Polyfill para Web Crypto em runtimes Node 18.x onde globalThis.crypto pode não existir
// e bibliotecas (ex.: TypeORM) chamam crypto.randomUUID / getRandomValues.
// Este arquivo é importado no início do bootstrap para garantir disponibilidade.

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { webcrypto, randomUUID, randomFillSync } from 'node:crypto'

// Garante objeto crypto global
if (!(globalThis as any).crypto && webcrypto) {
  ;(globalThis as any).crypto = webcrypto as unknown as Crypto
}

// Fallback para randomUUID quando ausente
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
if (!(globalThis as any).crypto.randomUUID && typeof randomUUID === 'function') {
  ;(globalThis as any).crypto.randomUUID = randomUUID as unknown as () => string
}

// Fallback para getRandomValues quando ausente
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
if (!(globalThis as any).crypto.getRandomValues && typeof randomFillSync === 'function') {
  ;(globalThis as any).crypto.getRandomValues = (typedArray: ArrayBufferView) => {
    randomFillSync(typedArray as any)
    return typedArray
  }
}

// src/polyfills.ts
// Garantir Web Crypto no Node 18
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { webcrypto, randomUUID, randomFillSync } from 'node:crypto';

if (!globalThis.crypto) {
  // @ts-ignore
  globalThis.crypto = webcrypto as unknown as Crypto;
}
// @ts-ignore
if (!(globalThis.crypto as any).randomUUID && randomUUID) {
  // @ts-ignore
  (globalThis.crypto as any).randomUUID = randomUUID;
}
// @ts-ignore
if (!(globalThis.crypto as any).getRandomValues && randomFillSync) {
  // @ts-ignore
  (globalThis.crypto as any).getRandomValues = (typedArray: ArrayBufferView) => {
    randomFillSync(typedArray as any);
    return typedArray;
  };
}
