export const ERC20_ABI = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function totalSupply() view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function balanceOf(address account) view returns (uint256)",
  "function mint(address to, uint256 amount)",
  "function burn(address from, uint256 amount)",
  "function transfer(address to, uint256 amount) returns (bool)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function teleportToPublicChain(address to, uint256 amount, uint256 chainId)",
  "event Transfer(address indexed from, address indexed to, uint256 value)",
];

export const ERC721_ABI = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function balanceOf(address owner) view returns (uint256)",
  "function ownerOf(uint256 tokenId) view returns (address)",
  "function tokenURI(uint256 tokenId) view returns (string)",
  "function mint(address to, uint256 tokenId)",
  "function burn(uint256 tokenId)",
  "function teleportToPublicChain(address to, uint256 tokenId, uint256 chainId)",
  "event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)",
];

export const ERC1155_ABI = [
  "function name() view returns (string)",
  "function uri(uint256 id) view returns (string)",
  "function balanceOf(address account, uint256 id) view returns (uint256)",
  "function mint(address to, uint256 id, uint256 amount, bytes data)",
  "function burn(address from, uint256 id, uint256 amount)",
  "function teleportToPublicChain(address to, uint256 id, uint256 amount, uint256 chainId, bytes data)",
  "event TransferSingle(address indexed operator, address indexed from, address indexed to, uint256 id, uint256 value)",
  "event TransferBatch(address indexed operator, address indexed from, address indexed to, uint256[] ids, uint256[] values)",
];

export const ATTESTATION_ABI = [
  "function attest(address token, bool approved, string reason, uint256 score)",
  "function getAttestations(address token) view returns (tuple(address attester, address token, bool approved, string reason, uint256 score, uint256 timestamp)[])",
  "function getAttestationCount(address token) view returns (uint256)",
  "event Attested(address indexed token, address indexed attester, bool approved, uint256 score)",
];

export const MARKETPLACE_ABI = [
  "function list(address token, uint8 assetType, uint256 tokenId, uint256 amount, uint256 price) returns (uint256)",
  "function update(uint256 listingId, uint256 newPrice)",
  "function delist(uint256 listingId)",
  "function buy(uint256 listingId) payable",
  "function getListing(uint256 listingId) view returns (tuple(address token, uint8 assetType, uint256 tokenId, uint256 amount, uint256 price, bool active))",
  "function getActiveListings() view returns (uint256[])",
  "function nextListingId() view returns (uint256)",
  "event Listed(uint256 indexed listingId, address indexed token, uint8 assetType, uint256 price)",
  "event Updated(uint256 indexed listingId, uint256 newPrice)",
  "event Delisted(uint256 indexed listingId)",
  "event Bought(uint256 indexed listingId, address indexed buyer, uint256 price)",
];
