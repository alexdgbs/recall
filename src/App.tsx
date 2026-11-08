import { useEffect, useState, type CSSProperties } from "react";
import "../assets/css/styles.css";
import { PHONE_HEIGHT, PHONE_WIDTH } from "./config";
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
  // Escala del marco de teléfono en escritorio: se calcula con el tamaño de
  // la ventana y se pasa como estilo de React, sin tocar el DOM a mano.
  const [wide, setWide] = useState(
    () =>
      typeof window.matchMedia === "function" &&
      window.matchMedia("(min-width: 901px)").matches,
  );
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const fit = () => {
      setWide(window.matchMedia("(min-width: 901px)").matches);
      setScale(Math.min(1, (window.innerHeight - 32) / PHONE_HEIGHT));
    };
    fit();
    window.addEventListener("resize", fit, { passive: true });
    return () => window.removeEventListener("resize", fit);
  }, []);
  const frameStyle = (
    wide
      ? {
          "--phone-scale": String(scale),
          width: `${PHONE_WIDTH * scale}px`,
          height: `${PHONE_HEIGHT * scale}px`,
        }
      : undefined
  ) as CSSProperties | undefined;
  if (!state.onboarded)
    return (
      <div className="desktop-stage">
        <div />
        <div className="phone-frame" style={frameStyle}>
          <main className="phone">
            <Onboarding />
          </main>
        </div>
        <div />
      </div>
    );
  const startQuiz = (topic?: string, review = false) => {
    // Sin errores no hay repaso: no abrir un quiz vacío.
    if (review && state.errors.length === 0) return;
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
      <Home startQuiz={startQuiz} />
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
      <div className="phone-frame" style={frameStyle}>
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
          <code>nums.filter(n =&gt; n % 2 === 0)</code>
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
