const { IntCode, LocationMap, delay } = require("./util");

setTimeout(async () => {
  console.log(await calc(getInput()));
});

/**
 * @param {string} input
 */
async function calc(input) {
  const map = new LocationMap(input.replace(/\n/g, "\n#"));

  /** @type {{[loc:string]: string}} */
  const portalsByLocation = {};
  /** @type {{[loc:string]: 'inner'|'outer'}} */
  const portalTypeByLocation = {};
  /** @type {{[name:string]: {x:number,y:number}[]}} */
  const portalsByName = {};

  map.forEach((symbol, { x, y }) => {
    if (isLetter(symbol)) {
      const symbolRight = map.get(x + 1, y);
      const symbolBelow = map.get(x, y + 1);

      const name = isLetter(symbolRight)
        ? symbol + symbolRight
        : isLetter(symbolBelow)
        ? symbol + symbolBelow
        : undefined;

      if (name) {
        const dir = isLetter(symbolRight) ? { x: 1, y: 0 } : { x: 0, y: 1 };
        const prevSymbol = map.get(x - dir.x, y - dir.y);
        const location =
          prevSymbol === "."
            ? { x: x - dir.x, y: y - dir.y }
            : { x: x + 2 * dir.x, y: y + 2 * dir.y };

        const minDistanceFromEdge = Math.min(
          Math.abs(x - map.minX),
          Math.abs(x - map.maxX),
          Math.abs(y - map.minY),
          Math.abs(y - map.maxY)
        );

        const locationStr = pointToStr(location);
        portalsByLocation[locationStr] = name;

        portalTypeByLocation[locationStr] =
          minDistanceFromEdge < 5 ? "outer" : "inner";

        if (!portalsByName[name]) portalsByName[name] = [];
        portalsByName[name].push(location);
      }
    }
  });

  // Flood fill

  let stepCount = 0;
  if (false) {
    // Part 1
    let pointsToCheck = portalsByName.AA;

    while (pointsToCheck.length) {
      const next = [];
      for (const point of pointsToCheck) {
        map.draw("o", point);

        const { x, y } = point;
        const portal = portalsByLocation[pointToStr(point)];
        if (portal === "ZZ") {
          console.log("found portal!");
          console.log(map.toString());
          return {
            stepCount,
          };
        }
        if (portal) {
          const portalLocations = portalsByName[portal].filter(
            p => p.x !== x && p.y !== y
          );
          next.push(...portalLocations);
        }

        const adjacent = [
          { x: x + 1, y },
          { x: x - 1, y },
          { x, y: y + 1 },
          { x, y: y - 1 },
        ];

        for (const a of adjacent) {
          const symbol = map.get(a.x, a.y);
          if (symbol === ".") {
            next.push(a);
          }
        }
      }

      pointsToCheck = next;

      // console.log(map.toString());
      // await delay(50);
      stepCount++;
    }
  } else {
    // Part 2
    let pointsToCheck = [{ ...portalsByName.AA[0], level: 0 }];
    const mapsByLevel = [map.clone()];

    while (pointsToCheck.length) {
      const next = [];
      for (const point of pointsToCheck) {
        let curMap = mapsByLevel[point.level];
        if (!curMap) {
          mapsByLevel[point.level] = curMap = map.clone();
          // console.log("create clone", point.level);
        }

        const curSymbol = curMap.get(point.x, point.y);
        if (curSymbol !== ".") {
          continue;
        }
        curMap.draw("o", point);

        const { x, y } = point;
        const portal = portalsByLocation[pointToStr(point)];
        if (portal === "AA" || portal === "ZZ") {
          if (portal === "ZZ") {
            if (point.level === 0) {
              console.log("found portal!");
              // console.log(curMap.toString());
              return {
                stepCount,
              };
            } else {
              // console.log(
              //   "found portal but wrong level",
              //   portal,
              //   pointToStr(point),
              //   point.level
              // );
            }
          }
        } else if (portal) {
          const portalType = portalTypeByLocation[pointToStr(point)];
          const nextLevel = point.level + (portalType === "inner" ? 1 : -1);
          if (nextLevel >= 0) {
            const portalLocations = portalsByName[portal]
              .filter(p => p.x !== x && p.y !== y)
              .map(p => ({ ...p, level: nextLevel }));
            next.push(...portalLocations);
          }
        }

        const adjacent = [
          { x: x + 1, y, level: point.level },
          { x: x - 1, y, level: point.level },
          { x, y: y + 1, level: point.level },
          { x, y: y - 1, level: point.level },
        ];

        for (const a of adjacent) {
          const symbol = curMap.get(a.x, a.y);
          if (symbol === ".") {
            next.push(a);
          }
        }
      }

      pointsToCheck = next;

      // console.log(map.toString());
      // await delay(50);
      stepCount++;
    }
  }

  console.log({ portalsByLocation, stepCount }, portalsByName);
  // return map.toString();
}

