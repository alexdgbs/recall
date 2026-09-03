import { useState } from "react";
import { concepts, questions, type Difficulty, type Question } from "../data";
import { useRecall } from "../state";
import { Icon } from "../components/Icon";
import { shuffle } from "./shared";

export function Quiz({
  pool,
  title,
  onClose,
}: {
  pool: Question[];
  title: string;
  onClose: () => void;
}) {
  const { answer, finishSession, state } = useRecall();
  const [index, setIndex] = useState(0);
  const [choice, setChoice] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const q = pool[index];
  const concept = concepts.find((c) => c.name === q?.concept);
  const select = (i: number) => {
    if (choice !== null || !q) return;
    setChoice(i);
    const ok = i === q.correct;
    if (ok) setScore((s) => s + 1);
    answer(q, ok);
  };
  const next = () => {
    if (index === pool.length - 1) {
      finishSession();
      onClose();
    } else {
      setIndex((i) => i + 1);
      setChoice(null);
    }
  };
  if (!q)
    return (
      <section className="screen active">
        <div className="card empty show">No hay preguntas disponibles.</div>
        <button className="white-btn full-action" onClick={onClose}>
          Volver
        </button>
      </section>
    );
  return (
    <section className="screen active">
      <div className="quiz-head">
        <button className="icon-btn" onClick={onClose} aria-label="Cerrar">
          <Icon name="close" />
        </button>
        <div className="quiz-center">
          <strong>{title}</strong>
          <small>
            {index + 1} de {pool.length}
          </small>
        </div>
        <div className="points">{score * 100} pts</div>
      </div>
      <div className="bar">
        <span style={{ width: `${((index + 1) / pool.length) * 100}%` }} />
      </div>
      <div className="question">
        <span className="tag">{q.type}</span>
        <h2>{q.q}</h2>
        <p>
          {state.settings.difficulty === "technical"
            ? "Sin pistas en modo prueba técnica."
            : q.hint}
        </p>
      </div>
      <pre className="code code-box">
        {q.code || "Selecciona la respuesta."}
      </pre>
      <div className="answers">
        {q.options.map((option, i) => (
          <button
            key={option}
            disabled={choice !== null}
            className={`answer ${choice !== null && i === q.correct ? "correct" : ""} ${choice === i && i !== q.correct ? "wrong" : ""}`}
            onClick={() => select(i)}
          >
            {q.codeOptions ? (
              <>
                <div className="answer-option-label">
                  OPCIÓN {String.fromCharCode(65 + i)}
                </div>
                <pre className="code answer-option-code">{option}</pre>
              </>
            ) : (
              <div className="answer-row">
                <span className="letter">{String.fromCharCode(65 + i)}</span>
                <span className="answer-option-text">{option}</span>
              </div>
            )}
          </button>
        ))}
      </div>
      {choice !== null && (
        <div className="card feedback show">
          <h3>
            {choice === q.correct
              ? "¡Correcto!"
              : `Casi. La respuesta es: ${q.options[q.correct]}`}
          </h3>
          <p>{q.explain}</p>
          {concept && (
            <div className="concept show">
              <h4>Concepto: {concept.name}</h4>
              <p>{concept.summary}</p>
              <div className="tags">
                <span className="tag">{concept.returns}</span>
                <span className="tag">{concept.mutates}</span>
              </div>
              <pre className="code code-example">{concept.example}</pre>
            </div>
          )}
        </div>
      )}
      <button
        className={`white-btn next-btn ${choice !== null ? "show" : ""}`}
        onClick={next}
      >
        {index === pool.length - 1 ? "Terminar" : "Continuar"}
      </button>
    </section>
  );
}

export function createQuiz(
  difficulty: Difficulty,
  topic?: string,
  reviewIds?: string[],
) {
  let pool = questions.filter(
    (q) => q.difficulty === difficulty && (!topic || q.topic === topic),
  );
  if (reviewIds) pool = questions.filter((q) => reviewIds.includes(q.id));
  return shuffle(pool).slice(0, difficulty === "technical" ? 10 : 8);
}
