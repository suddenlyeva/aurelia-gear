import * as PIXI from 'pixi.js';
import game from '@/system/game';
import config from '@/system/config';

let letterbox = {};

letterbox.create = (texture) => {
  letterbox.top = new PIXI.TilingSprite(texture, 0, config.CANVAS_HEIGHT);
  letterbox.bottom = new PIXI.TilingSprite(texture, 0, config.CANVAS_HEIGHT);
  letterbox.left = new PIXI.TilingSprite(texture, config.CANVAS_WIDTH, 0);
  letterbox.right = new PIXI.TilingSprite(texture, config.CANVAS_WIDTH, 0);

  letterbox.top.interactive = true;
  letterbox.bottom.interactive = true;
  letterbox.left.interactive = true;
  letterbox.right.interactive = true;
};

letterbox.resize = (frameX, frameY) => {
  frameX /= game.stage.scale.x;
  frameY /= game.stage.scale.y;
  let frameW = window.innerWidth / game.stage.scale.x;
  let frameH = window.innerHeight / game.stage.scale.y;

  letterbox.left.width = frameX;
  letterbox.left.height = frameH;
  letterbox.left.x = -frameX;

  letterbox.right.width = frameX;
  letterbox.right.height = frameH;
  letterbox.right.x = config.CANVAS_WIDTH;

  letterbox.top.height = frameY;
  letterbox.top.width = frameW;
  letterbox.top.y = -frameY;

  letterbox.bottom.height = frameY;
  letterbox.bottom.width = frameW;
  letterbox.bottom.y = config.CANVAS_HEIGHT;
};

letterbox.update = () => {
  game.stage.addChild(letterbox.top);
  game.stage.addChild(letterbox.bottom);
  game.stage.addChild(letterbox.left);
  game.stage.addChild(letterbox.right);
};

export default letterbox;
