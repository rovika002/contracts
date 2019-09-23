pragma solidity ^0.4.24;


import "./InvoiceTokenERC20.sol";
import "../interfaces/ITwoKeyDonationCampaign.sol";
import "../interfaces/ITwoKeyBaseReputationRegistry.sol";
import "../interfaces/ITwoKeyExchangeRateContract.sol";
import "../upgradable-pattern-campaigns/UpgradeableCampaign.sol";
import "../campaign-mutual-contracts/TwoKeyCampaignConversionHandler.sol";


contract TwoKeyDonationConversionHandler is UpgradeableCampaign, TwoKeyCampaignConversionHandler {

    Conversion [] public conversions;
    InvoiceTokenERC20 public erc20InvoiceToken; // ERC20 token which will be issued as an invoice

    ITwoKeyDonationCampaign twoKeyCampaign;

    string currency;

    mapping(address => uint256) private converterToAmountOfDonationTokensReceived;


    //Struct to represent donation in Ether
    struct Conversion {
        address contractor; // Contractor (creator) of campaign
        uint256 contractorProceedsETHWei; // How much contractor will receive for this conversion
        address converter; // Converter is one who's buying tokens -> plasma address
        uint conversionCreatedAt; // Time when conversion was created
        ConversionState state;
        uint256 conversionAmount; // Amount for conversion (In ETH / FIAT)
        uint256 maxReferralRewardETHWei; // Total referral reward for the conversion
        uint256 maxReferralReward2key;
        uint256 moderatorFeeETHWei;
        uint256 tokensBought;
    }

    event InvoiceTokenCreated(
        address token,
        string tokenName,
        string tokenSymbol
    );


    function setInitialParamsDonationConversionHandler(
        string tokenName,
        string tokenSymbol,
        string _currency,
        address _contractor,
        address _twoKeyDonationCampaign,
        address _twoKeySingletonRegistry
    )
    public
    {
        require(isCampaignInitialized == false);

        counters = new uint[](10);
        twoKeyCampaign = ITwoKeyDonationCampaign(_twoKeyDonationCampaign);
        twoKeySingletonRegistry = _twoKeySingletonRegistry;
        twoKeyEventSource = getAddressFromTwoKeySingletonRegistry("TwoKeyEventSource");
        contractor = _contractor;
        currency = _currency;
        // Deploy an ERC20 token which will be used as the Invoice
        erc20InvoiceToken = new InvoiceTokenERC20(tokenName,tokenSymbol,address(this));
        // Emit an event with deployed token address, name, and symbol
        emit InvoiceTokenCreated(address(erc20InvoiceToken), tokenName, tokenSymbol);
        isCampaignInitialized = true;
    }


    function emitConvertedEvent(
        address converterAddress,
        uint conversionAmount,
        uint conversionId
    )
    internal
    view
    {
        ITwoKeyEventSource(twoKeyEventSource).convertedDonationV2(
            twoKeyCampaign,
            ITwoKeyEventSource(twoKeyEventSource).plasmaOf(converterAddress),
            conversionAmount,
            conversionId
        );
    }

    function emitExecutedEvent(
        address _converterAddress,
        uint conversionId,
        uint tokens
    )
    internal
    view
    {
        ITwoKeyEventSource(twoKeyEventSource).executedV1(
            twoKeyCampaign,
            ITwoKeyEventSource(twoKeyEventSource).plasmaOf(_converterAddress),
            conversionId,
            tokens
        );
    }

    function emitRejectedEvent(
        address _campaignAddress,
        address _converterAddress
    )
    internal
    view
    {
        ITwoKeyEventSource(twoKeyEventSource).rejected(
            twoKeyCampaign,
            ITwoKeyEventSource(twoKeyEventSource).plasmaOf(_converterAddress)
        );
    }



    /**
     * @notice Function to calculate amount of donation tokens to be received
     * @param _conversionAmountETHWei is the amount of conversion in WEI
     */
    function calculateAmountOfTokens(
        uint _conversionAmountETHWei
    )
    internal
    view
    returns (uint)
    {
        if(keccak256(currency) == keccak256('ETH')) {
            return _conversionAmountETHWei;
        } else {
            address twoKeyExchangeRateContract = getAddressFromTwoKeySingletonRegistry("TwoKeyExchangeRateContract");
            uint rate = ITwoKeyExchangeRateContract(twoKeyExchangeRateContract).getBaseToTargetRate(currency);
            uint conversionAmountInFIAT = (_conversionAmountETHWei*rate).div(10**18);
            return conversionAmountInFIAT;
        }
    }


    function transferInvoiceToken(
        address _converter,
        uint _conversionAmountETHWei
    )
    internal
    {
        uint amountOfTokens = calculateAmountOfTokens(_conversionAmountETHWei);
        converterToAmountOfDonationTokensReceived[_converter] = converterToAmountOfDonationTokensReceived[_converter].add(amountOfTokens);
        erc20InvoiceToken.transfer(_converter, amountOfTokens);
    }


    /**
     * @param _converterAddress is the one who calls join and donate function
     */
    function supportForCreateConversion(
        address _converterAddress,
        uint _conversionAmount,
        uint _maxReferralRewardETHWei,
        bool _isKYCRequired
    )
    public
    returns (uint)
    {
        require(msg.sender == address(twoKeyCampaign));
        //If KYC is required, basic funnel executes and we require that converter is not previously rejected
        if(_isKYCRequired == true) {
            require(converterToState[_converterAddress] != ConverterState.REJECTED); // If converter is rejected then can't create conversion
            // Checking the state for converter, if this is his 1st time, he goes initially to PENDING_APPROVAL
            if(converterToState[_converterAddress] == ConverterState.NOT_EXISTING) {
                converterToState[_converterAddress] = ConverterState.PENDING_APPROVAL;
                stateToConverter[bytes32("PENDING_APPROVAL")].push(_converterAddress);
            }
        } else {
            //If KYC is not required converter is automatically approved
            if(converterToState[_converterAddress] == ConverterState.NOT_EXISTING) {
                converterToState[_converterAddress] = ConverterState.APPROVED;
                stateToConverter[bytes32("APPROVED")].push(_converterAddress);
            }
        }


        uint256 _moderatorFeeETHWei = calculateModeratorFee(_conversionAmount);
        uint256 _contractorProceeds = _conversionAmount.sub(_maxReferralRewardETHWei.add(_moderatorFeeETHWei));
        counters[1] = counters[1].add(1);

        uint amountOfTokens = calculateAmountOfTokens(_conversionAmount);

        Conversion memory c = Conversion(
            contractor,
            _contractorProceeds,
            _converterAddress,
            block.timestamp,
            ConversionState.APPROVED,
            _conversionAmount,
            _maxReferralRewardETHWei,
            0,
            _moderatorFeeETHWei,
            amountOfTokens
        );

        conversions.push(c);
        converterToHisConversions[_converterAddress].push(numberOfConversions);
        emitConvertedEvent(_converterAddress, _conversionAmount, numberOfConversions);

        emit ConversionCreated(numberOfConversions);
        numberOfConversions = numberOfConversions.add(1);

        return numberOfConversions-1;

    }

    function executeConversion(
        uint _conversionId
    )
    public
    {
        Conversion conversion = conversions[_conversionId];
        require(converterToState[conversion.converter] == ConverterState.APPROVED);
        require(conversion.state == ConversionState.APPROVED);

        counters[1] = counters[1].sub(1); //Decrease number of approved conversions

//         Buy tokens from campaign and distribute rewards between referrers
        uint totalReward2keys = twoKeyCampaign.buyTokensAndDistributeReferrerRewards(
            conversion.maxReferralRewardETHWei,
            conversion.converter,
            _conversionId
        );


        // Update reputation points in registry for conversion executed event
        ITwoKeyBaseReputationRegistry(getAddressFromTwoKeySingletonRegistry("TwoKeyBaseReputationRegistry")).updateOnConversionExecutedEvent(
            conversion.converter,
            contractor,
            twoKeyCampaign
        );


        amountConverterSpentEthWEI[conversion.converter] = amountConverterSpentEthWEI[conversion.converter].add(conversion.conversionAmount);
        counters[8] = counters[8].add(totalReward2keys);
        twoKeyCampaign.buyTokensForModeratorRewards(conversion.moderatorFeeETHWei);
        twoKeyCampaign.updateContractorProceeds(conversion.contractorProceedsETHWei);

        counters[6] = counters[6].add(conversion.conversionAmount);

        if(doesConverterHaveExecutedConversions[conversion.converter] == false) {
            counters[5] = counters[5].add(1); //increase number of unique converters
            doesConverterHaveExecutedConversions[conversion.converter] = true;
        }

        conversion.maxReferralReward2key = totalReward2keys;
        conversion.state = ConversionState.EXECUTED;
        counters[3] = counters[3].add(1); //Increase number of executed conversions

        transferInvoiceToken(conversion.converter, conversion.conversionAmount);
        emitExecutedEvent(conversion.converter, _conversionId, conversion.tokensBought);
    }


    function rejectConverter(
        address _converter
    )
    public
    onlyContractorOrMaintainer
    {
        rejectConverterInternal(_converter);
        uint refundAmount = 0;
        uint len = converterToHisConversions[_converter].length;

        for(uint i=0; i<len; i++) {
            uint conversionId = converterToHisConversions[_converter][i];
            Conversion c = conversions[conversionId];

            //In this case since we don't support FIAT, every conversion is auto approved
            if(c.state == ConversionState.APPROVED) {
                counters[1] = counters[1].sub(1); // Reduce number of approved conversions
                counters[2] = counters[2].add(1); //Increase number of rejected conversions
                ITwoKeyBaseReputationRegistry(getAddressFromTwoKeySingletonRegistry("TwoKeyBaseReputationRegistry")).updateOnConversionRejectedEvent(_converter, contractor, twoKeyCampaign);
                c.state = ConversionState.REJECTED;
                refundAmount = refundAmount.add(c.conversionAmount);
            }
        }

        if(refundAmount > 0) {
            twoKeyCampaign.sendBackEthWhenConversionCancelledOrRejected(_converter, refundAmount);
        }

        emitRejectedEvent(twoKeyCampaign, _converter);
    }

    /**
     * @notice Function to cancel conversion and get back money
     * @param _conversionId is the id of the conversion
     * @dev returns all the funds to the converter back
     */
    function converterCancelConversion(
        uint _conversionId
    )
    public
    {
        Conversion conversion = conversions[_conversionId];

        uint numberOfDays = 10;
        require(conversion.conversionCreatedAt.add(numberOfDays.mul(1 days)) < block.timestamp);
        require(msg.sender == conversion.converter);
        require(conversion.state == ConversionState.PENDING_APPROVAL);

        counters[0] = counters[0].sub(1); // Reduce number of pending conversions
        counters[4] = counters[4].add(1); // Increase number of cancelled conversions
        conversion.state = ConversionState.CANCELLED_BY_CONVERTER;


        twoKeyCampaign.sendBackEthWhenConversionCancelledOrRejected(msg.sender, conversion.conversionAmount);
    }


    /**
     * @notice Function to get conversion details by id
     * @param conversionId is the id of conversion
     */
    function getConversion(
        uint conversionId
    )
    external
    view
    returns (bytes)
    {
        Conversion memory conversion = conversions[conversionId];

        address converter; // Defaults to 0x0

        if(isConverterAnonymous[conversion.converter] == false) {
            converter = conversion.converter;
        }

        return abi.encodePacked (
            conversion.contractor,
            converter,
            conversion.contractorProceedsETHWei,
            conversion.conversionAmount,
            conversion.tokensBought,
            conversion.maxReferralRewardETHWei,
            conversion.maxReferralReward2key,
            conversion.moderatorFeeETHWei,
            conversion.state
        );
    }

    function getAmountConverterSpent(
        address converter
    )
    public
    view
    returns (uint)
    {
        return amountConverterSpentEthWEI[converter];
    }

    function getAmountOfDonationTokensConverterReceived(
        address converter
    )
    public
    view
    returns (uint)
    {
        return converterToAmountOfDonationTokensReceived[converter];
    }

}
