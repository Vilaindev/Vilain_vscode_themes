const vscode = require("vscode");

async function showWelcome(context) {
  try {
    const panel = vscode.window.createWebviewPanel(
      "vilainWelcome",
      "VILAIN - Bienvenue",
      vscode.ViewColumn.Active,
      {
        enableScripts: true,
        localResourceRoots: [vscode.Uri.joinPath(context.extensionUri, "media")]
      }
    );

    const webview = panel.webview;
    const media = (p) =>
      webview.asWebviewUri(vscode.Uri.joinPath(context.extensionUri, "media", p));

    const csp = [
      "default-src 'none'",
      `img-src ${webview.cspSource} https:`,
      `style-src ${webview.cspSource} 'unsafe-inline'`,
      `script-src ${webview.cspSource}`
    ].join("; ");

    const profile = {
      name: "VILAIN",
      role: "Créateur de VilainThemes",
      headline: "Merci d'utiliser mon thème !",
      message: "Tu peux checker mes autres projets ou rejoindre mon Discord :",
      avatar: media("avatar.png"),
      github: "https://github.com/Vilaindev",
      discord: "https://discord.gg/vilaindev",
      tip:
        'Astuce : tu peux rouvrir ce panneau via "VilainThemes: Ouvrir le message de bienvenue".'
    };
    const themes = [
      {
        id: "vilainthemes-core",
        label: "VilainThemes Core",
        accent: "#7f5dff",
        accentSoft: "#4b2fb8"
      },
      {
        id: "vilainthemes-hyper",
        label: "VilainThemes Hyper",
        accent: "#ff6fda",
        accentSoft: "#3b9dff"
      },
      {
        id: "vilainthemes-stealth",
        label: "VilainThemes Stealth",
        accent: "#5be0c9",
        accentSoft: "#4075ff"
      },
      {
        id: "vilainthemes-aurora",
        label: "VilainThemes Aurora",
        accent: "#37e5ff",
        accentSoft: "#0c7cb6"
      },
      {
        id: "vilainthemes-pastel",
        label: "VilainThemes Pastel",
        accent: "#ff89ea",
        accentSoft: "#d36bff"
      },
      {
        id: "vilainthemes-light",
        label: "VilainThemes Light",
        accent: "#ffb347",
        accentSoft: "#ff7e3b"
      },
      {
        id: "vilainthemes-light-lila",
        label: "VilainThemes Light Lila",
        accent: "#9ea8ff",
        accentSoft: "#6f7bff"
      }
    ];
    const iconTheme = {
      id: "vilainthemes-icons",
      label: "Pack Icônes VilainThemes Violet",
      accent: "#c28bff",
      accentSoft: "#7b4bff"
    };
    const themeButtons = themes
      .map(
        ({ id, label, accent, accentSoft }) =>
          `<button class="theme" data-theme="${id}" data-label="${label}" style="--accent:${accent};--accent-soft:${accentSoft};">${label}</button>`
      )
      .join("");

    panel.webview.html = `<!doctype html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="Content-Security-Policy" content="${csp}">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="stylesheet" href="${media("welcome.css")}">
  <title>Bienvenue - VILAIN</title>
</head>
<body>
  <div class="backdrop" style="background-image:url('${media("background.png")}')"></div>
  <main class="card">
    <div class="avatar">
      <img src="${profile.avatar}" alt="Avatar GitHub de ${profile.name}">
    </div>
    <p class="hero-name">${profile.name}</p>
    <p class="eyebrow">${profile.role}</p>
    <h1>${profile.headline}</h1>
    <p class="muted">${profile.message}</p>
    <span class="version-pill">v<span id="ver"></span></span>
    <div class="cta">
      <button class="pill" data-open="${profile.github}" style="--pill-accent:#5ab0ff;--pill-accent-soft:#113c63;">Mon GitHub</button>
      <button class="pill" data-open="${profile.discord}" style="--pill-accent:#c18bff;--pill-accent-soft:#452365;">Mon Discord</button>
    </div>

    <section class="themes">
      <h2>Choisir un thème VilainThemes</h2>
      <div class="grid">
        ${themeButtons}
        <button class="theme icon-pill" data-icon="${iconTheme.id}" data-label="${iconTheme.label}" style="--accent:${iconTheme.accent};--accent-soft:${iconTheme.accentSoft};">
          ${iconTheme.label}
          <span class="hint">Icônes VS Code</span>
        </button>
      </div>
    </section>

    <p class="tip">${profile.tip}</p>
  </main>
  <script src="${media("welcome.js")}"></script>
</body>
</html>`;

    panel.webview.onDidReceiveMessage(async (msg) => {
      try {
        if (!msg || typeof msg !== "object") return;
        if (msg.type === "setTheme" && typeof msg.id === "string") {
          await applyTheme(msg.id, msg.label);
          return;
        }
        if (msg.type === "setIconTheme" && typeof msg.id === "string") {
          await applyIconTheme(msg.id, msg.label);
          return;
        }
        if (msg.type === "openUrl" && typeof msg.href === "string") {
          await vscode.env.openExternal(vscode.Uri.parse(msg.href));
          return;
        }
      } catch (err) {
        const msgText = err && err.message ? err.message : String(err);
        vscode.window.showErrorMessage("VILAIN (handler): " + msgText);
        console.error(err);
      }
    });
  } catch (err) {
    const msgText = err && err.message ? err.message : String(err);
    vscode.window.showErrorMessage("VILAIN: " + msgText);
    console.error(err);
  }
}

