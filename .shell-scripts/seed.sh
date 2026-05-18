source .env
trap 'hide-env-vars "$BASH_COMMAND"' DEBUG

forge script script/Seed.s.sol \
    --broadcast --rpc-url arbitrum \
    --private-key $PRIVATE_KEY \
    --with-gas-price 100000000
