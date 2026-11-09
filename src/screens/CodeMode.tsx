import { useRef, useState, type KeyboardEvent } from "react";
import { challenges } from "../data";
import { MAX_CODE_CHARS } from "../config";
import { useRecall } from "../state";
import { findChallenge } from "../domain";
import { runCode, type TestResult } from "../services/codeRunner";
import { Back, formatValue, label } from "./shared";

export function CodeMode({
  onClose,
  initialId,
}: {
  onClose: () => void;
  initialId?: string;
}) {
  const { state, registerCodeAttempt, saveCodeDraft, clearCodeDraft } =
    useRecall();
  // Desde la lista se abre un reto concreto; si no, el primero de la
  // dificultad activa. La dificultad queda fijada al entrar: el componente
  // se desmonta al salir, así que no hace falta guardarla en estado.
  const start = initialId ? findChallenge(initialId) : undefined;
  const difficulty = start?.difficulty ?? state.settings.difficulty;
  const list = challenges.filter((c) => c.difficulty === difficulty);
  const [index, setIndex] = useState(() => {
    const i = start ? list.findIndex((c) => c.id === start.id) : -1;
    return i >= 0 ? i : 0;
  });
  const challenge = list[index];
  // Borradores por reto: cambiar de reto no tira lo escrito; al volver,
  // cada reto muestra su último código, no el template. El ref es la
  // copia rápida en sesión; lo guardado vive en el estado y sobrevive
  // a salir de la pantalla y a recargar.
  const drafts = useRef<Record<string, string>>({ ...state.codeDrafts });
  const [code, setCode] = useState(
    () =>
      (challenge ? drafts.current[challenge.id] : undefined) ??
      challenge?.template ??
      "",
  );
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
    drafts.current[challenge.id] = code;
    saveCodeDraft(challenge.id, code);
    const i = (next + list.length) % list.length;
    const nextCode =
      drafts.current[list[i].id] ??
      state.codeDrafts[list[i].id] ??
      list[i].template;
    drafts.current[list[i].id] = nextCode;
    setIndex(i);
    setCode(nextCode);
    setResults([]);
    setStatus("Escribe tu solución y ejecuta los tests.");
  };
  // Salir guarda lo escrito, para que siga ahí al volver.
  const exit = () => {
    saveCodeDraft(challenge.id, code);
    onClose();
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
    // Lo escrito queda guardado aunque se salga sin volver a tocar nada.
    saveCodeDraft(challenge.id, code);
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
        <button className="icon-btn" onClick={exit} aria-label="Volver">
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
          onClick={() => {
            // Reiniciar borra también el borrador guardado de este reto.
            delete drafts.current[challenge.id];
            clearCodeDraft(challenge.id);
            setCode(challenge.template);
          }}
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
