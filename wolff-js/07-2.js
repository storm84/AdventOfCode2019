// Dag 7

input = [0];

// prettier-ignore
program = [
  3,8,1001,8,10,8,105,1,0,0,21,38,55,68,93,118,199,280,361,442,99999,3,9,1002,9,2,9,101,5,9,9,102,4,9,9,4,9,99,3,9,101,3,9,9,1002,9,3,9,1001,9,4,9,4,9,99,3,9,101,4,9,9,102,3,9,9,4,9,99,3,9,102,2,9,9,101,4,9,9,102,2,9,9,1001,9,4,9,102,4,9,9,4,9,99,3,9,1002,9,2,9,1001,9,2,9,1002,9,5,9,1001,9,2,9,1002,9,4,9,4,9,99,3,9,101,1,9,9,4,9,3,9,102,2,9,9,4,9,3,9,101,1,9,9,4,9,3,9,101,1,9,9,4,9,3,9,101,1,9,9,4,9,3,9,101,2,9,9,4,9,3,9,1001,9,1,9,4,9,3,9,102,2,9,9,4,9,3,9,1002,9,2,9,4,9,3,9,1002,9,2,9,4,9,99,3,9,1001,9,1,9,4,9,3,9,1001,9,2,9,4,9,3,9,1002,9,2,9,4,9,3,9,101,2,9,9,4,9,3,9,1001,9,2,9,4,9,3,9,1001,9,1,9,4,9,3,9,102,2,9,9,4,9,3,9,1001,9,1,9,4,9,3,9,1002,9,2,9,4,9,3,9,102,2,9,9,4,9,99,3,9,1002,9,2,9,4,9,3,9,1001,9,1,9,4,9,3,9,102,2,9,9,4,9,3,9,102,2,9,9,4,9,3,9,101,1,9,9,4,9,3,9,1001,9,1,9,4,9,3,9,101,2,9,9,4,9,3,9,102,2,9,9,4,9,3,9,101,2,9,9,4,9,3,9,1001,9,2,9,4,9,99,3,9,1001,9,2,9,4,9,3,9,1001,9,2,9,4,9,3,9,102,2,9,9,4,9,3,9,101,1,9,9,4,9,3,9,1002,9,2,9,4,9,3,9,1002,9,2,9,4,9,3,9,1001,9,2,9,4,9,3,9,1001,9,2,9,4,9,3,9,101,1,9,9,4,9,3,9,1001,9,1,9,4,9,99,3,9,102,2,9,9,4,9,3,9,1001,9,1,9,4,9,3,9,1001,9,1,9,4,9,3,9,1002,9,2,9,4,9,3,9,1002,9,2,9,4,9,3,9,1001,9,2,9,4,9,3,9,1002,9,2,9,4,9,3,9,102,2,9,9,4,9,3,9,102,2,9,9,4,9,3,9,101,2,9,9,4,9,99
]

setTimeout(tryAllPhaseCombinations);
async function tryAllPhaseCombinations() {
  const phaseSettings = new Array(5 ** 5)
    .fill(0)
    .map((_, i) =>
      (i + 5 ** 5)
        .toString(5)
        .substr(1)
        .split("")
        .map(x => +x + 5)
    )
    .filter(
      x =>
        x.includes(5) &&
        x.includes(6) &&
        x.includes(7) &&
        x.includes(8) &&
        x.includes(9)
    );

  max = 0;
  maxPhase = undefined;

  for (const phaseSeq of phaseSettings) {
    const streams = phaseSeq.map((phase, i) => {
      const stream = new Stream(`[${i}] `);
      stream.write(phase);
      return stream;
    });

    streams[0].write(0);
    const p0 = run("[p0]", program.slice(), streams[0], streams[1]);
    const p1 = run("[p1]", program.slice(), streams[1], streams[2]);
    const p2 = run("[p2]", program.slice(), streams[2], streams[3]);
    const p3 = run("[p3]", program.slice(), streams[3], streams[4]);
    const p4 = run("[p4]", program.slice(), streams[4], streams[0]);

    try {
      await Promise.all([p0, p1, p2, p3, p4]);
    } catch (e) {
      console.error("Error when running program");
      console.error(e);
      return;
    }

    const value = await streams[0].waitForClose();

    if (value > max) {
      max = value;
      maxPhase = phaseSeq;
    }
    // break;
  }
  console.log(max, maxPhase);
}

class Stream {
  closed = false;
  /** @type {number[]} */
  values = [];
  lastIndex = -1;

  /** @type {Promise<number>} */
  readPromise;
  readPromiseResolver;
  readPromiseRejecter;

  closePromiseResolver;
  closePromise = new Promise(resolve => (this.closePromiseResolver = resolve));

