module.exports = async ({getNamedAccounts, deployments, getChainId, getUnnamedAccounts,}) => {
  const {deploy} = deployments;
  const {deployer} = await getNamedAccounts();
  const chainId = await getChainId();

  if (chainId == 31337) { // hardhat network
    console.log('We are on local network, [Deploy Oracle Mocks]');
    const linkToken = await deploy('LinkToken', { from: deployer, log: true })
    await deploy('VRFCoordinatorMock', {
      from: deployer,
      log: true,
      args: [linkToken.address]
  })
  } 
  
};
module.exports.tags = ['mocks'];