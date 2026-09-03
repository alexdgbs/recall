import { useState } from "react";
import { concepts } from "../data";

export function Learn() {
  const [term, setTerm] = useState("");
  const visible = concepts.filter((c) =>
    (c.name + c.group + c.summary).toLowerCase().includes(term.toLowerCase()),
  );
  return (
    <section className="screen active">
      <p className="eyebrow">APRENDER</p>
      <h2 className="view-title">Qué hace cada cosa.</h2>
      <p className="muted view-intro">
        Busca un concepto y revisa qué devuelve, si modifica el original y un
        ejemplo corto.
      </p>
      <input
        className="search"
        type="search"
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        placeholder="Ej. slice, map, while..."
      />
      <div className="learn-list">
        {visible.map((c) => (
          <article className="card learn-card" key={c.name}>
            <div className="learn-card-head">
              <h3>{c.name}</h3>
              <span className="tag">{c.group}</span>
            </div>
            <p>{c.summary}</p>
            <div className="tags">
              <span className="tag">{c.returns}</span>
              <span className="tag">{c.mutates}</span>
            </div>
            <pre className="code code-example">{c.example}</pre>
          </article>
        ))}
      </div>
      {!visible.length && (
        <div className="card empty show">No encontré ese concepto.</div>
      )}
    </section>
  );
}
