const Marketplace = artifacts.require('./Marketplace.sol');

contract('Markeplace', (accounts)=>{
  let markeplace;

  before(async()=>{
    markeplace = await Marketplace.deployed();
  })

  describe('deployment', async()=>{
    it('deploys successfully', async()=>{
      const address = await markeplace.address
      assert.notEqual(address, 0x0)
      assert.notEqual(address, '')
      assert.notEqual(address, null)
      assert.notEqual(address, undefined)
    })

    it('has a name', async()=>{
      const name = await markeplace.name()
      assert.equal(name, 'Dapp University Marketplace')
    })
  })
})