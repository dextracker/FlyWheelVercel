import { ethers } from 'ethers';

export const joePair = new ethers.utils.Interface([
  'function decimals() external pure returns (uint8)',
  'function balanceOf(address owner) external view returns (uint256)',
  'function token0() external view returns (address)',
  'function token1() external view returns (address)',
  'function getReserves() external view returns ( uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast)',
]);
