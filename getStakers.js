import fetch from "node-fetch";
import * as XLSX from "xlsx/xlsx.mjs";
import * as fs from "fs";
import pkg from "bignumber.js";
const { BigNumber } = pkg;
XLSX.set_fs(fs);

const STAKE_CONTRACT =
  "erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqthllllsy5r6rh";
const API_SIZE = 10000;
const DROP_MULTIPLIER = new BigNumber(167000).precision(18);

fetch(
  `https://index.elrond.com/delegators/_search?q=contract:${STAKE_CONTRACT}&size=${API_SIZE}`
)
  .then((r) => r.json())
  .then((r) =>
    r.hits.hits
      .map((h) => h._source)
      .filter((t) => t.activeStakeNum > 0)
      .filter((t) => t.contract === STAKE_CONTRACT)
      .map((f) => {
        let stake_big = BigNumber(f.activeStake).precision(18);
        let dropAmount_big = stake_big
          .multipliedBy(DROP_MULTIPLIER)
          .precision(18);
        let dropAmount_hex = dropAmount_big.toString(16);
        if (dropAmount_hex.length % 2 === 1) {
          console.log("padding needed");
          dropAmount_hex = "0" + dropAmount_hex;
        }
        console.log(`stake=${stake_big}`);
        console.log(`drop_amount=${dropAmount_big}`);
        console.log(`drop_hex=${dropAmount_hex}`);
        return [
          f.address,
          dropAmount_hex,
          f.activeStakeNum,
          dropAmount_big.toFixed(),
        ];
      })
  )
  .then((stakes) => {
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(
      wb,
      XLSX.utils.aoa_to_sheet([...stakes]),
      "Stakes"
    );

    XLSX.writeFile(wb, "stakes.xlsx");

    console.log("#stakes = ", stakes.length);
  });
