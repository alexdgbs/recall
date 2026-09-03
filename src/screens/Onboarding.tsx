import { useState, type ReactNode } from "react";
import { isValidUsername, normalizeUsername, useRecall } from "../state";
import { createBackup, readBackup } from "../services/backup";
import { Icon } from "../components/Icon";
import { Arrow, Back } from "./shared";

function Dots({ step }: { step: number }) {
  return (
    <div className="progress-dots">
      {[0, 1, 2, 3, 4].map((i) => (
        <span key={i} className={i === step ? "active" : ""} />
      ))}
    </div>
  );
}
function NextButton({
  children,
  onClick,
}: {
  children: string;
  onClick: () => void;
}) {
  return (
    <button className="next-pill" type="button" onClick={onClick}>
      <span>{children}</span>
      <span className="round">
        <Arrow />
      </span>
    </button>
  );
}
export function Onboarding() {
  const { state, setUsername, finishOnboarding, restore } = useRecall();
  const [step, setStep] = useState(0);
  const [name, setName] = useState(state.profile.name);
  const [error, setError] = useState("");
  const [backup, setBackup] = useState("");
  const [backupStatus, setBackupStatus] = useState(
    "El código funciona como una copia portátil de tus datos.",
  );
  const submitName = () => {
    const clean = normalizeUsername(name);
    setName(clean);
    if (!isValidUsername(clean) || !setUsername(clean)) {
      setError(
        "Usa 3–12 caracteres; empieza y termina con letra o número, sin puntos dobles.",
      );
      return;
    }
    setError("");
    setStep(2);
  };
  const restoreData = () => {
    try {
      restore(readBackup(backup.trim()));
      setBackupStatus("Datos restaurados correctamente.");
    } catch {
      setBackupStatus("Ese código no es válido o está incompleto.");
    }
  };
  if (step === 0)
    return (
      <section className="screen onboarding active">
        <div className="onboard-wrap">
          <div className="top-row">
            <div className="mark" aria-label="Recall" />
            <Dots step={0} />
          </div>
          <div className="onboard-content">
            <p className="eyebrow">RECALL</p>
            <h1>Bienvenido.</h1>
          </div>
          <div className="onboard-actions split">
            <button className="text-action" onClick={() => setStep(5)}>
              Ya tengo un código
            </button>
            <NextButton onClick={() => setStep(1)}>Continuar</NextButton>
          </div>
        </div>
      </section>
    );
  if (step === 5)
    return (
      <section className="screen onboarding active">
        <div className="onboard-wrap">
          <div className="top-row logo-only">
            <button
              className="icon-btn"
              onClick={() => setStep(0)}
              aria-label="Volver"
            >
              <Back />
            </button>
            <div className="word-logo">Recall</div>
          </div>
          <div className="onboard-content">
            <p className="eyebrow">RESTAURAR</p>
            <h2>
              ¿Vienes de
              <br />
              otro dispositivo?
            </h2>
            <p>
              Pega tu código de respaldo. Si es válido, recuperaremos tu usuario
              y progreso.
            </p>
            <div className="card restore-panel">
              <textarea
                maxLength={120000}
                value={backup}
                onChange={(e) => setBackup(e.target.value)}
                placeholder="Pega aquí tu código de respaldo..."
              />
              <div
                className={`status ${backupStatus.startsWith("Datos") ? "ok" : ""}`}
              >
                {backupStatus}
              </div>
            </div>
          </div>
          <div className="onboard-actions split">
            <button className="text-action" onClick={() => setStep(0)}>
              Cancelar
            </button>
            <NextButton onClick={restoreData}>Restaurar</NextButton>
          </div>
        </div>
      </section>
    );
  if (step === 1)
    return (
      <section className="screen onboarding active">
        <div className="onboard-wrap">
          <div className="top-row">
            <button
              className="icon-btn"
              onClick={() => setStep(0)}
              aria-label="Volver"
            >
              <Back />
            </button>
            <Dots step={1} />
          </div>
          <div className="onboard-content">
            <p className="eyebrow">TU PERFIL</p>
            <h2>Elige un usuario</h2>
            <p>
              Se guarda únicamente en este navegador. No se envía a ningún
              servidor.
            </p>
            <div className="field">
              <label htmlFor="nameInput">USUARIO</label>
              <input
                id="nameInput"
                minLength={3}
                maxLength={12}
                autoComplete="username"
                autoCapitalize="none"
                spellCheck={false}
                value={name}
                onChange={(e) => setName(e.target.value.toLowerCase())}
                placeholder="not_recall"
              />
              <div className="field-foot">
                <div className="field-error">{error}</div>
                <span>{name.length}/12</span>
              </div>
            </div>
            <div className="privacy-note">
              No usamos tu IP como identificador.
              <br />
              Tus datos permanecen en este dispositivo.
            </div>
          </div>
          <div className="onboard-actions">
            <NextButton onClick={submitName}>Continuar</NextButton>
          </div>
        </div>
      </section>
    );
  if (step === 2)
    return (
      <section className="screen onboarding active">
        <div className="onboard-wrap">
          <div className="top-row">
            <button
              className="icon-btn"
              onClick={() => setStep(1)}
              aria-label="Volver"
            >
              <Back />
            </button>
            <Dots step={2} />
          </div>
          <div className="personal-welcome">
            <p className="eyebrow">LISTO</p>
            <h1>
              Hola,<span>{state.profile.name}</span>
            </h1>
            <p className="personal-welcome-copy">
              <span>Aprende hoy.</span>
              <span>Recuérdalo mañana.</span>
            </p>
          </div>
          <div className="onboard-actions">
            <NextButton onClick={() => setStep(3)}>Continuar</NextButton>
          </div>
        </div>
      </section>
    );
  if (step === 3)
    return (
      <Intro
        step={3}
        title={
          <>
            Recuerda qué hace
            <br />
            cada herramienta.
          </>
        }
        copy="Antes de memorizar respuestas, revisa qué devuelve un método, si modifica el array original y cuándo conviene usarlo."
        back={() => setStep(2)}
        next={() => setStep(4)}
        action="Continuar"
      />
    );
  return (
    <Intro
      step={4}
      title={
        <>
          Piensa como en una
          <br />
          prueba técnica.
        </>
      }
      copy="Predice salidas, completa código, identifica errores y elige la mejor solución. Después de responder, se explica el concepto."
      back={() => setStep(3)}
      next={finishOnboarding}
      action="Iniciar"
    />
  );
}
function Intro({
  step,
  title,
  copy,
  back,
  next,
  action,
}: {
  step: number;
  title: ReactNode;
  copy: string;
  back: () => void;
  next: () => void;
  action: string;
}) {
  const learn = step === 3;
  return (
    <section className="screen onboarding active">
      <div className="onboard-wrap">
        <div className="top-row">
          <button className="icon-btn" onClick={back} aria-label="Volver">
            <Back />
          </button>
          <Dots step={step} />
        </div>
        <div className="onboard-content">
          <p className="eyebrow">{learn ? "APRENDE" : "PRACTICA"}</p>
          <h2>{title}</h2>
          <p>{copy}</p>
          <div className="card hero-panel">
            <div className="row">
              <div className="hero-icon">
                <Icon name={learn ? "book" : "code"} />
              </div>
              <div>
                <strong>
                  {learn ? "Referencia rápida" : "Preguntas de código"}
                </strong>
                <small>
                  {learn
                    ? "slice, splice, map, filter, reduce, Set, Map, async/await y más."
                    : "if/else, for, while, arrays, funciones, objetos, métodos y algoritmos."}
                </small>
              </div>
            </div>
            <div className="row">
              <div className="hero-icon">
                <Icon name={learn ? "fundamentals" : "chart"} />
              </div>
              <div>
                <strong>{learn ? "Ejemplos claros" : "Progreso local"}</strong>
                <small>
                  {learn
                    ? "Cada concepto incluye una explicación corta y código de ejemplo."
                    : "Se guardan sesiones, respuestas correctas y porcentaje de acierto."}
                </small>
              </div>
            </div>
          </div>
        </div>
        <div className="onboard-actions">
          <NextButton onClick={next}>{action}</NextButton>
        </div>
      </div>
    </section>
  );
}
