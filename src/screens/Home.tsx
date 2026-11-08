import { TOPICS, useRecall } from "../state";
import { Icon } from "../components/Icon";
import { topicMeta } from "./shared";
import type { Difficulty } from "../data";

// La sesión recomendada es el quiz mixto con la dificultad activa: el
// título dice la dificultad real, no "técnico" cuando es básico.
const sessionCopy: Record<Difficulty, { title: string; copy: string }> = {
  basic: {
    title: "Repaso básico",
    copy: "Preguntas cortas de sintaxis, arrays y funciones.",
  },
  intermediate: {
    title: "Repaso intermedio",
    copy: "Una mezcla de sintaxis, arrays, funciones y lógica.",
  },
  technical: {
    title: "Prueba técnica",
    copy: "Preguntas de prueba técnica, sin pistas.",
  },
};

export function Home({
  startQuiz,
}: {
  startQuiz: (topic?: string, review?: boolean) => void;
}) {
  const { state, accuracy, streak } = useRecall();
  const done = state.activity.daily.answers,
    goal = state.settings.dailyGoal,
    pct = Math.min(100, Math.round((done / goal) * 100));
  const initials = (state.profile.name[0] || "R").toUpperCase();
  const session = sessionCopy[state.settings.difficulty];
  return (
    <section className="screen active">
      <div className="app-header">
        <div className="greeting">
          <p>Bienvenido</p>
          <h2>{state.profile.name}</h2>
          <p className="greeting-sub">
            Quiz, referencia y retos de JavaScript, todo en este dispositivo.
          </p>
        </div>
        <div className="avatar">{initials}</div>
      </div>
      <div className="card session">
        <p className="eyebrow">SESIÓN RECOMENDADA</p>
        <h3>{session.title}</h3>
        <p>{session.copy}</p>
        <button className="white-btn" onClick={() => startQuiz()}>
          Empezar práctica
        </button>
      </div>
      <div className="section-head">
        <h3>Resumen</h3>
        <span>Guardado local</span>
      </div>
      <div className="stats-grid">
        <Stat name="Sesiones" value={state.stats.sessions} />
        <Stat name="Acierto" value={`${accuracy}%`} />
        <Stat name="Correctas" value={state.stats.correctAnswers} />
      </div>
      <div className="card goal-card">
        <div className="goal-top">
          <div>
            <p className="eyebrow">META DE HOY</p>
            <strong>
              {done} de {goal} preguntas
            </strong>
            <p>
              {done >= goal
                ? "Meta completada. Buen trabajo."
                : "Completa una sesión corta para mantener el ritmo."}
            </p>
          </div>
          <div className="streak-badge">
            <small>Racha</small>
            <b>{streak}</b>
            <small>{streak === 1 ? "día" : "días"}</small>
          </div>
        </div>
        <div className="goal-progress">
          <span style={{ width: `${pct}%` }} />
        </div>
        <div className="goal-footer">
          <span>{pct}%</span>
          <span>Se actualiza al responder</span>
        </div>
      </div>
      <button
        className="card review-card review-button"
        onClick={() => startQuiz(undefined, true)}
        disabled={state.errors.length === 0}
      >
        <div>
          <p className="eyebrow">REPASAR ERRORES</p>
          <strong>Vuelve a lo que fallaste.</strong>
          <p>
            Las preguntas incorrectas quedan guardadas hasta responderlas bien.
          </p>
        </div>
        <div className="review-count">{state.errors.length}</div>
      </button>
      <div className="section-head">
        <h3>Precisión por tema</h3>
        <span>Aciertos</span>
      </div>
      <div className="topic-progress-list">
        {TOPICS.map((topic) => {
          const item = state.topicStats[topic],
            pct = item.answered
              ? Math.round((item.correct / item.answered) * 100)
              : 0;
          return (
            <div className="topic-progress-item" key={topic}>
              <div className="topic-progress-head">
                <strong>{topicMeta[topic].title}</strong>
                <span>
                  {item.answered
                    ? `${item.correct} de ${item.answered} correctas`
                    : "Sin respuestas"}
                </span>
              </div>
              <progress className="topic-progress-bar" max="100" value={pct} />
            </div>
          );
        })}
      </div>
      <div className="section-head">
        <h3>Qué practicar</h3>
        <span>{TOPICS.length} áreas</span>
      </div>
      <div className="topics">
        {TOPICS.map((topic, i) => {
          const meta = topicMeta[topic];
          return (
            <button
              className="topic"
              key={topic}
              onClick={() => startQuiz(topic)}
            >
              <div className="topic-top">
                <div className="topic-icon">
                  <Icon name={meta.icon} />
                </div>
                <span className="topic-num">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <strong>{meta.title}</strong>
              <small>{meta.desc}</small>
            </button>
          );
        })}
      </div>
    </section>
  );
}
function Stat({ name, value }: { name: string; value: string | number }) {
  return (
    <div className="card2 stat">
      <small>{name}</small>
      <strong>{value}</strong>
    </div>
  );
}
