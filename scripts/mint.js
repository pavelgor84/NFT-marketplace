const { ethers } = require("hardhat")

const PRICE = ethers.utils.parseEther("0.1")

async function mint() {
    const basicNft = await ethers.getContract("BasicNft")
    console.log("Minting NFT...")
    const mintTx = await basicNft.mintNft()
    const mintTxRecipe = await mintTx.wait(1)
    const tokenId = mintTxRecipe.events[0].args.tokenId
    console.log(`TokenId: ${tokenId}`)
    console.log(`NFT address: ${basicNft.address}`)
}

mint()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })