// DOESN'T WORK

const { IntCode, LocationMap } = require("./util");

setTimeout(async () => {
  console.log(await calc(getInput()));
});

/**
 * @param {string} input
 */
async function calc(input) {
  const map = new LocationMap(input);
  const startPos = map.find("@");
  map.moveTo(startPos.x, startPos.y);
  // Use a careful flood-fill

  const foundKeys = {};
  const foundDoors = {};
  const lockedDoors = {};

  let nextPositions = [startPos];
  while (nextPositions.length) {

  }

  return startPos;
}

function getInput() {
  return `
  #################################################################################
  #...#p........#..k........#.K..f........#...#.........#...........#.....#.......#
  #.#V#.#######.#P#########.#.#########.###.#.#######.###.###.#####.#.###.#.#####Y#
  #.#.#.#.C...#...#....u..#...#.A.....#...#.#.........#...#...#...#.#...#...#.....#
  #.#.#.#.###.#########.#.#####.#####.#.#.#.#########.#.###.#####.#.###.#####.#####
  #.#...#...#.#.......#.#.#.#...#...#.#.#.#...#...#...#.#...#.....#.....#.#...#...#
  #.#####.#.#.###.###.#.#.#.#.###.#.#.#.#.###.#.#.#####.#.###.###########.#.###.###
  #...#.#.#.#...#.#.#...#.#.#i#...#.#.#.#.#...#.#.....#.#...#.........#.....#.....#
  ###.#.#.#.###.#.#.#####.#.#.#.#.#.#.###F#.###.#####.#.###.#######.#.#.#####.###.#
  #...#..n#.#.#...#.....#...#.#.#.#.#.#a..#.....#.#...#...#.#.....#.#.#.....#...#.#
  #O#######.#.#####.#####.###.#.#.#.#.#.###.#####.#.#.###J#.#.###.#.#######.#####.#
  #...#.....#.....#.....#.#...#.#.#.#...#.#.......#.#...#.#.#.#.#.#.........#.....#
  ###.#.#####.#.###.###.#.#.#####.#######.#.#######.#####.#.#.#.#.###.#######.###.#
  #.#.#.#...#.#.....#.#...#.#.....#.......#.#t....#.#.....#l#.#.#...#...#....x#.#.#
  #.#.#.###.#.#######.#####.###.###.###.#.###.###.#.#.#####.#.#.###.###.#.#####.#.#
  #...#...#.#...#.........#...#....q#...#.#...#...#.#...#.#.#...#...#.#...#...#...#
  #.#####.#.###.#.###########I#######.###.#.#####.#.###.#.#.###.#.###.#####.#.#.###
  #.......#...#.#.#......z....#...#...#...#.#...#.#.......#.#...#.#.........#.#.#.#
  #########.#.#.#.#.###########.#.#.###.###.#.#.#.#.#######.#.###.#.#########G#.#.#
  #.....#...#.#...#.#...........#.#.#.#...#.#.#.#.#...#.....#.#...#.....#...#.#...#
  #W#.###.###.###.#.#####.#.#####.#.#.###.#.#.#.#.###.#.#####.#.#######.#.###.###.#
  #.#...#...#.....#...Z.#.#...#.#...#.#...#...#.#...#.#.....#.#.#.......#.#...#...#
  #.###.###.#############.###.#.#####.#.#######.###.#.#####.#.###.#.#####.#.###.###
  #...#...#.#.....#.....#...#.#.......#.#.#...#.#.#.#.#.....#...#.#.#...#.....#...#
  #.#####.#.#.###.###.#.###.#.#######.#.#.#.#.#.#.#.#.#.###.###.###.#.#.#.#######.#
  #.#.....#...#...#...#.#...#...#...#...#.#.#.#.#.#.#.#.#.#.#.#...#.#.#...#.......#
  ###.###.#####.###.###.#####.#.#.#.#.###.#.#.#.#.#.###.#.#.#.###.#.###.###.#######
  #...#.....#.#.#...#.#.#...#.#.#.#.#.....#.#...#.#.....#...#...#.#...#...#.#.....#
  #.#######.#.#.###.#.#.#.#.###.#.#.#####.#.#####.#######.#####.#.###.#####.#.###.#
  #.#.....#.#.#.....#.#.#.#...#...#...#...#...#.....#...........#...#.........#...#
  #.#.###.#.#.#######.#.#.###.#.#####.#.###.#.#.#.###.#########.###.#####.#######.#
  #r#...#.#...#.......#.#...#.#.#.....#.#.#.#.#.#.........#...#...#.....#...#...#.#
  #.###.#.#####.#.#####.#.#.#.###.#####.#.#.#.###########.#.#.#.#######.#####.#.###
  #.....#.#...#.#.#.....#.#.#.....#.....#.#.#.......#...#.#.#.#.#.....#.#.....#...#
  #.#####.#.#.#.#.#.#######.#######.#####.#.#######.#.#.###.#.###.###.#.#.#######.#
  #.#.#...#.#.#.#.#.#.....#.....#.#.#.....#.#.....#...#.....#...#...#.#...#.......#
  #.#.#.###.#.#.#.#.###.#.#.###.#.#.###.#.#.#.###.#############.###.#.#####.#######
  #.#.#...#.#...#.#.#...#.#...#.#...#...#.#.#.#...#........m..#...#.#.....#.....#.#
  #.#.###.#.#####.#.#.###.#####.#.###.###.#.#.#.###.#########.#.###.#####.#####.#.#
  #.....#.......#.....#.........#.....#.......#.....#.........#.........#.........#
  #######################################.@.#######################################
  #.#...M.........#.H...............#.........#h....#...#.....#.#..............b..#
  #.#.###########.#####.###########.#.###.###.#.#.#.#.#.###.#.#.#.###############.#
  #.#...........#.......#.........#...#...#...#.#.#...#.#...#.#.......#.D.#.....#.#
  #.###########.###.#####.#####.#######.###.###.#.#####.#.###.#########.#.#.###.#.#
  #.....#.....#...#.#...#.#...#.....#...#.#.....#.#...#.#.#...#.........#...#.#.#.#
  #.###.#.###.###.###.#.#.###.#####.#.###.#######.#.#.#.#.#.###.#############.#.#.#
  #...#.#.#.#...#.....#.#.........#...#...#.....#.#.#.#...#.#...#.............#.#.#
  #.###.#.#.#.#########.#########.#####.###.###.#.###.#####T#.#.###.#####.#####.#.#
  #.#...#...#.....#...#.#.......#...#.....#.#.....#...#...#.#.#...#.....#.......#.#
  #.#.###.#####.###.#.#.#.#####.###.#####.#.#######.#.#.###.#.###.#####.#########.#
  #.#g....#.....#...#...#...#..d..#.......#...#.#...#.#...#.#...#...#.#.......#...#
  #######.#.###.#.#####.#####.###########.###.#.#.#.#.###.#.#######.#.#######.###.#
  #.....#.#...#.#.....#.#...#.......#...#.#...#...#.#.....#.....#...#.......#.#...#
  #.###.#####.#######.###.#.#.###.###.#.#.#.#######.#.#########.#.#####.#####.#.#.#
  #.#.E.....#...#...#.....#.#...#.....#.#.#.#.......#.#.......#...#.....#.....#.#.#
  #.#.#####.###.#.#.#######.###.#######.#.#.#.#######.#.#.###.#####.###.#.#####.#.#
  #.#.#...#.....#.#.........#...#.....#.#.#.#...#.....#.#...#.#.....#w..#...#..s#.#
  #.###.#.#####.#.#.#########.###.###.#.#.#.###.#######.###.###.###.###.###.###.#.#
  #.#...#.....#.#.#.#...#.#...#...#...#...#.#...#.......#.#.......#...#...#.....#.#
  #.#.#######.#.#.###.#.#.#.###.###.#.#####.#.###.#######.#######.###.#.#########.#
  #.#.#.....#.#.#.....#.#...#.#.#...#.....#.#...............#...#...#.#.#.........#
  #.#.#.###.#.#.#########.###.#.#.#######.#.###############.#.#####.#.###.#########
  #.#.#.#...#.#...#...#...#.....#...#.....#.#...........#...#.#.....#.#...#.......#
  #.#.###.#.#.#####.#.#.#########.#.#######.#.#########.#####.#######.#.###.#####.#
  #.#.#...#.#.....L.#.#.#.......#.#.......#...#.....#.#...#...#.....#.#.#.......#.#
  #.#.#.###.#########.#.#.#####.#.#######.#.###.#.#.#.###.#.###.###.#.#.#######.#.#
  #.#.#.#.#.#.......#...#...#...#.#.......#.#.#.#.#.....#.#.#...#...#.#.....#...#.#
  #.#.#.#.#.#.###.#.#######.#.#####.#######.#.#.#.#######.#.###.#.###.#####.#.###.#
  #.#...#.#.#.#...#.#.......#.#...#....c..#.#...#.#.....#.#.....#.#.......#.#.R.#.#
  #.#####.#.###S###.#.#.#####.#.#.#######.#.#####.#.###.#.#######.#.###.###.#####.#
  #.......#.....#...#.#.#...#...#.....#...#.....#.#.#...#...#.....#...#...#...#e..#
  #.#####.#######B#####.#.###########.#.#######.#.#.#.###.###.#######.###.###.#.#.#
  #.....#.........#.....#.....#.....#.#...#...#...#.#...#...#.....#...#.....#.#.#.#
  #####.###########.#####.###.#.###.#.###.###.###.#.###.###.#####.#####.###.#.#.#.#
  #...#.....#.......#.#.....#.#...#.#...#.#.....#.#.#.......#...#...#...#...#.#.#.#
  ###.#####.#.#######.#.#####N###.#.###.#.#.#####.#.#######.#.#.###.#.#######.#.#.#
  #...#.....#...#..o....#.#...#...#...#...#.#.....#.......#.#j#...#y#.......#.#.#.#
  #.###.#######.#.#######.#.###.###.#####.#.#.###########.###.#.###.#.#####.#.#X#.#
  #.............#........v#.......#.U.....#.Q...........#.....#.....#.....#.....#.#
  #################################################################################
    `;
}
