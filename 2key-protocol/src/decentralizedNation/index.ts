import {ICreateOpts, ITwoKeyBase, ITwoKeyHelpers, ITwoKeyAcquisitionCampaign} from '../interfaces';
import {
    IDaoMeta,
    IDecentralizedNation,
    IDecentralizedNationConstructor,
    IMember,
    INationalVotingCampaign,
    IVotingCampaign,
} from "./interfaces";
import {ITwoKeyUtils} from "../utils/interfaces";
import {promisify} from "../utils";
import contracts from '../contracts';
import {ITwoKeyWeightedVoteConstructor} from "../veightedVote/interfaces";
import {ITwoKeyWeightedVoteContract} from "../veightedVote";
import {IJoinLinkOpts} from "../acquisition/interfaces";
import Sign from '../utils/sign';

export default class DecentralizedNation implements IDecentralizedNation {
    private readonly base: ITwoKeyBase;
    private readonly helpers: ITwoKeyHelpers;
    private readonly utils: ITwoKeyUtils;
    private readonly veightedVode: ITwoKeyWeightedVoteContract;
    private readonly acquisitionCampaign: ITwoKeyAcquisitionCampaign;

    constructor(twoKeyProtocol: ITwoKeyBase, helpers: ITwoKeyHelpers, utils: ITwoKeyUtils, veightedVote: ITwoKeyWeightedVoteContract, acquisitionCampaign: ITwoKeyAcquisitionCampaign) {
        this.base = twoKeyProtocol;
        this.helpers = helpers;
        this.utils = utils;
        this.veightedVode = veightedVote;
        this.acquisitionCampaign = acquisitionCampaign;
    }

    _convertMembersFromBytes(members: any): IMember[] {
        const result: IMember[] = [];
        const [ addresses, usernames, fullnames, emails, types ] = members;
        const l = addresses.length;
        for (let i = 0; i < l; i++) {
            result.push({
                address: addresses[i],
                username: this.base.web3.toUtf8(usernames[i]),
                fullname: this.base.web3.toUtf8(fullnames[i]),
                email: this.base.web3.toUtf8(emails[i]),
                type: this.base.web3.toUtf8(types[i]),
            });
        }
        return result;
    }

    /**
     *
     * @param {IDecentralizedNationConstructor} data
     * @param {string} from
     * @returns {Promise<string>}
     */
    public check(address: string, from: string): Promise<boolean> {
        return new Promise(async(resolve,reject) => {
            try {
                let exists = await promisify(this.base.twoKeyReg.checkIfTwoKeyMaintainerExists, [address, {from}]);
                resolve(exists);
            } catch (e) {
                reject(e);
            }
        })
    }

    /**
     *
     * @param {string} username
     * @param {string} address
     * @param {string} fullName
     * @param {string} email
     * @param {string} from
     * @returns {Promise<string>}
     */
    public populateData(username:string, address:string, fullName:string, email:string, from: string): Promise<string> {
        return new Promise(async(resolve,reject) => {
            try {
                 const nonce = await this.helpers._getNonce(from);
                 let txHash = await promisify(this.base.twoKeyReg.addName,[
                        username,
                        address,
                        fullName,
                        email,
                        {
                            from,
                            nonce
                        }
                    ]);
                    await this.utils.getTransactionReceiptMined(txHash);
                resolve(txHash);
            } catch(e) {
                reject(e);
            }
        })
    }

    /**
     *
     * @param {IDecentralizedNationConstructor} data
     * @param {string} from
     * @returns {Promise<string>}
     */
    public create(data: IDecentralizedNationConstructor, from: string, { gasPrice, progressCallback, interval, timeout = 60000 }: ICreateOpts = {}) : Promise<string> {
        return new Promise(async(resolve,reject) => {
            try {
                //TODO: Deploy twokeyVoteToken

                let txHash = await this.helpers._createContract(contracts.DecentralizedNation ,from, {params: [
                    data.nationName,
                    data.ipfsHashForConstitution,
                    data.ipfsHashForDAOPublicInfo,
                    data.initialMemberAddresses,
                    data.initialMemberTypes.map(type => this.base.web3.toHex(type)),
                    data.limitsPerMemberType,
                    data.eligibleToStartVotingCampaign,
                    data.minimalNumberOfVotersForVotingCampaign,
                    data.minimalPercentOfVotersForVotingCampaign,
                    data.minimalNumberOfVotersForPetitioningCampaign,
                    data.minimalPercentOfVotersForPetitioningCampaign,
                    this.base.twoKeyReg.address,
                ],
                    gasPrice,
                    progressCallback, },
                );
                let receipt = await this.utils.getTransactionReceiptMined(txHash, { interval, timeout, web3: this.base.web3 });
                let address = receipt.contractAddress;
                resolve(address);
            } catch (e) {
                reject(e);
            }
        })
    }

