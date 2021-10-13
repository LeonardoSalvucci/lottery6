module.exports = async ({getNamedAccounts, deployments, getChainId, getUnnamedAccounts,}) => {
  const {deploy, get} = deployments;
  const {deployer} = await getNamedAccounts();
  const chainId = await getChainId();

  if (chainId == 31337) { // hardhat network
    const linkToken = await get('LinkToken')
    const vrfMock = await get('VRFCoordinatorMock')
    await deploy('TestMap', {
      from: deployer,
      log: true,
      args: [linkToken.address, vrfMock.address]
  })
  } 
  
};
module.exports.tags = ['testmap'];