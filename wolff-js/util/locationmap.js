class LocationMap {
  /**
   * @param {string} asString
   */
  constructor(asString = undefined) {
    if (asString) {
      this.data = asString
        .trim()
        .replace(/(^|\n) +/g, "$1")
        .split("\n")
        .map(x => x.split(""));

      this.maxX = this.data[0].length - 1;
      this.maxY = this.data.length - 1;
    }
  }

  x = 0;
  y = 0;

  /**
   * @type {string[][]}
   */
  data = [];
  maxSymbolSize = 1;

  minX = Infinity;
  minY = Infinity;
  maxX = -Infinity;
  maxY = -Infinity;

  /**
   * @param {string} symbol
   * @param {{x:number; y:number}} pos
   */
  draw(symbol, { x, y } = this) {
    if (!this.data[y]) this.data[y] = [];

    this.data[y][x] = symbol;

    if (symbol.length > this.maxSymbolSize) this.maxSymbolSize = symbol.length;

    this.minX = Math.min(this.minX, x);
    this.minY = Math.min(this.minY, y);
    this.maxX = Math.max(this.maxX, x);
    this.maxY = Math.max(this.maxY, y);
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

  /**
   * @param {string} symbol
   */
  find(symbol) {
    for (let y = this.minY; y <= this.maxY; y++) {
      for (let x = this.minX; x <= this.maxX; x++) {
        const cellSymbol = this.data[y][x];
        if (symbol === cellSymbol) {
          return { x, y };
        }
      }
    }

    return undefined;
  }
}

exports.LocationMap = LocationMap;