    /**
     *
     * @param decentralizedNation
     * @param {string} from
     * @returns {Promise<any>}
     */
    public getAllMembersFromDAO(decentralizedNation:any) : Promise<IMember[]> {
        /*
        * addresses[]
        * usernames[]: bytes
        * fullnames[]: bytes
        * emails[]: bytes
        * types[]: bytes
        * */
        return new Promise(async(resolve,reject) => {
            try {
                const decentralizedNationInstance = await this.helpers._getDecentralizedNationInstance(decentralizedNation);
                // const members:IMember[] = [];
                // const [ addresses, usernames, fullnames, emails, types ] = await promisify(decentralizedNationInstance.getAllMembers, [{from}]);
                const members = this._convertMembersFromBytes(await promisify(decentralizedNationInstance.getAllMembers, []));
                // const l = addresses.length;
                // for (let i = 0; i < l; i++) {
                //     members.push({
                //         address: addresses[i],
                //         username: this.base.web3.toUtf8(usernames[i]),
                //         fullname: this.base.web3.toUtf8(fullnames[i]),
                //         email: this.base.web3.toUtf8(emails[i]),
                //         type: this.base.web3.toUtf8(types[i]),
                //     });
                // }
                resolve(members)
            } catch (e) {
                reject(e);
            }
        });
    }


    /**
     *
     * @param decentralizedNation
     * @param {string} memberType
     * @param {string} from
     * @returns {Promise<any>}
     */
    public getAllMembersForSpecificType(decentralizedNation:any, memberType:string, from:string) : Promise<any> {
        return new Promise(async(resolve,reject) => {
           try {
                let decentralizedNationInstance = await this.helpers._getDecentralizedNationInstance(decentralizedNation);
               memberType = this.base.web3.toHex(memberType);
                let allMembersForType = await promisify(decentralizedNationInstance.getAllMembersForType,[memberType,{from}]);
                resolve(allMembersForType);
           } catch (e) {
               reject(e);
           }
        });
    }

    /**
     *
     * @param decentralizedNation
     * @param {string} address
     * @param {string} from
     * @returns {Promise<number>}
     */
    public getVotingPointsForTheMember(decentralizedNation: any, address: string, from: string) : Promise<number> {
        return new Promise (async(resolve,reject) => {
            try {
                let decentralizedNationInstance = await this.helpers._getDecentralizedNationInstance(decentralizedNation);
                let votingPoints = await promisify(decentralizedNationInstance.getMembersVotingPoints,[address,{from}]);
                resolve(votingPoints);
            } catch (e) {
                reject(e);
            }
        });
    }

    /**
     *
     * @param decentralizedNation
     * @param {string} newMemberAddress
     * @param {string} memberType
     * @param {string} from
     * @returns {Promise<string>}
     */
    public addMemberByFounder(decentralizedNation: any, newMemberAddress: string, memberType:string, from:string) : Promise<string> {
        return new Promise(async(resolve,reject) => {
           try {
               memberType = this.base.web3.toHex(memberType);
               let decentralizedNationInstance = await this.helpers._getDecentralizedNationInstance(decentralizedNation);
               let txHash = await promisify(decentralizedNationInstance.addMembersByFounders,[newMemberAddress,memberType,{from}]);
               console.log(txHash);
               resolve(txHash);
           } catch (e) {
               reject(e);
           }
        });
    }


    /**
     *
     * @param decentralizedNation
     * @param {string} from
     * @returns {Promise<any>}
     */
    public getNameAndIpfsHashesForDAO(decentralizedNation: any) : Promise<IDaoMeta> {
        return new Promise( async(resolve, reject) => {
            try {
                const decentralizedNationInstance = await this.helpers._getDecentralizedNationInstance(decentralizedNation);
                const [name, constitution, metaIPFS] = await promisify(decentralizedNationInstance.getNameAndIpfsHashes,[]);
                console.log(name, constitution, metaIPFS);
                const meta = JSON.parse((await promisify(this.base.ipfs.cat, [metaIPFS])).toString());
                resolve({
                    name,
                    constitution,
                    meta,
                });
            } catch (e) {
                reject(e);
            }
        })
    }

