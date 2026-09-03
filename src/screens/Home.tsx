import { TOPICS, useRecall } from "../state";
import { Icon } from "../components/Icon";
import { topicMeta, type View } from "./shared";

export function Home({
  go,
  startQuiz,
}: {
  go: (view: View) => void;
  startQuiz: (topic?: string, review?: boolean) => void;
}) {
  const { state, accuracy, streak } = useRecall();
  const done = state.activity.daily.answers,
    goal = state.settings.dailyGoal,
    pct = Math.min(100, Math.round((done / goal) * 100));
  const initials = (state.profile.name[0] || "R").toUpperCase();
  return (
    <section className="screen active">
      <div className="app-header">
        <div className="greeting">
          <p>Bienvenido</p>
          <h2>{state.profile.name}</h2>
        </div>
        <div className="avatar">{initials}</div>
      </div>
      <div className="card session">
        <p className="eyebrow">SESIÓN RECOMENDADA</p>
        <h3>Repaso técnico mixto</h3>
        <p>
          Una mezcla breve de sintaxis, arrays, funciones y lógica de
          entrevistas.
        </p>
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
                <strong>{topic === "Metodos" ? "Métodos" : topic}</strong>
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
        <span>12 áreas</span>
      </div>
      <div className="topics">
        {TOPICS.map((topic, i) => {
          const meta = topicMeta[i];
          return (
            <button
              className="topic"
              key={topic}
              onClick={() => startQuiz(topic)}
            >
              <div className="topic-top">
                <div className="topic-icon">
                  <Icon name={meta[2]} />
                </div>
                <span className="topic-num">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <strong>{meta[0]}</strong>
              <small>{meta[1]}</small>
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
