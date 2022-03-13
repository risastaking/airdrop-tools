import fetch from "node-fetch";
import * as XLSX from "xlsx/xlsx.mjs";
import * as fs from "fs";
import pkg from "bignumber.js";
const { BigNumber } = pkg;
XLSX.set_fs(fs);

const STAKE_CONTRACT =
  "erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqthllllsy5r6rh";
const TRANSACTIONS_SIZE = 10000;
const DROP_MULTIPLIER = new BigNumber(167000).precision(18);

const transactions = fetch(
  `https://api.elrond.com/transactions?from=0&size=${TRANSACTIONS_SIZE}&sender=${STAKE_CONTRACT}&receiver=${STAKE_CONTRACT}&condition=should&fields=txHash,receiver,receiverShard,sender,senderShard,status,timestamp,value,tokenValue,tokenIdentifier,action,results`
);

let stakerAddresses = (
  await transactions.then((r) => {
    return r.json();
  })
)
  .filter((t) => t.status === "success")
  .filter((t) => t.action?.name === "delegate")
  .map((t) => t.sender);

const stakers = Array.from(new Set(stakerAddresses)); //dedup

const delay = (ms = 500) => new Promise((r) => setTimeout(r, ms));

const getDataSeries = async (items) => {
  const stakes = new Set();
  for (let index = 0; index < items.length; index++) {
    await delay();
    const contents = await fetch(
      `https://elrondscan.com/api/wallet/api/delegation?addresses[]=${items[index]}`
    ).then((r) => {
      return r.json();
    });
    const activeStake = contents
      .filter(
        (s) =>
          s.filter(
            (x) => x.contract === STAKE_CONTRACT && x.userActiveStake != "0"
          )?.length > 0
      )
      .flatMap((f) =>
        f
          .filter((x) => x.contract === STAKE_CONTRACT)
          .flatMap((f) => {
            let stake_big = BigNumber(f.userActiveStake).precision(18);
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
              f.userActiveStake,
              dropAmount_big.toFixed(),
            ];
          })
      );
    console.log(activeStake);
    stakes.add(activeStake);
  }
  return stakes;
};

const stakes = await getDataSeries(stakers);

const wb = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(
  wb,
  XLSX.utils.aoa_to_sheet([...stakes]),
  "Stakes"
);

XLSX.writeFile(wb, "stakes.xlsx");

console.log("#stakes = ", stakes.length);
