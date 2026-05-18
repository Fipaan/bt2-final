Compiling 127 files with Solc 0.8.33
Solc 0.8.33 finished in 12.14s
Compiler run successful with warnings:
Warning (5574): Contract code size is 30599 bytes and exceeds 24576 bytes (a limit introduced in Spurious Dragon). This contract may not be deployable on Mainnet. Consider enabling the optimizer (with a low "runs" value!), turning off revert strings, or using libraries.
  --> src/dao/MyGovernor.sol:17:1:
   |
17 | contract MyGovernor is
   | ^ (Relevant source part starts here and spans across multiple lines).

Warning (5574): Contract code size is 184346 bytes and exceeds 24576 bytes (a limit introduced in Spurious Dragon). This contract may not be deployable on Mainnet. Consider enabling the optimizer (with a low "runs" value!), turning off revert strings, or using libraries.
  --> script/Deploy.s.sol:31:1:
   |
31 | contract Deploy is Script {
   | ^ (Relevant source part starts here and spans across multiple lines).

Warning (3860): Contract initcode size is 184613 bytes and exceeds 49152 bytes (a limit introduced in Shanghai). This contract may not be deployable on Mainnet. Consider enabling the optimizer (with a low "runs" value!), turning off revert strings, or using libraries.
  --> script/Deploy.s.sol:31:1:
   |
31 | contract Deploy is Script {
   | ^ (Relevant source part starts here and spans across multiple lines).

Warning (3860): Contract initcode size is 72622 bytes and exceeds 49152 bytes (a limit introduced in Shanghai). This contract may not be deployable on Mainnet. Consider enabling the optimizer (with a low "runs" value!), turning off revert strings, or using libraries.
  --> test/amm/AMM.t.sol:57:1:
   |
57 | contract AMMTest is Test {
   | ^ (Relevant source part starts here and spans across multiple lines).

Warning (3860): Contract initcode size is 53995 bytes and exceeds 49152 bytes (a limit introduced in Shanghai). This contract may not be deployable on Mainnet. Consider enabling the optimizer (with a low "runs" value!), turning off revert strings, or using libraries.
  --> test/amm/Equestria1155.t.sol:60:1:
   |
60 | contract Equestria1155Test is Test {
   | ^ (Relevant source part starts here and spans across multiple lines).

Warning (3860): Contract initcode size is 85794 bytes and exceeds 49152 bytes (a limit introduced in Shanghai). This contract may not be deployable on Mainnet. Consider enabling the optimizer (with a low "runs" value!), turning off revert strings, or using libraries.
  --> test/dao/BoxTest.t.sol:12:1:
   |
12 | contract BoxTest is Test {
   | ^ (Relevant source part starts here and spans across multiple lines).

Warning (3860): Contract initcode size is 104088 bytes and exceeds 49152 bytes (a limit introduced in Shanghai). This contract may not be deployable on Mainnet. Consider enabling the optimizer (with a low "runs" value!), turning off revert strings, or using libraries.
  --> test/dao/FullFlow.t.sol:14:1:
   |
14 | contract FullFlowTest is Test {
   | ^ (Relevant source part starts here and spans across multiple lines).

Warning (3860): Contract initcode size is 49603 bytes and exceeds 49152 bytes (a limit introduced in Shanghai). This contract may not be deployable on Mainnet. Consider enabling the optimizer (with a low "runs" value!), turning off revert strings, or using libraries.
 --> test/dao/GovernanceToken.t.sol:8:1:
  |
8 | contract GovernanceTokenTest is Test {
  | ^ (Relevant source part starts here and spans across multiple lines).

Warning (3860): Contract initcode size is 98736 bytes and exceeds 49152 bytes (a limit introduced in Shanghai). This contract may not be deployable on Mainnet. Consider enabling the optimizer (with a low "runs" value!), turning off revert strings, or using libraries.
  --> test/dao/MyGovernor.t.sol:13:1:
   |
13 | contract MyGovernorTest is Test {
   | ^ (Relevant source part starts here and spans across multiple lines).

Warning (3860): Contract initcode size is 50889 bytes and exceeds 49152 bytes (a limit introduced in Shanghai). This contract may not be deployable on Mainnet. Consider enabling the optimizer (with a low "runs" value!), turning off revert strings, or using libraries.
  --> test/factory/GameTokenFactory.t.sol:12:1:
   |
12 | contract GameTokenFactoryTest is Test {
   | ^ (Relevant source part starts here and spans across multiple lines).

Warning (3860): Contract initcode size is 108019 bytes and exceeds 49152 bytes (a limit introduced in Shanghai). This contract may not be deployable on Mainnet. Consider enabling the optimizer (with a low "runs" value!), turning off revert strings, or using libraries.
  --> test/invariant/Invariants.t.sol:77:1:
   |
77 | contract InvariantTests is Test {
   | ^ (Relevant source part starts here and spans across multiple lines).

Warning (3860): Contract initcode size is 89024 bytes and exceeds 49152 bytes (a limit introduced in Shanghai). This contract may not be deployable on Mainnet. Consider enabling the optimizer (with a low "runs" value!), turning off revert strings, or using libraries.
  --> test/vault/NFTRentalVault.t.sol:12:1:
   |
12 | contract NFTRentalVaultTest is Test {
   | ^ (Relevant source part starts here and spans across multiple lines).

Analysing contracts...
Running tests...

Ran 4 tests for test/vulnerability/VulnerabilityTest.t.sol:VulnerabilityTest
[PASS] test_accessControl_fixed_onlyOwnerCanWithdraw() (gas: 314441)
[PASS] test_accessControl_vulnerable_anyoneCanWithdraw() (gas: 281845)
[PASS] test_reentrancy_fixed_attackReverts() (gas: 703942)
[PASS] test_reentrancy_vulnerable_attackSucceeds() (gas: 831976)
Suite result: ok. 4 passed; 0 failed; 0 skipped; finished in 1.91ms (1.58ms CPU time)

Ran 5 tests for test/dao/Treasury.t.sol:TreasuryTest
[PASS] test_receiveETH() (gas: 17236)
[PASS] test_withdrawETH_onlyTimelock() (gas: 11577)
[PASS] test_withdrawETH_works() (gas: 49445)
[PASS] test_withdrawToken_onlyTimelock() (gas: 52596)
[PASS] test_withdrawToken_works() (gas: 68512)
Suite result: ok. 5 passed; 0 failed; 0 skipped; finished in 3.60ms (2.50ms CPU time)

Ran 4 tests for test/dao/TokenVesting.t.sol:TokenVestingTest
[PASS] testCannotReleaseBeforeVesting() (gas: 20067)
[PASS] testFullVestingAndRelease() (gas: 87753)
[PASS] testInitialVesting() (gas: 18109)
[PASS] testLinearVestingMidpoint() (gas: 21466)
Suite result: ok. 4 passed; 0 failed; 0 skipped; finished in 6.81ms (5.37ms CPU time)

Ran 1 test for test/dao/FullFlow.t.sol:FullFlowTest
[PASS] testFullDAOFlow() (gas: 804065)
Suite result: ok. 1 passed; 0 failed; 0 skipped; finished in 18.66ms (9.91ms CPU time)

Ran 7 tests for test/chainlink/VRFConsumer.t.sol:VRFConsumerTest
[PASS] testFuzz_fulfillRandomWords_anyWord(uint256) (runs: 256, μ: 148054, ~: 148676)
[PASS] test_fulfillRandomWords_emitsEvent() (gas: 148405)
[PASS] test_fulfillRandomWords_storesResult() (gas: 148834)
[PASS] test_multipleRequests_independentResults() (gas: 236802)
[PASS] test_requestRandom_emitsEvent() (gas: 115858)
[PASS] test_requestRandom_returnsRequestId() (gas: 113059)
[PASS] test_requestRandom_storesSender() (gas: 115793)
Suite result: ok. 7 passed; 0 failed; 0 skipped; finished in 312.68ms (68.83ms CPU time)

Ran 12 tests for test/dao/MyGovernor.t.sol:MyGovernorTest
[PASS] test_defeated() (gas: 115137)
[PASS] test_defeated_quorum_not_met() (gas: 179002)
[PASS] test_delegation() (gas: 86575)
[PASS] test_execute() (gas: 410722)
[PASS] test_proposal_threshold_blocks_low_balance() (gas: 167871)
[PASS] test_propose() (gas: 86183)
[PASS] test_queue() (gas: 345324)
[PASS] test_state_active() (gas: 97045)
[PASS] test_succeeded_state() (gas: 234042)
[PASS] test_vote_abstain() (gas: 162778)
[PASS] test_vote_against() (gas: 162450)
[PASS] test_vote_for() (gas: 162658)
Suite result: ok. 12 passed; 0 failed; 0 skipped; finished in 312.78ms (34.04ms CPU time)

Ran 3 tests for test/fork/Fork.t.sol:ForkTest
[PASS] test_fork_chainlinkPriceFeed() (gas: 371016)
[PASS] test_fork_chainlinkStalenessCheck() (gas: 374667)
[PASS] test_fork_usdcTransfer() (gas: 54848)
Suite result: ok. 3 passed; 0 failed; 0 skipped; finished in 2.27s (4.75s CPU time)

Ran 11 tests for test/chainlink/PriceFeedConsumer.t.sol:PriceFeedConsumerTest
[PASS] test_getLatestPrice_exactThresholdNotStale() (gas: 20199)
[PASS] test_getLatestPrice_returnsPrice() (gas: 16398)
[PASS] test_getLatestPrice_returnsUpdatedAt() (gas: 16604)
[PASS] test_getLatestPrice_revertsOnNegativePrice() (gas: 27115)
[PASS] test_getLatestPrice_revertsOnZeroPrice() (gas: 22059)
[PASS] test_getLatestPrice_revertsWhenStale() (gas: 20601)
[PASS] test_mockAggregator_description() (gas: 7913)
[PASS] test_mockAggregator_getRoundData() (gas: 12187)
[PASS] test_mockAggregator_setPrice() (gas: 24029)
[PASS] test_mockAggregator_setUpdatedAt_makesStale() (gas: 27617)
[PASS] test_mockAggregator_version() (gas: 6837)
Suite result: ok. 11 passed; 0 failed; 0 skipped; finished in 82.00s (3.77ms CPU time)

Ran 20 tests for test/factory/GameTokenFactory.t.sol:GameTokenFactoryTest
[PASS] test_create2_deploysToken() (gas: 997432)
[PASS] test_create2_deterministicAddress() (gas: 1006056)
[PASS] test_create2_emitsEvent() (gas: 1003487)
[PASS] test_create2_revertsOnSaltReuse() (gas: 1040461293)
[PASS] test_create_deploysToken() (gas: 996015)
[PASS] test_create_differentAddressEachTime() (gas: 1964826)
[PASS] test_create_emitsEvent() (gas: 1001725)
[PASS] test_create_ownerIsCallerMessage() (gas: 998142)
[PASS] test_create_trackedInAllTokens() (gas: 1965871)
[PASS] test_proxy_cannotReinitialize() (gas: 232584)
[PASS] test_proxy_initialize() (gas: 239678)
[PASS] test_proxy_mint() (gas: 282648)
[PASS] test_proxy_mintOnlyOwner() (gas: 230260)
[PASS] test_proxy_version_v1() (gas: 231653)
[PASS] test_upgrade_onlyOwner() (gas: 234206)
[PASS] test_upgrade_statePreserved() (gas: 300149)
[PASS] test_upgrade_toV2() (gas: 247058)
[PASS] test_upgrade_v2_capEnforced() (gas: 276326)
[PASS] test_upgrade_v2_initializeCap() (gas: 271329)
[PASS] test_upgrade_v2_mintUnderCap() (gas: 325097)
Suite result: ok. 20 passed; 0 failed; 0 skipped; finished in 82.00s (29.87ms CPU time)

Ran 18 tests for test/vault/NFTRentalVault.t.sol:NFTRentalVaultTest
[PASS] testFuzz_depositRedeem_roundingInvariant(uint256) (runs: 256, μ: 115420, ~: 115645)
[PASS] testFuzz_injectYield_increasesTotalAssets(uint256) (runs: 256, μ: 159958, ~: 160068)
[PASS] test_boost_givesMoreShares() (gas: 332576)
[PASS] test_deposit_assetsTransferred() (gas: 128040)
[PASS] test_deposit_basic() (gas: 122399)
[PASS] test_injectYield_increasesAssets() (gas: 158145)
[PASS] test_injectYield_onlyOwner() (gas: 13572)
[PASS] test_previewDeposit_matchesActual() (gas: 128921)
[PASS] test_redeem_basic() (gas: 118582)
[PASS] test_setBoostBps_belowBaseReverts() (gas: 16280)
[PASS] test_setBoostBps_onlyOwner() (gas: 13066)
[PASS] test_setBoostBps_updated() (gas: 24469)
[PASS] test_stakeNFT() (gas: 161709)
[PASS] test_stakeNFT_doubleStakeReverts() (gas: 165941)
[PASS] test_stakeNFT_wrongId() (gas: 52518)
[PASS] test_unstakeNFT() (gas: 151286)
[PASS] test_unstakeNFT_notRenterReverts() (gas: 169273)
[PASS] test_withdraw_basic() (gas: 122311)
Suite result: ok. 18 passed; 0 failed; 0 skipped; finished in 82.00s (672.85ms CPU time)

Ran 13 tests for test/amm/Equestria1155.t.sol:Equestria1155Test
[PASS] testBalanceOfBatch() (gas: 33662)
[PASS] testCraftDoubleDropOnLuckyRoll() (gas: 324904)
[PASS] testCraftRevertsOnInsufficientResources() (gas: 78685)
[PASS] testCraftSuccessMintsNFTAndBurnsResources() (gas: 359080)
[PASS] testMintBatchAndBalances() (gas: 72020)
[PASS] testMintSingleFungible() (gas: 32828)
[PASS] testSafeBatchTransferFromApprovedOperatorToGoodReceiver() (gas: 153376)
[PASS] testSafeTransferFromApprovedOperatorToEOA() (gas: 77770)
[PASS] testSetGovernor_onlyOwner() (gas: 16039)
[PASS] testSetRecipe_governorCanUpdate() (gas: 96815)
[PASS] testSetRecipe_onlyGovernor() (gas: 18516)
[PASS] testTransferToRejectingContractReverts() (gas: 98707)
[PASS] testUriSubstitution() (gas: 195016)
Suite result: ok. 13 passed; 0 failed; 0 skipped; finished in 82.00s (18.09ms CPU time)

Ran 44 tests for test/amm/AMM.t.sol:AMMTest
[PASS] invariant_kNeverDecreases() (runs: 256, calls: 128000, reverts: 989)

╭------------+-----------------+-------+---------+----------╮
| Contract   | Selector        | Calls | Reverts | Discards |
+===========================================================+
| AMMHandler | addLiquidity    | 42773 | 328     | 0        |
|------------+-----------------+-------+---------+----------|
| AMMHandler | removeLiquidity | 42617 | 661     | 0        |
|------------+-----------------+-------+---------+----------|
| AMMHandler | swap            | 42610 | 0       | 0        |
╰------------+-----------------+-------+---------+----------╯

[PASS] testFuzz_addRemoveLiquidity_noLoss(uint256) (runs: 256, μ: 260498, ~: 261368)
[PASS] testFuzz_getAmountOut_alwaysLessThanInput(uint256) (runs: 256, μ: 9904, ~: 9351)
[PASS] testFuzz_getAmountOut_yulMatchesSolidity(uint256,uint256,uint256) (runs: 256, μ: 13357, ~: 13158)
[PASS] testFuzz_removeLiquidity_neverExceedsReserves(uint256) (runs: 256, μ: 248685, ~: 249554)
[PASS] testFuzz_swap_constantProduct(uint256) (runs: 256, μ: 299915, ~: 300049)
[PASS] test_addLiquidity_emitsEvent() (gas: 243489)
[PASS] test_addLiquidity_initial() (gas: 243271)
[PASS] test_addLiquidity_mintsLPTokens() (gas: 244602)
[PASS] test_addLiquidity_revertsZeroAmount() (gas: 19996)
[PASS] test_addLiquidity_slippageA() (gas: 252130)
[PASS] test_addLiquidity_slippageB() (gas: 252731)
[PASS] test_addLiquidity_subsequentKeepsRatio() (gas: 326805)
[PASS] test_benchmark_getAmountOut_solidity() (gas: 8552)
[PASS] test_benchmark_getAmountOut_yul() (gas: 7434)
[PASS] test_constructor_deploysLPToken() (gas: 3493)
[PASS] test_constructor_revertsIdenticalTokens() (gas: 67947)
[PASS] test_constructor_revertsZeroAddress() (gas: 67188)
[PASS] test_constructor_setsTokens() (gas: 13728)
[PASS] test_getAmountOut_basic() (gas: 8739)
[PASS] test_getAmountOut_matchesYul() (gas: 10797)
[PASS] test_getAmountOut_revertsZeroReserve() (gas: 11362)
[PASS] test_lpToken_approve() (gas: 44549)
[PASS] test_lpToken_decimals() (gas: 7376)
[PASS] test_lpToken_transfer() (gas: 280937)
[PASS] test_lpToken_transferFrom() (gas: 269401)
[PASS] test_lpToken_transferFrom_maxAllowanceNotReduced() (gas: 287161)
[PASS] test_lpToken_transferFrom_reducesAllowance() (gas: 312577)
[PASS] test_lpToken_transferFrom_revertsInsufficientAllowance() (gas: 250233)
[PASS] test_lpToken_transfer_revertsInsufficientBalance() (gas: 18691)
[PASS] test_quotes_nonZeroAfterLiquidity() (gas: 247730)
[PASS] test_quotes_zeroBeforeLiquidity() (gas: 12425)
[PASS] test_removeLiquidity_basic() (gas: 248132)
[PASS] test_removeLiquidity_emitsEvent() (gas: 248964)
[PASS] test_removeLiquidity_reservesDecreased() (gas: 248908)
[PASS] test_removeLiquidity_revertsZero() (gas: 248078)
[PASS] test_removeLiquidity_slippage() (gas: 279932)
[PASS] test_swap_AtoB() (gas: 298057)
[PASS] test_swap_BtoA() (gas: 298392)
[PASS] test_swap_emitsEvent() (gas: 294875)
[PASS] test_swap_revertsInvalidToken() (gas: 250060)
[PASS] test_swap_revertsSlippage() (gas: 254314)
[PASS] test_swap_revertsZeroAmount() (gas: 252675)
[PASS] test_swap_updatesReserves() (gas: 291527)
Suite result: ok. 44 passed; 0 failed; 0 skipped; finished in 82.00s (59.69s CPU time)

Ran 7 tests for test/dao/GovernanceToken.t.sol:GovernanceTokenTest
[PASS] testDelegation() (gas: 97880)
[PASS] testDelegationUpdate() (gas: 189772)
[PASS] testFuzz_delegate_votingPowerMatchesBalance(uint256) (runs: 256, μ: 126755, ~: 126949)
[PASS] testFuzz_transfer_conservesSupply(uint256) (runs: 256, μ: 45318, ~: 44977)
[PASS] testInitialDistribution() (gas: 32637)
[PASS] testPermit() (gas: 329804)
[PASS] testVotingPowerSnapshot() (gas: 98710)
Suite result: ok. 7 passed; 0 failed; 0 skipped; finished in 82.06s (82.18s CPU time)

Ran 9 tests for test/invariant/Invariants.t.sol:InvariantTests
[PASS] invariant_amm_kNeverDecreases() (runs: 256, calls: 128000, reverts: 473)

╭-----------------+-----------------+-------+---------+----------╮
| Contract        | Selector        | Calls | Reverts | Discards |
+================================================================+
| AMMHandler      | addLiquidity    | 18299 | 121     | 0        |
|-----------------+-----------------+-------+---------+----------|
| AMMHandler      | removeLiquidity | 18323 | 352     | 0        |
|-----------------+-----------------+-------+---------+----------|
| AMMHandler      | swap            | 18441 | 0       | 0        |
|-----------------+-----------------+-------+---------+----------|
| TreasuryHandler | deposit         | 18333 | 0       | 0        |
|-----------------+-----------------+-------+---------+----------|
| TreasuryHandler | withdraw        | 18189 | 0       | 0        |
|-----------------+-----------------+-------+---------+----------|
| VaultHandler    | deposit         | 18167 | 0       | 0        |
|-----------------+-----------------+-------+---------+----------|
| VaultHandler    | redeem          | 18248 | 0       | 0        |
╰-----------------+-----------------+-------+---------+----------╯

[PASS] invariant_amm_lpSupplyNonZeroWhenReservesNonZero() (runs: 256, calls: 128000, reverts: 464)

╭-----------------+-----------------+-------+---------+----------╮
| Contract        | Selector        | Calls | Reverts | Discards |
+================================================================+
| AMMHandler      | addLiquidity    | 18299 | 109     | 0        |
|-----------------+-----------------+-------+---------+----------|
| AMMHandler      | removeLiquidity | 18323 | 355     | 0        |
|-----------------+-----------------+-------+---------+----------|
| AMMHandler      | swap            | 18441 | 0       | 0        |
|-----------------+-----------------+-------+---------+----------|
| TreasuryHandler | deposit         | 18333 | 0       | 0        |
|-----------------+-----------------+-------+---------+----------|
| TreasuryHandler | withdraw        | 18189 | 0       | 0        |
|-----------------+-----------------+-------+---------+----------|
| VaultHandler    | deposit         | 18167 | 0       | 0        |
|-----------------+-----------------+-------+---------+----------|
| VaultHandler    | redeem          | 18248 | 0       | 0        |
╰-----------------+-----------------+-------+---------+----------╯

[PASS] invariant_govToken_totalSupplyConstant() (runs: 256, calls: 128000, reverts: 478)

╭-----------------+-----------------+-------+---------+----------╮
| Contract        | Selector        | Calls | Reverts | Discards |
+================================================================+
| AMMHandler      | addLiquidity    | 18299 | 122     | 0        |
|-----------------+-----------------+-------+---------+----------|
| AMMHandler      | removeLiquidity | 18323 | 356     | 0        |
|-----------------+-----------------+-------+---------+----------|
| AMMHandler      | swap            | 18441 | 0       | 0        |
|-----------------+-----------------+-------+---------+----------|
| TreasuryHandler | deposit         | 18333 | 0       | 0        |
|-----------------+-----------------+-------+---------+----------|
| TreasuryHandler | withdraw        | 18189 | 0       | 0        |
|-----------------+-----------------+-------+---------+----------|
| VaultHandler    | deposit         | 18167 | 0       | 0        |
|-----------------+-----------------+-------+---------+----------|
| VaultHandler    | redeem          | 18248 | 0       | 0        |
╰-----------------+-----------------+-------+---------+----------╯

[PASS] invariant_treasury_balanceEqualsDepositedMinusWithdrawn() (runs: 256, calls: 128000, reverts: 471)

╭-----------------+-----------------+-------+---------+----------╮
| Contract        | Selector        | Calls | Reverts | Discards |
+================================================================+
| AMMHandler      | addLiquidity    | 18299 | 115     | 0        |
|-----------------+-----------------+-------+---------+----------|
| AMMHandler      | removeLiquidity | 18323 | 356     | 0        |
|-----------------+-----------------+-------+---------+----------|
| AMMHandler      | swap            | 18441 | 0       | 0        |
|-----------------+-----------------+-------+---------+----------|
| TreasuryHandler | deposit         | 18333 | 0       | 0        |
|-----------------+-----------------+-------+---------+----------|
| TreasuryHandler | withdraw        | 18189 | 0       | 0        |
|-----------------+-----------------+-------+---------+----------|
| VaultHandler    | deposit         | 18167 | 0       | 0        |
|-----------------+-----------------+-------+---------+----------|
| VaultHandler    | redeem          | 18248 | 0       | 0        |
╰-----------------+-----------------+-------+---------+----------╯

[PASS] invariant_treasury_balanceNonNegative() (runs: 256, calls: 128000, reverts: 493)

╭-----------------+-----------------+-------+---------+----------╮
| Contract        | Selector        | Calls | Reverts | Discards |
+================================================================+
| AMMHandler      | addLiquidity    | 18299 | 128     | 0        |
|-----------------+-----------------+-------+---------+----------|
| AMMHandler      | removeLiquidity | 18323 | 365     | 0        |
|-----------------+-----------------+-------+---------+----------|
| AMMHandler      | swap            | 18441 | 0       | 0        |
|-----------------+-----------------+-------+---------+----------|
| TreasuryHandler | deposit         | 18333 | 0       | 0        |
|-----------------+-----------------+-------+---------+----------|
| TreasuryHandler | withdraw        | 18189 | 0       | 0        |
|-----------------+-----------------+-------+---------+----------|
| VaultHandler    | deposit         | 18167 | 0       | 0        |
|-----------------+-----------------+-------+---------+----------|
| VaultHandler    | redeem          | 18248 | 0       | 0        |
╰-----------------+-----------------+-------+---------+----------╯

[PASS] invariant_vault_redeemNeverExceedsDeposit() (runs: 256, calls: 128000, reverts: 465)

╭-----------------+-----------------+-------+---------+----------╮
| Contract        | Selector        | Calls | Reverts | Discards |
+================================================================+
| AMMHandler      | addLiquidity    | 18299 | 131     | 0        |
|-----------------+-----------------+-------+---------+----------|
| AMMHandler      | removeLiquidity | 18323 | 334     | 0        |
|-----------------+-----------------+-------+---------+----------|
| AMMHandler      | swap            | 18441 | 0       | 0        |
|-----------------+-----------------+-------+---------+----------|
| TreasuryHandler | deposit         | 18333 | 0       | 0        |
|-----------------+-----------------+-------+---------+----------|
| TreasuryHandler | withdraw        | 18189 | 0       | 0        |
|-----------------+-----------------+-------+---------+----------|
| VaultHandler    | deposit         | 18167 | 0       | 0        |
|-----------------+-----------------+-------+---------+----------|
| VaultHandler    | redeem          | 18248 | 0       | 0        |
╰-----------------+-----------------+-------+---------+----------╯

[PASS] invariant_vault_totalAssetsMatchesBalance() (runs: 256, calls: 128000, reverts: 504)

╭-----------------+-----------------+-------+---------+----------╮
| Contract        | Selector        | Calls | Reverts | Discards |
+================================================================+
| AMMHandler      | addLiquidity    | 18299 | 137     | 0        |
|-----------------+-----------------+-------+---------+----------|
| AMMHandler      | removeLiquidity | 18323 | 367     | 0        |
|-----------------+-----------------+-------+---------+----------|
| AMMHandler      | swap            | 18441 | 0       | 0        |
|-----------------+-----------------+-------+---------+----------|
| TreasuryHandler | deposit         | 18333 | 0       | 0        |
|-----------------+-----------------+-------+---------+----------|
| TreasuryHandler | withdraw        | 18189 | 0       | 0        |
|-----------------+-----------------+-------+---------+----------|
| VaultHandler    | deposit         | 18167 | 0       | 0        |
|-----------------+-----------------+-------+---------+----------|
| VaultHandler    | redeem          | 18248 | 0       | 0        |
╰-----------------+-----------------+-------+---------+----------╯

[PASS] invariant_vault_totalAssetsNonNegative() (runs: 256, calls: 128000, reverts: 475)

╭-----------------+-----------------+-------+---------+----------╮
| Contract        | Selector        | Calls | Reverts | Discards |
+================================================================+
| AMMHandler      | addLiquidity    | 18299 | 116     | 0        |
|-----------------+-----------------+-------+---------+----------|
| AMMHandler      | removeLiquidity | 18323 | 359     | 0        |
|-----------------+-----------------+-------+---------+----------|
| AMMHandler      | swap            | 18441 | 0       | 0        |
|-----------------+-----------------+-------+---------+----------|
| TreasuryHandler | deposit         | 18333 | 0       | 0        |
|-----------------+-----------------+-------+---------+----------|
| TreasuryHandler | withdraw        | 18189 | 0       | 0        |
|-----------------+-----------------+-------+---------+----------|
| VaultHandler    | deposit         | 18167 | 0       | 0        |
|-----------------+-----------------+-------+---------+----------|
| VaultHandler    | redeem          | 18248 | 0       | 0        |
╰-----------------+-----------------+-------+---------+----------╯

[PASS] invariant_vault_totalSupplyNonNegative() (runs: 256, calls: 128000, reverts: 493)

╭-----------------+-----------------+-------+---------+----------╮
| Contract        | Selector        | Calls | Reverts | Discards |
+================================================================+
| AMMHandler      | addLiquidity    | 18299 | 123     | 0        |
|-----------------+-----------------+-------+---------+----------|
| AMMHandler      | removeLiquidity | 18323 | 370     | 0        |
|-----------------+-----------------+-------+---------+----------|
| AMMHandler      | swap            | 18441 | 0       | 0        |
|-----------------+-----------------+-------+---------+----------|
| TreasuryHandler | deposit         | 18333 | 0       | 0        |
|-----------------+-----------------+-------+---------+----------|
| TreasuryHandler | withdraw        | 18189 | 0       | 0        |
|-----------------+-----------------+-------+---------+----------|
| VaultHandler    | deposit         | 18167 | 0       | 0        |
|-----------------+-----------------+-------+---------+----------|
| VaultHandler    | redeem          | 18248 | 0       | 0        |
╰-----------------+-----------------+-------+---------+----------╯

Suite result: ok. 9 passed; 0 failed; 0 skipped; finished in 93.73s (578.73s CPU time)

Ran 14 test suites in 93.73s (588.73s CPU time): 158 tests passed, 0 failed, 0 skipped (158 total tests)
Wrote LCOV report.
