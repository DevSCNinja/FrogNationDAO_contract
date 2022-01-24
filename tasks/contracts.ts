import {task} from 'hardhat/config'

task('contracts', 'Prints all contracts address', async (taskArgs, hre) => {

  const nft = await hre.deployments.get('NFT')

  console.log('-------------')
  console.log(`NFT: ${nft.address}`)
  console.log('-------------')

})
