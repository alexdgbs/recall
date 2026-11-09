import type { Difficulty } from "../data";
import { useRecall } from "../state";
import { challengeProgress } from "../domain";
import { Arrow, label, type View } from "./shared";

export function Practice({
  go,
  startQuiz,
  openCode,
}: {
  go: (view: View) => void;
  startQuiz: (topic?: string, review?: boolean) => void;
  openCode: () => void;
}) {
  const { state, streak, setDifficulty } = useRecall();
  // Progreso de retos: sale del estado guardado, no de la dificultad
  // activa, así la tarjeta se ve igual en las 3 dificultades y tras
  // recargar. Antes no había tarjeta: el único "N listos" vivía en el
  // encabezado de Código Real, solo dentro de un reto.
  const { done, total } = challengeProgress(state.codeStats.completed);
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
          // Sin errores el quiz saldría vacío: el botón no navega.
          disabled={state.errors.length === 0}
          onClick={() => startQuiz(undefined, true)}
        />
        <Mode
          title={`${done} de ${total} listos`}
          eyebrow="RETOS DE CÓDIGO"
          copy="Ver los 9 retos por dificultad y su estado."
          onClick={() => go("challenges")}
        />
        <Mode
          title="Escribe y ejecuta tests"
          eyebrow="CÓDIGO REAL"
          copy="Completa una función y prueba casos normales y extremos."
          onClick={openCode}
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
  disabled = false,
  onClick,
}: {
  eyebrow: string;
  title: string;
  copy: string;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button className="mode-card" onClick={onClick} disabled={disabled}>
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
