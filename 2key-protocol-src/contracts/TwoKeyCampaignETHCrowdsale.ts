/* GENERATED BY TYPECHAIN VER. 0.2.7 */
/* tslint:disable */

import { BigNumber } from "bignumber.js";
import * as TC from "./typechain-runtime";

export class TwoKeyCampaignETHCrowdsale extends TC.TypeChainContract {
  public readonly rawWeb3Contract: any;

  public constructor(web3: any, address: string | BigNumber) {
    const abi = [
      {
        constant: true,
        inputs: [{ name: "", type: "address" }],
        name: "units",
        outputs: [{ name: "", type: "uint256" }],
        payable: false,
        stateMutability: "view",
        type: "function"
      },
      {
        constant: true,
        inputs: [],
        name: "name",
        outputs: [{ name: "", type: "string" }],
        payable: false,
        stateMutability: "view",
        type: "function"
      },
      {
        constant: false,
        inputs: [
          { name: "_spender", type: "address" },
          { name: "_value", type: "uint256" }
        ],
        name: "approve",
        outputs: [{ name: "", type: "bool" }],
        payable: false,
        stateMutability: "nonpayable",
        type: "function"
      },
      {
        constant: false,
        inputs: [
          { name: "_to", type: "address" },
          { name: "_value", type: "uint256" }
        ],
        name: "transferQuota",
        outputs: [{ name: "", type: "bool" }],
        payable: false,
        stateMutability: "nonpayable",
        type: "function"
      },
      {
        constant: false,
        inputs: [
          { name: "_tokenID", type: "uint256" },
          { name: "_assetContract", type: "address" },
          { name: "_amount", type: "uint256" }
        ],
        name: "transferAssetTwoKeyToken",
        outputs: [],
        payable: false,
        stateMutability: "nonpayable",
        type: "function"
      },
      {
        constant: true,
        inputs: [
          { name: "c", type: "address" },
          { name: "_method", type: "bytes" },
          { name: "_val", type: "uint256" }
        ],
        name: "call_return",
        outputs: [{ name: "answer", type: "uint256" }],
        payable: false,
        stateMutability: "view",
        type: "function"
      },
      {
        constant: true,
        inputs: [],
        name: "totalSupply",
        outputs: [{ name: "", type: "uint256" }],
        payable: false,
        stateMutability: "view",
        type: "function"
      },
      {
        constant: false,
        inputs: [{ name: "sig", type: "bytes" }],
        name: "transferSig",
        outputs: [],
        payable: false,
        stateMutability: "nonpayable",
        type: "function"
      },
      {
        constant: false,
        inputs: [
          { name: "_from", type: "address" },
          { name: "_to", type: "address" },
          { name: "_value", type: "uint256" }
        ],
        name: "transferFrom",
        outputs: [{ name: "", type: "bool" }],
        payable: false,
        stateMutability: "nonpayable",
        type: "function"
      },
      {
        constant: true,
        inputs: [{ name: "", type: "address" }],
        name: "received_from",
        outputs: [{ name: "", type: "address" }],
        payable: false,
        stateMutability: "view",
        type: "function"
      },
      {
        constant: true,
        inputs: [],
        name: "decimals",
        outputs: [{ name: "", type: "uint8" }],
        payable: false,
        stateMutability: "view",
        type: "function"
      },
      {
        constant: true,
        inputs: [],
        name: "getAssetContractAddress",
        outputs: [{ name: "", type: "address" }],
        payable: false,
        stateMutability: "view",
        type: "function"
      },
      {
        constant: true,
        inputs: [{ name: "", type: "address" }],
        name: "public_link_key",
        outputs: [{ name: "", type: "address" }],
        payable: false,
        stateMutability: "view",
        type: "function"
      },
      {
        constant: false,
        inputs: [
          { name: "_from", type: "address" },
          { name: "_to", type: "address" },
          { name: "_value", type: "uint256" }
        ],
        name: "transferFromQuota",
        outputs: [{ name: "", type: "bool" }],
        payable: false,
        stateMutability: "nonpayable",
        type: "function"
      },
      {
        constant: true,
        inputs: [],
        name: "checkInventoryBalance",
        outputs: [{ name: "", type: "uint256" }],
        payable: false,
        stateMutability: "view",
        type: "function"
      },
      {
        constant: false,
        inputs: [
          { name: "_spender", type: "address" },
          { name: "_subtractedValue", type: "uint256" }
        ],
        name: "decreaseApproval",
        outputs: [{ name: "", type: "bool" }],
        payable: false,
        stateMutability: "nonpayable",
        type: "function"
      },
      {
        constant: true,
        inputs: [],
        name: "getContractBalance",
        outputs: [{ name: "", type: "uint256" }],
        payable: false,
        stateMutability: "view",
        type: "function"
      },
      {
        constant: true,
        inputs: [{ name: "_owner", type: "address" }],
        name: "balanceOf",
        outputs: [{ name: "", type: "uint256" }],
        payable: false,
        stateMutability: "view",
        type: "function"
      },
      {
        constant: false,
        inputs: [{ name: "_amount", type: "uint256" }],
        name: "addFungibleAsset",
        outputs: [{ name: "", type: "bool" }],
        payable: false,
        stateMutability: "nonpayable",
        type: "function"
      },
      {
        constant: true,
        inputs: [],
        name: "getConstantInfo",
        outputs: [
          { name: "", type: "uint256" },
          { name: "", type: "uint256" },
          { name: "", type: "uint256" },
          { name: "", type: "uint256" }
        ],
        payable: false,
        stateMutability: "view",
        type: "function"
      },
      {
        constant: true,
        inputs: [],
        name: "ipfs_hash",
        outputs: [{ name: "", type: "string" }],
        payable: false,
        stateMutability: "view",
        type: "function"
      },
      {
        constant: true,
        inputs: [],
        name: "bounty",
        outputs: [{ name: "", type: "uint256" }],
        payable: false,
        stateMutability: "view",
        type: "function"
      },
      {
        constant: true,
        inputs: [],
        name: "symbol",
        outputs: [{ name: "", type: "string" }],
        payable: false,
        stateMutability: "view",
        type: "function"
      },
      {
        constant: false,
        inputs: [],
        name: "buyProduct",
        outputs: [],
        payable: true,
        stateMutability: "payable",
        type: "function"
      },
      {
        constant: true,
        inputs: [{ name: "", type: "address" }],
        name: "influencer2cut",
        outputs: [{ name: "", type: "uint256" }],
        payable: false,
        stateMutability: "view",
        type: "function"
      },
      {
        constant: false,
        inputs: [
          { name: "_to", type: "address" },
          { name: "_value", type: "uint256" }
        ],
        name: "transfer",
        outputs: [{ name: "", type: "bool" }],
        payable: false,
        stateMutability: "nonpayable",
        type: "function"
      },
      {
        constant: true,
        inputs: [{ name: "_from", type: "address" }],
        name: "checkAmountAddressSent",
        outputs: [{ name: "", type: "uint256" }],
        payable: false,
        stateMutability: "view",
        type: "function"
      },
      {
        constant: false,
        inputs: [
          { name: "_converter", type: "address" },
          { name: "_assetContract", type: "address" },
          { name: "_amount", type: "uint256" }
        ],
        name: "expireEscrow",
        outputs: [{ name: "", type: "bool" }],
        payable: false,
        stateMutability: "nonpayable",
        type: "function"
      },
      {
        constant: false,
        inputs: [{ name: "_amount", type: "uint256" }],
        name: "redeemTwoKeyToken",
        outputs: [],
        payable: false,
        stateMutability: "nonpayable",
        type: "function"
      },
      {
        constant: false,
        inputs: [
          { name: "_from", type: "address" },
          { name: "_assetName", type: "string" },
          { name: "_amount", type: "uint256" }
        ],
        name: "buyFromWithTwoKey",
        outputs: [],
        payable: false,
        stateMutability: "nonpayable",
        type: "function"
      },
      {
        constant: true,
        inputs: [],
        name: "quota",
        outputs: [{ name: "", type: "uint256" }],
        payable: false,
        stateMutability: "view",
        type: "function"
      },
      {
        constant: false,
        inputs: [{ name: "_public_link_key", type: "address" }],
        name: "setPublicLinkKey",
        outputs: [],
        payable: false,
        stateMutability: "nonpayable",
        type: "function"
      },
      {
        constant: false,
        inputs: [],
        name: "checkAndUpdateInventoryBalance",
        outputs: [{ name: "", type: "uint256" }],
        payable: false,
        stateMutability: "nonpayable",
        type: "function"
      },
      {
        constant: false,
        inputs: [
          { name: "_spender", type: "address" },
          { name: "_addedValue", type: "uint256" }
        ],
        name: "increaseApproval",
        outputs: [{ name: "", type: "bool" }],
        payable: false,
        stateMutability: "nonpayable",
        type: "function"
      },
      {
        constant: true,
        inputs: [{ name: "last_influencer", type: "address" }],
        name: "getCuts",
        outputs: [{ name: "", type: "uint256[]" }],
        payable: false,
        stateMutability: "view",
        type: "function"
      },
      {
        constant: false,
        inputs: [{ name: "sig", type: "bytes" }],
        name: "buySign",
        outputs: [],
        payable: true,
        stateMutability: "payable",
        type: "function"
      },
      {
        constant: true,
        inputs: [
          { name: "_owner", type: "address" },
          { name: "_spender", type: "address" }
        ],
        name: "allowance",
        outputs: [{ name: "", type: "uint256" }],
        payable: false,
        stateMutability: "view",
        type: "function"
      },
      {
        constant: false,
        inputs: [
          { name: "_units", type: "uint256" },
          { name: "_bounty", type: "uint256" }
        ],
        name: "updateRefchainRewardsAndConverterProceeds",
        outputs: [],
        payable: true,
        stateMutability: "payable",
        type: "function"
      },
      {
        constant: true,
        inputs: [{ name: "", type: "address" }],
        name: "conversions",
        outputs: [
          { name: "from", type: "address" },
          { name: "payout", type: "uint256" },
          { name: "converter", type: "address" },
          { name: "isFulfilled", type: "bool" },
          { name: "isCancelled", type: "bool" },
          { name: "assetName", type: "string" },
          { name: "assetContract", type: "address" },
          { name: "amount", type: "uint256" },
          { name: "campaignType", type: "uint8" },
          { name: "openingTime", type: "uint256" },
          { name: "closingTime", type: "uint256" }
        ],
        payable: false,
        stateMutability: "view",
        type: "function"
      },
      {
        constant: false,
        inputs: [
          { name: "_converter", type: "address" },
          { name: "_assetName", type: "string" },
          { name: "_assetContract", type: "address" },
          { name: "_amount", type: "uint256" }
        ],
        name: "cancelAssetTwoKey",
        outputs: [{ name: "", type: "bool" }],
        payable: false,
        stateMutability: "nonpayable",
        type: "function"
      },
      {
        inputs: [
          { name: "_eventSource", type: "address" },
          { name: "_economy", type: "address" },
          { name: "_whitelistInfluencer", type: "address" },
          { name: "_whitelistConverter", type: "address" },
          { name: "_moderator", type: "address" },
          { name: "_start", type: "uint256" },
          { name: "_duration", type: "uint256" },
          { name: "_expiryConversion", type: "uint256" },
          { name: "_escrowPrecentage", type: "uint256" },
          { name: "_rate", type: "uint256" },
          { name: "_maxPi", type: "uint256" },
          { name: "_assetContract", type: "address" }
        ],
        payable: false,
        stateMutability: "nonpayable",
        type: "constructor"
      },
      { payable: true, stateMutability: "payable", type: "fallback" },
      {
        anonymous: false,
        inputs: [
          { indexed: true, name: "to", type: "address" },
          { indexed: false, name: "units", type: "uint256" }
        ],
        name: "Fulfilled",
        type: "event"
      },
      {
        anonymous: false,
        inputs: [
          { indexed: true, name: "to", type: "address" },
          { indexed: false, name: "amount", type: "uint256" }
        ],
        name: "Rewarded",
        type: "event"
      },
      {
        anonymous: false,
        inputs: [{ indexed: true, name: "_contract", type: "address" }],
        name: "Expired",
        type: "event"
      },
      {
        anonymous: false,
        inputs: [
          { indexed: false, name: "_sender", type: "address" },
          { indexed: false, name: "value", type: "uint256" }
        ],
        name: "ReceivedEther",
        type: "event"
      },
      {
        anonymous: false,
        inputs: [
          { indexed: true, name: "owner", type: "address" },
          { indexed: true, name: "spender", type: "address" },
          { indexed: false, name: "value", type: "uint256" }
        ],
        name: "Approval",
        type: "event"
      },
      {
        anonymous: false,
        inputs: [
          { indexed: true, name: "from", type: "address" },
          { indexed: true, name: "to", type: "address" },
          { indexed: false, name: "value", type: "uint256" }
        ],
        name: "Transfer",
        type: "event"
      }
    ];
    super(web3, address, abi);
  }

