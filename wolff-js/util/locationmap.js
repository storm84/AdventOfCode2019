class LocationMap {
  x = 0;
  y = 0;

  data = [];
  maxSymbolSize = 1;

  minX = 0;
  minY = 0;
  maxX = 0;
  maxY = 0;

  /**
   * @param {string} symbol
   */
  draw(symbol) {
    if (!this.data[this.y]) this.data[this.y] = [];

    this.data[this.y][this.x] = symbol;

    if (symbol.length > this.maxSymbolSize) this.maxSymbolSize = symbol.length;
  }

  get(x = this.x, y = this.y) {
    return this.data[y] && this.data[y][x];
  }

  /**
   * @param {number} x
   * @param {number} y
   */
  moveTo(x, y) {
    this.x = x;
    this.y = y;

    this.minX = Math.min(this.minX, x);
    this.minY = Math.min(this.minY, y);
    this.maxX = Math.max(this.maxX, x);
    this.maxY = Math.max(this.maxY, y);
  }

  /**
   * @param {number} relativeX
   * @param {number} relativeY
   */
  move(relativeX, relativeY) {
    this.moveTo(this.x + relativeX, this.y + relativeY);
  }

  toString() {
    const chars = [];
    for (let y = this.minY; y <= this.maxY; y++) {
      for (let x = this.minX; x <= this.maxX; x++) {
        const symbol = this.data[y][x];
        if (symbol === undefined) chars.push(" ");
        else chars.push(symbol);
      }

      chars.push("\n");
    }

    return chars.join("");
  }
}

exports.LocationMap = LocationMap;
