export function Point(x, y) {
  this.x = x;
  this.y = y;
}

export function Size(w, h) {
  this.width = w;
  this.height = h;
}

export function Line(x1, y1, x2, y2) {
  this.start = new Point(x1, y1);
  this.end = new Point(x2, y2);
}

export function Range(min, max) {
  this.min = min;
  this.max = max;
}
