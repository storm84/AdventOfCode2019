require("./util");

setTimeout(async () => {
  // console.log(await calc1(getInput(), 1));
  console.log(await calc2(getInput()));
});

async function calc2(input) {
  const targetRes = 1000000000000;
  let lo = 1;
  let loRes;
  let hi = targetRes;
  let res;

  // binary search
  while (lo + 1 !== hi) {
    const middle = Math.floor(lo + (hi - lo) / 2);
    res = await calc1(input, middle);
    console.log({ lo, middle, hi, res });
    if (res < targetRes) {
      lo = middle;
      loRes = res;
    } else if (res > targetRes) {
      hi = middle;
    }
  }

  return { lo, loRes };
}

/**
 * @param {string} input
 */
async function calc1(input, needed) {
  const parsed = input
    .trim()
    .split("\n")
    .map(x => {
      const arr = x
        .trim()
        .split(/, | => /)
        .map(x => x.split(" "))
        .map(([num, elem]) => ({
          num: BigInt(num),
          elem,
        }));

      return {
        from: arr.slice(0, -1),
        to: arr.slice(-1)[0],
        needed: 0n,
      };
    });

  const byTo = new Map(parsed.map(x => [x.to.elem, x]));

  /** @type {{[elem:string]: {num:number; elem:string;}[]}} */
  const byFrom = Object.fromEntries(
    parsed
      .map(x => x.from)
      .flat()
      .distinct()
      .map(x => [x.elem, []])
  );

  for (const x of parsed) {
    for (const from of x.from) {
      byFrom[from.elem].push(x.to);
    }
  }

  byTo.get("FUEL").needed = BigInt(needed);

  const withoutParents = ["FUEL"];
  let numOre = 0n;

  for (let i = 0; i < withoutParents.length; i++) {
    let { from, to, needed } = byTo.get(withoutParents[i]);

    // console.log(withoutParents[i]);

    const multiples = divCeil(needed, to.num);

    for (const f of from) {
      // console.log(f);
      if (f.elem === "ORE") {
        numOre += multiples * f.num;
        continue;
      }

      const x = byTo.get(f.elem);
      x.needed += multiples * f.num;
      byFrom[f.elem] = byFrom[f.elem].filter(x => x.elem !== to.elem);
      if (byFrom[f.elem].length === 0) {
        withoutParents.push(f.elem);
      } else {
        // console.log('byfrom', byFrom[f.elem])
      }
    }
    // console.log(byTo.get(to.elem));
  }

  function divCeil(a, b) {
    const res = a / b;
    if (res * b === a) {
      return res;
    } else {
      return res + 1n;
    }
  }

  return numOre;
}

function getInput() {
  // return `
  // 9 ORE => 2 A
  // 8 ORE => 3 B
  // 7 ORE => 5 C
  // 3 A, 4 B => 1 AB
  // 5 B, 7 C => 1 BC
  // 4 C, 1 A => 1 CA
  // 2 AB, 3 BC, 4 CA => 1 FUEL
  // `;
  // return `
  //   157 ORE => 5 NZVS
  // 165 ORE => 6 DCFZ
  // 44 XJWVT, 5 KHKGT, 1 QDVJ, 29 NZVS, 9 GPVTF, 48 HKGWZ => 1 FUEL
  // 12 HKGWZ, 1 GPVTF, 8 PSHF => 9 QDVJ
  // 179 ORE => 7 PSHF
  // 177 ORE => 5 HKGWZ
  // 7 DCFZ, 7 PSHF => 2 XJWVT
  // 165 ORE => 2 GPVTF
  // 3 DCFZ, 7 NZVS, 5 HKGWZ, 10 PSHF => 8 KHKGT
  //   `;
  return `
  180 ORE => 9 DQFL
3 HGCR, 9 TKRT => 8 ZBLC
1 MZQLG, 12 RPLCK, 8 PDTP => 8 VCFX
3 ZBLC, 19 VFZX => 1 SJQL
1 CRPGK => 4 TPRT
7 HGCR, 4 TGCW, 1 VFZX => 9 JBPHS
8 GJHX => 4 NSDBV
1 VFTG => 2 QNWD
1 WDKW, 2 DWRH, 6 VNMV, 2 HFHL, 55 GJHX, 4 NSDBV, 15 KLJMS, 17 KZDJ => 1 FUEL
2 JHSJ, 15 JNWJ, 1 ZMFXQ => 4 GVRK
1 PJFBD => 3 MZQLG
1 SJQL, 11 LPVWN => 9 DLZS
3 PRMJ, 2 XNWV => 6 JHSJ
4 SJQL => 8 PJFBD
14 QNWD => 6 STHQ
5 CNLFV, 2 VFTG => 9 XNWV
17 LWNKB, 6 KBWF, 3 PLSCB => 8 KZDJ
6 LHWZQ, 5 LWNKB => 3 ZDWX
5 RPLCK, 2 LPVWN => 8 ZMFXQ
1 QNWD, 2 TKRT => 3 CRPGK
1 JBPHS, 1 XNWV => 6 TLRST
21 ZDWX, 3 FZDP, 4 CRPGK => 6 PDTP
1 JCVP => 1 WXDVT
2 CRPGK => 9 FGVL
4 DQFL, 2 VNMV => 1 HGCR
2 GVRK, 2 VCFX, 3 PJFBD, 1 PLSCB, 23 FZDP, 22 PCSM, 1 JLVQ => 6 HFHL
1 CRPGK, 5 PJFBD, 4 XTCP => 8 PLSCB
1 HTZW, 17 FGVL => 3 LHWZQ
2 KBWF => 4 DQKLC
2 LHWZQ => 2 PRMJ
2 DLZS, 2 VCFX, 15 PDTP, 14 ZDWX, 35 NBZC, 20 JVMF, 1 BGWMS => 3 DWRH
2 TKVCX, 6 RPLCK, 2 HTZW => 4 XTCP
8 CNLFV, 1 NRSD, 1 VFTG => 9 VFZX
1 TLRST => 4 WDKW
9 VFCZG => 7 GJHX
4 FZDP => 8 JLVQ
2 ZMFXQ, 2 STHQ => 6 QDZB
2 SJQL, 8 ZDWX, 6 LPRL, 6 WXDVT, 1 TPRT, 1 JNWJ => 8 KLJMS
6 JBPHS, 2 ZBLC => 6 HTZW
1 PDTP, 2 LHWZQ => 8 JNWJ
8 ZBLC => 7 TKVCX
2 WDKW, 31 QDZB => 4 PCSM
15 GJHX, 5 TKVCX => 7 FZDP
15 SJQL, 3 PRMJ => 4 JCVP
31 CNLFV => 1 TGCW
1 TLRST, 2 WDKW => 9 KBWF
102 ORE => 7 VNMV
103 ORE => 5 CNLFV
163 ORE => 2 VFTG
5 NRSD, 1 STHQ => 3 VFCZG
16 LPVWN, 13 KBWF => 2 BGWMS
5 BGWMS, 11 SJQL, 9 FZDP => 6 NBZC
175 ORE => 7 NRSD
5 HTZW => 4 LPVWN
4 PRMJ => 7 JVMF
6 PCSM, 8 DQKLC => 7 LPRL
2 CNLFV => 7 TKRT
3 FZDP => 3 LWNKB
1 HTZW => 4 RPLCK
  `;
}
