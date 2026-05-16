// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import {IERC165, IERC1155} from "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import {IERC1155Receiver}  from "@openzeppelin/contracts/token/ERC1155/IERC1155Receiver.sol";
import {ReentrancyGuard}   from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract Equestria1155 is IERC1155, ReentrancyGuard {
    uint256 public constant HONESTY     = 1;
    uint256 public constant KINDNESS    = 2;
    uint256 public constant LAUGHTER    = 3;
    uint256 public constant GENEROSITY  = 4;
    uint256 public constant LOYALTY     = 5;
    uint256 public constant MAGIC       = 6;

    uint256 public constant PINKIE_PIE        = 1001;
    uint256 public constant STARLIGHT_GLIMMER = 1002;

    struct Recipe {
        uint256 honesty;
        uint256 kindness;
        uint256 laughter;
        uint256 generosity;
        uint256 loyalty;
        uint256 magic;
    }
    // "non-fungible" token -> "fungible" price
    mapping(uint256 => Recipe) public recipes;
    // tokenId => owner => balance
    mapping(uint256 => mapping(address => uint256)) internal _balances;
    // owner => operator => approved
    mapping(address => mapping(address => bool)) internal _operatorApprovals;

    string internal _baseUri;
    address public immutable contractOwner;

    error NotOwner();
    error ZeroAddress();
    error NotApproved();
    error InsufficientBalance();
    error SmartContractNotAccepted();
    error SelfApproval();
    error IdValueArrLengthMismatch();
    error IdOwnerArrLengthMismatch();
    error TooManyIdFieldsInURL();
    error InvalidRecipe();
    error NotEnoughHonesty();
    error NotEnoughKindness();
    error NotEnoughLaughter();
    error NotEnoughGenerosity();
    error NotEnoughLoyalty();
    error NotEnoughMagic();

    constructor(string memory baseURI) {
        recipes[PINKIE_PIE] = Recipe({
            honesty:    15,
            kindness:   10,
            laughter:   100,
            generosity: 20,
            loyalty:    5,
            magic:      0
        });

        recipes[STARLIGHT_GLIMMER] = Recipe({
            honesty:    5,
            kindness:   3,
            laughter:   0,
            generosity: 0,
            loyalty:    15,
            magic:      80
        });

        uint256 idCount = 0;
        bytes memory uriBytes = bytes(baseURI);
        for (uint256 i = 3; i < uriBytes.length; ++i) {
            if (uriBytes[i-3] == '{' &&
                uriBytes[i-2] == 'i' &&
                uriBytes[i-1] == 'd' &&
                uriBytes[i]   == '}') {
                if (idCount > 0) revert TooManyIdFieldsInURL();
                idCount += 1;
            }
        }
        _baseUri = baseURI;
        contractOwner = msg.sender;
    }

    function uri(uint256 tokenId) public view returns (string memory) {
        bytes memory uriBytes = bytes(_baseUri);
        bytes memory _uri = new bytes(uriBytes.length + 60 + 5);
        uint256 srcPtr = 0;
        for (uint256 i = 0; i < uriBytes.length;) {
            if (i + 3 < uriBytes.length &&
                uriBytes[i]   == '{'    &&
                uriBytes[i+1] == 'i'    &&
                uriBytes[i+2] == 'd'    &&
                uriBytes[i+3] == '}') {
                uint256 end   = srcPtr + 63;
                uint256 value = tokenId;
                for (uint256 j = 0; j < 64; j++) {
                    _uri[end - j] = _hexChar(value & 0xF);
                    value >>= 4;
                }
                srcPtr += 64;
                i      += 4;
            } else {
                _uri[srcPtr] = uriBytes[i];
                srcPtr += 1;
                i      += 1;
            }
        }
        bytes memory _uriBytes = bytes(_uri);
        _uri[_uriBytes.length-5] = '.';
        _uri[_uriBytes.length-4] = 'j';
        _uri[_uriBytes.length-3] = 's';
        _uri[_uriBytes.length-2] = 'o';
        _uri[_uriBytes.length-1] = 'n';
        return string(_uri);
    }
    
    function _hexChar(uint256 b) internal pure returns (bytes1) {
        // 0-9
        // forge-lint: disable-next-line(unsafe-typecast)
        if (b < 10) return bytes1(uint8(b + 48));
        // A-F
        // forge-lint: disable-next-line(unsafe-typecast)
        return bytes1(uint8(b + 87));
    }

    function craft(uint256 ponyId) external nonReentrant {
        Recipe memory r = recipes[ponyId];
        if (
            r.honesty +
            r.kindness +
            r.laughter +
            r.generosity +
            r.loyalty +
            r.magic == 0
        ) revert InvalidRecipe();

        address user = msg.sender;

        if (balanceOf(user, HONESTY)    < r.honesty)    revert NotEnoughHonesty();
        if (balanceOf(user, KINDNESS)   < r.kindness)   revert NotEnoughKindness();
        if (balanceOf(user, LAUGHTER)   < r.laughter)   revert NotEnoughLaughter();
        if (balanceOf(user, GENEROSITY) < r.generosity) revert NotEnoughGenerosity();
        if (balanceOf(user, LOYALTY)    < r.loyalty)    revert NotEnoughLoyalty();
        if (balanceOf(user, MAGIC)      < r.magic)      revert NotEnoughMagic();

        _burn(user, HONESTY,    r.honesty);
        _burn(user, KINDNESS,   r.kindness);
        _burn(user, LAUGHTER,   r.laughter);
        _burn(user, GENEROSITY, r.generosity);
        _burn(user, LOYALTY,    r.loyalty);
        _burn(user, MAGIC,      r.magic);

        _mint(user, ponyId, 1, "");
    }

    // NOTE: inherited from IERC1155
    // event TransferSingle(address indexed _operator, address indexed _from, address indexed _to, uint256 _id, uint256 _value);
    // event TransferBatch(address indexed _operator, address indexed _from, address indexed _to, uint256[] _ids, uint256[] _values);
    // event ApprovalForAll(address indexed _owner, address indexed _operator, bool _approved);
    // event URI(string _value, uint256 indexed _id);

     modifier onlyOwner() {
         _onlyOwner();
         _;
     }

     function _onlyOwner() internal view {
         if (msg.sender != contractOwner) revert NotOwner();
     }

     modifier nonZeroAddress(address addr) {
         _nonZeroAddress(addr);
         _;
     }

     function _nonZeroAddress(address addr) internal pure {
         if (addr == address(0)) revert ZeroAddress();
     }

     modifier notSelfApproval(address addr) {
         _notSelfApproval(addr);
         _;
     }

     function _notSelfApproval(address addr) internal view {
         if (addr == msg.sender) revert SelfApproval();
     }


    function supportsInterface(bytes4 interfaceId) pure external returns (bool) {
        // According to ERC-165: https://eips.ethereum.org/EIPS/eip-165
        if (interfaceId == 0xffffffff) return false;
        return interfaceId == type(IERC1155).interfaceId ||
               interfaceId == type(IERC165).interfaceId;
    } 

    function safeTransferFrom(
        address from, address to,
        uint256 id,   uint256 value,
        bytes calldata data
    ) external nonZeroAddress(to) {
        address operator = msg.sender;
        if (!this.isApprovedForAll(from, operator)) revert NotApproved();

        _transferSingle(operator, from, to, id, value);
        _safeHandleSmartContract(operator, from, to, id, value, data);
    }

    function safeBatchTransferFrom(
        address from, address to,
        uint256[] calldata ids,
        uint256[] calldata values,
        bytes calldata data
    ) external nonZeroAddress(to) {
        address operator = msg.sender;
        if (!this.isApprovedForAll(from, operator)) revert NotApproved();
        
        if (ids.length != values.length) revert IdValueArrLengthMismatch();

        for (uint256 i = 0; i < ids.length; ++i) {
            uint256 id    = ids[i];
            uint256 value = values[i];

            _transferSingle(operator, from, to, id, value);
        }
        _safeHandleSmartContractBatch(operator, from, to, ids, values, data);
    }

    function burn(
        address from,
        uint256 id, uint256 value,
        bytes calldata data
    ) external {
        _burnWithData(from, id, value, data);
    }

    function mint(
        address to,
        uint256 id, uint256 value,
        bytes calldata data
    ) external onlyOwner nonZeroAddress(to) {
        _mint(to, id, value, data);
    }

    function mintBatch(
        address to,
        uint256[] calldata ids, uint256[] calldata values,
        bytes calldata data
    ) external onlyOwner nonZeroAddress(to) {
        if (ids.length != values.length) revert IdValueArrLengthMismatch();

        address operator = msg.sender;
        address from = address(0);

        for (uint256 i = 0; i < ids.length; ++i) {
            uint256 id    = ids[i];
            uint256 value = values[i];

            _transferSingle(operator, from, to, id, value);
        }
        _safeHandleSmartContractBatch(operator, from, to, ids, values, data);
    }

    function balanceOf(address owner, uint256 id)
        public view nonZeroAddress(owner) returns (uint256)  {
        return _balances[id][owner];
    }

    function balanceOfBatch(
        address[] calldata owners,
        uint256[] calldata ids
    ) external view returns (uint256[] memory balances) {
        if (owners.length != ids.length) revert IdOwnerArrLengthMismatch();

        balances = new uint256[](owners.length);
        for (uint256 i = 0; i < owners.length; ++i) {
            address owner = owners[i];
            uint256 id    = ids[i];
            balances[i] = balanceOf(owner, id);
        }
        return balances;
    }

    function setApprovalForAll(address operator, bool approved) external notSelfApproval(operator) {
        _operatorApprovals[msg.sender][operator] = approved;
        emit ApprovalForAll(msg.sender, operator, approved);
    }

    function isApprovedForAll(address owner, address operator) external view returns (bool) {
        return _operatorApprovals[owner][operator];
    }

    function _burnWithData(
        address from,
        uint256 id, uint256 value,
        bytes memory data
    ) internal {
        address operator = msg.sender;
        address to = address(0);
        _transferSingle(operator, from, to, id, value);
        _safeHandleSmartContract(operator, from, to, id, value, data);
    }

    function _burn(
        address from,
        uint256 id, uint256 value
    ) internal {
        address operator = msg.sender;
        address to = address(0);
        _transferSingle(operator, from, to, id, value);
    }

    function _mint(
        address to,
        uint256 id, uint256 value,
        bytes memory data
    ) internal {
        address operator = msg.sender;
        address from = address(0);
        _transferSingle(operator, from, to, id, value);
        _safeHandleSmartContract(operator, from, to, id, value, data);
    }

    function _safeHandleSmartContract(
        address operator,
        address from, address to,
        uint256 id, uint256 value,
        bytes memory data
    ) internal {
        if (to.code.length > 0) {
            bytes4 response = IERC1155Receiver(to).onERC1155Received(
                operator,
                from,
                id,
                value,
                data
            );

            if (response != IERC1155Receiver.onERC1155Received.selector) {
                revert SmartContractNotAccepted();
            }
        }
    }

    function _safeHandleSmartContractBatch(
        address operator,
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory values,
        bytes memory data
    ) internal {
        if (to.code.length > 0) {
            bytes4 response = IERC1155Receiver(to).onERC1155BatchReceived(
                operator,
                from,
                ids,
                values,
                data
            );
    
            if (response != IERC1155Receiver.onERC1155BatchReceived.selector) {
                revert SmartContractNotAccepted();
            }
        }
    }

    function _transferSingle(
        address operator,
        address from, address to,
        uint256 id, uint256 value
    ) internal {
        if (from != address(0)) {
            uint256 fromBalance = _balances[id][from];
            
            if (fromBalance < value) revert InsufficientBalance();
            unchecked {
                _balances[id][from] = fromBalance - value;
            }
        }
        
        _balances[id][to] += value;
        
        emit TransferSingle(operator, from, to, id, value);
    }
}
