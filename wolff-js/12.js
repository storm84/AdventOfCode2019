// Hint used for part 2: the bodies move independently along the axes

require("./util");

console.log(calc(getInput()));

/**
 * @param {string} input
 */
function calc(input) {
  const moons = input
    .trim()
    .split(/\n/)
    .map(x =>
      x
        .trim()
        .split(/[<>,]/)
        .map(y => y.split("=")[1])
    )
    .map(([, x, y, z]) => ({
      pos: { x: +x, y: +y, z: +z },
      vel: { x: 0, y: 0, z: 0 },
    }));

  let stepX0 = false;
  let stepY0 = false;
  let stepZ0 = false;

  for (let i = 0; i < 1e6; i++) {
    for (const moon of moons) {
      for (const compare of moons) {
        if (moon === compare) continue;

        moon.vel.x += Math.sign(compare.pos.x - moon.pos.x);
        moon.vel.y += Math.sign(compare.pos.y - moon.pos.y);
        moon.vel.z += Math.sign(compare.pos.z - moon.pos.z);
      }
    }

    let isX0 = true;
    let isY0 = true;
    let isZ0 = true;

    for (const moon of moons) {
      moon.pos.x += moon.vel.x;
      moon.pos.y += moon.vel.y;
      moon.pos.z += moon.vel.z;

      if (isX0 && moon.vel.x !== 0) isX0 = false;
      if (isY0 && moon.vel.y !== 0) isY0 = false;
      if (isZ0 && moon.vel.z !== 0) isZ0 = false;
    }

    // Part 2
    if (isX0 || isY0 || isZ0) {
      // console.log({ isX0, isY0, isZ0, step: i + 1 });

      if (isX0 && !stepX0) {
        stepX0 = i + 1;
        console.log("x=", i + 1);
      }
      if (isY0 && !stepY0) {
        stepY0 = i + 1;
        console.log("y=", i + 1);
      }
      if (isZ0 && !stepZ0) {
        stepZ0 = i + 1;
        console.log("z=", i + 1);
      }
    }

    if (stepX0 && stepY0 && stepZ0) {
      return { stepX0, stepY0, stepZ0, result: "leastCommonMultiple * 2" };
    }
  }

  // Part 1
  const energy = moons
    .map(x => {
      const p = x.pos;
      const v = x.vel;
      return (
        (Math.abs(p.x) + Math.abs(p.y) + Math.abs(p.z)) *
        (Math.abs(v.x) + Math.abs(v.y) + Math.abs(v.z))
      );
    })
    .sum();

  return energy;
}

function getInput() {
  return `
  <x=-14, y=-4, z=-11>
  <x=-9, y=6, z=-7>
  <x=4, y=1, z=4>
  <x=2, y=-14, z=-9>
  `;
}
