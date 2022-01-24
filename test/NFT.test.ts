import {waffle} from "hardhat"
import {expect} from "chai"
import {setup} from "@/utils/fixture"
import {ADDRESS_ZERO, parseCoin} from "@/utils/helpers"

describe("NFT", function () {
  describe("constructor", function () {
    it("Should initialize", async function () {
      // given
      const {nft, owner, farm, team} = await waffle.loadFixture(setup)
      // when
      const name = await nft.name()
      const symbol = await nft.symbol()
      const maxSupply = await nft.maxSupply()
      const price = await nft.price()
      const teamAddr = await nft.teamAddress()
      const farmAddr = await nft.farmAddress()
      const ownerAddr = await nft.owner()
      // then
      expect(name).to.be.equal("NFT")
      expect(symbol).to.be.equal("NFT")
      expect(maxSupply).to.be.equal(100)
      expect(price).to.be.equal(parseCoin("20"))
      expect(farmAddr).to.be.equal(farm.address)
      expect(teamAddr).to.be.equal(team.address)
      expect(ownerAddr).to.be.equal(owner.address)
    })
  })

  describe("mint", function () {
    it("Should mint an nft", async function () {
      // given
      const {nft, alice, farm, team} = await waffle.loadFixture(setup)
      const price = await nft.price()
      const nextTokeId = await nft.nextTokenId()
      const farmBalanceBefore = await farm.getBalance()
      const teamBalanceBefore = await team.getBalance()
      // when
      const tx = await alice.nft.mint(1, {value: price})
      // then
      await expect(tx).to.emit(nft, "Transfer").withArgs(ADDRESS_ZERO, alice.address, nextTokeId)
      expect(await nft.balanceOf(alice.address)).to.be.equal(1)
      expect(await nft.nextTokenId()).to.be.equal(nextTokeId.add(1))
      expect(await farm.getBalance()).to.be.equal(farmBalanceBefore.add(parseCoin("8")))
      expect(await team.getBalance()).to.be.equal(teamBalanceBefore.add(parseCoin("2")))
    })
    it("Should mint an nft with discount", async function () {
      // given
      const {nft, alice, farm, team} = await waffle.loadFixture(setup)
      await alice.frogNFT.mint(1, {value:parseCoin("69")})
      const price = await nft.price()
      const nextTokeId = await nft.nextTokenId()
      const farmBalanceBefore = await farm.getBalance()
      const teamBalanceBefore = await team.getBalance()
      // when
      const tx = await alice.nft.mint(1, {value: price.sub(parseCoin("1"))})
      // then
      await expect(tx).to.emit(nft, "Transfer").withArgs(ADDRESS_ZERO, alice.address, nextTokeId)
      expect(await nft.balanceOf(alice.address)).to.be.equal(1)
      expect(await nft.nextTokenId()).to.be.equal(nextTokeId.add(1))
      expect(await farm.getBalance()).to.be.equal(farmBalanceBefore.add(parseCoin("7")))
      expect(await team.getBalance()).to.be.equal(teamBalanceBefore.add(parseCoin("2")))
    })
    it("Should mint an nft with tips", async function () {
      // given
      const {nft, alice, farm, team} = await waffle.loadFixture(setup)
      const price = await nft.price()
      const nextTokeId = await nft.nextTokenId()
      const farmBalanceBefore = await farm.getBalance()
      const teamBalanceBefore = await team.getBalance()
      const tips = parseCoin("1.23")
      // when
      const tx = await alice.nft.mint(1, {value: price.add(tips)})
      // then
      await expect(tx).to.emit(nft, "Transfer").withArgs(ADDRESS_ZERO, alice.address, nextTokeId)
      expect(await nft.balanceOf(alice.address)).to.be.equal(1)
      expect(await nft.nextTokenId()).to.be.equal(nextTokeId.add(1))
      expect(await farm.getBalance()).to.be.equal(farmBalanceBefore.add(parseCoin("8")))
      expect(await team.getBalance()).to.be.equal(teamBalanceBefore.add(parseCoin("2")).add(tips))
    })
    it("Should mint two nft", async function () {
      // given
      const {nft, alice, farm, team} = await waffle.loadFixture(setup)
      const price = await nft.price()
      const nextTokeId = await nft.nextTokenId()
      const farmBalanceBefore = await farm.getBalance()
      const teamBalanceBefore = await team.getBalance()
      // when
      const tx = await alice.nft.mint(2, {value: price.mul(2)})
      // then
      await expect(tx).to.emit(nft, "Transfer").withArgs(ADDRESS_ZERO, alice.address, nextTokeId)
      await expect(tx).to.emit(nft, "Transfer").withArgs(ADDRESS_ZERO, alice.address, nextTokeId.add(1))
      expect(await nft.balanceOf(alice.address)).to.be.equal(2)
      expect(await nft.nextTokenId()).to.be.equal(nextTokeId.add(2))
      expect(await farm.getBalance()).to.be.equal(farmBalanceBefore.add(parseCoin("16")))
      expect(await team.getBalance()).to.be.equal(teamBalanceBefore.add(parseCoin("4")))
    })
    it("Should mint two nft with discount", async function () {
      // given
      const {nft, alice, farm, team} = await waffle.loadFixture(setup)
      await alice.frogNFT.mint(1, {value:parseCoin("69")})
      const price = await nft.price()
      const nextTokeId = await nft.nextTokenId()
      const farmBalanceBefore = await farm.getBalance()
      const teamBalanceBefore = await team.getBalance()
      // when
      const tx = await alice.nft.mint(2, {value: price.sub(parseCoin("1")).mul(2)})
      // then
      await expect(tx).to.emit(nft, "Transfer").withArgs(ADDRESS_ZERO, alice.address, nextTokeId)
      await expect(tx).to.emit(nft, "Transfer").withArgs(ADDRESS_ZERO, alice.address, nextTokeId.add(1))
      expect(await nft.balanceOf(alice.address)).to.be.equal(2)
      expect(await nft.nextTokenId()).to.be.equal(nextTokeId.add(2))
      expect(await farm.getBalance()).to.be.equal(farmBalanceBefore.add(parseCoin("14")))
      expect(await team.getBalance()).to.be.equal(teamBalanceBefore.add(parseCoin("4")))
    })
    it("Should mint two nft with tips", async function () {
      // given
      const {nft, alice, farm, team} = await waffle.loadFixture(setup)
      const price = await nft.price()
      const nextTokeId = await nft.nextTokenId()
      const farmBalanceBefore = await farm.getBalance()
      const teamBalanceBefore = await team.getBalance()
      const tips = parseCoin("1.23")
      // when
      const tx = await alice.nft.mint(2, {value: price.mul(2).add(tips)})
      // then
      await expect(tx).to.emit(nft, "Transfer").withArgs(ADDRESS_ZERO, alice.address, nextTokeId)
      await expect(tx).to.emit(nft, "Transfer").withArgs(ADDRESS_ZERO, alice.address, nextTokeId.add(1))
      expect(await nft.balanceOf(alice.address)).to.be.equal(2)
      expect(await nft.nextTokenId()).to.be.equal(nextTokeId.add(2))
      expect(await farm.getBalance()).to.be.equal(farmBalanceBefore.add(parseCoin("16")))
      expect(await team.getBalance()).to.be.equal(teamBalanceBefore.add(parseCoin("4")).add(tips))
    })
    it("Should reverted with 'Mint total is zero'", async function () {
      // given
      const {nft, alice} = await waffle.loadFixture(setup)
      const price = await nft.price()
      // when
      const tx = alice.nft.mint(0, {value: price})
      // then
      await expect(tx).to.be.revertedWith("Mint total is zero")
    })
    it("Should reverted with 'Value sent is not correct'", async function () {
      // given
      const {nft, alice} = await waffle.loadFixture(setup)
      const price = await nft.price()
      const value = price.sub(1)
      // when
      const tx = alice.nft.mint(1, {value})
      // then
      await expect(tx).to.be.revertedWith("Value sent is not correct")
    })
    it("Should reverted when have discount with 'Mint exceed max supply'", async function () {
      // given
      const {nft, alice} = await waffle.loadFixture(setup)
      await alice.frogNFT.mint(1, {value: parseCoin("69")})
      const price = await nft.price()
      const value = price.sub(parseCoin("1")).sub(1)
      // when
      const tx = alice.nft.mint(1, {value})
      // then
      await expect(tx).to.be.revertedWith("Value sent is not correct")
    })
    it("Should reverted with 'Mint exceed max supply'", async function () {
      // given
      const {nft, alice, bob} = await waffle.loadFixture(setup)
      const maxSupply = await nft.maxSupply()
      const price = await nft.price()
      const mintedShapes = maxSupply.toNumber()
      for (let i = 0; i < mintedShapes; i++) {
        await bob.nft.mint(1, {value: price})
      }
      // when
      const tx = alice.nft.mint(1, {value: price})
      // then
      await expect(tx).to.be.revertedWith("Mint exceed max supply")
    })
  })

  describe("claimReward", function () {
    it("Should claim none reward", async function () {
      // given
      const {nft, alice} = await waffle.loadFixture(setup)
      const price = await nft.price()
      const id = await nft.nextTokenId()
      await alice.nft.mint(1, {value: price})
      const rewardBefore = await alice.nft.getReward(id)
      // when
      const tx = alice.nft.claimReward(id)
      // then
      await expect(tx).to.not.emit(nft, 'RewardClaimed')
      expect(await alice.nft.getReward(id)).to.be.equal(rewardBefore)
    })
    it("Should claim one loop reward", async function () {
      // given
      const {nft, alice, bob} = await waffle.loadFixture(setup)
      const price = await nft.price()
      const id = await nft.nextTokenId()
      await alice.nft.mint(1, {value: price})
      await bob.nft.mint(1, {value: price.mul(10)})
      const balance = await alice.getBalance()
      // when
      const tx = alice.nft.claimReward(id)
      // then
      await expect(tx).to.emit(nft, 'RewardClaimed').withArgs(alice.address, id, parseCoin("1"))
      expect(await alice.getBalance()).to.be.gt(balance)
      expect(await alice.nft.getReward(id)).to.be.equal(0)
    })
    it("Should claim half reward", async function () {
      // given
      const {nft, alice, bob} = await waffle.loadFixture(setup)
      const price = await nft.price()
      const id = await nft.nextTokenId()
      await alice.nft.mint(1, {value: price})
      await bob.nft.mint(5, {value: price.mul(10)})
      const balance = await alice.getBalance()
      // when
      const tx = alice.nft.claimReward(id)
      // then
      await expect(tx).to.emit(nft, 'RewardClaimed').withArgs(alice.address, id, parseCoin("5"))
      expect(await alice.getBalance()).to.be.gt(balance)
      expect(await alice.nft.getReward(id)).to.be.equal(0)
    })
    it("Should claim full loop reward", async function () {
      // given
      const {nft, alice, bob} = await waffle.loadFixture(setup)
      const price = await nft.price()
      const id = await nft.nextTokenId()
      await alice.nft.mint(1, {value: price})
      await bob.nft.mint(20, {value: price.mul(20)})
      const balance = await alice.getBalance()
      // when
      const tx = alice.nft.claimReward(id)
      // then
      await expect(tx).to.emit(nft, 'RewardClaimed').withArgs(alice.address, id, parseCoin("10"))
      expect(await alice.getBalance()).to.be.gt(balance)
      expect(await alice.nft.getReward(id)).to.be.equal(0)
    })
  })

  describe("claimRewards", function () {
    it("Should claim none reward", async function () {
      // given
      const {nft, alice} = await waffle.loadFixture(setup)
      const price = await nft.price()
      await alice.nft.mint(1, {value: price})
      // when
      const tx = alice.nft.claimRewards()
      // then
      await expect(tx).to.not.emit(nft, 'RewardClaimed')
      expect(await nft.getRewards(alice.address)).to.be.equal(0)
    })
    it("Should claim one loop reward", async function () {
      // given
      const {nft, alice, bob} = await waffle.loadFixture(setup)
      const price = await nft.price()
      const nfts = 2
      await alice.nft.mint(nfts, {value: price.mul(nfts)})
      await bob.nft.mint(1, {value: price})
      const balance = await alice.getBalance()
      // when
      const tx = alice.nft.claimRewards()
      // then
      await expect(tx).to.emit(nft, 'RewardClaimed').withArgs(alice.address, 1, parseCoin("2"))
      await expect(tx).to.emit(nft, 'RewardClaimed').withArgs(alice.address, 2, parseCoin("1"))
      expect(await alice.getBalance()).to.be.gt(balance)
      expect(await nft.getRewards(alice.address)).to.be.equal(0)
    })
    it("Should claim half reward", async function () {
      // given
      const {nft, alice, bob} = await waffle.loadFixture(setup)
      const price = await nft.price()
      await alice.nft.mint(2, {value: price.mul(2)})
      await bob.nft.mint(5, {value: price.mul(10)})
      const balance = await alice.getBalance()
      // when
      const tx = await alice.nft.claimRewards()
      // then
      await expect(tx).to.emit(nft, 'RewardClaimed').withArgs(alice.address, 1, parseCoin("6"))
      await expect(tx).to.emit(nft, 'RewardClaimed').withArgs(alice.address, 2, parseCoin("5"))
      expect(await alice.getBalance()).to.be.gt(balance)
      expect(await nft.getRewards(alice.address)).to.be.equal(0)
    })
    it("Should claim full loop reward", async function () {
      // given
      const {nft, alice, bob} = await waffle.loadFixture(setup)
      const price = await nft.price()
      await alice.nft.mint(2, {value: price.mul(2)})
      await bob.nft.mint(20, {value: price.mul(20)})
      const balance = await alice.getBalance()
      // when
      const tx = await alice.nft.claimRewards()
      // then
      await expect(tx).to.emit(nft, 'RewardClaimed').withArgs(alice.address, 1, parseCoin("10"))
      await expect(tx).to.emit(nft, 'RewardClaimed').withArgs(alice.address, 2, parseCoin("10"))
      expect(await alice.getBalance()).to.be.gt(balance)
      expect(await nft.getRewards(alice.address)).to.be.equal(0)
    })
  })

  describe("tokenURI", function () {
    it("Should return a tokenURI", async function () {
      // given
      const {nft, alice} = await waffle.loadFixture(setup)
      const value = await nft.price()
      const tokenId = await nft.nextTokenId()
      await alice.nft.mint(1, {value})
      // when
      const tokenURI = await nft.tokenURI(tokenId)
      // then
      expect(tokenURI).to.be.equal("https://token.com")
    })

    it("Should reverted with 'URI query for nonexistent token'", async function () {
      // given
      const {alice} = await waffle.loadFixture(setup)
      // when
      const tx = alice.nft.tokenURI(1)
      // then
      await expect(tx).to.be.revertedWith("URI query for nonexistent token")
    })
  })

  describe("getReward", function () {
    it("Should get none reward", async function () {
      // given
      const {nft, alice} = await waffle.loadFixture(setup)
      const price = await nft.price()
      const id = await nft.nextTokenId()
      await alice.nft.mint(1, {value: price})
      // when
      const reward = await nft.getReward(id)
      // then
      expect(reward).to.be.equal(0)
    })
    it("Should get one loop reward", async function () {
      // given
      const {nft, alice, bob} = await waffle.loadFixture(setup)
      const price = await nft.price()
      const id = await nft.nextTokenId()
      await alice.nft.mint(1, {value: price})
      await bob.nft.mint(1, {value: price.mul(10)})
      // when
      const reward = await nft.getReward(id)
      // then
      expect(reward).to.be.equal(parseCoin("1"))
    })
    it("Should get half reward", async function () {
      // given
      const {nft, alice, bob} = await waffle.loadFixture(setup)
      const price = await nft.price()
      const id = await nft.nextTokenId()
      await alice.nft.mint(1, {value: price})
      await bob.nft.mint(5, {value: price.mul(10)})
      // when
      const reward = await nft.getReward(id)
      // then
      expect(reward).to.be.equal(parseCoin("5"))
    })
    it("Should get full loop reward", async function () {
      // given
      const {nft, alice, bob} = await waffle.loadFixture(setup)
      const price = await nft.price()
      const id = await nft.nextTokenId()
      await alice.nft.mint(1, {value: price})
      await bob.nft.mint(20, {value: price.mul(20)})
      // when
      const reward = await nft.getReward(id)
      // then
      expect(reward).to.be.equal(parseCoin("10"))
    })
  })

  describe("getRewards", function () {
    it("Should get none rewards", async function () {
      // given
      const {nft, alice} = await waffle.loadFixture(setup)
      const price = await nft.price()
      const nfts = 1
      await alice.nft.mint(nfts, {value: price.mul(nfts)})
      // when
      const reward = await nft.getRewards(alice.address)
      // then
      expect(reward).to.be.equal(0)
    })
    it("Should get one loop rewards", async function () {
      // given
      const {nft, alice, bob} = await waffle.loadFixture(setup)
      const price = await nft.price()
      const nfts = 2
      await alice.nft.mint(nfts, {value: price.mul(nfts)})
      await bob.nft.mint(1, {value: price.mul(10)})
      // when
      const reward = await nft.getRewards(alice.address)
      // then
      expect(reward).to.be.equal(parseCoin("3"))
    })
    it("Should get half rewards", async function () {
      // given
      const {nft, alice, bob} = await waffle.loadFixture(setup)
      const price = await nft.price()
      const nfts = 2
      await alice.nft.mint(nfts, {value: price.mul(nfts)})
      await bob.nft.mint(5, {value: price.mul(10)})
      // when
      const reward = await nft.getRewards(alice.address)
      // then
      expect(reward).to.be.equal(parseCoin("11"))
    })
    it("Should get full loop rewards", async function () {
      // given
      const {nft, alice, bob} = await waffle.loadFixture(setup)
      const price = await nft.price()
      const nfts = 3
      await alice.nft.mint(nfts, {value: price.mul(nfts)})
      await bob.nft.mint(20, {value: price.mul(20)})
      // when
      const reward = await nft.getRewards(alice.address)
      // then
      expect(reward).to.be.equal(parseCoin("30"))
    })
  })

  describe("hasDiscount", function () {
    it("Should have discount if owner a Frog", async function () {
      // given
      const {nft, alice} = await waffle.loadFixture(setup)
      await alice.frogNFT.mint(1, {value: parseCoin("69")})
      // when
      const discount = await nft.hasDiscount(alice.address)
      // then
      expect(discount).to.be.true
    })
    it("Should not have discount if not owner a Frog NFT", async function () {
      // given
      const {nft, alice} = await waffle.loadFixture(setup)
      // when
      const discount = await nft.hasDiscount(alice.address)
      // then
      expect(discount).to.be.false
    })
  })

  describe("setTokenURI", function () {
    it("Should set new tokenURI", async function () {
      // given
      const {nft, alice, owner} = await waffle.loadFixture(setup)
      const price = await nft.price()
      const id = await nft.nextTokenId()
      await alice.nft.mint(1, {value: price})
      const tokenURI = "https://abc"
      // when
      await owner.nft.setTokenURI(tokenURI)
      // then
      expect(await nft.tokenURI(id)).to.be.equal(tokenURI)
    })

    it("Should reverted with 'Ownable: caller is not the owner'", async function () {
      // given
      const {alice} = await waffle.loadFixture(setup)
      // when
      const tx = alice.nft.setTokenURI("https://abc/")
      // then
      await expect(tx).to.be.revertedWith("Ownable: caller is not the owner")
    })
  })

  describe("setPrice", function () {
    it("Should set new price", async function () {
      // given
      const {nft, owner} = await waffle.loadFixture(setup)
      const price = parseCoin("1.123")
      // when
      await owner.nft.setPrice(price)
      // then
      expect(await nft.price()).to.be.equal(price)
    })
    it("Should reverted with 'Ownable: caller is not the owner'", async function () {
      // given
      const {alice} = await waffle.loadFixture(setup)
      // when
      const tx = alice.nft.setPrice(parseCoin("1.0"))
      // then
      await expect(tx).to.be.revertedWith("Ownable: caller is not the owner")
    })
  })

})