  static async createAndValidate(
    web3: any,
    address: string | BigNumber
  ): Promise<TwoKeyCampaignETHCrowdsale> {
    const contract = new TwoKeyCampaignETHCrowdsale(web3, address);
    const code = await TC.promisify(web3.eth.getCode, [address]);

    // in case of missing smartcontract, code can be equal to "0x0" or "0x" depending on exact web3 implementation
    // to cover all these cases we just check against the source code length — there won't be any meaningful EVM program in less then 3 chars
    if (code.length < 4) {
      throw new Error(`Contract at ${address} doesn't exist!`);
    }
    return contract;
  }

  public get name(): Promise<string> {
    return TC.promisify(this.rawWeb3Contract.name, []);
  }

  public get totalSupply(): Promise<BigNumber> {
    return TC.promisify(this.rawWeb3Contract.totalSupply, []);
  }

  public get decimals(): Promise<BigNumber> {
    return TC.promisify(this.rawWeb3Contract.decimals, []);
  }

  public get getAssetContractAddress(): Promise<string> {
    return TC.promisify(this.rawWeb3Contract.getAssetContractAddress, []);
  }

  public get checkInventoryBalance(): Promise<BigNumber> {
    return TC.promisify(this.rawWeb3Contract.checkInventoryBalance, []);
  }

