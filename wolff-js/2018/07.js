console.log(calc(getInput()));

function calc(input) {
  const byParent = {};
  const byChild = {};
  input
    .trim()
    .split("\n")
    .map(x => /Step (.) must be finished before step (.) can begin/.exec(x))
    .map(([_match, before, after]) => {
      if (!byParent[before]) byParent[before] = new Set();
      if (!byParent[after]) byParent[after] = new Set();
      if (!byChild[before]) byChild[before] = new Set();
      if (!byChild[after]) byChild[after] = new Set();

      byParent[before].add(after);
      byChild[after].add(before);
    });

  const childrenWithoutParents = Object.entries(byChild)
    .filter(([step, parents]) => parents.size === 0)
    .map(([step, parents]) => step);

  // part 1
  {
    // const result = [];
    // while (childrenWithoutParents.length) {
    //   childrenWithoutParents.sort();
    //   const step = childrenWithoutParents.shift();
    //   result.push(step);
    //   const newChildren = byParent[step];
    //   for (const child of newChildren) {
    //     byChild[child].delete(step);
    //     if (byChild[child].size === 0) {
    //       childrenWithoutParents.push(child);
    //     }
    //   }
    // }
    // return result.join("");
  }

  // part 2
  {
    const numWorkers = 5;
    const extraOffset = 60;

    const completion = [];

    const workers = new Array(numWorkers).fill(".");
    const offset = extraOffset + 1 - "A".charCodeAt(0);
    const endTimeByStep = { ".": Infinity };
    // -
    let counter = 0;
    let stopAt = 1;
    for (; counter < stopAt; counter++) {
      workers.sort((a, b) => endTimeByStep[a] - endTimeByStep[b]);
      workers.forEach((worker, i) => {
        if (worker !== "." && endTimeByStep[worker] === counter) {
          const step = worker;
          const newChildren = byParent[step];
          for (const child of newChildren) {
            byChild[child].delete(step);
            if (byChild[child].size === 0) {
              childrenWithoutParents.push(child);
            }
          }

          worker = workers[i] = ".";
        }

        if (worker === "." && childrenWithoutParents.length) {
          childrenWithoutParents.sort();
          const step = childrenWithoutParents.shift();
          completion.push(step);
          const endTime = counter + step.charCodeAt(0) + offset;
          endTimeByStep[step] = endTime;
          worker = workers[i] = step;
          stopAt = Math.max(stopAt, endTime + 1);
        }
      });

      console.log(counter, workers);
    }

    return { completion, counter, endTimeByStep, result: counter - 1 };
  }
}

function getInput() {
  //   return `
  // Step C must be finished before step A can begin.
  // Step C must be finished before step F can begin.
  // Step A must be finished before step B can begin.
  // Step A must be finished before step D can begin.
  // Step B must be finished before step E can begin.
  // Step D must be finished before step E can begin.
  // Step F must be finished before step E can begin.
  // `;
  return `
Step M must be finished before step D can begin.
Step E must be finished before step Z can begin.
Step F must be finished before step W can begin.
Step T must be finished before step K can begin.
Step L must be finished before step Z can begin.
Step K must be finished before step Q can begin.
Step H must be finished before step V can begin.
Step Q must be finished before step P can begin.
Step B must be finished before step S can begin.
Step W must be finished before step P can begin.
Step P must be finished before step R can begin.
Step A must be finished before step D can begin.
Step G must be finished before step Z can begin.
Step I must be finished before step D can begin.
Step V must be finished before step D can begin.
Step Z must be finished before step R can begin.
Step X must be finished before step R can begin.
Step S must be finished before step U can begin.
Step J must be finished before step D can begin.
Step R must be finished before step U can begin.
Step U must be finished before step Y can begin.
Step D must be finished before step C can begin.
Step Y must be finished before step N can begin.
Step O must be finished before step C can begin.
Step N must be finished before step C can begin.
Step Q must be finished before step O can begin.
Step K must be finished before step Z can begin.
Step X must be finished before step N can begin.
Step F must be finished before step I can begin.
Step F must be finished before step O can begin.
Step V must be finished before step X can begin.
Step E must be finished before step N can begin.
Step V must be finished before step C can begin.
Step B must be finished before step P can begin.
Step J must be finished before step U can begin.
Step D must be finished before step Y can begin.
Step Z must be finished before step J can begin.
Step I must be finished before step U can begin.
Step E must be finished before step O can begin.
Step X must be finished before step U can begin.
Step G must be finished before step S can begin.
Step K must be finished before step X can begin.
Step G must be finished before step N can begin.
Step X must be finished before step O can begin.
Step P must be finished before step G can begin.
Step L must be finished before step G can begin.
Step B must be finished before step Y can begin.
Step W must be finished before step G can begin.
Step B must be finished before step A can begin.
Step T must be finished before step S can begin.
Step J must be finished before step C can begin.
Step A must be finished before step U can begin.
Step R must be finished before step D can begin.
Step U must be finished before step O can begin.
Step D must be finished before step N can begin.
Step O must be finished before step N can begin.
Step Q must be finished before step A can begin.
Step V must be finished before step J can begin.
Step W must be finished before step O can begin.
Step F must be finished before step R can begin.
Step A must be finished before step X can begin.
Step H must be finished before step O can begin.
Step P must be finished before step X can begin.
Step E must be finished before step Y can begin.
Step M must be finished before step U can begin.
Step T must be finished before step C can begin.
Step A must be finished before step S can begin.
Step P must be finished before step S can begin.
Step Q must be finished before step B can begin.
Step V must be finished before step S can begin.
Step S must be finished before step Y can begin.
Step X must be finished before step Y can begin.
Step H must be finished before step S can begin.
Step J must be finished before step R can begin.
Step V must be finished before step U can begin.
Step X must be finished before step C can begin.
Step I must be finished before step X can begin.
Step Y must be finished before step O can begin.
Step V must be finished before step O can begin.
Step F must be finished before step L can begin.
Step T must be finished before step Q can begin.
Step R must be finished before step O can begin.
Step E must be finished before step W can begin.
Step Q must be finished before step Y can begin.
Step E must be finished before step H can begin.
Step I must be finished before step R can begin.
Step B must be finished before step D can begin.
Step F must be finished before step A can begin.
Step J must be finished before step Y can begin.
Step R must be finished before step N can begin.
Step W must be finished before step A can begin.
Step D must be finished before step O can begin.
Step P must be finished before step N can begin.
Step E must be finished before step Q can begin.
Step G must be finished before step V can begin.
Step G must be finished before step I can begin.
Step X must be finished before step S can begin.
Step M must be finished before step C can begin.
Step G must be finished before step X can begin.
Step T must be finished before step P can begin.
Step Q must be finished before step Z can begin.
`;
}
