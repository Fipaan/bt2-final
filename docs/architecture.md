---

## 4. Data Model - Storage Layouts

### GovernanceToken
| Slot | Variable | Type |
|------|----------|------|
| inherited | ERC20 storage | name, symbol, balances, allowances |
| inherited | ERC20Votes checkpoints | delegate mapping, checkpoint arrays |
| inherited | Nonces | nonces mapping |

### Equestria1155
| Slot | Variable | Type |
|------|----------|------|
| 0 | `_balances` | `mapping(uint256 => mapping(address => uint256))` |
| 1 | `_operatorApprovals` | `mapping(address => mapping(address => bool))` |
| 2 | `recipes` | `mapping(uint256 => Recipe)` |
| 3 | `_baseUri` | `string` |
| 4 | `contractOwner` | `address` (immutable) |
| 5 | `gameGovernor` | `address` |
| 6 | `dropBoostBps` | `uint256` |
| 7 | `pendingCraftUser` | `mapping(uint256 => address)` |
| 8 | `pendingCraftPonyId` | `mapping(uint256 => uint256)` |
| inherited | VRFConsumerBaseV2Plus | `s_vrfCoordinator` |
| inherited | ReentrancyGuard | `_status` |

### AMM
| Slot | Variable | Type |
|------|----------|------|
| 0 | `tokenA` | `address` (immutable) |
| 1 | `tokenB` | `address` (immutable) |
| 2 | `lpToken` | `address` (immutable) |
| 3 | `reserveA` | `uint256` |
| 4 | `reserveB` | `uint256` |
| inherited | ReentrancyGuard | `_status` |

### GameTokenV1 (UUPS - storage collision proof)
| Slot | Variable | Type | Notes |
|------|----------|------|-------|
| 0–99 | ERC20Upgradeable | name, symbol, balances | OZ reserved |
| 100–149 | OwnableUpgradeable | owner | OZ reserved |
| 150 | UUPSUpgradeable | - | no storage |
| 151+ | free for V1/V2 additions | | |

**V2 adds:** `mintCap` at slot 151. No collision with V1 since V1 uses no custom slots.

### NFTRentalVault
| Slot | Variable | Type |
|------|----------|------|
| inherited | ERC4626/ERC20 | shares, balances |
| inherited | Ownable | owner |
| inherited | ReentrancyGuard | _status |
| 0 | `nftContract` | `address` (immutable) |
| 1 | `boostedNftId` | `uint256` (immutable) |
| 2 | `boostBps` | `uint256` |
| 3 | `rentals` | `mapping(uint256 => Rental)` |
| 4 | `isRenting` | `mapping(address => bool)` |

---

## 5. Trust Assumptions

| Actor | Powers | Risk if Compromised |
|-------|--------|---------------------|
| Deployer | Initial token distribution, ERC-1155 owner, GameToken owner | Can mint unlimited game tokens, change NFT recipes before governance handoff |
| TimelockController | Controls Treasury, Box, Vault yield, NFT parameters | Can drain treasury, change game economics - mitigated by 2-day delay |
| MyGovernor | Queues timelock operations | Flash-loan attack possible - mitigated by 1-day voting delay and 4% quorum |
| Chainlink VRF | Source of randomness for loot drops | Manipulated randomness could bias drop rates - VRF is cryptographically secure |
| Chainlink Price Feed | ETH/USD price | Stale or manipulated price - mitigated by staleness check (1 hour threshold) |
| address(0) EXECUTOR | Anyone can execute ready timelock ops | Griefing risk is low - execution only proceeds after full governance lifecycle |

---

## 6. Design Decisions Log (ADRs)

### ADR-01: ERC-1155 over ERC-721
- **Context:** In-game items need both fungible resources and unique NFTs
- **Options:** ERC-721 (one contract per NFT type), ERC-1155 (single contract, multiple types)
- **Decision:** ERC-1155 - required by project scope, supports both fungible resources (HONESTY, KINDNESS, etc.) and semi-fungible NFTs (PINKIE_PIE, STARLIGHT_GLIMMER) in one contract
- **Consequences:** More complex transfer logic, but single contract deployment and batch operations

### ADR-02: AMM over Lending Pool
- **Context:** DeFi primitive required - either constant-product AMM or lending pool
- **Options:** Lending pool (LTV, health factor, liquidation), AMM (x·y=k)
- **Decision:** AMM - fits GameFi narrative (trading fungible resources), team more familiar with AMM mechanics, simpler to test invariants
- **Consequences:** No borrowing/lending functionality, but resource trading is more natural for a game economy

### ADR-03: Arbitrum Sepolia over other L2s
- **Context:** Must deploy to one of Arbitrum/Optimism/Base/zkSync Sepolia
- **Options:** All four testnets
- **Decision:** Arbitrum Sepolia - Chainlink VRF and price feeds available, accessible faucets, well-documented
- **Consequences:** Slightly higher L2 fees than Base Sepolia, but better tooling support

### ADR-04: Async VRF in craft()
- **Context:** Loot drop randomness requires VRF - but VRF is async
- **Options:** Synchronous mock randomness (block.timestamp), async VRF with pending state
- **Decision:** Async VRF - `block.timestamp` as randomness is explicitly forbidden by requirements; pending craft state stored in mapping
- **Consequences:** Two-step UX (craft request -> fulfillment), but cryptographically secure randomness

### ADR-05: UUPS over Transparent Proxy
- **Context:** Upgradeability required
- **Options:** Transparent proxy (admin slot), UUPS (upgrade logic in implementation)
- **Decision:** UUPS - lower deployment gas, upgrade authorization in contract logic, recommended by OZ for new projects
- **Consequences:** Implementation must include `_authorizeUpgrade`, accidental self-destruct risk mitigated by `_disableInitializers` in constructor

### ADR-06: Manual nonReentrant over OZ ReentrancyGuard in LPToken
- **Context:** LPToken needs reentrancy protection but is a minimal ERC-20
- **Options:** Inherit OZ ReentrancyGuard, implement manually
- **Decision:** Manual - LPToken is intentionally minimal, avoiding OZ inheritance keeps bytecode small and storage layout simple
- **Consequences:** Must ensure modifier is applied consistently - covered by Slither and test suite

---

## 7. Design Patterns Used

| Pattern | Where | Justification |
|---------|-------|---------------|
| Factory (CREATE + CREATE2) | `GameTokenFactory` | Deterministic token deployment, address prediction |
| UUPS Proxy | `GameTokenV1/V2` + `ERC1967Proxy` | Upgradeability with lower gas than transparent proxy |
| Checks-Effects-Interactions | `AMM`, `NFTRentalVault`, `Equestria1155` | Prevents reentrancy, documented in audit report |
| Access Control / Role-based | All contracts | `onlyOwner`, `onlyTimelock`, `onlyGovernor`, `onlyAmm` |
| Timelock | `TimelockController` | Governance actions delayed 2 days, prevents flash-loan governance attacks |
| Reentrancy Guard | `AMM`, `NFTRentalVault`, `Equestria1155` | OpenZeppelin ReentrancyGuard on all state-changing external functions |
| Oracle Adapter | `PriceFeedConsumer` | Abstracts Chainlink feed behind interface, enables mock substitution in tests |