  public get getContractBalance(): Promise<BigNumber> {
    return TC.promisify(this.rawWeb3Contract.getContractBalance, []);
  }

  public get ipfs_hash(): Promise<string> {
    return TC.promisify(this.rawWeb3Contract.ipfs_hash, []);
  }

  public get bounty(): Promise<BigNumber> {
    return TC.promisify(this.rawWeb3Contract.bounty, []);
  }

  public get symbol(): Promise<string> {
    return TC.promisify(this.rawWeb3Contract.symbol, []);
  }

  public get quota(): Promise<BigNumber> {
    return TC.promisify(this.rawWeb3Contract.quota, []);
  }

  public units(arg0: BigNumber | string): Promise<BigNumber> {
    return TC.promisify(this.rawWeb3Contract.units, [arg0.toString()]);
  }

  public call_return(
    c: BigNumber | string,
    _method: string[],
    _val: BigNumber | number
  ): Promise<BigNumber> {
    return TC.promisify(this.rawWeb3Contract.call_return, [
      c.toString(),
      _method.map(val => val.toString()),
      _val.toString()
    ]);
  }

  public received_from(arg0: BigNumber | string): Promise<string> {
    return TC.promisify(this.rawWeb3Contract.received_from, [arg0.toString()]);
  }

  public public_link_key(arg0: BigNumber | string): Promise<string> {
    return TC.promisify(this.rawWeb3Contract.public_link_key, [
      arg0.toString()
    ]);
  }

