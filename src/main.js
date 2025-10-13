// src/main.js
import App from "./App.js";
import config from "./config/index.js";

(async () => {
  const app = new App(config);
  await app.init();
  app.start();
})();
