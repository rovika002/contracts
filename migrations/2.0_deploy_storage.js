const TwoKeyUpgradableExchangeStorage = artifacts.require('TwoKeyUpgradableExchangeStorage');
const TwoKeyCampaignValidatorStorage = artifacts.require('TwoKeyCampaignValidatorStorage');
const TwoKeyEventSourceStorage = artifacts.require("TwoKeyEventSourceStorage");
const TwoKeyAdminStorage = artifacts.require('TwoKeyAdminStorage');
const TwoKeyFactoryStorage = artifacts.require('TwoKeyFactoryStorage');


module.exports = function deploy(deployer) {
    deployer.deploy(TwoKeyCampaignValidatorStorage)
    .then(() => TwoKeyCampaignValidatorStorage.deployed())
    .then(() => deployer.deploy(TwoKeyUpgradableExchangeStorage))
    .then(() => TwoKeyUpgradableExchangeStorage.deployed())
    .then(() => deployer.deploy(TwoKeyEventSourceStorage))
    .then(() => TwoKeyEventSourceStorage.deployed())
    .then(() => deployer.deploy(TwoKeyAdminStorage))
    .then(() => TwoKeyAdminStorage.deployed())
    .then(() => deployer.deploy(TwoKeyFactoryStorage))
    .then(() => TwoKeyFactoryStorage.deployed())
    .then(() => true);
};