  public balanceOf(_owner: BigNumber | string): Promise<BigNumber> {
    return TC.promisify(this.rawWeb3Contract.balanceOf, [_owner.toString()]);
  }

  public getConstantInfo(): Promise<
    [BigNumber, BigNumber, BigNumber, BigNumber]
  > {
    return TC.promisify(this.rawWeb3Contract.getConstantInfo, []);
  }

  public influencer2cut(arg0: BigNumber | string): Promise<BigNumber> {
    return TC.promisify(this.rawWeb3Contract.influencer2cut, [arg0.toString()]);
  }

  public checkAmountAddressSent(_from: BigNumber | string): Promise<BigNumber> {
    return TC.promisify(this.rawWeb3Contract.checkAmountAddressSent, [
      _from.toString()
    ]);
  }

  public getCuts(last_influencer: BigNumber | string): Promise<BigNumber[]> {
    return TC.promisify(this.rawWeb3Contract.getCuts, [
      last_influencer.toString()
    ]);
  }

  public allowance(
    _owner: BigNumber | string,
    _spender: BigNumber | string
  ): Promise<BigNumber> {
    return TC.promisify(this.rawWeb3Contract.allowance, [
      _owner.toString(),
      _spender.toString()
    ]);
  }

  public conversions(
    arg0: BigNumber | string
  ): Promise<
    [
      string,
      BigNumber,
      string,
      boolean,
      boolean,
      string,
      string,
      BigNumber,
      BigNumber,
      BigNumber,
      BigNumber
    ]
  > {
    return TC.promisify(this.rawWeb3Contract.conversions, [arg0.toString()]);
  }

