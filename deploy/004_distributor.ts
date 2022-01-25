import {HardhatRuntimeEnvironment} from "hardhat/types"
import {utils} from "ethers"

export default async function deploy(hre: HardhatRuntimeEnvironment) {
  const {deployments, ethers, getNamedAccounts} = hre
  const {deployer, team, farm} = await getNamedAccounts()

  const isLocal = hre.network.config.tags.indexOf('local') != -1

  const veNFT = await deployments.get("veNFT")
  let coins = [];

  for (let i = 1; i < 10; i++) {
    let coin = await deployments.get(`Token${i}`);
    coins.push(coin.address);
  }

  const _start_time = 1639440000;

  /* const wFTM = '0x21be370d5312f44cb42ce377bc9b8a0cef1a4c83';
  const spell = '0x468003b688943977e6130f4f68f23aad939a1040';
  const spirit = '0x5cc61a78f164885776aa610fb0fe1257df78e59b';
  const beets = '0xf24bcf4d1e507740041c9cfd2dddb29585adce1e';
  const tetu = '0x65c9d9d080714cda7b5d58989dc27f897f165179';
  const credit = '0x77128dfdd0ac859b33f44050c6fa272f34872b5e';
  const linSpirit = '0xc5713b6a0f26bf0fdc1c52b90cd184d950be515c';
  const pills = '0xb66b5d38e183de42f21e92abcaf3c712dd5d6286';
  const boo = '0x841fad6eae12c286d1fd18d1d525dffa75c7effe'; */

  const _admin = deployer;

  const distributor = await deployments.deploy("fee-distributor", {
    from: deployer,
    args: [
        veNFT.address,
        _start_time,
        coins,
        _admin,
        _admin,
    ],
    log: true,
  })
}
deploy.tags = ["distributor"]
