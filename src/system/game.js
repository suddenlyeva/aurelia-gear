import * as PIXI from 'pixi.js';

const game = new PIXI.Application();
game.renderer.backgroundColor = 0xffffff;
game.stage.update = () => {};
game.view.addEventListener('contextmenu', (event) => event.preventDefault());
document.body.appendChild(game.view);

export default game;
