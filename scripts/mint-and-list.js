const { ethers } = require("hardhat")

const PRICE = ethers.utils.parseEther("0.1")

async function mintAndList() {
    const nftMarketplace = await ethers.getContract("NftMarketplace")
    const basicNft = await ethers.getContract("BasicNft")
    console.log("Minting NFT...")
    const mintTx = await basicNft.mintNft()
    const mintTxRecipe = await mintTx.wait(1)
    const tokenId = mintTxRecipe.events[0].args.tokenId
    console.log("Approving NFT...")
    const approvalTX = await basicNft.approve(nftMarketplace.address, tokenId)
    await approvalTX.wait(1)
    console.log("Listing...")
    const listTx = await nftMarketplace.listItem(basicNft.address, tokenId, PRICE)
    await listTx.wait(1)
    console.log("Listed!")



}

mintAndList()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })