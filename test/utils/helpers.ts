import {ethers} from 'hardhat'
import {BigNumber} from 'ethers'

export const parseCoin = ethers.utils.parseEther
export const formatCoin = ethers.utils.formatEther

export const ADDRESS_ZERO = ethers.constants.AddressZero

export async function setBalance(address: string, amount: BigNumber) {
  const params = [address, amount.toHexString()]
  await ethers.provider.send('hardhat_setBalance', params)
}

export async function increaseTime(time: BigNumber) {
  await ethers.provider.send('evm_increaseTime', [time.toNumber()])
}

export async function setNextBlockTimestamp(timestamp: BigNumber) {
  await ethers.provider.send('evm_setNextBlockTimestamp', [timestamp.toNumber()])
}
