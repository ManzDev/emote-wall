const wall = document.querySelector(".wall");

const BOUNCE_FACTOR = 0.90;

export class Emote {
  img = new Image();
  pos = { x: 0, y: 0 };
  live = true;
  speed = { x: 3, y: 2 };
  acc = { y: 0.05 };
  alpha = 0.995;
  timer = null;

  constructor(id, x, y) {
    const url = `https://static-cdn.jtvnw.net/emoticons/v2/${id}/default/dark/3.0`;
    this.img.classList.add("emote");
    this.img.src = url;
    this.speed.x = -5 + Math.floor(Math.random() * 5);
    this.speed.y = -5 + Math.floor(Math.random() * 5);
    this.update(x, y);
  }

  simulate() {
    this.speed.y += this.acc.y;

    if (this.pos.x + this.img.offsetWidth > innerWidth || this.pos.x < 0) {
      this.speed.x = -this.speed.x * BOUNCE_FACTOR;
      this.speed.y *= BOUNCE_FACTOR;
    }

    if (this.pos.y + this.img.offsetHeight > innerHeight || this.pos.y < 0) {
      this.speed.y = -this.speed.y * BOUNCE_FACTOR;
      this.speed.x *= BOUNCE_FACTOR;
    }

    this.speed.x *= this.alpha;
    this.speed.y *= this.alpha;

    this.pos.x += this.speed.x;
    this.pos.y += this.speed.y;

    this.render();

    this.timer = requestAnimationFrame(this.simulate.bind(this));

    if (this.isStop()) {
      // cancelAnimationFrame(this.timer);
      this.live = false;
    }
  }

  isStop() {
    return (this.speed.x ** 2) + (this.speed.y ** 2) < 5 &&
      this.pos.y < this.img.offsetHeight + 15;
  }

  update(x, y) {
    this.pos.x = x;
    this.pos.y = y;
  }

  render() {
    this.img.style.setProperty("--x", `${this.pos.x}px`);
    this.img.style.setProperty("--y", `${this.pos.y}px`);
    // this.img.style = `transform: translate(${this.pos.x}px, ${this.pos.y}px)`;
  }

  clear() {
    cancelAnimationFrame(this.timer);
    this.live = false;
    this.img.remove();
  }

  addToWall() {
    this.img.style.setProperty("transform", "translate(var(--x), var(--y))");
    wall.append(this.img);
    this.simulate();
    setTimeout(() => this.fadeOut(), 4000);
    setTimeout(() => this.clear(), 5000);
  }

  fadeOut() {
    const keyframes = [{ opacity: 1 }, { opacity: 0 }];
    this.img.animate(keyframes, { duration: 1000 });
  }
}
