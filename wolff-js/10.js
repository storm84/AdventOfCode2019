require("./helpers");

console.log(calc(getInput()));

/**
 * @param {string} input
 */
function calc(input) {
  const map = input
    .trim()
    .split(/\s+/)
    .map(x => x.trim());

  const mapRes = map.map(x => x.split("").map(x => "."));

  const w = map[0].length;
  const h = map.length;

  const asteroids = [];

  for (let x = 0; x < w; x++) {
    for (let y = 0; y < h; y++) {
      if (map[y][x] === "#") asteroids.push({ x, y });
    }
  }

  const found = asteroids
    .map(asteroid => {
      const num = new Set(asteroids.map(a => angle(asteroid, a))).size - 1;
      mapRes[asteroid.y][asteroid.x] = num;
      return { asteroid, num };
    })
    .orderByDesc(x => x.num);

  // console.log(found);
  // return toString(mapRes);
  // part 1
  const asteroidInfo = found[0];
  // return asteroidInfo;

  // part 2
  const { asteroid } = asteroidInfo;
  const toProcess = asteroids
    .filter(a => a !== asteroid)
    .groupBy(a => ((angle(asteroid, a) / Math.PI) * 180 + 270) % 360)
    .orderBy(group => group.key)
    .map(group =>
      group.orderBy(a => Math.hypot(asteroid.x - a.x, asteroid.y - a.y))
    );

  const result = [];
  for (let i = 0; i < toProcess.length; i++) {
    const arrayForThisAngle = toProcess[i];
    const item = arrayForThisAngle.shift();
    result.push(item);
    if (arrayForThisAngle.length) {
      toProcess.push(arrayForThisAngle);
    }

    // console.log(i + 1, item);
  }

  return result[200 - 1];

  function angle(a, b) {
    if (a === b) return true;
    let atan = Math.atan2(a.y - b.y, a.x - b.x);
    if (atan < 0) atan += 2 * Math.PI;

    if (isNaN(atan)) {
      console.log("nan", a, b);
    }
    return atan;
  }

  /**
   * @param {string[][]} map
   */
  function toString(map) {
    return map.map(x => (Array.isArray(x) ? x.join("") : x)).join("\n");
  }
}

// Misslyckat försök
/**
 * @param {string} input
 */
function calcDoesntWork(input) {
  const map = input
    .trim()
    .split(/\s+/)
    .map(x => x.trim());

  const mapRes = map.map(x => x.split("").map(x => " ."));

  const w = map[0].length;
  const h = map.length;

  const primes = [0, 1, 2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31];

  let maxFound = 0;
  let best;

  for (let x = 0; x < w; x++) {
    for (let y = 0; y < h; y++) {
      if (map[y][x] === ".") continue;
      // if (x !== 3 || y !== 4) continue;
      if (x !== 4 || y !== 2) continue;

      const found = find(x, y);

      if (maxFound < found) {
        maxFound = found;
        best = { x, y };
      }

      mapRes[y][x] = found.toString().padStart(2, " ");
    }
  }

  console.log(toString(map));
  // return find(1, 1);
  // console.log(find(1, 2));
  console.log("===========");
  console.log(toString(mapRes));

  console.log(best);

  // return;
  return maxFound;

  /**
   * @param {string[][]} map
   */
  function toString(map) {
    return map.map(x => (Array.isArray(x) ? x.join("") : x)).join("\n");
  }

  function find(x, y) {
    let ang = { angles: new Set(), found: [] };
    let found = 1; // self

    for (let primeX of primes) {
      for (let primeY of primes) {
        const a = count(ang, x, y, primeX, primeY);
        const b = count(ang, x, y, primeX, 0);
        const c = count(ang, x, y, primeX, -primeY);
        const d = count(ang, x, y, 0, -primeY);
        const e = count(ang, x, y, -primeX, -primeY);
        const f = count(ang, x, y, -primeX, 0);
        const g = count(ang, x, y, -primeX, primeY);
        const h = count(ang, x, y, 0, primeY);

        const foundHere = a + b + c + d + e + f + g + h;
        if (foundHere) {
          found += foundHere;
          // console.log({ p: primeX + "," + primeY, a, b, c, d, e, f, g, h });
          // console.log([...ang.angles].map(x=>Math.round(x)));
        }
      }
    }

    return found;
  }

  function count(obj, x, y, primeX, primeY) {
    if (primeX === 0 && primeY === 0) return 0;

    let angle = (Math.atan2(primeY, primeX) / Math.PI) * 180;

    if (angle < 0) angle += 360;
    else if (angle >= 360) angle %= 360;

    if (obj.angles.has(angle)) {
      return 0;
    }

    // console.log({ primeX, primeY });

    while (true) {
      x += primeX;
      y += primeY;

      const found = map[y] && map[y][x];
      if (found === "#") {
        obj.angles.add(angle);
        obj.found.push(x + "," + y + " at " + angle);
        return 1;
      }
      if (found === undefined) return 0;
    }
  }
}

function getInput() {
  // return `
  // .#..#
  // .....
  // #####
  // ....#
  // ..###
  // `;
  // return `
  // .#..#
  // .....
  // #####
  // ....#
  // ...##
  // `;
  // return `
  //   .#..##.###...#######
  //   ##.############..##.
  //   .#.######.########.#
  //   .###.#######.####.#.
  //   #####.##.#.##.###.##
  //   ..#####..#.#########
  //   ####################
  //   #.####....###.#.#.##
  //   ##.#################
  //   #####.##.###..####..
  //   ..######..##.#######
  //   ####.##.####...##..#
  //   .#####..#.######.###
  //   ##...#.##########...
  //   #.##########.#######
  //   .####.#.###.###.#.##
  //   ....##.##.###..#####
  //   .#.#.###########.###
  //   #.#.#.#####.####.###
  //   ###.##.####.##.#..##
  //   `;
  return `
.#..#..#..#...#..#...###....##.#....
.#.........#.#....#...........####.#
#..##.##.#....#...#.#....#..........
......###..#.#...............#.....#
......#......#....#..##....##.......
....................#..............#
..#....##...#.....#..#..........#..#
..#.#.....#..#..#..#.#....#.###.##.#
.........##.#..#.......#.........#..
.##..#..##....#.#...#.#.####.....#..
.##....#.#....#.......#......##....#
..#...#.#...##......#####..#......#.
##..#...#.....#...###..#..........#.
......##..#.##..#.....#.......##..#.
#..##..#..#.....#.#.####........#.#.
#......#..........###...#..#....##..
.......#...#....#.##.#..##......#...
.............##.......#.#.#..#...##.
..#..##...#...............#..#......
##....#...#.#....#..#.....##..##....
.#...##...........#..#..............
.............#....###...#.##....#.#.
#..#.#..#...#....#.....#............
....#.###....##....##...............
....#..........#..#..#.......#.#....
#..#....##.....#............#..#....
...##.............#...#.....#..###..
...#.......#........###.##..#..##.##
.#.##.#...##..#.#........#.....#....
#......#....#......#....###.#.....#.
......#.##......#...#.#.##.##...#...
..#...#.#........#....#...........#.
......#.##..#..#.....#......##..#...
..##.........#......#..##.#.#.......
.#....#..#....###..#....##..........
..............#....##...#.####...##.
`;
}
