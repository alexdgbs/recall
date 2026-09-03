import { createRoot } from "react-dom/client";
import App from "./App";
import { RecallProvider } from "./state";

const root = document.getElementById("root");
if (!root) throw new Error("No se encontró el punto de montaje de Recall.");
createRoot(root).render(
  <RecallProvider>
    <App />
  </RecallProvider>,
);
