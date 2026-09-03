import { Icon } from "./Icon";
import type { View } from "../screens/shared";

export function BottomNav({
  view,
  go,
}: {
  view: View;
  go: (view: View) => void;
}) {
  return (
    <nav className="bottom-nav">
      <div className="nav-grid">
        {(
          [
            ["home", "Inicio"],
            ["learn", "Aprender"],
            ["practice", "Practicar"],
            ["profile", "Perfil"],
          ] as [View, string][]
        ).map(([id, text]) => (
          <button
            key={id}
            className={`nav-btn ${view === id ? "active" : ""}`}
            onClick={() => go(id)}
          >
            <Icon
              name={
                id === "home"
                  ? "home"
                  : id === "learn"
                    ? "learn"
                    : id === "practice"
                      ? "practice"
                      : "profile"
              }
            />
            <span>{text}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
