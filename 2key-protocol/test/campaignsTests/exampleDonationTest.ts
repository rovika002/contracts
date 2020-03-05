import '../constants/polifils';
import availableUsers, {userIds} from "../constants/availableUsers";
import usersActions from "./reusable/userActions/usersActions";
import {campaignUserActions} from "./constants/constants";
import TestStorage from "../helperClasses/TestStorage";
import {campaignTypes, incentiveModels} from "../constants/smallConstants";
import {ICreateCampaign} from "../../src/donation/interfaces";
import createDonationCampaign from "./helpers/createDonationCampaign";
import checkDonationCampaign from "./reusable/checkDonationCampaign";

const contributionSize = 1;

const campaignData: ICreateCampaign = {
  moderator: undefined,
  invoiceToken: {
    tokenName: 'NikolaToken',
    tokenSymbol: 'NTKN',
  },
  maxReferralRewardPercent: 20,
  campaignStartTime: 0,
  campaignEndTime: 9884748832,
  minDonationAmount: 1,
  maxDonationAmount: 10,
  campaignGoal: 10000000000000000000000000000000,
  referrerQuota: 5,
  isKYCRequired: true,
  shouldConvertToRefer: false,
  acceptsFiat: false,
  incentiveModel: incentiveModels.manual,
  currency: 'ETH',
  endCampaignOnceGoalReached: false,
  expiryConversionInHours: 0,
};

describe(
  'exampleDonationTest',
  () => {
    const storage = new TestStorage(userIds.aydnep, campaignTypes.donation, campaignData.isKYCRequired);

    before(function () {
      this.timeout(60000);
      return createDonationCampaign(campaignData, storage);
    });

    checkDonationCampaign(campaignData, storage);


    usersActions(
      {
        userKey: userIds.guest,
        secondaryUserKey: storage.contractorKey,
        actions: [campaignUserActions.visit],
        campaignData,
        storage,
      }
    );

    usersActions(
      {
        userKey: userIds.gmail,
        secondaryUserKey: storage.contractorKey,
        actions: [
          campaignUserActions.visit,
          campaignUserActions.join,
        ],
        campaignData,
        storage,
        cut: 50,
      }
    );

    usersActions(
      {
        userKey: userIds.test4,
        secondaryUserKey: userIds.gmail,
        actions: [
          campaignUserActions.visit,
          campaignUserActions.checkManualCutsChain,
          campaignUserActions.joinAndConvert,
          campaignUserActions.checkConverterSpent,
        ],
        campaignData,
        storage,
        contribution: contributionSize,
      }
    );

    usersActions(
      {
        userKey: userIds.renata,
        secondaryUserKey: userIds.gmail,
        actions: [
          campaignUserActions.visit,
          campaignUserActions.checkManualCutsChain,
          campaignUserActions.joinAndConvert,
          campaignUserActions.checkConverterSpent,
        ],
        campaignData,
        storage,
        contribution: contributionSize,
      }
    );

    usersActions(
      {
        userKey: userIds.uport,
        secondaryUserKey: userIds.gmail,
        actions: [
          campaignUserActions.visit,
          campaignUserActions.checkManualCutsChain,
          campaignUserActions.joinAndConvert,
          campaignUserActions.checkConverterSpent,
        ],
        campaignData,
        storage,
        contribution: contributionSize,
      }
    );

    if(campaignData.isKYCRequired){
      usersActions(
        {
          userKey: userIds.uport,
          secondaryUserKey: userIds.gmail,
          actions: [
            campaignUserActions.cancelConvert,
          ],
          campaignData,
          storage,
          contribution: contributionSize,
        }
      );

      usersActions(
        {
          userKey: storage.contractorKey,
          secondaryUserKey: userIds.test4,
          actions: [
            campaignUserActions.checkPendingConverters,
            campaignUserActions.approveConverter,
          ],
          campaignData,
          storage,
          contribution: contributionSize,
        }
      );

      usersActions(
        {
          userKey: userIds.test4,
          actions: [
            campaignUserActions.executeConversion,
            campaignUserActions.checkConverterSpent,
          ],
          campaignData,
          storage,
          contribution: contributionSize,
        }
      );
      usersActions(
        {
          userKey: storage.contractorKey,
          secondaryUserKey: userIds.renata,
          actions: [
            campaignUserActions.checkPendingConverters,
            campaignUserActions.rejectConverter,
          ],
          campaignData,
          storage,
          contribution: contributionSize,
        }
      );
      usersActions(
        {
          userKey: userIds.renata,
          actions: [
            campaignUserActions.checkRestrictedConvert,
          ],
          campaignData,
          storage,
          contribution: contributionSize,
        }
      );
    }

    usersActions(
      {
        userKey: storage.contractorKey,
        actions: [
          campaignUserActions.hedgingEth,
        ],
        campaignData,
        storage,
      }
    );

    usersActions(
      {
        userKey: storage.contractorKey,
        secondaryUserKey: userIds.test4,
        actions: [
          campaignUserActions.checkERC20Balance,
        ],
        campaignData,
        storage,
      }
    );

    usersActions(
      {
        userKey: userIds.test4,
        actions: [
          campaignUserActions.checkReferrersList,
          campaignUserActions.checkReferrerReward,
          campaignUserActions.checkAvailableDonation,
          campaignUserActions.checkStatistic,
          campaignUserActions.checkContractorBalanceAndProceeds,
        ],
        campaignData,
        storage,
      }
    );

    usersActions(
      {
        userKey: userIds.gmail,
        actions: [
          campaignUserActions.checkReferrerRewardStats,
          campaignUserActions.moderatorAndReferrerWithdraw,
        ],
        campaignData,
        storage,
      }
    );
    it('should get stats for the contract from upgradable exchange', async() => {
      const {protocol, web3: {address}} = availableUsers[userIds.aydnep];
      const {campaignAddress} = storage;
      let stats = await protocol.UpgradableExchange.getStatusForTheContract(campaignAddress, address);
      console.log(stats);
    }).timeout(60000);
  },
);
