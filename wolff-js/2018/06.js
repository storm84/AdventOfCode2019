setTimeout(() => console.log(calc2(getInput())));

// This is a completely unnecessarily convoluted solution - it tries to lay out points in order of distance...
function calc1(input) {
  const maxCoord = 360;
  const map = new Array(maxCoord * 3)
    .fill()
    .map(() => new Array(maxCoord * 3).fill(" "));
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  const origins = input
    .trim()
    .split("\n")
    .map(x => x.split(", "))
    .map(([x, y]) => ({ x: +y, y: +x }))
    .map((p, i) => {
      p.name = chars[i];
      p.got = 1;
      p.toString = () => p.name;
      return p;
    });

  origins.forEach(p => {
    map[p.x + maxCoord][p.y + maxCoord] = p;
  });

  let originsToCheck = origins.slice();
  for (let dist = 1; dist < maxCoord; dist++) {
    const gotBefore = originsToCheck.map(x => x.got);

    for (const origin of originsToCheck) {
      for (let a = 0; a < dist; a++) {
        let b = dist - a;
        set(origin, dist, origin.x + a, origin.y + b);
        set(origin, dist, origin.x + b, origin.y - a);
        set(origin, dist, origin.x - a, origin.y - b);
        set(origin, dist, origin.x - b, origin.y + a);
      }
    }

    originsToCheck = originsToCheck.filter((o, i) => o.got !== gotBefore[i]);
  }

  const finiteOrigins = origins.filter(o => !originsToCheck.includes(o));

  const max = Math.max(...finiteOrigins.map(o => o.got));

  return max;
  return map.map(x => x.join("")).join("\n");

  function set(origin, dist, x, y) {
    x += maxCoord;
    y += maxCoord;
    const existing = map[x][y];
    if (existing.dist === dist) {
      map[x][y].origin.got--;
      map[x][y] = "!";
    } else if (existing === " ") {
      origin.got++;
      map[x][y] = {
        dist,
        origin,
        toString: () => origin.name.toLowerCase(),
      };
    }
  }
}

function calc2(input) {
  const maxCoord = 360;

  const origins = input
    .trim()
    .split("\n")
    .map(x => x.split(", "))
    .map(([x, y]) => ({ x: +y, y: +x }));

  let count = 0;
  for (let i = 0; i < maxCoord; i++) {
    for (let j = 0; j < maxCoord; j++) {
      const totDist = origins
        .map(o => Math.abs(i - o.x) + Math.abs(j - o.y))
        .reduce((a, b) => a + b);
      if (totDist < 10000) count++;
    }
  }

  return count;
}

function getInput() {
  return `
45, 315
258, 261
336, 208
160, 322
347, 151
321, 243
232, 148
48, 202
78, 161
307, 230
170, 73
43, 73
74, 248
177, 296
330, 266
314, 272
175, 291
75, 142
278, 193
279, 337
228, 46
211, 164
131, 100
110, 338
336, 338
231, 353
184, 213
300, 56
99, 231
119, 159
180, 349
130, 193
308, 107
140, 40
222, 188
356, 44
73, 107
304, 313
199, 238
344, 158
49, 225
64, 117
145, 178
188, 265
270, 215
48, 181
213, 159
174, 311
114, 231
325, 162
`;
}
