const { assert, expect } = require("chai")
const { ethers, network, deployments, getNamedAccounts } = require("hardhat")
const { developementNetworks } = require("../../helper-hh-config")

!developementNetworks.includes(network.name) ? describe.skip : describe("NFT Marketplace tests", function () {
    let nftMarketplace, basicNft, deployer, player
    const PRICE = ethers.utils.parseEther("0.1")
    const TOKEN_ID = 0

    beforeEach(async () => {

        deployer = (await getNamedAccounts()).deployer
        //player = (await getNamedAccounts()).player
        const accounts = await ethers.getSigners()
        player = accounts[1]
        await deployments.fixture(["all"])
        nftMarketplace = await ethers.getContract("NftMarketplace")
        basicNft = await ethers.getContract("BasicNft")

        await basicNft.mint()
        await nftMarketplace.approve(basicNft.address, TOKEN_ID)

        it("Can list and buy nft", async function () {
            await nftMarketplace.listItem(basicNft.address, TOKEN_ID, PRICE)
            const nftMarketplacePlayer = nftMarketplace.connect(player)
            await nftMarketplacePlayer.buyItem(basicNft.address, TOKEN_ID, { value: PRICE })
            const newOwnerOfNFT = await basicNft.ownerOf(TOKEN_ID)
            const deployerProceeds = await nftMarketplace.getProceeds(deployer)
            assert(newOwnerOfNFT.toString() == player.address)
            assert(deployerProceeds.toString() == PRICE.toString())
        })


    })


})