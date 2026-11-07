import { useState, type KeyboardEvent } from "react";
import { challenges } from "../data";
import { MAX_CODE_CHARS } from "../config";
import { useRecall } from "../state";
import { runCode, type TestResult } from "../services/codeRunner";
import { Back, formatValue, label } from "./shared";

export function CodeMode({ onClose }: { onClose: () => void }) {
  const { state, registerCodeAttempt } = useRecall();
  const list = challenges.filter(
    (c) => c.difficulty === state.settings.difficulty,
  );
  const [index, setIndex] = useState(0);
  const challenge = list[index];
  const [code, setCode] = useState(challenge?.template ?? "");
  const [results, setResults] = useState<TestResult[]>([]);
  const [running, setRunning] = useState(false);
  const [status, setStatus] = useState(
    "Escribe tu solución y ejecuta los tests.",
  );
  if (!challenge)
    return (
      <section className="screen no-nav active">
        <div className="card empty show">No hay retos disponibles.</div>
        <button className="white-btn full-action" onClick={onClose}>
          Volver
        </button>
      </section>
    );
  const change = (next: number) => {
    const i = (next + list.length) % list.length;
    setIndex(i);
    setCode(list[i].template);
    setResults([]);
    setStatus("Escribe tu solución y ejecuta los tests.");
  };
  const handleTab = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key !== "Tab") return;
    e.preventDefault();
    const el = e.currentTarget;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    setCode(code.slice(0, start) + "  " + code.slice(end));
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(start + 2, start + 2);
    });
  };
  const run = async () => {
    // Un solo worker a la vez: un segundo clic mientras corre no arranca
    // otra ejecución que pise el resultado de la primera.
    if (running) return;
    setRunning(true);
    setStatus("Ejecutando…");
    try {
      const output = await runCode(code, challenge);
      setResults(output);
      const passed = output.every((r) => r.pass);
      const already = state.codeStats.completed.includes(challenge.id);
      registerCodeAttempt(challenge.id, passed);
      setStatus(
        passed
          ? already
            ? "Tests superados. Este reto ya estaba completado."
            : "Tests superados. Reto completado."
          : "Ajusta tu solución y vuelve a ejecutar.",
      );
    } catch (error) {
      setStatus(
        error instanceof Error ? error.message : "No se pudo ejecutar.",
      );
    } finally {
      setRunning(false);
    }
  };
  return (
    <section className="screen no-nav active">
      <div className="quiz-head">
        <button className="icon-btn" onClick={onClose} aria-label="Volver">
          <Back />
        </button>
        <div className="quiz-center">
          <strong>Código real</strong>
          <small>
            {index + 1} de {list.length}
          </small>
        </div>
        <div className="points">
          {state.codeStats.passed}{" "}
          {state.codeStats.passed === 1 ? "listo" : "listos"}
        </div>
      </div>
      <div className="code-challenge-head">
        <span className="tag">{label(challenge.difficulty)}</span>
        <h2>{challenge.title}</h2>
        <p>{challenge.description}</p>
      </div>
      <div className="editor-wrap">
        <div className="editor-top">
          <span>{challenge.functionName}</span>
          <span>JavaScript</span>
        </div>
        <textarea
          className="code-editor"
          maxLength={MAX_CODE_CHARS}
          value={code}
          onChange={(e) => setCode(e.target.value)}
          onKeyDown={handleTab}
        />
      </div>
      <div className="code-actions">
        <button
          className="outline-btn"
          onClick={() => setCode(challenge.template)}
        >
          Reiniciar
        </button>
        <button className="white-btn" onClick={run} disabled={running}>
          {running ? "Ejecutando…" : "Ejecutar tests"}
        </button>
      </div>
      <div
        className={`status ${results.length && results.every((r) => r.pass) ? "ok" : ""}`}
      >
        {status}
      </div>
      <div className="tests-list">
        {results.map((result, i) => (
          <div className={`test-row ${result.pass ? "pass" : "fail"}`} key={i}>
            <strong>
              {result.pass ? "✓" : "✕"} Test {i + 1}
            </strong>
            <span>
              Esperado: {formatValue(result.expected)}
              {`\n`}Recibido: {result.error ?? formatValue(result.actual)}
            </span>
          </div>
        ))}
      </div>
      {list.length > 1 && (
        <div className="challenge-nav">
          <button className="outline-btn" onClick={() => change(index - 1)}>
            Anterior
          </button>
          <button className="outline-btn" onClick={() => change(index + 1)}>
            Siguiente
          </button>
        </div>
      )}
    </section>
  );
}
