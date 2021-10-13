const { expect } = require("chai");
const { ethers, deployments } = require("hardhat");

let link, testMap, vrfMock;

describe("Test Oracle VRF Mock", function () {
  it("Deploy TestMap", async function () {
    await deployments.fixture(['mocks', 'testmap'])
    const [owner] = await ethers.getSigners()
    const LinkToken = await deployments.get('LinkToken')
    link = await ethers.getContractAt('LinkToken', LinkToken.address)
    const TestMap = await deployments.get('TestMap')
    testMap = await ethers.getContractAt('TestMap', TestMap.address)
    const VRFMock = await deployments.get('VRFCoordinatorMock')
    vrfMock = await ethers.getContractAt('VRFCoordinatorMock', VRFMock.address)

  });

  it("Transfer LINK to Contract", async() => {
    const fundAmount = ethers.utils.parseEther('100')
    const [owner] = await ethers.getSigners()

    const balanceBefore = await link.balanceOf(testMap.address)

    await link.connect(owner).transfer(testMap.address, fundAmount)
    const balanceAfter = await link.balanceOf(testMap.address)
    expect((balanceAfter - balanceBefore).toString()).to.equal(fundAmount.toString())
  })

  it("Call runLottery", async () => {
    const [owner] = await ethers.getSigners()
    const expected = '777'

    // run Lottery
    const transaction = await testMap.runLottery()
    const tx_receipt = await transaction.wait()
    const requestId = tx_receipt.events[2].topics[0]

    // VRF Callback
    await vrfMock.callBackWithRandomness(requestId, expected, testMap.address)
    console.log(await testMap.getLastResult())
  })
  
});
