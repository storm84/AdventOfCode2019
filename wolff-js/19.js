const { IntCode, LocationMap } = require("./util");

setTimeout(async () => {
  console.log(await calc(getInput()));
});

/**
 * @param {string} input
 */
async function calc(input) {
  const map = new LocationMap();

  const programArray = new IntCode({ program: input }).program;

  let tot = 0;
  // part 1:
  // for (let x = 0; x < 50; x++) {
  // part 2:
  for (let x = 976; x < 985; x++) {
    // part 1:
    // for (let y = 0; y < 50; y++) {
    // part 2:
    for (let y = 485; y < 490; y++) {
      const tl = await get(x, y);
      const tr = await get(x + 99, y);
      const br = await get(x + 99, y + 99);
      const bl = await get(x, y + 99);

      // part 1:
      // const result = tl;
      // part 2:
      const result = tl + tr + br + bl;

      tot += result;
      map.draw(result + "", { x, y });
    }
  }

  // part 1:
  // return tot;

  // part 2:
  return map.toString();

  function get(x, y) {
    const program = new IntCode({ program: programArray.slice() });
    program.run();
    program.write(x);
    program.write(y);
    return program.read();
  }
}

function getInput() {
  return `
  109,424,203,1,21102,11,1,0,1105,1,282,21101,0,18,0,1105,1,259,2101,0,1,221,203,1,21102,1,31,0,1105,1,282,21102,1,38,0,1105,1,259,20102,1,23,2,21201,1,0,3,21102,1,1,1,21102,57,1,0,1106,0,303,2102,1,1,222,21002,221,1,3,20101,0,221,2,21101,0,259,1,21101,0,80,0,1105,1,225,21101,44,0,2,21102,91,1,0,1105,1,303,1202,1,1,223,21002,222,1,4,21102,259,1,3,21102,1,225,2,21102,225,1,1,21101,118,0,0,1106,0,225,21002,222,1,3,21101,163,0,2,21101,0,133,0,1106,0,303,21202,1,-1,1,22001,223,1,1,21102,148,1,0,1106,0,259,1202,1,1,223,20101,0,221,4,21001,222,0,3,21102,1,24,2,1001,132,-2,224,1002,224,2,224,1001,224,3,224,1002,132,-1,132,1,224,132,224,21001,224,1,1,21101,195,0,0,105,1,108,20207,1,223,2,21002,23,1,1,21102,-1,1,3,21102,1,214,0,1106,0,303,22101,1,1,1,204,1,99,0,0,0,0,109,5,2101,0,-4,249,22102,1,-3,1,22101,0,-2,2,22101,0,-1,3,21102,250,1,0,1106,0,225,21202,1,1,-4,109,-5,2105,1,0,109,3,22107,0,-2,-1,21202,-1,2,-1,21201,-1,-1,-1,22202,-1,-2,-2,109,-3,2106,0,0,109,3,21207,-2,0,-1,1206,-1,294,104,0,99,22102,1,-2,-2,109,-3,2105,1,0,109,5,22207,-3,-4,-1,1206,-1,346,22201,-4,-3,-4,21202,-3,-1,-1,22201,-4,-1,2,21202,2,-1,-1,22201,-4,-1,1,21202,-2,1,3,21101,0,343,0,1106,0,303,1106,0,415,22207,-2,-3,-1,1206,-1,387,22201,-3,-2,-3,21202,-2,-1,-1,22201,-3,-1,3,21202,3,-1,-1,22201,-3,-1,2,21201,-4,0,1,21101,384,0,0,1105,1,303,1105,1,415,21202,-4,-1,-4,22201,-4,-3,-4,22202,-3,-2,-2,22202,-2,-4,-4,22202,-3,-2,-3,21202,-4,-1,-2,22201,-3,-2,1,21202,1,1,-4,109,-5,2105,1,0

    `;
}