    /**
     *
     * @param decentralizedNation
     * @param {INationalVotingCampaign} data
     * @param {string} from
     * @param {number} gasPrice
     * @param {ICreateCampaignProgress} progressCallback
     * @param {number} interval
     * @param {number} timeout
     * @returns {Promise<string>}
     */
    public createCampaign(decentralizedNation: any, data: INationalVotingCampaign, from: string, { gasPrice, progressCallback, interval, timeout = 60000 }: ICreateOpts = {}) : Promise<any> {
        return new Promise(async(resolve, reject) => {
            try{
                const decentralizedNationInstance = await this.helpers._getDecentralizedNationInstance(decentralizedNation);
                let addressOfVoteToken = await promisify(decentralizedNationInstance.votingToken,[]);

                this.base._log("ADDRESS OF VOTE TOKEN: " + addressOfVoteToken);

                const dataForVotingContract : ITwoKeyWeightedVoteConstructor = {
                    descriptionForVoting: data.votingReason,
                    addressOfDAO: decentralizedNationInstance.address,
                    erc20: addressOfVoteToken
                };

                this.base._log("HERE");
                let addressOfVotingContract = await this.veightedVode.createWeightedVoteContract(dataForVotingContract, from, {
                    gasPrice, progressCallback, interval, timeout
                });

                let txHash = await promisify(decentralizedNationInstance.startCampagin,[
                    data.votingReason,
                    data.campaignLengthInDays,
                    addressOfVotingContract,
                    data.flag,
                    {
                        from,
                        gasPrice,
                    }
                ]);
                await this.utils.getTransactionReceiptMined(txHash);
                const campaignPublicLinkKey = await this.acquisitionCampaign.join(addressOfVotingContract, from, {gasPrice});
                resolve(campaignPublicLinkKey);
            } catch(e) {
                reject(e);
            }
        })
    }

    /**
     *
     * @param decentralizedNation
     * @param {string} memberType
     * @returns {Promise<boolean>}
     */
    public isTypeEligibleToCreateAVotingCampaign(decentralizedNation: any, memberType: string) : Promise<boolean> {
        return new Promise(async(resolve,reject) => {
            try {
                memberType = this.base.web3.toHex(memberType);
                let decentralizedNationInstance = await this.helpers._getDecentralizedNationInstance(decentralizedNation);
                let isEligible = await promisify(decentralizedNationInstance.isMemberTypeEligibleToCreateVotingCampaign, [memberType]);
                resolve(isEligible);
            } catch (e) {
                reject(e);
            }
        })
    }

    /**
     *
     * @param decentralizedNation
     * @returns {Promise<any>}
     */

    public getAllCampaigns(decentralizedNation:any) : Promise<IVotingCampaign[]> {
        return new Promise(async(resolve,reject) => {
           try {
               let decentralizedNationInstance = await this.helpers._getDecentralizedNationInstance(decentralizedNation);
               let numberOfCampaigns = await promisify(decentralizedNationInstance.getNumberOfVotingCampaigns,[]);
               const promises = [];
               for (let i=0; i<numberOfCampaigns; i++) {
                   promises.push(new Promise(async (cResolve, cReject) => {
                       let nvcAddress = await promisify(decentralizedNationInstance.allCampaigns,[i]);
                       let [votingReason, finished, votesYes, votesNo, votingResultForYes, votingResultForNo, votingCampaignLengthInDays, campaignType, votingCampaignContractAddress]
                           = await promisify(decentralizedNationInstance.getCampaign,[i]);
                       votesYes = votesYes.toNumber();
                       votesNo = votesNo.toNumber();
                       votingResultForYes = votingResultForYes.toNumber();
                       votingResultForNo = votingResultForNo.toNumber();
                       votingCampaignLengthInDays = new Date(votingCampaignLengthInDays.toNumber());
                       campaignType = this.base.web3.toUtf8(campaignType);
                       cResolve({
                           votingReason, finished, votesYes, votesNo, votingResultForYes, votingResultForNo, votingCampaignLengthInDays, campaignType, votingCampaignContractAddress,
                       });
                   }));
               }
               resolve(await Promise.all(promises));
           } catch(e) {
               reject(e);
           }
        });
    }

