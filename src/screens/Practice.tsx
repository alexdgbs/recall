import type { Difficulty } from "../data";
import { useRecall } from "../state";
import { Arrow, label, type View } from "./shared";

export function Practice({
  go,
  startQuiz,
}: {
  go: (view: View) => void;
  startQuiz: (topic?: string, review?: boolean) => void;
}) {
  const { state, streak, setDifficulty } = useRecall();
  return (
    <section className="screen active">
      <p className="eyebrow">PRACTICAR</p>
      <h2 className="view-title">Elige cómo entrenar.</h2>
      <p className="muted view-intro">
        Cambia la dificultad y Recall adapta las preguntas y retos.
      </p>
      <div className="difficulty-tabs">
        {(["basic", "intermediate", "technical"] as Difficulty[]).map((d) => (
          <button
            key={d}
            className={`difficulty-btn ${state.settings.difficulty === d ? "active" : ""}`}
            onClick={() => setDifficulty(d)}
          >
            {label(d)}
          </button>
        ))}
      </div>
      <div className="practice-meta">
        <span className="tag">
          Meta: {state.activity.daily.answers}/{state.settings.dailyGoal}
        </span>
        <span className="tag">
          Racha: {streak} {streak === 1 ? "día" : "días"}
        </span>
        <span className="tag">Errores: {state.errors.length}</span>
      </div>
      <div className="practice-stack">
        <Mode
          title="Preguntas rápidas"
          eyebrow="QUIZ"
          copy="Salidas, conceptos, sintaxis y código correcto."
          onClick={() => startQuiz()}
        />
        <Mode
          title="Repasar pendientes"
          eyebrow="ERRORES"
          copy={
            state.errors.length
              ? `${state.errors.length} preguntas por dominar.`
              : "No tienes errores pendientes."
          }
          onClick={() => startQuiz(undefined, true)}
        />
        <Mode
          title="Escribe y ejecuta tests"
          eyebrow="CÓDIGO REAL"
          copy="Completa una función y prueba casos normales y extremos."
          onClick={() => go("code")}
        />
      </div>
      <div className="notice">
        Tu código se ejecuta en este dispositivo. Si tarda demasiado, lo
        detenemos para que la app no se bloquee.
      </div>
    </section>
  );
}
function Mode({
  eyebrow,
  title,
  copy,
  onClick,
}: {
  eyebrow: string;
  title: string;
  copy: string;
  onClick: () => void;
}) {
  return (
    <button className="mode-card" onClick={onClick}>
      <div className="mode-copy">
        <p className="eyebrow">{eyebrow}</p>
        <strong>{title}</strong>
        <p>{copy}</p>
      </div>
      <div className="mode-arrow">
        <Arrow />
      </div>
    </button>
  );
}