function pointToStr({ x, y }) {
  return `${x},${y}`;
}

function isLetter(str) {
  return /^[A-Z]$/.test(str);
}

function getInput() {
  //   return `
  //              Z L X W       C
  //              Z P Q B       K
  //   ###########.#.#.#.#######.###############
  //   #...#.......#.#.......#.#.......#.#.#...#
  //   ###.#.#.#.#.#.#.#.###.#.#.#######.#.#.###
  //   #.#...#.#.#...#.#.#...#...#...#.#.......#
  //   #.###.#######.###.###.#.###.###.#.#######
  //   #...#.......#.#...#...#.............#...#
  //   #.#########.#######.#.#######.#######.###
  //   #...#.#    F       R I       Z    #.#.#.#
  //   #.###.#    D       E C       H    #.#.#.#
  //   #.#...#                           #...#.#
  //   #.###.#                           #.###.#
  //   #.#....OA                       WB..#.#..ZH
  //   #.###.#                           #.#.#.#
  // CJ......#                           #.....#
  //   #######                           #######
  //   #.#....CK                         #......IC
  //   #.###.#                           #.###.#
  //   #.....#                           #...#.#
  //   ###.###                           #.#.#.#
  // XF....#.#                         RF..#.#.#
  //   #####.#                           #######
  //   #......CJ                       NM..#...#
  //   ###.#.#                           #.###.#
  // RE....#.#                           #......RF
  //   ###.###        X   X       L      #.#.#.#
  //   #.....#        F   Q       P      #.#.#.#
  //   ###.###########.###.#######.#########.###
  //   #.....#...#.....#.......#...#.....#.#...#
  //   #####.#.###.#######.#######.###.###.#.#.#
  //   #.......#.......#.#.#.#.#...#...#...#.#.#
  //   #####.###.#####.#.#.#.#.###.###.#.###.###
  //   #.......#.....#.#...#...............#...#
  //   #############.#.#.###.###################
  //                A O F   N
  //                A A D   M
  // `;
  // return `
  //          A
  //          A
  //   #######.#########
  //   #######.........#
  //   #######.#######.#
  //   #######.#######.#
  //   #######.#######.#
  //   #####  B    ###.#
  // BC...##  C    ###.#
  //   ##.##       ###.#
  //   ##...DE  F  ###.#
  //   #####    G  ###.#
  //   #########.#####.#
  // DE..#######...###.#
  //   #.#########.###.#
  // FG..#########.....#
  //   ###########.#####
  //              Z
  //              Z
  // `;
  //   return `
  //                    A
  //                    A
  //   #################.#############
  //   #.#...#...................#.#.#
  //   #.#.#.###.###.###.#########.#.#
  //   #.#.#.......#...#.....#.#.#...#
  //   #.#########.###.#####.#.#.###.#
  //   #.............#.#.....#.......#
  //   ###.###########.###.#####.#.#.#
  //   #.....#        A   C    #.#.#.#
  //   #######        S   P    #####.#
  //   #.#...#                 #......VT
  //   #.#.#.#                 #.#####
  //   #...#.#               YN....#.#
  //   #.###.#                 #####.#
  // DI....#.#                 #.....#
  //   #####.#                 #.###.#
  // ZZ......#               QG....#..AS
  //   ###.###                 #######
  // JO..#.#.#                 #.....#
  //   #.#.#.#                 ###.#.#
  //   #...#..DI             BU....#..LF
  //   #####.#                 #.#####
  // YN......#               VT..#....QG
  //   #.###.#                 #.###.#
  //   #.#...#                 #.....#
  //   ###.###    J L     J    #.#.###
  //   #.....#    O F     P    #.#...#
  //   #.###.#####.#.#####.#####.###.#
  //   #...#.#.#...#.....#.....#.#...#
  //   #.#####.###.###.#.#.#########.#
  //   #...#.#.....#...#.#.#.#.....#.#
  //   #.###.#####.###.###.#.#.#######
  //   #.#.........#...#.............#
  //   #########.###.###.#############
  //            B   J   C
  //            U   P   P
  //     `;

  return `
                                 S           R       C   O         F       Z   Y
                                 X           E       R   T         P       Z   H
  ###############################.###########.#######.###.#########.#######.###.###############################
  #.#.#.#.#.........#.#.#.#...#.....#.....#.....#...#...#.....#.#.......#...........#...#.........#.#.......#.#
  #.#.#.#.#########.#.#.#.#.#####.###.#.#######.###.###.#####.#.#.###.#.#.###.#.#####.###.#####.###.###.#####.#
  #.....#...#.#...................#...#.#.............#.#.....#.....#.#.#.#...#.#.............#.#.........#...#
  #####.#.###.###.#####.#.#.###.#.#.###.#.#.#####.#####.#.#########.#######.#####.###.#.#.#######.###.#####.###
  #...#...#.#.....#.....#.#.#...#.....#.#.#.....#.#...#.#.#.....#...#...#...#.....#.#.#.#...........#...#.#...#
  #.#####.#.#.#.#.#.###.#.#.###########.###.###.###.#.#.#.###.#####.#.#.###.#.###.#.###.#.#.#############.#.###
  #.#...#...#.#.#.#.#...#.#...#.#.#.......#.#...#...#...#...#.#.....#.#...#.....#.....#.#.#...#...#.#.#...#...#
  #.###.###.###########.#.#.###.#.###.###.#####.#####.###.###.#####.#.#.#.#.#########.#########.###.#.###.#.###
  #.......#.#.#.#.......#.#.#...........#.#.....#.......#.#.....#.#...#.#.#.#.....#.#.#.#.....#.#.#...#.....#.#
  #.#.#.###.#.#.#############.#.###.###.#######.###.###.#.#.###.#.#.###.###.#.#####.###.#.#####.#.#.#.#.#.#.#.#
  #.#.#.....#.....#...#...#.#.#.#...#.#...#...#...#.#.#.#.....#.#.#.#...#...............#.#...#...#.#...#.#.#.#
  #########.#####.#.#####.#.#.###.###.#.###.###.###.#.###.###.#.#.#####.#.###.#######.###.#.###.#######.#####.#
  #.#...#.......#...........#.#.#.#.....#.......#...#.......#.#.....#.#.#.#.#.#.#.#.#.#...#.......#...#...#...#
  #.#.#########.###.#.#####.###.#####.#.#######.#.#############.#####.#.#.#.###.#.#.###.###.###.#.###.###.###.#
  #...#...#.#...#...#.#.........#...#.#...#.#.#.#.......#.#.....#.#.....#.....#...............#.#.#.....#.....#
  #.#####.#.#.#########.#######.#.###.#.###.#.#.###.#####.#.###.#.#####.###.###.###.#####.#.#.###.###.###.#####
  #.#...#.#.#.#.........#.#.....#...#.#.#.....#.#.....#.....#.......#.....#.#...#.....#...#.#.#...#.#.#.......#
  #.###.#.#.#.###########.#.#.#.###.###.#.###.#.#.#############.#####.#.###.#.#####.###.#.#########.#.#.#######
  #...#.#.....#.....#.....#.#.#...#.#...#.#.#...#...#...#.#...#.....#.#.#.......#.#...#.#...#.#.....#...#.#.#.#
  ###.#.###.#####.#######.#####.###.###.#.#.#######.#.###.###.#.#.#####.#.#######.#########.#.#.#######.#.#.#.#
  #.#...#.....#.#.....#...#.#...........#...#.#.......#.#.......#.#.#.#.#.#...#...#...#.#.#.#.#.#.........#...#
  #.#.#.#.#.###.#.#.###.###.#.###.#####.###.#.###.###.#.#.#########.#.#.#.#.#####.#.###.#.###.#.#######.#####.#
  #...#.#.#.#.#...#...#.......#.....#.....#.#.#.....#.#.........#.....#.#...#.............#.......#.#.#...#.#.#
  ###.#####.#.###.#####.###.#####.#########.#.#.#.#######.###.#.#.###.#.#.###.###.###.#######.###.#.#.#.###.#.#
  #.#.#...#.#...#.....#.#.....#.........#.....#.#.......#.#...#.#...#...#.......#.#...#.#.#.....#.#.#.#.#.....#
  #.#.###.#.###.#.#################.#########.#####.#######.#######.#########.#########.#.###.#.###.#.#.#####.#
  #...........#.......#...#.#      R         Q     O       O       B         S      #.#...#.#.#.#.#.....#.#.#.#
  #####.#########.#.#.#.###.#      G         M     Y       Q       K         X      #.#.###.#.###.###.###.#.#.#
  #...#...#.#.#...#.#.#.#.#.#                                                       #...................#......RK
  ###.#.###.#.#.#######.#.#.#                                                       #.#######.#.#.#####.###.###
  #.#...#.#.#.#...#...#.#.#.#                                                     RE......#.#.#.#.#.....#.#...#
  #.###.#.#.#.#.###.###.#.#.#                                                       #.#####.#####.###.#.#.###.#
  #.......#.........#...#...#                                                       #.....#...#.#.#.#.#.#...#.#
  ###.###.#.#####.#####.#.###                                                       #.#####.#.#.###.###.#####.#
  #.#...#.....#.#.#.........#                                                       #.#.#.#.#...#.#.#.........#
  #.###.#######.#.#.#.###.###                                                       #.#.#.#####.#.#.###.#####.#
BK..........#.......#.#.....#                                                       #.#.#.............#...#...#
  #.#.###################.###                                                       ###.#.#######.###.#########
  #.#.#.#.#.#.#.#.#...#......MV                                                     #.#.#.....#...#.....#.....#
  #.###.#.#.#.#.#.#.#####.###                                                       #.#.#####.###.#####.#.#####
  #.#.#.....#.......#.......#                                                       #.......#.#.....#.....#.#..FL
  ###.###.#.#.#####.#.#####.#                                                       #.#.#####.###.#.#.#.#.#.#.#
  #.#.#...#.....#...#.#...#.#                                                     FP..#.........#.#.#.#.#.....#
  #.#.###.#.#.#####.#####.###                                                       ###########.###############
  #.......#.#...#.......#...#                                                     DB..#.....#.#.#.#...#...#.#.#
  ###.###############.###.###                                                       #.#.#.###.###.###.#.#.#.#.#
QM......#.....#.#...#........FW                                                     #...#.#.....#.......#.#....UC
  ###.#####.#.#.#.###########                                                       #.###.#.#.#######.###.#.###
DB..#.#...#.#.#.....#.......#                                                       #...#...#.......#...#.....#
  #.#####.###.###.#.###.###.#                                                       #.###.#####.#######.#.#####
  #...#.....#.....#.#.#.#...#                                                       #.#.#...#...........#.#...#
  #.###.#.#####.#####.#.#.###                                                       ###.#.###################.#
  #...#.#.#...#...#...#.#.#.#                                                     AV....#.#.............#.....#
  #.###.#.#.###.#.#.#.#.#.#.#                                                       #.#####.#.#########.###.#.#
  #.....#.......#...#...#....ZP                                                     #.......#...#.......#...#.#
  #.#.#.#.#################.#                                                       ###.###.#####.#.#.#####.#.#
  #.#.#.#.#.#...........#...#                                                       #.#.#.#.#...#.#.#.......#..PA
  #########.#.#.###.###.#####                                                       #.#.#.###.#################
  #.......#.#.#.#...#.....#..RK                                                   UC..#.#...#.#.#.#............RG
  #.###.###.#.#####.#.#.###.#                                                       #.###.#.#.#.#.#.#.#.###.#.#
DE..#.....#.#...#...#.#.....#                                                       #...#.#.........#.#.#...#.#
  ###.#####.#.###.###########                                                       ###.#.#######.#.#.#.###.#.#
  #.............#.#...#...#.#                                                       #...#.....#.#.#.#.#.#...#.#
  #######.#########.#.###.#.#                                                       #.###.#####.#.#.###.#######
  #...#.........#.#.#.......#                                                       #.....#.#.....#...#.#.#.#.#
  ###.#####.#####.#####.#.#.#                                                       #.#####.#########.###.#.#.#
  #.....#.#...#.#.#.#.#.#.#.#                                                       #.#.............#.#.#.#...#
  ###.###.#####.#.#.#.#.###.#                                                       #.#.###.#.#########.#.#.###
  #...#...#.....#...#...#...#                                                       #.#...#.#.#.#.#.#...#.#...#
  #.#.###.###.###.#####.###.#                                                       ###.###.###.#.#.#.###.###.#
OQ..#.....................#..YI                                                   ZJ......#.......#.#.....#...#
  #.#.#########.###.#.#######                                                       #######.###.###.#.#.#####.#
  #.#.#.......#...#.#.#.....#                                                       #...#...#.........#........MV
  #####.#.###.###.#######.#.#                                                       #.#######.#.###.#####.###.#
  #...#.#.#.#...#.#...#...#.#                                                     ZL........#.#.#.......#...#.#
  #.#.#.#####.#.#####.#.###.#                                                       #####.###############.#####
  #.#.....#...#.#.#.....#...#                                                       #.....#.#...#...#...#.#....ZJ
  #.###.###.#####.###.###.###                                                       #.#####.#.#####.#.#######.#
FW....#...#...........#.#....YH                                                   OT..#...#.....#.....#........AV
  #.###.#######.###.#.#.#.###                                                       #.#.#.#.#.#####.#.#######.#
  #.#.....#.......#.#.#...#.#                                                       #...#...#.......#.........#
  #.###.###.#.#####.#.#####.#    C       N         I     F     D         P   E      #.#.###.#.#####.#.#####.###
  #.#...#.#.#.....#.#...#...#    R       C         A     L     E         A   K      #.#...#.#.#.....#...#.#...#
  #.#.#.#.###.#####.#.###.#######.#######.#########.#####.#####.#########.###.#######.#.#####.###.###.###.#.#.#
  #.#.#.....#...#...#...#.#...........#.....#.#.....#.....#.........#.....#.......#.#.#.....#.#.....#.#...#.#.#
  ###.#.#####.#####.#####.#####.###.#####.###.#.###.#.#####.###########.#.#####.#.#.###.###.#.#.#.#.#.###.###.#
  #.#.#...#.#.....#.#.........#...#.#.#.......#.#.#.#.....#.........#...#...#.#.#.#...#.#.#.#.#.#.#.#.......#.#
  #.###.###.#.#########.#.###.#.#####.#.#.#.#####.#.#.#####.#.#########.#.#.#.###.#.#.###.###.#.#.###.###.#####
  #.......#.......#.....#.#.........#.#.#.#.#...#...#...#...#.#.#.......#.#.#...#.#.#.....#.#.#.#.#.#...#.#...#
  ###.###.#.#.#.###.###.#.###.###.###.###.#.###.#.###.#######.#.#####.#.#######.#.###.###.#.#######.#.#######.#
  #...#...#.#.#.#...#...#.#.....#.#.#...#.#...#.....#.....#.......#.#.#...#.............#.#.#...#.#...........#
  #.#.#.###.#####.###############.#.#.#.###.#####.###.#######.###.#.###.#####.#.###########.#.#.#.#.#.#####.###
  #.#.#.#...#.#.......#.....#.#.....#.#.........#.#...#...#.#.#...#...#.....#.#.#.............#.#...#...#.....#
  ###.#######.###.#.#.#.###.#.#.#######.#####.###.###.###.#.###.#.#.###.#######.#####.#.###.#####.#########.###
  #...#...........#.#.#.#...#.#.#...........#...#.#...#.......#.#.#.....#...#.........#...#.#...#.#...#.......#
  #.###.#.#####.#.#########.#.#.#.###.#####.#####.###.#####.#.#.###.###.#.#######.#############.###.#####.###.#
  #...#.#.#.....#.#...#.........#.#.....#...#.......#.....#.#.....#.#.#.....#.#.........#.....#.#.#.#...#.#...#
  ###.###.#.#.#.#####.###.#.#.#.#########.#.#######.#.###########.#.#.#######.#.#.#.###.###.#.#.#.#.#.#######.#
  #...#...#.#.#.....#...#.#.#.#.....#.....#.#.....#.#.....#.#.#...#.#.#.#.......#.#.#.#.....#.........#.....#.#
  #.#.#.#.###.#.#.#####.#######.#.###.#.#.###.###.#.#.#.###.#.###.#.#.#.#####.#.#####.#.#.#######.###.#.#####.#
  #.#.#.#...#.#.#.#.#.....#.....#.#...#.#.#.....#...#.#.#.#...#...#.#.....#.#.#.#.#...#.#.#.#...#.#.......#.#.#
  #.#######.#######.#####.#####.#######.###.###.#.#.###.#.###.###.#.#####.#.#.###.#.#####.#.###.#####.###.#.###
  #.#.......#.....................#.......#...#.#.#.#...#.....#...#...#.#.......#.......#.#.........#...#.....#
  ###.###.###.#.#.###.#.#######.#####.#####.###.#####.#####.#.###.#.#.#.###.#####.#########.#####.#######.#####
  #...#...#...#.#.#...#.#.#.......#.....#.#.#...#.#...#...#.#.....#.#.#.#...#.......#...........#.....#.#.#...#
  #.#####.#########.#####.#####.#######.#.#####.#.###.#.###.#.#.###.###.#.#.#.###.###.###.###.#######.#.#####.#
  #.#.#...#...........#...........#...#.......#.#.#...#...#.#.#.#.#.....#.#.#...#.......#.#.#.....#.......#...#
  ###.#.#.###.#.#.#.#####.#####.#####.#.#######.#.###.#.#.#.###.#.#.#.#.###.###.#.#####.###.#.###.#######.###.#
  #.....#.#...#.#.#.#.....#.........#.......#.....#.....#.#.#.....#.#.#.#.......#...#.......#.#.........#.....#
  #################################.#.#####.#####.#######.#.#######.#############.#############################
                                   Z A     E     Y       O Z       N             I
                                   P A     K     I       Y L       C             A
`;
}