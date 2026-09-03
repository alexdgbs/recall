import { useEffect, useState } from "react";
import "../assets/css/styles.css";
import { useRecall } from "./state";
import {
  CodeMode,
  Home,
  Learn,
  Onboarding,
  Practice,
  Profile,
  Quiz,
  createQuiz,
  type View,
} from "./screens";
import { BottomNav } from "./components/BottomNav";
import { questions, type Question } from "./data";

export default function App() {
  const { state, storageAvailable } = useRecall();
  const [view, setView] = useState<View>("home");
  const [quiz, setQuiz] = useState<{ pool: Question[]; title: string } | null>(
    null,
  );
  useEffect(() => {
    const fit = () => {
      const frame = document.querySelector<HTMLElement>(".phone-frame");
      if (!frame) return;
      if (!matchMedia("(min-width: 901px)").matches) {
        frame.style.removeProperty("--phone-scale");
        frame.style.removeProperty("width");
        frame.style.removeProperty("height");
        return;
      }
      const scale = Math.min(1, (innerHeight - 32) / 844);
      frame.style.setProperty("--phone-scale", String(scale));
      frame.style.width = `${390 * scale}px`;
      frame.style.height = `${844 * scale}px`;
    };
    fit();
    addEventListener("resize", fit, { passive: true });
    return () => removeEventListener("resize", fit);
  }, []);
  if (!state.onboarded)
    return (
      <div className="desktop-stage">
        <div />
        <div className="phone-frame">
          <main className="phone">
            <Onboarding />
          </main>
        </div>
        <div />
      </div>
    );
  const startQuiz = (topic?: string, review = false) => {
    const pool = createQuiz(
      state.settings.difficulty,
      topic,
      review ? state.errors : undefined,
    );
    setQuiz({
      pool,
      title: review ? "Repasar errores" : (topic ?? "Repaso mixto"),
    });
    setView("quiz");
  };
  const screen =
    view === "home" ? (
      <Home go={setView} startQuiz={startQuiz} />
    ) : view === "learn" ? (
      <Learn />
    ) : view === "practice" ? (
      <Practice go={setView} startQuiz={startQuiz} />
    ) : view === "quiz" && quiz ? (
      <Quiz
        pool={quiz.pool}
        title={quiz.title}
        onClose={() => setView("practice")}
      />
    ) : view === "code" ? (
      <CodeMode onClose={() => setView("practice")} />
    ) : (
      <Profile go={setView} />
    );
  return (
    <div className="desktop-stage">
      <aside className="showcase-editorial showcase-intro" aria-hidden="true">
        <span className="showcase-label">Recall</span>
        <h2>
          Aprende.
          <br />
          Practica.
          <br />
          Recuerda.
        </h2>
        <p>Una rutina breve para entender código y conservar lo aprendido.</p>
      </aside>
      <div className="phone-frame">
        <main className="phone">
          {screen}
          {!storageAvailable && (
            <div className="storage-notice" role="status">
              No se pueden guardar cambios en este dispositivo.
            </div>
          )}
          {!["quiz", "code"].includes(view) && (
            <BottomNav view={view} go={setView} />
          )}
        </main>
      </div>
      <aside className="showcase-editorial showcase-detail" aria-hidden="true">
        <div className="showcase-code-block">
          <span>práctica de hoy</span>
          <code>
            nums.filter(n =&gt;
            <br />
            &nbsp;&nbsp;n % 2 === 0<br />)
          </code>
        </div>
        <div className="showcase-facts">
          <div>
            <strong>12</strong>
            <span>áreas</span>
          </div>
          <div>
            <strong>{questions.length}</strong>
            <span>preguntas</span>
          </div>
          <div>
            <strong>100%</strong>
            <span>local</span>
          </div>
        </div>
      </aside>
    </div>
  );
}
