const { LinkedList } = require("../util");

// console.log(calc1(getInput()).max());
console.log(calc2(getInput()).max());

function calc1(input) {
  const { players, maxMarble } = input;

  const game = new LinkedList([0], true);
  const scores = new Array(players).fill(0);
  let current = game.first;
  for (let i = 1; i <= maxMarble; i++) {
    // game.assertValid();
    if (i % 23 !== 0) {
      current = current.next.insertAfter(i);
    } else {
      const player = i % players;
      const sevenCC = current.getPrev(7);
      current = sevenCC.next;
      sevenCC.remove();
      scores[player] += i + sevenCC.value;
    }
  }

  return scores;
}

function calc2(input) {
  input.maxMarble *= 100;
  return calc1(input);
}

function getInput() {
  return { players: 459, maxMarble: 71790 };
}