    async plasma_bdfs(weightedVoteContract: any, contractor: string, start_address: string[], cb: (from: string) => void) {
        for (let i = 0; i < start_address.length; i++) {
            let from = start_address[i];
            const weightedVoteContractInstance = await this.helpers._getWeightedVoteContract(weightedVoteContract);
            const given_to = await promisify(this.base.twoKeyPlasmaEvents.get_visits_list, [from, weightedVoteContractInstance.address, contractor, {from: this.base.plasmaAddress}]);
            if (given_to.length > 0) {
                await this.plasma_bdfs(weightedVoteContract, contractor, given_to, cb)
            } else {  // "from" is a leaf
                await cb(from);
            }
        }
    }

    public countPlasmaVotes(weightedVoteContract: any, contractor: string): Promise<boolean> {
        return new Promise<boolean>(async (resolve, reject) => {
           try {
               await this.plasma_bdfs(weightedVoteContract, contractor, [contractor], async (from) => {
                   // check if "from" is off-chain
                   const weightedVoteContractInstance = await this.helpers._getWeightedVoteContract(weightedVoteContract);
                   let arcs = await promisify(weightedVoteContractInstance.balanceOf, [from]);
                   if (arcs.toNumber()) return;
                   console.log('visited_sig', weightedVoteContractInstance.address, contractor, from);
                   let m = await promisify(this.base.twoKeyPlasmaEvents.visited_sig, [weightedVoteContractInstance.address, contractor, from]);
                   console.log(`FROM=${from} SIG=${m}`);
                   m = m.slice(2);  // remove 0x
                   let version = m.slice(0, 2);
                   let msg_len = (version == '01') ? 86 : 41;

                   let r = (m.length - 2 * 21) % (2 * (65 + msg_len));
                   m = m.slice(0, m.length - r);

                   if (m.length > 40) {
                       let first_address = `0x${m.slice(2, 42)}`;
                       let first_public_key = await promisify(weightedVoteContractInstance.public_link_key, [first_address]);
                       let cuts = Sign.validate_join(first_public_key, null, null, `0x${m}`);
                       console.log(`cuts=${cuts.toString()}`);
                       await promisify(weightedVoteContractInstance.transferSig, [`0x${m}`, { from: contractor }]);
                   }
               });
               resolve(true);
           } catch (e) {
               reject(e);
           }
        });
        //
        // let total_vote = await c.total_vote();
        // let voted_yes = await c.voted_yes();
        // let voted_no = await c.voted_no();
        // let weighted_yes = await c.weighted_yes();
        // let weighted_no = await c.weighted_no();
        // let total_weight = await c.total_weight();
        // console.log('total_vote='+total_vote+' voted_yes='+voted_yes+' voted_no='+voted_no+'total_weight='+total_weight+' weighted_yes='+weighted_yes+' weighted_no='+weighted_no)
    }



    public join(campaign: any, from: string, { cut, gasPrice = this.base._getGasPrice(), referralLink }: IJoinLinkOpts = {}): Promise<string> {
        return new Promise<string>(async (resolve, reject) => {
           try {
               if (cut > 0 && cut <= 100) {
                   cut = cut + 1
               } else if (cut < 0 && cut >= -100) {
                   cut = 255 + cut
               } else if (cut != 255) {
                   cut = 0
               }
               const cut_sign = await Sign.sign_cut2eteherum(cut, from, this.base.web3);
               console.log('JOIN', await this.utils.getOffchainDataFromIPFSHash(referralLink));
               const hash = await this.acquisitionCampaign.join(campaign, from, { cut, gasPrice, referralLink, cutSign: cut_sign });
               resolve(hash);
           } catch (e) {
               reject(e);
           }
        });
    }

    public getVotingResults(weightedVoteContract: any): Promise<any> {
        return new Promise<any>(async (resolve, reject) => {
            try {
                const weightedVoteContractInstance = await this.helpers._getWeightedVoteContract(weightedVoteContract);
                const results = await promisify(weightedVoteContractInstance.getDynamicData, []);
                resolve(results);
            } catch (e) {
                reject(e);
            }
        })
    }
}