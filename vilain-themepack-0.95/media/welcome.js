const vscode = acquireVsCodeApi();
const meta = { version: "2.1.0" };
const verEl = document.getElementById("ver");
if (verEl) verEl.textContent = meta.version;

document.addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;
  const label = btn.getAttribute("data-label") || btn.textContent.trim();
  const theme = btn.getAttribute("data-theme");
  if (theme) {
    vscode.postMessage({ type: "setTheme", id: theme, label });
    return;
  }
  const icon = btn.getAttribute("data-icon");
  if (icon) {
    vscode.postMessage({ type: "setIconTheme", id: icon, label });
    return;
  }
  const href = btn.getAttribute("data-open");
  if (href) {
    vscode.postMessage({ type: "openUrl", href });
  }
});
console.log("Bienvenue VILAIN:", JSON.stringify(meta));
