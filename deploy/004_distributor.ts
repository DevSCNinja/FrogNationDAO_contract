import {HardhatRuntimeEnvironment} from "hardhat/types"
import {utils} from "ethers"

export default async function deploy(hre: HardhatRuntimeEnvironment) {
  const {deployments, ethers, getNamedAccounts} = hre
  const {deployer, team, farm} = await getNamedAccounts()

  const isLocal = hre.network.config.tags.indexOf('local') != -1

  const veNFT = await deployments.get("veNFT")
  const MockERC20 = await deployments.get("MockERC20")

  const _start_time = 1639440000;
  const _admin = deployer;

  const distributor = await deployments.deploy("fee-distributor", {
    from: deployer,
    args: [
        veNFT.address,
        _start_time,
        [/*token1.address, token2.address, ...*/],
        _admin,
        _admin,
    ],
    log: true,
  })
}
deploy.tags = ["distributor"]
