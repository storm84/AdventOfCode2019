// Dag 7

input = [0];

// prettier-ignore
program = [
  3,8,1001,8,10,8,105,1,0,0,21,38,55,68,93,118,199,280,361,442,99999,3,9,1002,9,2,9,101,5,9,9,102,4,9,9,4,9,99,3,9,101,3,9,9,1002,9,3,9,1001,9,4,9,4,9,99,3,9,101,4,9,9,102,3,9,9,4,9,99,3,9,102,2,9,9,101,4,9,9,102,2,9,9,1001,9,4,9,102,4,9,9,4,9,99,3,9,1002,9,2,9,1001,9,2,9,1002,9,5,9,1001,9,2,9,1002,9,4,9,4,9,99,3,9,101,1,9,9,4,9,3,9,102,2,9,9,4,9,3,9,101,1,9,9,4,9,3,9,101,1,9,9,4,9,3,9,101,1,9,9,4,9,3,9,101,2,9,9,4,9,3,9,1001,9,1,9,4,9,3,9,102,2,9,9,4,9,3,9,1002,9,2,9,4,9,3,9,1002,9,2,9,4,9,99,3,9,1001,9,1,9,4,9,3,9,1001,9,2,9,4,9,3,9,1002,9,2,9,4,9,3,9,101,2,9,9,4,9,3,9,1001,9,2,9,4,9,3,9,1001,9,1,9,4,9,3,9,102,2,9,9,4,9,3,9,1001,9,1,9,4,9,3,9,1002,9,2,9,4,9,3,9,102,2,9,9,4,9,99,3,9,1002,9,2,9,4,9,3,9,1001,9,1,9,4,9,3,9,102,2,9,9,4,9,3,9,102,2,9,9,4,9,3,9,101,1,9,9,4,9,3,9,1001,9,1,9,4,9,3,9,101,2,9,9,4,9,3,9,102,2,9,9,4,9,3,9,101,2,9,9,4,9,3,9,1001,9,2,9,4,9,99,3,9,1001,9,2,9,4,9,3,9,1001,9,2,9,4,9,3,9,102,2,9,9,4,9,3,9,101,1,9,9,4,9,3,9,1002,9,2,9,4,9,3,9,1002,9,2,9,4,9,3,9,1001,9,2,9,4,9,3,9,1001,9,2,9,4,9,3,9,101,1,9,9,4,9,3,9,1001,9,1,9,4,9,99,3,9,102,2,9,9,4,9,3,9,1001,9,1,9,4,9,3,9,1001,9,1,9,4,9,3,9,1002,9,2,9,4,9,3,9,1002,9,2,9,4,9,3,9,1001,9,2,9,4,9,3,9,1002,9,2,9,4,9,3,9,102,2,9,9,4,9,3,9,102,2,9,9,4,9,3,9,101,2,9,9,4,9,99
]

phaseSettings = new Array(5 ** 5)
  .fill(0)
  .map((_, i) =>
    (i + 5 ** 5)
      .toString(5)
      .substr(1)
      .split("")
      .map(x => +x)
  )
  .filter(
    x =>
      x.includes(0) &&
      x.includes(1) &&
      x.includes(2) &&
      x.includes(3) &&
      x.includes(4)
  );

max = 0;
maxPhase = undefined;

for (const phaseSeq of phaseSettings) {
  let inputValue = 0;
  for (const phase of phaseSeq) {
    const res = run(program.slice(), [phase, inputValue]);
    inputValue = res[0];
  }

  if (inputValue > max) {
    max = inputValue;
    maxPhase = phaseSeq;
  }
}
console.log(max, maxPhase);

function run(p, input) {
  const opNumArgs = {
    1: 3,
    2: 3,
    3: 1,
    4: 1,
    5: 2,
    6: 2,
    7: 3,
    8: 3,
  };
  input.reverse();
  const output = [];

  for (let i = 0, counter = 0; p[i] !== 99; counter++) {
    if (counter > 500) {
      console.error(output);
      throw "counter stop";
    }
    op = p[i] % 100;

    a1 = a1Val = p[i + 1];
    a2 = a2Val = p[i + 2];
    a3 = a3Val = p[i + 3];

    a1Mode = Math.floor(p[i] / 100) % 10;
    a2Mode = Math.floor(p[i] / 1000) % 10;
    a3Mode = Math.floor(p[i] / 10000) % 10;

    // 0 = position; 1 = immediate
    if (a1Mode === 0) a1Val = p[a1];
    if (a2Mode === 0) a2Val = p[a2];
    if (a3Mode === 0) a3Val = p[a3];

    i += 1 + opNumArgs[op];

    switch (op) {
      case 1:
        p[a3] = a1Val + a2Val;
        break;
      case 2:
        p[a3] = a1Val * a2Val;
        break;
      case 3:
        p[a1] = input.pop();
        break;
      case 4:
        output.push(a1Val);
        break;
      case 5:
        if (a1Val !== 0) i = a2Val;
        break;
      case 6:
        if (a1Val === 0) i = a2Val;
        break;
      case 7:
        p[a3] = a1Val < a2Val ? 1 : 0;
        break;
      case 8:
        p[a3] = a1Val === a2Val ? 1 : 0;
        break;
      default:
        throw "what?";
    }
  }
  return output;
}