  public approveTx(
    _spender: BigNumber | string,
    _value: BigNumber | number
  ): TC.DeferredTransactionWrapper<TC.ITxParams> {
    return new TC.DeferredTransactionWrapper<TC.ITxParams>(this, "approve", [
      _spender.toString(),
      _value.toString()
    ]);
  }
  public transferQuotaTx(
    _to: BigNumber | string,
    _value: BigNumber | number
  ): TC.DeferredTransactionWrapper<TC.ITxParams> {
    return new TC.DeferredTransactionWrapper<TC.ITxParams>(
      this,
      "transferQuota",
      [_to.toString(), _value.toString()]
    );
  }
  public transferAssetTwoKeyTokenTx(
    _tokenID: BigNumber | number,
    _assetContract: BigNumber | string,
    _amount: BigNumber | number
  ): TC.DeferredTransactionWrapper<TC.ITxParams> {
    return new TC.DeferredTransactionWrapper<TC.ITxParams>(
      this,
      "transferAssetTwoKeyToken",
      [_tokenID.toString(), _assetContract.toString(), _amount.toString()]
    );
  }
  public transferSigTx(
    sig: string[]
  ): TC.DeferredTransactionWrapper<TC.ITxParams> {
    return new TC.DeferredTransactionWrapper<TC.ITxParams>(
      this,
      "transferSig",
      [sig.map(val => val.toString())]
    );
  }
  public transferFromTx(
    _from: BigNumber | string,
    _to: BigNumber | string,
    _value: BigNumber | number
  ): TC.DeferredTransactionWrapper<TC.ITxParams> {
    return new TC.DeferredTransactionWrapper<TC.ITxParams>(
      this,
      "transferFrom",
      [_from.toString(), _to.toString(), _value.toString()]
    );
  }
  public transferFromQuotaTx(
    _from: BigNumber | string,
    _to: BigNumber | string,
    _value: BigNumber | number
  ): TC.DeferredTransactionWrapper<TC.ITxParams> {
    return new TC.DeferredTransactionWrapper<TC.ITxParams>(
      this,
      "transferFromQuota",
      [_from.toString(), _to.toString(), _value.toString()]
    );
  }
  public decreaseApprovalTx(
    _spender: BigNumber | string,
    _subtractedValue: BigNumber | number
  ): TC.DeferredTransactionWrapper<TC.ITxParams> {
    return new TC.DeferredTransactionWrapper<TC.ITxParams>(
      this,
      "decreaseApproval",
      [_spender.toString(), _subtractedValue.toString()]
    );
  }
  public addFungibleAssetTx(
    _amount: BigNumber | number
  ): TC.DeferredTransactionWrapper<TC.ITxParams> {
    return new TC.DeferredTransactionWrapper<TC.ITxParams>(
      this,
      "addFungibleAsset",
      [_amount.toString()]
    );
  }
  public buyProductTx(): TC.DeferredTransactionWrapper<TC.IPayableTxParams> {
    return new TC.DeferredTransactionWrapper<TC.IPayableTxParams>(
      this,
      "buyProduct",
      []
    );
  }
  public transferTx(
    _to: BigNumber | string,
    _value: BigNumber | number
  ): TC.DeferredTransactionWrapper<TC.ITxParams> {
    return new TC.DeferredTransactionWrapper<TC.ITxParams>(this, "transfer", [
      _to.toString(),
      _value.toString()
    ]);
  }
  public expireEscrowTx(
    _converter: BigNumber | string,
    _assetContract: BigNumber | string,
    _amount: BigNumber | number
  ): TC.DeferredTransactionWrapper<TC.ITxParams> {
    return new TC.DeferredTransactionWrapper<TC.ITxParams>(
      this,
      "expireEscrow",
      [_converter.toString(), _assetContract.toString(), _amount.toString()]
    );
  }
  public redeemTwoKeyTokenTx(
    _amount: BigNumber | number
  ): TC.DeferredTransactionWrapper<TC.ITxParams> {
    return new TC.DeferredTransactionWrapper<TC.ITxParams>(
      this,
      "redeemTwoKeyToken",
      [_amount.toString()]
    );
  }
  public buyFromWithTwoKeyTx(
    _from: BigNumber | string,
    _assetName: string,
    _amount: BigNumber | number
  ): TC.DeferredTransactionWrapper<TC.ITxParams> {
    return new TC.DeferredTransactionWrapper<TC.ITxParams>(
      this,
      "buyFromWithTwoKey",
      [_from.toString(), _assetName.toString(), _amount.toString()]
    );
  }
  public setPublicLinkKeyTx(
    _public_link_key: BigNumber | string
  ): TC.DeferredTransactionWrapper<TC.ITxParams> {
    return new TC.DeferredTransactionWrapper<TC.ITxParams>(
      this,
      "setPublicLinkKey",
      [_public_link_key.toString()]
    );
  }
  public checkAndUpdateInventoryBalanceTx(): TC.DeferredTransactionWrapper<
    TC.ITxParams
  > {
    return new TC.DeferredTransactionWrapper<TC.ITxParams>(
      this,
      "checkAndUpdateInventoryBalance",
      []
    );
  }
  public increaseApprovalTx(
    _spender: BigNumber | string,
    _addedValue: BigNumber | number
  ): TC.DeferredTransactionWrapper<TC.ITxParams> {
    return new TC.DeferredTransactionWrapper<TC.ITxParams>(
      this,
      "increaseApproval",
      [_spender.toString(), _addedValue.toString()]
    );
  }
  public buySignTx(
    sig: string[]
  ): TC.DeferredTransactionWrapper<TC.IPayableTxParams> {
    return new TC.DeferredTransactionWrapper<TC.IPayableTxParams>(
      this,
      "buySign",
      [sig.map(val => val.toString())]
    );
  }
  public updateRefchainRewardsAndConverterProceedsTx(
    _units: BigNumber | number,
    _bounty: BigNumber | number
  ): TC.DeferredTransactionWrapper<TC.IPayableTxParams> {
    return new TC.DeferredTransactionWrapper<TC.IPayableTxParams>(
      this,
      "updateRefchainRewardsAndConverterProceeds",
      [_units.toString(), _bounty.toString()]
    );
  }
  public cancelAssetTwoKeyTx(
    _converter: BigNumber | string,
    _assetName: string,
    _assetContract: BigNumber | string,
    _amount: BigNumber | number
  ): TC.DeferredTransactionWrapper<TC.ITxParams> {
    return new TC.DeferredTransactionWrapper<TC.ITxParams>(
      this,
      "cancelAssetTwoKey",
      [
        _converter.toString(),
        _assetName.toString(),
        _assetContract.toString(),
        _amount.toString()
      ]
    );
  }

