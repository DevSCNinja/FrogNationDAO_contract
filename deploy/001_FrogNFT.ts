import {HardhatRuntimeEnvironment} from "hardhat/types"

export default async function deploy(hre: HardhatRuntimeEnvironment) {
  const {deployments, getNamedAccounts} = hre
  const {deployer} = await getNamedAccounts()

  const isMainnet = hre.network.config.tags.indexOf("mainnet") != -1
  if (isMainnet) {
    await deployments.save("FrogNFT", {
      address: "0x2d21B401E0Ab6347165113dcF29997630163E59D",
      abi: [],
    })
    return
  }

  const frogNFT = await deployments.deploy("FrogNFT", {
    from: deployer,
    args: [
      '69420 Frogs',
      '69F',
      'https://gateway.pinata.cloud/ipfs/QmcGYcEAzaMLpLJxYGMUMY8v2AD2EBXSBh13oPxrZ3EHau/',
      69420,
      0,
      deployer,
    ],
    log: true,
  })
}
deploy.tags = ["FrogNFT"]
