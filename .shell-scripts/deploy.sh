source .env
trap 'hide-env-vars "$BASH_COMMAND"' DEBUG

forge script script/Deploy.s.sol \
    --broadcast --rpc-url arbitrum \
    --private-key $PRIVATE_KEY \
    --with-gas-price 100000000
