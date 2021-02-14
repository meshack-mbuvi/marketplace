const { assert } = require('chai');
require('chai').use(require('chai-as-promised')).should()

/* eslint-disable no-undef */
const Marketplace = artifacts.require('./Marketplace.sol');

contract('Marketplace', ([deployer, seller, buyer]) => {
  let marketplace;

  before(async () => {
    marketplace = await Marketplace.deployed();
  })

  describe('deployment', async () => {
    it('deploys successfully', async () => {
      const address = await marketplace.address
      assert.notEqual(address, 0x0)
      assert.notEqual(address, '')
      assert.notEqual(address, null)
      assert.notEqual(address, undefined)
    })

    it('has a name', async () => {
      const name = await marketplace.name()
      assert.equal(name, 'Dapp University Marketplace')
    })
  })

  describe('products', async () => {
    let result, productCount;
    before(async () => {
      result = await marketplace.createProduct('Iphone X', web3.utils.toWei('1', 'Ether'), { from: seller });
      productCount = await marketplace.productCount();
    })

    it('creates products', async () => {
      // SUCCESS
      assert.equal(productCount, 1)
      const event = result.logs[0].args
      assert.equal(event.name, 'Iphone X')
      assert.equal(event.id.toNumber(), productCount.toNumber(), 'id is correct')
      assert.equal(event.purchased, false, 'Purchased is correct')
      assert.equal(event.owner, seller, ' seller is correct')

      // FAILURE: must have a name
      await await marketplace.createProduct('', web3.utils.toWei('1', 'Ether'), { from: seller }).should.be.rejected;

      // FAILURE: must have a price
      await await marketplace.createProduct('Iphone X', 0, { from: seller }).should.be.rejected;
    })
  })

})