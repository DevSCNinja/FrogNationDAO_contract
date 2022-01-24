import {HardhatRuntimeEnvironment} from "hardhat/types"
import {utils} from "ethers"

export default async function deploy(hre: HardhatRuntimeEnvironment) {
  const {deployments, ethers, getNamedAccounts} = hre
  const {deployer, team, farm} = await getNamedAccounts()

  const isLocal = hre.network.config.tags.indexOf('local') != -1

  const frogNFT = await deployments.get("FrogNFT")

  const _name = "veNFT";
  const _symbol = "vNFT";
  const _version = 1;

  const veNFT = await deployments.deploy("veNFT", {
    from: deployer,
    args: [
      frogNFT.address,
      _name,
      _symbol,
      _version,
    ],
    log: true,
  })
}
deploy.tags = ["veNFT"]
