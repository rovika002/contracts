pragma solidity ^0.4.24;


import '../openzeppelin-solidity/contracts/ownership/Ownable.sol';
import "./TwoKeyTypes.sol";
import "../interfaces/ITwoKeyAcquisitionCampaignERC20.sol";
import "./RBACWithAdmin.sol";
import "./TwoKeyConversionStates.sol";


// adapted from: 
// https://openzeppelin.org/api/docs/crowdsale_validation_WhitelistedCrowdsale.html

contract TwoKeyWhitelisted is TwoKeyTypes, TwoKeyConversionStates {

    mapping(address => Conversion) public conversions;
    // Same conversion can appear only in once of this 4 arrays at a time
    address[] addressesOfPendingConverters;
    address[] addressesOfApprovedConverters;
    address[] addressesOfRejectedConverters;
    address[] addressesOfExpiredConverters;


    address twoKeyAcquisitionCampaignERC20;
    address moderator;
    address contractor;

    address assetContractERC20;
    string assetSymbol;
    uint assetUnitDecimals;

    uint tokenDistributionDate; // January 1st 2019
    uint maxDistributionDateShiftInDays; // 180 days
    uint bonusTokensVestingMonths; // 6 months
    uint bonusTokensVestingStartShiftInDaysFromDistributionDate; // 180 days




    /// @notice Method which will be called inside constructor of TwoKeyAcquisitionCampaignERC20
    /// @param _twoKeyAcquisitionCampaignERC20 is the address of TwoKeyAcquisitionCampaignERC20 contract
    /// @param _moderator is the address of the moderator
    /// @param _contractor is the address of the contractor
    function setTwoKeyAcquisitionCampaignERC20(address _twoKeyAcquisitionCampaignERC20, address _moderator, address _contractor) public {
        require(twoKeyAcquisitionCampaignERC20 == address(0));
        twoKeyAcquisitionCampaignERC20 = _twoKeyAcquisitionCampaignERC20;
        moderator = _moderator;
        contractor = _contractor;
        // get asset name, address, price, etc all we need
    }

    /// Structure which will represent conversion
    struct Conversion {
        address contractor; // Contractor (creator) of campaign
        uint256 contractorProceeds; // How much contractor will receive for this conversion
        address converter; // Converter is one who's buying tokens
        ConversionState state;
        string assetSymbol; // Name of ERC20 token we're selling in our campaign (we can get that from contract address)
        address assetContractERC20; // Address of ERC20 token we're selling in our campaign
        uint256 conversionAmount; // Amount for conversion (In ETH)
        uint256 maxReferralRewardETHWei;
        uint256 moderatorFeeETHWei;
        uint256 baseTokenUnits;
        uint256 bonusTokenUnits;
        CampaignType campaignType; // Enumerator representing type of campaign (This one is however acquisition)
        uint256 conversionCreatedAt; // When conversion is created
        uint256 conversionExpiresAt; // When conversion expires
    }

    /// @notice Modifier which allows only TwoKeyAcquisitionCampaign to issue calls
    modifier onlyTwoKeyAcquisitionCampaign() {
        require(msg.sender == twoKeyAcquisitionCampaignERC20);
        _;
    }

    modifier onlyContractorOrModerator() {
        require(msg.sender == contractor || msg.sender == moderator);
        _;
    }

    modifier onlyWhitelistedConverter() {
        require(isWhitelistedConverter(msg.sender) == true);
        _;
    }

    //mapping containing if address of referrer is whitelisted
    mapping(address => bool) public whitelistedReferrer;

    //mapping containing if addresses of converter is whitelisted
    mapping(address => bool) public whitelistedConverter;


    constructor(uint _tokenDistributionDate, // January 1st 2019
        uint _maxDistributionDateShiftInDays, // 180 days
        uint _bonusTokensVestingMonths, // 6 months
        uint _bonusTokensVestingStartShiftInDaysFromDistributionDate) public {
        tokenDistributionDate = _tokenDistributionDate;
        maxDistributionDateShiftInDays = _maxDistributionDateShiftInDays;
        bonusTokensVestingMonths = _bonusTokensVestingMonths;
        bonusTokensVestingStartShiftInDaysFromDistributionDate = _bonusTokensVestingStartShiftInDaysFromDistributionDate;
    }

    /*
    ==============================CONVERTER WHITELIST FUNCTIONS=========================================================
    */
    function isWhitelistedReferrer(address _beneficiary) public view returns(bool) {
        return(whitelistedReferrer[_beneficiary]);
    }

    /*
     * @dev Adds single address to whitelist.
     * @param _beneficiary Address to be added to the whitelist
     */
    function addToWhitelistReferrer(address _beneficiary) public {
        whitelistedReferrer[_beneficiary] = true;
    }
    /**
     * @dev Adds list of addresses to whitelist. Not overloaded due to limitations with truffle testing.
     * @param _beneficiaries Addresses to be added to the whitelis
     */
    function addManyToWhitelistReferrer(address[] _beneficiaries) public {
        for (uint256 i = 0; i < _beneficiaries.length; i++) {
            whitelistedReferrer[_beneficiaries[i]] = true;
        }
    }
    /**
     * @dev Removes single address from whitelist.
     * @param _beneficiary Address to be removed to the whitelist
     */
    function removeFromWhitelistReferrer(address _beneficiary) public {
        whitelistedReferrer[_beneficiary] = false;
    }

    /*
    ===========================CONVERTER WHITELIST FUNCTIONS============================================================
    */

    function isWhitelistedConverter(address _beneficiary) public view returns(bool) {
        return(whitelistedConverter[_beneficiary]);
    }

    /*
     * @dev Adds single address to whitelist.
     * @param _beneficiary Address to be added to the whitelist
     */
    function addToWhitelistConverter(address _beneficiary) public {
        whitelistedConverter[_beneficiary] = true;
    }
    /**
     * @dev Adds list of addresses to whitelist. Not overloaded due to limitations with truffle testing.
     * @param _beneficiaries Addresses to be added to the whitelist
     */
    function addManyToWhitelistConverter(address[] _beneficiaries) public {
        for (uint256 i = 0; i < _beneficiaries.length; i++) {
            whitelistedConverter[_beneficiaries[i]] = true;
        }
    }
    /**
     * @dev Removes single address from whitelist.
     * @param _beneficiary Address to be removed to the whitelist
     */
    function removeFromWhitelistConverter(address _beneficiary) public {
        whitelistedConverter[_beneficiary] = false;
    }

    /*
    ====================================================================================================================
    */

    /// @notice Function which checks if converter has converted
    /// @dev will throw if not
    /// @param converterAddress is the address of converter
    function didConverterConvert(address converterAddress) public view {
        Conversion memory c = conversions[converterAddress];
        require(c.state != ConversionState.FULFILLED);
        require(c.state != ConversionState.CANCELLED);
    }

    /*
    ====================================================================================================================
    */

    function supportForCanceledEscrow(address _converterAddress) public onlyTwoKeyAcquisitionCampaign returns (uint256){
        Conversion memory c = conversions[_converterAddress];
        c.state = ConversionState.CANCELLED;
        conversions[_converterAddress] = c;

        return (c.contractorProceeds);
    }


    function supportForCancelAssetTwoKey(address _converterAddress) public view onlyTwoKeyAcquisitionCampaign{
        Conversion memory c = conversions[_converterAddress];
        require(c.state != ConversionState.CANCELLED);
        require(c.state != ConversionState.FULFILLED);
        require(c.state != ConversionState.REJECTED);
    }

    /// @notice Function which will support checking if escrow is expired
    /// @dev only contract TwoKeyAcquisitionCampaign can call this method
    /// @param _converterAddress is the address of the converter
    function supportForExpireEscrow(address _converterAddress) public view onlyTwoKeyAcquisitionCampaign {
        Conversion memory c = conversions[_converterAddress];
        require(c.state != ConversionState.CANCELLED);
        require(c.state != ConversionState.FULFILLED);
        require(c.state != ConversionState.REJECTED);
        require(now > c.conversionExpiresAt);
    }

    /// @notice Support function to create conversion
    /// @dev This function can only be called from TwoKeyAcquisitionCampaign contract address
    /// @param _contractor is the address of campaign contractor
    /// @param _contractorProceeds is the amount which goes to contractor
    /// @param _converterAddress is the address of the converter
    /// @param _conversionAmount is the amount for conversion in ETH
    /// @param expiryConversion is the length of conversion
    function supportForCreateConversion(
            address _contractor,
            uint256 _contractorProceeds,
            address _converterAddress,
            uint256 _conversionAmount,
            uint256 _maxReferralRewardETHWei,
            uint256 _moderatorFeeETHWei,
            uint256 baseTokensForConverterUnits,
            uint256 bonusTokensForConverterUnits,
            uint256 expiryConversion) public onlyTwoKeyAcquisitionCampaign {
        // these are going to be global variables
        address _assetContractERC20 = ITwoKeyAcquisitionCampaignERC20(twoKeyAcquisitionCampaignERC20).getAssetContractAddress();
        string memory _assetSymbol = ITwoKeyAcquisitionCampaignERC20(twoKeyAcquisitionCampaignERC20).getSymbol();
        Conversion memory c = Conversion(_contractor, _contractorProceeds, _converterAddress,
            ConversionState.PENDING, _assetSymbol, _assetContractERC20, _conversionAmount,
            _maxReferralRewardETHWei, _moderatorFeeETHWei, baseTokensForConverterUnits,
            bonusTokensForConverterUnits, CampaignType.CPA_FUNGIBLE,
            now, now + expiryConversion * (1 hours));

        conversions[_converterAddress] = c;
        addressesOfPendingConverters.push(_converterAddress);
    }

    /// @notice Function to encode provided parameters into bytes
    /// @param converter is address of converter
    /// @param conversionCreatedAt is timestamp when conversion is created
    /// @param conversionAmountETH is the amount of conversion in ETH
    /// @return bytes containing all this data concatenated and encoded into hex
    function encodeParams(address converter, uint conversionCreatedAt, uint conversionAmountETH) public view returns(bytes) {
        return abi.encodePacked(converter, conversionCreatedAt, conversionAmountETH);
    }

    function getEncodedConversion(address converter) public view returns (bytes) {
        Conversion memory _conversion = conversions[converter];
        bytes memory encoded = encodeParams(_conversion.converter, _conversion.conversionCreatedAt, _conversion.conversionAmount);
        return encoded;
    }

    /// @notice Function to retrieve all converters who's conversions are pending
    /// @dev it's a view function, doesn't consume any gas
    /// @return array of addresses of pending converters
    function getPendingConverters() public view onlyContractorOrModerator returns (address[]) {
        return addressesOfPendingConverters;
    }

    /// @notice Function to retrieve all converters who's conversions are rejected
    /// @dev it's a view function, doesn't consume any gas
    /// @return array of addresses of rejected converters
    function getRejectedConverters() public view onlyContractorOrModerator returns (address[]) {
        return addressesOfRejectedConverters;
    }

    /// @notice Function to retrieve all converters who's conversions are approved
    /// @dev it's a view function, doesn't consume any gas
    /// @return array of addresses of approved converters
    function getApprovedConverters() public view onlyContractorOrModerator returns (address[]) {
        return addressesOfApprovedConverters;
    }

    /// @notice Function to retrieve all converters who's conversions are expired
    /// @dev it's a view function, doesn't consume any gas
    /// @return array of addresses of expired converters
    function getExpiredConverters() public view onlyContractorOrModerator returns (address[]) {
        return addressesOfExpiredConverters;
    }

    /// @notice Function to check if address is in pending array of converters
    /// @param _pendingAddress is the address we're searching for
    /// @return true if found, otherwise false
    function isAddressPending(address _pendingAddress) public view returns (bool) {
        require(_pendingAddress != address(0));
        for(uint i=0; i<addressesOfPendingConverters.length; i++) {
            if(_pendingAddress == addressesOfPendingConverters[i]) {
                return true;
            }
        }
        return false;
    }


    /// @notice Function to check if address is in rejected array of converters
    /// @param _rejectedAddress is the address we're searching for
    /// @return true if found, otherwise false
    function isAddressRejected(address _rejectedAddress) public view returns (bool) {
        require(_rejectedAddress != address(0));
        for(uint i=0; i<addressesOfRejectedConverters.length; i++) {
            if(_rejectedAddress == addressesOfRejectedConverters[i]) {
                return true;
            }
        }
        return false;
    }

    function getConversionAttributes(address _converter) public view onlyTwoKeyAcquisitionCampaign returns (uint,uint,uint,uint) {
        Conversion memory conversion = conversions[_converter];
        return (conversion.maxReferralRewardETHWei, conversion.moderatorFeeETHWei,
        conversion.baseTokenUnits, conversion.bonusTokenUnits);
    }


    function fullFillConversion(address _converter) public onlyTwoKeyAcquisitionCampaign {
        Conversion memory conversion = conversions[_converter];
        conversion.state = ConversionState.FULFILLED;
        conversions[_converter] = conversion;
    }


    //******************************************************
    //(3) CONVERSION 2nd STEP
    //actually third step after the moderator/contractor approved the converter in the white list

    function executeConversion(address _converter) onlyWhitelistedConverter public {
        didConverterConvert(_converter);
        performConversion(_converter);
    }

    function performConversion(address _converter) internal {
        /*
         Then we need another function that requires converter to be whitelisted and should do the following:
            - Compute referral rewards and distribute then updateRefchainRewards
            - Compute and distribute moderation fees then
            - Generate lock-up contracts for tokens then
            - Move tokens to lock-up contracts then
            - Send remaining ether to contractor
        */

        uint _maxReferralRewardETHWei;
        uint _moderatorFee;
        uint _baseTokenUnits;
        uint _bonusTokenUnits;

        Conversion memory conversion = conversions[_converter];


        ITwoKeyAcquisitionCampaignERC20(twoKeyAcquisitionCampaignERC20).updateRefchainRewards(conversion.maxReferralRewardETHWei, _converter);

        /// Transfer fee to moderator balance
        moderator.transfer(conversion.moderatorFeeETHWei);



        //lockup contracts:
        /*
        1. basetokens get sent to 1 lockup contract
        2. bonus tokens are separated to 6 equal portions and sent to 6 lockup contracts.
        3. a lockupcontract has the converter as beneficiary, and a vesting date in which the converter is allowed to pull the tokens to any other address
        4. only other function of the lockupcontract is that the contractor may up to 1 time only, delay the vesting date of the tokens, by no more then maxVestingDaysDelay (param should be in campaign contract),
        and only if the vesting date has not yet arrived.

        EXAMPLE LOCKUP:
            -lockup contract has converter and contractor
            -lockup contract has balance of tokens (ERC20)
            -we have vesting date in lockup contract
            -lockup contract allows only converter to transfer the tokens only after vesting date
            -contractor can change the vesting date up to once by no more than "max vesting date days shift" (param)

        uint tokenDistributionDate; // January 1st 2019
        uint maxDistributionDateShiftInDays; // 180 days

        (tokenDistributionDate,maxDistributionDateShiftInDays,baseTokens, converter, contractor) -- constructor of lockup contract

        uint bonusTokensVestingMonths; // 6 months
        uint bonusTokensVestingStartShiftInDaysFromDistributionDate; // 180 days

        bonusTokensVestingMonths*(tokenDistributionDate + bonusTokensVestingStartShiftInDaysFromDistributionDate, maxDistributionDateShiftInDays,
        bonusTokens/bonusTokensVestingMonths, converter, contractor)

        */

        //this is if we want a simple test without lockup contracts
        //        require(assetContractERC20.call(bytes4(keccak256("transfer(address,uint256)")), _converterAddress, _units));


        //uint256 fee = calculateModeratorFee(c.payout);  //TODO take fee from conversion object since we already computed it.

        //require(twoKeyEconomy.transfer(moderator, fee.mul(rate)));

        //uint256 payout = c.payout;
        //uint256 maxReward = maxReferralRewardPercent.mul(payout).div(100);

        // transfer payout - fee - rewards to seller
        //require(twoKeyEconomy.transfer(contractor, (payout.sub(fee).sub(maxReward)).mul(rate)));

        //transferRewardsTwoKeyToken(c.from, maxReward.mul(rate));
        //twoKeyEventSource.fulfilled(address(this), c.converter, c.tokenID, c.assetContract, c.indexOrAmount, c.campaignType);

        //c.isFulfilled = true;

    }

}