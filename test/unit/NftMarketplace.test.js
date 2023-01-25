const { assert, expect } = require("chai")
const { ethers, network, deployments, getNamedAccounts } = require("hardhat")
const { developementNetworks } = require("../../helper-hh-config")

!developementNetworks.includes(network.name) ? describe.skip : describe("NFT Marketplace tests", function () {
    let nftMarketplace, basicNft, deployer, player
    const PRICE = ethers.utils.parseEther("0.1")
    const NEW_PRICE = ethers.utils.parseEther("0.15")
    const TOKEN_ID = 0

    beforeEach(async () => {

        deployer = (await getNamedAccounts()).deployer
        //player = (await getNamedAccounts()).player
        const accounts = await ethers.getSigners()
        player = accounts[1]
        await deployments.fixture(["all"])
        nftMarketplace = await ethers.getContract("NftMarketplace")
        basicNft = await ethers.getContract("BasicNft")

        await basicNft.mintNft()
        await basicNft.approve(nftMarketplace.address, TOKEN_ID)
    })

    it("Can list and buy nft", async function () {
        await nftMarketplace.listItem(basicNft.address, TOKEN_ID, PRICE)
        const nftMarketplacePlayer = nftMarketplace.connect(player)
        await nftMarketplacePlayer.buyItem(basicNft.address, TOKEN_ID, { value: PRICE })
        const newOwnerOfNFT = await basicNft.ownerOf(TOKEN_ID)
        const deployerProceeds = await nftMarketplace.getProceeds(deployer)
        assert(newOwnerOfNFT.toString() == player.address)
        assert(deployerProceeds.toString() == PRICE.toString())
    })

    it("Can update a listing", async function () {
        await nftMarketplace.listItem(basicNft.address, TOKEN_ID, PRICE)
        await nftMarketplace.updateListing(basicNft.address, TOKEN_ID, NEW_PRICE)
        const listing = await nftMarketplace.getListing(basicNft.address, TOKEN_ID)
        assert(listing.price.toString() == NEW_PRICE.toString())
    })

    it("Deny not an owner of the nft", async function () {
        const nftMarketplacePlayer = nftMarketplace.connect(player)
        await basicNft.approve(player.address, TOKEN_ID)
        await expect(nftMarketplacePlayer.listItem(basicNft.address, TOKEN_ID, PRICE)).to.be.revertedWith("NotOwner")
    })


})
