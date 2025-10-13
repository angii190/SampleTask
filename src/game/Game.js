import { Container } from "pixi.js";

export default class Game extends Container {
  constructor(config) {
    super();

    this._config = config;
  }
}