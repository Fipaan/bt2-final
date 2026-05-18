source .env
trap 'hide-env-vars "$BASH_COMMAND"' DEBUG

forge script script/Verify.s.sol \
    --rpc-url arbitrum \
    --with-gas-price 100000000