  prefix = "";
  constructor(prefix) {
    this.prefix = prefix;
  }

  async read() {
    if (!this.readPromise) {
      if (this.lastIndex + 1 < this.values.length) {
        return this.values[++this.lastIndex];
      } else if (this.closed) {
        throw this.prefix + "Stream already closed";
      }

      this.readPromise = new Promise((resolve, reject) => {
        this.readPromiseResolver = resolve;
        this.readPromiseRejecter = reject;
      });

      this.readPromise.then(
        () =>
          (this.readPromise = this.readPromiseResolver = this.readPromiseRejecter = undefined),
        () =>
          (this.readPromise = this.readPromiseResolver = this.readPromiseRejecter = undefined)
      );
    }

    return this.readPromise;
  }

  /**
   * @param {number} value
   */
  write(value) {
    this.values.push(value);

    if (this.readPromiseResolver) {
      this.readPromiseResolver(this.values[++this.lastIndex]);
    }
  }

  close() {
    this.closed = true;
    if (this.readPromiseRejecter) {
      // console.log(this.prefix + "Stream closed! All values:", this.values);
      this.readPromiseRejecter(this.prefix + "Stream closed!");
    }

    this.closePromiseResolver(this.peekLastWrittenValue());
  }

  peekLastWrittenValue() {
    return this.values[this.values.length - 1];
  }

  waitForClose() {
    return this.closePromise;
  }
}

/**
 * @param {string} prefix
 * @param {number[]} p
 * @param {Stream} input
 * @param {Stream} output
 */
async function run(prefix, p, input, output) {
  const MODE_POSITION = 0;
  const MODE_IMMEDIATE = 1;
  const OP_HALT = 99;
  const OP_ADD = 1;
  const OP_MULT = 2;
  const OP_READ = 3;
  const OP_WRITE = 4;
  const OP_JUMP_IF_TRUE = 5;
  const OP_JUMP_IF_FALSE = 6;
  const OP_LESS_THAN = 7;
  const OP_EQUALS = 8;

  const opNumArgs = {
    [OP_ADD]: 3,
    [OP_MULT]: 3,
    [OP_READ]: 1,
    [OP_WRITE]: 1,
    [OP_JUMP_IF_TRUE]: 2,
    [OP_JUMP_IF_FALSE]: 2,
    [OP_LESS_THAN]: 3,
    [OP_EQUALS]: 3,
  };

  for (let i = 0, counter = 0; p[i] !== OP_HALT; counter++) {
    if (counter > 500) {
      console.error(output);
      throw prefix + "counter stop";
    }
    const op = p[i] % 100;

    const a1 = p[i + 1];
    let a1Val = a1;

    const a2 = p[i + 2];
    let a2Val = a2;

    const a3 = p[i + 3];
    let a3Val = a3;

    const a1Mode = Math.floor(p[i] / 100) % 10;
    const a2Mode = Math.floor(p[i] / 1000) % 10;
    const a3Mode = Math.floor(p[i] / 10000) % 10;

    if (a1Mode === MODE_POSITION) a1Val = p[a1];
    if (a2Mode === MODE_POSITION) a2Val = p[a2];
    if (a3Mode === MODE_POSITION) a3Val = p[a3];

    const numArgs = opNumArgs[op];

    if (numArgs >= 1) assertNumber(a1, a1Val);
    if (numArgs >= 2) assertNumber(a2, a2Val);
    if (numArgs >= 3) assertNumber(a3, a3Val);

    i += 1 + numArgs;

    function assertNumber(val, number) {
      if (typeof number !== "number") {
        console.error({ i, numArgs, number, op, val, a1, a2, a3, p });
        throw new Error("not a number!");
      }
    }

    switch (op) {
      case OP_ADD:
        p[a3] = a1Val + a2Val;
        break;
      case OP_MULT:
        p[a3] = a1Val * a2Val;
        break;
      case OP_READ:
        const result = await input.read();
        // console.log(prefix + "read", result);
        p[a1] = result;
        break;
      case OP_WRITE:
        // console.log(prefix + "write", a1Val);
        output.write(a1Val);
        break;
      case OP_JUMP_IF_TRUE:
        if (a1Val !== 0) i = a2Val;
        break;
      case OP_JUMP_IF_FALSE:
        if (a1Val === 0) i = a2Val;
        break;
      case OP_LESS_THAN:
        p[a3] = a1Val < a2Val ? 1 : 0;
        break;
      case OP_EQUALS:
        p[a3] = a1Val === a2Val ? 1 : 0;
        break;
      default:
        output.close();
        throw prefix + "Unknown opcode! " + op;
    }
  }

  output.close();
}
