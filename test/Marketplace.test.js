

/* eslint-disable no-undef */
const Marketplace = artifacts.require("Marketplace");

require("chai").use(require("chai-as-promised")).should()



contract('Marketplace', ([deployer, seller, buyer]) => {
    let marketplace

    before(async () => {
        marketplace = await Marketplace.deployed()
    })

    describe('deployment', async () => {
       it('deploys successfully', async () => {
        const address = await marketplace.address

        assert.notEqual(address, 0x0)
        assert.notEqual(address, "");
        assert.notEqual(address, null);
        assert.notEqual(address, undefined);
       })

       it('it has a name', async () => {
        const name = await marketplace.name()


        assert.equal(name, "Dapp University Marketplace");

       })
    })

    describe("products", async () => {
     let results, productCount

      before(async () => {
        results = await marketplace.createProducts('iPhone X', web3.utils.toWei('1', 'Ether'), {from: seller});
        productCount = await marketplace.productCount();
      });
      // SUCCESS
      it("creates products", async () => {
                                           assert.equal(productCount, 1);
                                           const event = results.logs[0].args;

                                           assert.equal(
                                             event.id.toNumber(),
                                             productCount.toNumber(),
                                             "id is correct"
                                           );
                                           assert.equal(
                                             event.name,
                                             "iPhone X",
                                             "name is correct"
                                           );
                                           assert.equal(
                                             event.price,
                                             "1000000000000000000",
                                             "price is correct"
                                           );
                                           assert.equal(
                                             event.owner,
                                             seller,
                                             "id is correct"
                                           );
                                           assert.equal(
                                             event.purchased,
                                             false,
                                             "purchased is correct"
                                           );

                                           // FAILURE
                                           await await marketplace.createProducts(
                                             "",
                                             web3.utils.toWei("1", "Ether"),
                                             { from: seller }
                                           ).should.be.rejected;

                                           await await marketplace.createProducts(
                                             "iPhone X",
                                             0,
                                             { from: seller }
                                           ).should.be.rejected;
                                         });

                                          it("lists products", async () => {
                                            const product = await marketplace.products(
                                              productCount
                                            );
                                            assert.equal(
                                              product.id.toNumber(),
                                              productCount.toNumber(),
                                              "id is correct"
                                            );
                                            assert.equal(
                                              product.name,
                                              "iPhone X",
                                              "name is correct"
                                            );
                                            assert.equal(
                                              product.price,
                                              "1000000000000000000",
                                              "price is correct"
                                            );
                                            assert.equal(
                                              product.owner,
                                              seller,
                                              "id is correct"
                                            );
                                            assert.equal(
                                              product.purchased,
                                              false,
                                              "purchased is correct"
                                            );
                                          });

    it("sell product", async () => {
        // Track the seller balance before purchase
        let oldSellerBalance
        oldSellerBalance = await web3.eth.getBalance(seller)
        oldSellerBalance = new web3.utils.BN(oldSellerBalance);

        // SUCCESS: buyer make purchase
        results = await marketplace.purchaseProduct(productCount, {
          from: buyer,
          value: web3.utils.toWei("1", "Ether"),
        });

        // Check logs
const event = results.logs[0].args;
        assert.equal(
          event.id.toNumber(),
          productCount.toNumber(),
          "id is correct"
        );
        assert.equal(event.name, "iPhone X", "name is correct");
        assert.equal(event.price, "1000000000000000000", "price is correct");
        assert.equal(event.owner, buyer, "id is correct");
        assert.equal(event.purchased, true, "purchased is correct");

        // check that seller recieved funds
        let newSellerBalance
        newSellerBalance = await web3.eth.getBalance(seller);
        newSellerBalance = new web3.utils.BN(newSellerBalance);

        let price 
        price = web3.utils.toWei('1', 'Ether')
        price = new web3.utils.BN(price);


        const expectedBalance = oldSellerBalance.add(price);

        assert.equal(newSellerBalance.toString(), expectedBalance.toString());

        // FAILURE
        await marketplace.purchaseProduct(99, {
          from: buyer,
          value: web3.utils.toWei("1", "Ether"),
        }).should.be.rejected;

        await marketplace.purchaseProduct(productCount, {
          from: buyer,
          value: web3.utils.toWei("0.5", "Ether"),
        }).should.be.rejected;

        await marketplace.purchaseProduct(productCount, {
          from: deployer,
          value: web3.utils.toWei("1", "Ether"),
        }).should.be.rejected;

        await marketplace.purchaseProduct(productCount, {
          from: buyer,
          value: web3.utils.toWei("1", "Ether"),
        }).should.be.rejected;
                                            
     });

    });

     
})