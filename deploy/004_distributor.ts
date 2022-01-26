import {HardhatRuntimeEnvironment} from 'hardhat/types'
import {utils} from 'ethers'

export default async function deploy(hre: HardhatRuntimeEnvironment) {
  const {deployments, ethers, getNamedAccounts} = hre
  const {deployer, team, farm} = await getNamedAccounts()

  const isLocal = hre.network.config.tags.indexOf('local') != -1

  const veNFT = await deployments.get('veNFT')
  let coins: string[] = [];

  for (let i = 1; i < 10; i++) {
    let coin = await deployments.get(`Token${i}`);
    coins.push(coin.address);
  }

  const _start_time: number = 1639440000;

  const _admin = deployer;
  const _emergency_return_address = _admin;

  const distributor = await deployments.deploy('fee-distributor', {
    from: deployer,
    args: [
        veNFT.address,
        _start_time,
        coins,
        _admin,
        _emergency_return_address,
    ],
    log: true,
  })
}
deploy.tags = ['distributor']
