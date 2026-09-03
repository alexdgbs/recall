import type { Challenge } from "../data";
export interface TestResult {
  pass: boolean;
  actual?: unknown;
  expected: unknown;
  error?: string;
}
export function runCode(
  code: string,
  challenge: Challenge,
): Promise<TestResult[]> {
  if (code.length > 10000)
    return Promise.reject(
      new Error("El código supera el límite de 10,000 caracteres."),
    );
  return new Promise((resolve, reject) => {
    const workerSource = `
self.onmessage = async (event) => {
  const { code, functionName, tests } = event.data;

  const same = (a, b, seen = new WeakMap()) => {
    if (Object.is(a, b)) return true;
    if (
      typeof a !== typeof b ||
      a === null ||
      b === null ||
      typeof a !== "object"
    ) return false;
    if (seen.get(a) === b) return true;

    seen.set(a, b);
    if (Array.isArray(a) !== Array.isArray(b)) return false;

    const aKeys = Object.keys(a).sort();
    const bKeys = Object.keys(b).sort();
    return aKeys.length === bKeys.length && aKeys.every(
      (key, index) => key === bKeys[index] && same(a[key], b[key], seen),
    );
  };

  try {
    const getFunction = new Function(
      code + "\\n;return typeof " + functionName +
      ' === "function" ? ' + functionName + " : null;",
    );
    const solution = getFunction();
    if (!solution) throw new Error("No se encontró la función " + functionName);

    const results = [];
    for (const test of tests) {
      try {
        const actual = await solution(...test.args);
        results.push({
          pass: same(actual, test.expected),
          actual,
          expected: test.expected,
        });
      } catch (error) {
        results.push({
          pass: false,
          error: String(error?.message || error),
          expected: test.expected,
        });
      }
    }
    self.postMessage({ results });
  } catch (error) {
    self.postMessage({ error: String(error?.message || error) });
  }
};`;
    const url = URL.createObjectURL(
      new Blob([workerSource], { type: "text/javascript" }),
    );
    const worker = new Worker(url);
    const done = () => {
      worker.terminate();
      URL.revokeObjectURL(url);
    };
    const timer = setTimeout(() => {
      done();
      reject(
        new Error(
          "La ejecución tardó demasiado. Revisa si hay un bucle infinito.",
        ),
      );
    }, 1500);
    worker.onmessage = (event) => {
      clearTimeout(timer);
      done();
      event.data.error
        ? reject(new Error(event.data.error))
        : resolve(event.data.results);
    };
    worker.onerror = () => {
      clearTimeout(timer);
      done();
      reject(new Error("No se pudo ejecutar el código."));
    };
    worker.postMessage({
      code,
      functionName: challenge.functionName,
      tests: challenge.tests,
    });
  });
}
