import { useRef, useState } from "react";
import { useRecall } from "../state";
import { createBackup, readBackup } from "../services/backup";
import { label, type View } from "./shared";

export function Profile({ go }: { go: (view: View) => void }) {
  const { state, accuracy, streak, setGoal, restore, reset } = useRecall();
  const [backup, setBackup] = useState("");
  const [status, setStatus] = useState("");
  const dialog = useRef<HTMLDialogElement>(null);
  const generate = () => {
    setBackup(createBackup(state));
    setStatus("Código generado. Incluye perfil, progreso y preferencias.");
  };
  const restoreData = () => {
    try {
      restore(readBackup(backup.trim()));
      setStatus("Datos restaurados correctamente.");
    } catch {
      setStatus("Ese código no es válido o está incompleto.");
    }
  };
  return (
    <section className="screen active">
      <p className="eyebrow">PERFIL</p>
      <h2 className="view-title">Tus datos.</h2>
      <div className="card profile-card">
        <div className="profile-line">
          <span>Usuario</span>
          <strong>{state.profile.name}</strong>
        </div>
        <div className="profile-line">
          <span>Sesiones</span>
          <strong>{state.stats.sessions}</strong>
        </div>
        <div className="profile-line">
          <span>Correctas</span>
          <strong>{state.stats.correctAnswers}</strong>
        </div>
        <div className="profile-line">
          <span>Precisión</span>
          <strong>{accuracy}%</strong>
        </div>
        <div className="profile-line">
          <span>Racha</span>
          <strong>
            {streak} {streak === 1 ? "día" : "días"}
          </strong>
        </div>
      </div>
      <div className="section-head">
        <h3>Meta diaria</h3>
      </div>
      <div className="card settings-card">
        <div className="setting-row">
          <div>
            <strong>Preguntas al día</strong>
            <p>Elige una meta breve y realista.</p>
          </div>
          <div className="goal-options">
            {([5, 10, 20] as const).map((goal) => (
              <button
                key={goal}
                className={`goal-option ${state.settings.dailyGoal === goal ? "active" : ""}`}
                onClick={() => setGoal(goal)}
              >
                {goal}
              </button>
            ))}
          </div>
        </div>
        <div className="setting-row">
          <div>
            <strong>Dificultad</strong>
            <p>{label(state.settings.difficulty)}</p>
          </div>
          <button className="outline-btn" onClick={() => go("practice")}>
            Cambiar
          </button>
        </div>
      </div>
      <div className="section-head">
        <h3>Código de respaldo</h3>
      </div>
      <div className="backup-box">
        <textarea
          className="backup-code"
          maxLength={120000}
          value={backup}
          onChange={(e) => setBackup(e.target.value)}
          placeholder="Genera o pega un código..."
        />
        <div className="action-grid">
          <button className="outline-btn" onClick={generate}>
            Generar
          </button>
          <button className="white-btn" onClick={restoreData}>
            Restaurar
          </button>
        </div>
        <div
          className={`status ${status.includes("correctamente") || status.includes("generado") ? "ok" : status ? "error" : ""}`}
        >
          {status}
        </div>
      </div>
      <div className="section-head">
        <h3>Reiniciar</h3>
      </div>
      <button
        className="danger-btn full-action"
        onClick={() => dialog.current?.showModal()}
      >
        Borrar datos locales
      </button>
      <dialog className="app-dialog" ref={dialog}>
        <div className="dialog-card">
          <div className="dialog-icon">!</div>
          <p className="eyebrow">ACCIÓN PERMANENTE</p>
          <h2>¿Borrar todo?</h2>
          <p>
            Se eliminarán tu progreso, usuario y preferencias de este
            dispositivo.
          </p>
          <div className="dialog-actions">
            <button
              className="outline-btn"
              onClick={() => dialog.current?.close()}
            >
              Cancelar
            </button>
            <button
              className="danger-solid-btn"
              onClick={() => {
                reset();
                dialog.current?.close();
              }}
            >
              Sí, borrar todo
            </button>
          </div>
        </div>
      </dialog>
    </section>
  );
}
