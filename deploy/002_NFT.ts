import {HardhatRuntimeEnvironment} from "hardhat/types"
import {utils} from "ethers"

export default async function deploy(hre: HardhatRuntimeEnvironment) {
  const {deployments, ethers, getNamedAccounts} = hre
  const {deployer, team, farm} = await getNamedAccounts()

  const isLocal = hre.network.config.tags.indexOf('local') != -1

  const frogNFT = await deployments.get("FrogNFT")

  const maxSupply = isLocal ? 100 : 100_000_000
  const price = ethers.utils.parseEther("20")

  const nft = await deployments.deploy("NFT", {
    from: deployer,
    args: [
      maxSupply,
      price,
      farm,
      team,
      frogNFT.address,
      "https://token.com",
    ],
    log: true,
  })
}
deploy.tags = ["NFT"]