  public FulfilledEvent(eventFilter: {
    to?: BigNumber | string | Array<BigNumber | string>;
  }): TC.DeferredEventWrapper<
    { to: BigNumber | string; units: BigNumber | number },
    { to?: BigNumber | string | Array<BigNumber | string> }
  > {
    return new TC.DeferredEventWrapper<
      { to: BigNumber | string; units: BigNumber | number },
      { to?: BigNumber | string | Array<BigNumber | string> }
    >(this, "Fulfilled", eventFilter);
  }
  public RewardedEvent(eventFilter: {
    to?: BigNumber | string | Array<BigNumber | string>;
  }): TC.DeferredEventWrapper<
    { to: BigNumber | string; amount: BigNumber | number },
    { to?: BigNumber | string | Array<BigNumber | string> }
  > {
    return new TC.DeferredEventWrapper<
      { to: BigNumber | string; amount: BigNumber | number },
      { to?: BigNumber | string | Array<BigNumber | string> }
    >(this, "Rewarded", eventFilter);
  }
  public ExpiredEvent(eventFilter: {
    _contract?: BigNumber | string | Array<BigNumber | string>;
  }): TC.DeferredEventWrapper<
    { _contract: BigNumber | string },
    { _contract?: BigNumber | string | Array<BigNumber | string> }
  > {
    return new TC.DeferredEventWrapper<
      { _contract: BigNumber | string },
      { _contract?: BigNumber | string | Array<BigNumber | string> }
    >(this, "Expired", eventFilter);
  }
  public ReceivedEtherEvent(eventFilter: {}): TC.DeferredEventWrapper<
    { _sender: BigNumber | string; value: BigNumber | number },
    {}
  > {
    return new TC.DeferredEventWrapper<
      { _sender: BigNumber | string; value: BigNumber | number },
      {}
    >(this, "ReceivedEther", eventFilter);
  }
  public ApprovalEvent(eventFilter: {
    owner?: BigNumber | string | Array<BigNumber | string>;
    spender?: BigNumber | string | Array<BigNumber | string>;
  }): TC.DeferredEventWrapper<
    {
      owner: BigNumber | string;
      spender: BigNumber | string;
      value: BigNumber | number;
    },
    {
      owner?: BigNumber | string | Array<BigNumber | string>;
      spender?: BigNumber | string | Array<BigNumber | string>;
    }
  > {
    return new TC.DeferredEventWrapper<
      {
        owner: BigNumber | string;
        spender: BigNumber | string;
        value: BigNumber | number;
      },
      {
        owner?: BigNumber | string | Array<BigNumber | string>;
        spender?: BigNumber | string | Array<BigNumber | string>;
      }
    >(this, "Approval", eventFilter);
  }
  public TransferEvent(eventFilter: {
    from?: BigNumber | string | Array<BigNumber | string>;
    to?: BigNumber | string | Array<BigNumber | string>;
  }): TC.DeferredEventWrapper<
    {
      from: BigNumber | string;
      to: BigNumber | string;
      value: BigNumber | number;
    },
    {
      from?: BigNumber | string | Array<BigNumber | string>;
      to?: BigNumber | string | Array<BigNumber | string>;
    }
  > {
    return new TC.DeferredEventWrapper<
      {
        from: BigNumber | string;
        to: BigNumber | string;
        value: BigNumber | number;
      },
      {
        from?: BigNumber | string | Array<BigNumber | string>;
        to?: BigNumber | string | Array<BigNumber | string>;
      }
    >(this, "Transfer", eventFilter);
  }
}
