const { increaseTime, latestTime, duration } = require("./utils");
require('truffle-test-utils').init();

const HOUR = 3600;

const ComposableAssetFactory = artifacts.require("ComposableAssetFactory");

const ERC721Mock = artifacts.require("ERC721TokenMock");
const ERC20Mock = artifacts.require("ERC20TokenMock");

contract('ComposableAssetFactory', async (accounts) => {

    let factory,
        erc721, 
        erc20;


    const coinbase = accounts[0];
    const tokenIndex = "123";
    const inventoryOwner = accounts[2];
    const factoryCreator = accounts[1];
    const tokenIDNFT = "1";
    const tokenIDFT = "2";


    before(async () => {

        erc721 = await ERC721Mock.new("NFT", "NFT");
        erc20 = await ERC20Mock.new();

        const openingTime = latestTime() + duration.minutes(1);
        const durationCampaign = duration.minutes(30);

        factory = await ComposableAssetFactory.new(openingTime, durationCampaign, {
            from: factoryCreator
        });
    });

    it("add fungible asset", async () => {


        await erc20.transfer(inventoryOwner, 200, {
            from: coinbase
        });

        let bal = await erc20.balanceOf(inventoryOwner);
        assert.equal(bal.toNumber(), 200, 'nothing tranferred to inventoryOwner');

        await erc20.approve(factory.address, 8, {
            from: inventoryOwner
        });

        let allow = await erc20.allowance(inventoryOwner, factory.address);
        assert.equal(allow.toNumber(), 8, 'allowance factory not set properly');


        await factory.addFungibleChild(tokenIDFT, erc20.address, 5, {
            from:  inventoryOwner
        });

        let balFactory = await erc20.balanceOf(factory.address);
        assert.equal(balFactory.toNumber(), 5, 'fungible was not transferred to composable by factoryCreator');


        let balinventoryOwner = await erc20.balanceOf(inventoryOwner);
        assert.equal(balinventoryOwner.toNumber(), 195, 'balance inventoryOwner not really changed by factoryCreator');


    });

    it("transfer fungible asset", async () => {
        const target = accounts[7];

        let initialBalanceTarget = await erc20.balanceOf(target);
        assert.equal(initialBalanceTarget.toNumber(), 0, 'target has some balance');


        await factory.transferFungibleChild(target, tokenIDFT, erc20.address, 3, {
            from: factoryCreator
        });

        let balFactory = await erc20.balanceOf(factory.address);
        assert.equal(balFactory.toNumber(), 2, 'fungible was not transferred from factory by factoryCreator');

        let balTarget = await erc20.balanceOf(target);
        assert.equal(balTarget.toNumber(), 3, 'fungible was not transferred to target by factoryCreator');


    });

    // it("add non fungible asset", async () => {

    //     await erc721.mint(inventoryOwner, tokenIndex, {
    //         from: coinbase,
    //     });

    //     await erc721.approve(factory.address, tokenIndex, {
    //         from: inventoryOwner
    //     });

    //     // let flag = await erc721.isApprovedOrOwner(factory.address, tokenIndex);
    //     // assert.isTrue(flag, 'composable not really approved');

    //     await factory.addNonFungibleChild(tokenIDNFT, erc721.address, tokenIndex, {
    //         from: factoryCreator
    //     });

    //     // let flagFactory = await erc721.isOwner(factory.address, tokenIndex);
    //     // assert.isTrue(flagFactory, 'composable owns the non fungible asset');

    //     // let flaginventoryOwner = await erc721.isOwner(factory.address, tokenIndex);
    //     // assert.isFalse(flaginventoryOwner, 'composable owns the non fungible asset');


    // });
  
   
});
