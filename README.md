# airdrop-tools
Scripts to facilitate an ESDT token airdrop on Elrond

# Get Stakers
```npm i```

Update ```STAKE_CONTRACT``` and ```DROP_MULTIPLIER``` variables in ```getStakers.js```

```npm start```

stakes.xlsx file is generated with the following format:

address, drop amount(HEX), user active stake, drop amount

# ERDPY Snippets

Create input file ```airdrop_list.csv``` with the following format:

address, drop amount(HEX)

Start a dry run of the drop with
```source ./airdrop.snippets.sh && airDropStart```

Uncomment ```#--send``` to start the airdrop for real
