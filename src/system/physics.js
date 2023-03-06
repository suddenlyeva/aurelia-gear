export default {
  addTo(sprite) {
    sprite.speed = 0;
    sprite.direction = 0;
    sprite.accel = 0;
    sprite.deltaX = 0;
    sprite.deltaY = 0;

    sprite.applyPhysics = (delta) => {
      sprite.speed += sprite.accel * delta;
      if (sprite.maxSpeed !== undefined) {
        sprite.speed = Math.min(sprite.speed, sprite.maxSpeed);
      }
      if (sprite.minSpeed !== undefined) {
        sprite.speed = Math.max(sprite.speed, sprite.minSpeed);
      }
      sprite.x += sprite.speed * Math.cos((sprite.direction * Math.PI) / 180) * delta;
      sprite.y += sprite.speed * Math.sin((sprite.direction * Math.PI) / 180) * delta;
    };
  },
  getAngle(a, b) {
    let distX = b.x - a.x;
    let distY = b.y - a.y;
    let radians = Math.atan2(distY, distX);
    return (radians * 180) / Math.PI;
  },
  getDistance(a, b) {
    let distX = b.x - a.x;
    let distY = b.y - a.y;
    return Math.sqrt(distX ** 2 + distY ** 2);
  },
};
