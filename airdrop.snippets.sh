PEM="path/to/pemfile.pem"
TOKEN_ID_HEX="524953412d633131356337"
PROXY=https://gateway.elrond.com

# ESDTTransfer@524953412d633131356337@021e19e0c9bab2400000
airDropStart() {
  fileInput='airdrop_list.csv'
  while IFS="," read -r receiver amount; do

    echo "receiver: $receiver, amount: ${amount%%[[:space:]]}"
    erdpy --verbose tx new --outfile="sent-tx-$receiver.json" \
      --pem=${PEM} --recall-nonce --receiver=$receiver --value=0 \
      --gas-limit 500000 --chain=1 --proxy=${PROXY} \
      --data=ESDTTransfer@${TOKEN_ID_HEX}@${amount%%[[:space:]]} #\
      #--send --wait-result
  done < $fileInput
}

#FreezeTransaction {
#    Sender: <account address of the token manager>
#    Receiver: erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqzllls8a5w6u
#    Value: 0
#    GasLimit: 60000000
#    Data: "freeze" +
#          "@" + <token identifier in hexadecimal encoding> +
#          "@" + <account address to freeze in hexadecimal encoding>
#}
freeze() {
    erdpy --verbose tx new --outfile="freeze-tx-$receiver_addr.json" \
      --pem=${PEM} --recall-nonce --receiver=erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqzllls8a5w6u --value=0 \
      --gas-limit 60000000 --chain=1 --proxy=${PROXY} \
      --data=freeze@524953412d633131356337@60bce65d5a09af03a7d5c2e847bb2a0cceebf6f7ad1c1327c6d22c21214a8d67 \
      --send
}

wipe() {

    erdpy --verbose tx new --outfile="freeze-tx-$receiver_addr.json" \
      --pem=${PEM} --recall-nonce --receiver=erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqzllls8a5w6u --value=0 \
      --gas-limit 60000000 --chain=1 --proxy=${PROXY} \
      --data=wipe@524953412d633131356337@60bce65d5a09af03a7d5c2e847bb2a0cceebf6f7ad1c1327c6d22c21214a8d67 \
      --send

    sleep 10

    erdpy --verbose tx new --outfile="wipe-tx-$receiver_addr.json" \
      --pem=${PEM} --recall-nonce --receiver=erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqzllls8a5w6u --value=0 \
      --gas-limit 60000000 --chain=1 --proxy=${PROXY} \
      --data=wipe@524953412d633131356337@32feb0d704081a0bf86825cbb514a55397db849b06273be8bb0a33be744dfe6c \
      --send
}
