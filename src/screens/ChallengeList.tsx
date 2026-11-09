import { challenges, type Difficulty } from "../data";
import { useRecall } from "../state";
import { challengeProgress } from "../domain";
import { Back, label, type View } from "./shared";

// Los 9 retos juntos, por dificultad y con su estado: la única vista
// donde se ven todos; tocar uno lo abre en el editor.
const ORDER: Difficulty[] = ["basic", "intermediate", "technical"];

export function ChallengeList({
  go,
  openChallenge,
}: {
  go: (view: View) => void;
  openChallenge: (id: string) => void;
}) {
  const { state } = useRecall();
  const { done, total } = challengeProgress(state.codeStats.completed);
  return (
    <section className="screen active">
      <div className="quiz-head">
        <button
          className="icon-btn"
          onClick={() => go("practice")}
          aria-label="Volver"
        >
          <Back />
        </button>
        <div className="quiz-center">
          <strong>Retos de código</strong>
          <small>
            {total} retos en {ORDER.length} dificultades
          </small>
        </div>
        <div className="points">
          {done} {done === 1 ? "listo" : "listos"}
        </div>
      </div>
      {ORDER.map((d) => {
        const list = challenges.filter((c) => c.difficulty === d);
        const doneHere = list.filter((c) =>
          state.codeStats.completed.includes(c.id),
        ).length;
        return (
          <div key={d}>
            <div className="section-head">
              <h3>{label(d)}</h3>
              <span>
                {doneHere} de {list.length} listos
              </span>
            </div>
            <div className="challenge-list">
              {list.map((c) => {
                const isDone = state.codeStats.completed.includes(c.id);
                return (
                  <button
                    key={c.id}
                    className="challenge-row"
                    onClick={() => openChallenge(c.id)}
                  >
                    <span>
                      <strong>{c.title}</strong>
                      <small>{c.functionName}</small>
                    </span>
                    <span className={`tag${isDone ? " done" : ""}`}>
                      {isDone ? "Listo" : "Pendiente"}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </section>
  );
}
