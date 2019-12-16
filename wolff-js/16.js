// hints for part 2:
// - the first 7 digits of the input is close toward the end of the resulting digit string
// - that means that we're actually only interested in the bottom right square
// - in that square, there's only a triangle of ones
// - the needed sums can be calculated cumulatively

setTimeout(async () => {
  console.log(await calc(getInput()));
});

async function calc(input) {
  input = input
    .trim()
    .split("")
    .map(x => +x);

  let pattern = [0, 1, 0, -1];

  // // part 1:
  // for (let i = 0; i < 100; i++) {
  //   console.log(i, ":", input.join(""));
  //   input = getNextPhase1(input);
  // }
  // return input;

  // part 2:
  input = input
    .join("")
    .repeat(10000)
    .substr(input.slice(0, 7).join(""))
    .split("")
    .map(x => +x);
  for (let i = 0; i < 100; i++) {
    input = getNextPhase2(input);
  }

  // console.log(input.join(""));
  console.log(input.join("").substr(0, 8));

  return "";

  /**
   * @param {number[]} arr
   */
  function getNextPhase1(arr) {
    let next = [];
    for (let i = 0; i < arr.length; i++) {
      let nextI = 0;
      const log = [];
      for (let j = 0; j < arr.length; j++) {
        const fromArr = arr[j];
        const fromPattern = pattern[Math.floor((j + 1) / (i + 1)) % 4];
        log.push(fromArr + "*" + fromPattern);
        nextI += fromArr * fromPattern;
      }
      nextI = Math.abs(nextI % 10);
      // console.log(log.join(" + "), "=", nextI);
      next.push(nextI);
    }

    return next;
  }

  /**
   * @param {number[]} arr
   */
  function getNextPhase2(arr) {
    let cumSum = 0;
    const result = [];
    for (let i = arr.length - 1; i >= 0; i--) {
      cumSum += arr[i];
      result[i] = cumSum % 10;
    }
    return result;
  }
}

function getInput() {
  // return `02935109699940807407585447034323`;
  return `
  59731816011884092945351508129673371014862103878684944826017645844741545300230138932831133873839512146713127268759974246245502075014905070039532876129205215417851534077861438833829150700128859789264910166202535524896960863759734991379392200570075995540154404564759515739872348617947354357737896622983395480822393561314056840468397927687908512181180566958267371679145705350771757054349846320639601111983284494477902984330803048219450650034662420834263425046219982608792077128250835515865313986075722145069152768623913680721193045475863879571787112159970381407518157406924221437152946039000886837781446203456224983154446561285113664381711600293030463013
  `;
}
