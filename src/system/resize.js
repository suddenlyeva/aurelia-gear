import game from '@/system/game';
import config from '@/system/config';
import letterbox from '@/system/letterbox';

// Rescales the screen up to a certain threshold
let sceneResize = (stretchThreshold = 0) => {
  // stretchThreshold - how much scene dimensions can deviate from the desired aspect ratio
  // 0.2 means the scene can be stretched by a maximum of 20% vertically or horizontally
  let targetAspectRatio = config.CANVAS_WIDTH / config.CANVAS_HEIGHT,
    currentAspectRatio = window.innerWidth / window.innerHeight;

  if (targetAspectRatio < currentAspectRatio) {
    // Wider screen than normal
    game.stage.scale.y = window.innerHeight / config.CANVAS_HEIGHT; // Always stretch height
    game.stage.scale.x = Math.min(
      game.stage.scale.y * (1 + stretchThreshold), // Use height ratio if past Stretch Threshold
      window.innerWidth / config.CANVAS_WIDTH,
    ); // Else stretch the width
  } else {
    // Taller Screen than normal
    game.stage.scale.x = window.innerWidth / config.CANVAS_WIDTH;
    game.stage.scale.y = Math.min(
      game.stage.scale.x * (1 + stretchThreshold), // Same as vertical, but inverted x and y
      window.innerHeight / config.CANVAS_HEIGHT,
    );
  }
  game.renderer.resize(window.innerWidth, window.innerHeight);

  game.stage.x = (window.innerWidth - config.CANVAS_WIDTH * game.stage.scale.x) / 2;
  game.stage.y = (window.innerHeight - config.CANVAS_HEIGHT * game.stage.scale.y) / 2;
  letterbox.resize(game.stage.x, game.stage.y);
};

// window.addEventListener('resize', () => {
//   sceneResize()
// }, true);

export default sceneResize;
