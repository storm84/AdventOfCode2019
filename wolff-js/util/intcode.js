class Stream {
  /** @type {boolean} */
  debug;
  closed = false;
  /** @type {number[]} */
  values = [];
  _lastIndex = -1;

  /** @type {Promise<number>} */
  _readPromise;
  _readPromiseResolver;
  _readPromiseRejecter;

  _closePromiseResolver;
  closePromise = new Promise(resolve => (this._closePromiseResolver = resolve));

  prefix = "";
  constructor(prefix, { debug = false } = {}) {
    this.prefix = prefix;
    this.debug = debug;
  }

  _log(...args) {
    if (this.debug) {
      console.log(this.prefix, ...args);
    }
  }

  hasNext() {
    return this._lastIndex + 1 < this.values.length;
  }

  async read() {
    this._log("read", {
      lastIndex: this._lastIndex,
      hasPromise: !!this._readPromise,
      hasVal: this._lastIndex + 1 < this.values.length,
    });
    if (!this._readPromise) {
      if (this._lastIndex + 1 < this.values.length) {
        return this.values[++this._lastIndex];
      } else if (this.closed) {
        throw this.prefix + " Stream already closed";
      }

      this._readPromise = new Promise((resolve, reject) => {
        this._readPromiseResolver = resolve;
        this._readPromiseRejecter = reject;
      });

      this._readPromise.then(
        () => {
          this._log("promise resolved");
          this._clearReadPromise();
        },
        () => this._clearReadPromise()
      );
    }

    return this._readPromise;
  }

  _clearReadPromise() {
    this._readPromise = this._readPromiseResolver = this._readPromiseRejecter = undefined;
  }

  /**
   * @param {number} value
   */
  write(value) {
    this._log("write", {
      value,
      writeNow: !!this._readPromiseResolver,
    });
    this.values.push(value);

    if (this._readPromiseResolver) {
      this._readPromiseResolver(this.values[++this._lastIndex]);
      this._clearReadPromise();
    }
  }

  close() {
    this.closed = true;
    if (this._readPromiseRejecter) {
      this._readPromiseRejecter(this.prefix + "Stream closed!");
    }

    this._closePromiseResolver(this.peekLastWrittenValue());
  }

  peekLastWrittenValue() {
    return this.values[this.values.length - 1];
  }

  waitForClose() {
    return this.closePromise;
  }
}

/**
 * Run an int code computer
 * @param {string} prefix
 * @param {number[]} p The program to run
 * @param {Stream} input
 * @param {Stream} output
 */
async function run(prefix, p, input, output) {
  const MODE_POSITION = 0;
  const MODE_IMMEDIATE = 1;
  const MODE_RELATIVE = 2;

  const OP_HALT = 99;
  const OP_ADD = 1;
  const OP_MULT = 2;
  const OP_READ = 3;
  const OP_WRITE = 4;
  const OP_JUMP_IF_TRUE = 5;
  const OP_JUMP_IF_FALSE = 6;
  const OP_LESS_THAN = 7;
  const OP_EQUALS = 8;
  const OP_ADJUST_RELATIVE_BASE = 9;

  const opNumArgs = {
    [OP_ADD]: 3,
    [OP_MULT]: 3,
    [OP_READ]: 1,
    [OP_WRITE]: 1,
    [OP_JUMP_IF_TRUE]: 2,
    [OP_JUMP_IF_FALSE]: 2,
    [OP_LESS_THAN]: 3,
    [OP_EQUALS]: 3,
    [OP_ADJUST_RELATIVE_BASE]: 1,
  };

  let relativeBase = 0;

  for (let i = 0, counter = 0; p[i] !== OP_HALT; counter++) {
    if (counter > 5000000) {
      console.error(output);
      throw prefix + "counter stop";
    }
    const op = p[i] % 100;

    const numArgs = opNumArgs[op];

    const a1Mode = Math.floor(p[i] / 100) % 10;
    const a2Mode = Math.floor(p[i] / 1000) % 10;
    const a3Mode = Math.floor(p[i] / 10000) % 10;

    const { val: a1Val, pos: a1Pos } = getValue(1, a1Mode);
    const { val: a2Val, pos: a2Pos } = getValue(2, a2Mode);
    const { val: a3Val, pos: a3Pos } = getValue(3, a3Mode);

    i += 1 + numArgs;

    function getValue(argIndex, mode) {
      if (numArgs < argIndex) {
        return {};
      }

      const arg = p[i + argIndex];

      if (mode === MODE_IMMEDIATE) {
        return { val: arg, pos: i + argIndex };
      }

      const position =
        mode === MODE_POSITION
          ? arg
          : mode === MODE_RELATIVE
          ? arg + relativeBase
          : (() => {
              throw prefix + "unexpected mode " + mode;
            })();

      if (position < 0) {
        throw new Error(prefix + "out of bounds!");
      }

      let value = p[position];
      if (value === undefined) value = 0;

      if (!Number.isSafeInteger(value)) {
        throw prefix + "not safe int " + value;
      }

      return { val: value, pos: position };
    }

    switch (op) {
      case OP_ADD: // 1
        p[a3Pos] = a1Val + a2Val;
        break;
      case OP_MULT: // 2
        p[a3Pos] = a1Val * a2Val;
        break;
      case OP_READ: // 3
        const result = await input.read();
        // console.log(prefix + "read", result);
        p[a1Pos] = result;
        break;
      case OP_WRITE: // 4
        // console.log(prefix + "write", a1Val);
        output.write(a1Val);
        break;
      case OP_JUMP_IF_TRUE: // 5
        if (a1Val !== 0) i = a2Val;
        break;
      case OP_JUMP_IF_FALSE: // 6
        if (a1Val === 0) i = a2Val;
        break;
      case OP_LESS_THAN: // 7
        p[a3Pos] = a1Val < a2Val ? 1 : 0;
        break;
      case OP_EQUALS: // 8
        p[a3Pos] = a1Val === a2Val ? 1 : 0;
        break;
      case OP_ADJUST_RELATIVE_BASE: // 9
        relativeBase += a1Val;
        break;
      default:
        output.close();
        throw prefix + "Unknown opcode! " + op;
    }
  }

  output.close();
}

exports.Stream = Stream;
exports.run = run;
