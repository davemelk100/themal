import ReactDOM from "react-dom/client";
import App from "./App";
import "./globals.css";

// Register service worker (deferred to avoid blocking critical path)
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch(() => {});
  });
}

ReactDOM.createRoot(document.getElementById("root")!).render(<App />);
