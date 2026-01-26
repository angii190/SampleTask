// src/main.js
import App from "./App.js";
import config from "./config/index.js";

(async () => {
  const app = new App(config);
  await app.init();
  app.start();

  // Expose app instance globally so HTML buttons can access its methods
  window.app = app;
})();

