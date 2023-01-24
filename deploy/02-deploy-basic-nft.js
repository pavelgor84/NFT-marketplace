const { network } = require("hardhat")
const { developementNetworks, VERIFICATION_BLOCK_CONFIRMATIONS } = require("../helper-hh-config")
const { verify } = require("../utils/verify")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();

    let args = [];

    const basicNft = await deploy("BasicNft", {
        from: deployer,
        args: args,
        log: true,
        waitConfirmations: 1
    })

    if (!developementNetworks.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        log("Verifying...")
        await verify(basicNft.address, args)
    }

    log("----------------------------")
    module.exports.tags = ["all", "basicnft"]

}