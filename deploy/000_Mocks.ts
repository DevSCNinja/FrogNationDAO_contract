import {HardhatRuntimeEnvironment} from 'hardhat/types'

export default async function deploy(hre: HardhatRuntimeEnvironment) {
  const {ethers, deployments, getNamedAccounts} = hre
  const {deployer} = await getNamedAccounts()

  for (let i = 1; i < 10; i++) {
    let _name = 'Token' + i;
    let _symbol = 'T' + i;

    const coin = await deployments.deploy(_name, {
      from: deployer,
      contract: 'Coin',
      args: [
        _name,
        _symbol,
        ethers.utils.parseEther('100000'),
        deployer,
      ],
      log: true,
    })
  }
}
deploy.tags = ['Mocks']