function activate(context) {
  const run = () => showWelcome(context);
  const cmd = vscode.commands.registerCommand("vilain.openWelcome", run);
  context.subscriptions.push(cmd);

  run().catch((err) => {
    const msgText = err && err.message ? err.message : String(err);
    console.error("VILAIN (auto):", msgText);
  });
}

async function applyTheme(id, labelText) {
  const themeId = findThemeIdentifier(id);
  if (!themeId) {
    vscode.window.showWarningMessage(
      `Impossible de trouver le thème "${labelText || id}". Installe le pack puis réessaie.`
    );
    return;
  }
  await vscode.workspace
    .getConfiguration("workbench")
    .update("colorTheme", themeId, vscode.ConfigurationTarget.Global);
  vscode.window.setStatusBarMessage(
    `Thème "${labelText || themeId}" activé`,
    2200
  );
}

function findThemeIdentifier(label) {
  for (const ext of vscode.extensions.all) {
    const themes = ext.packageJSON?.contributes?.themes;
    if (!Array.isArray(themes)) continue;
    const found = themes.find((theme) => {
      const themeId = theme.id || theme.label;
      return themeId === label || theme.label === label;
    });
    if (found) return found.id || found.label;
  }
  return null;
}

async function applyIconTheme(id, labelText) {
  const iconId = findIconThemeIdentifier(id);
  if (!iconId) {
    vscode.window.showWarningMessage(
      `Impossible de trouver le pack d'icônes "${labelText || id}".`
    );
    return;
  }
  await vscode.workspace
    .getConfiguration("workbench")
    .update("iconTheme", iconId, vscode.ConfigurationTarget.Global);
  vscode.window.setStatusBarMessage(
    `Icônes "${labelText || iconId}" activées`,
    2200
  );
}

function findIconThemeIdentifier(label) {
  for (const ext of vscode.extensions.all) {
    const icons = ext.packageJSON?.contributes?.iconThemes;
    if (!Array.isArray(icons)) continue;
    const found = icons.find((icon) => {
      const iconId = icon.id || icon.label;
      return iconId === label || icon.label === label;
    });
    if (found) return found.id || found.label;
  }
  return null;
}

function deactivate() {}

module.exports = { activate, deactivate };
