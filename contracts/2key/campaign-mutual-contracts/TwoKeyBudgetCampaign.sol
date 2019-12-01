pragma solidity ^0.4.24;

import "./TwoKeyCampaign.sol";
import "../interfaces/ITwoKeyConversionHandler.sol";
import "../interfaces/ITwoKeyExchangeRateContract.sol";
import "../interfaces/ITwoKeyCampaignLogicHandler.sol";
import "../upgradable-pattern-campaigns/UpgradeableCampaign.sol";
import "../interfaces/IERC20.sol";

/**
 * @author Nikola Madjarevic (https://github.com/madjarevicn)
 */
contract TwoKeyBudgetCampaign is TwoKeyCampaign {

	/**
	 * This is the BudgetCampaign contract abstraction which will
	 * be implemented by all budget campaigns in future
	 */


	// Representing if campaign "constructor" was called
	bool isCampaignInitialized;

	// Constant used for percentage calculations
	uint constant HUNDRED_PERCENT = 100;

	// Dollar to 2key rate in WEI at the moment of adding inventory
	uint public usd2KEYrateWei;

	// Variable to let us know if rewards have been bought with Ether
	bool public boughtRewardsWithEther;



	/**
     * @notice Internal function to check the balance of the specific ERC20 on this contract
     * @param tokenAddress is the ERC20 contract address
     */
	function getTokenBalance(
		address tokenAddress
	)
	internal
	view
	returns (uint)
	{
		return IERC20(tokenAddress).balanceOf(address(this));
	}


    /**
	 * @notice Function to add fiat inventory for rewards
	 * @dev only contractor can add this inventory
	 */
	function buyReferralBudgetWithEth()
	public
	onlyContractor
	payable
	{
		//It can be called only ONCE per campaign
		require(usd2KEYrateWei == 0);

		boughtRewardsWithEther = true;
		uint amountOfTwoKeys = buyTokensFromUpgradableExchange(msg.value, address(this));
		uint rateUsdToEth = ITwoKeyExchangeRateContract(getContractProxyAddress("TwoKeyExchangeRateContract")).getBaseToTargetRate("USD");

		usd2KEYrateWei = (msg.value).mul(rateUsdToEth).div(amountOfTwoKeys); //0.1 DOLLAR
	}

	/**
     * @notice Function which will buy tokens from upgradable exchange for moderator
     * @param moderatorFee is the fee in tokens moderator earned
     */
	function buyTokensForModeratorRewards(
		uint moderatorFee
	)
	public
	onlyTwoKeyConversionHandler
	{
		//Get deep freeze token pool address
		address twoKeyDeepFreezeTokenPool = getContractProxyAddress("TwoKeyDeepFreezeTokenPool");

		uint networkFee = twoKeyEventSource.getTwoKeyDefaultNetworkTaxPercent();

		// Balance which will go to moderator
		uint balance = moderatorFee.mul(HUNDRED_PERCENT.sub(networkFee)).div(HUNDRED_PERCENT);

		uint moderatorEarnings2key = buyTokensFromUpgradableExchange(balance,moderator); // Buy tokens for moderator
		buyTokensFromUpgradableExchange(moderatorFee.sub(balance), twoKeyDeepFreezeTokenPool); // Buy tokens for deep freeze token pool

		moderatorTotalEarnings2key = moderatorTotalEarnings2key.add(moderatorEarnings2key);
	}


	/**
     * @notice Function to withdraw remaining rewards inventory in the contract
     */
	function withdrawRemainingRewardsInventory() public onlyContractor
	returns (uint)
	{
		require(ITwoKeyCampaignLogicHandler(logicHandler).canContractorWithdrawRemainingRewardsInventory() == true);
		uint campaignRewardsBalance = getTokenBalance(twoKeyEconomy);

		uint rewardsNotSpent = campaignRewardsBalance.sub(reservedAmount2keyForRewards);
		if(rewardsNotSpent > 0) {
			IERC20(twoKeyEconomy).transfer(contractor, rewardsNotSpent);
		}
		return rewardsNotSpent;
	}

}
