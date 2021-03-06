### How to generate transaction bytecodes

Make sure you're using >= 3.6 python version on your machine

```apple js
pip install web3
pip install eth_abi
```
___
#### Generate bytecode for sending tokens:
- Arguments: 
    - receiver_address (The one who has to receive tokens)
    - amount  (unit -> regular number)

`python generate_bytecode.py transfer2KeyTokens <receiver_address> <amount>`

eg. "Lets transfer 500.5 tokens" 
- `python generate_bytecode.py transfer2KeyTokens 0x380249E32B620fbf2Fa53418B7141770524Da9C5 500.5`

___
#### Generate bytecode for upgrading contract:
- Arguments:
    - contract_name 
    - contract_version
    
`python generate_bytecode.py upgradeContract <contract_name> <contract_version>`

eg. "Lets upgrade TwoKeyUpgradableExchange contract to version 1.0.2" 
- `python generate_bytecode.py upgradeContract TwoKeyUpgradableExchange 1.0.2`

___
#### Generate bytecode for changing rewards release date:
- Arguments:
    - new_date (unix timestamp)
  
`python generate_bytecode.py setNewTwoKeyRewardsReleaseDate <new_date>`

eg. "Lets change rewards release date to 12428814231 timestamp"
- `python generate_bytecode.py setNewTwoKeyRewardsReleaseDate 12428814231`

___
#### Generate bytecode for adding a member to congress:
- Arguments:
    - target_member (member address)
    - member_name (member name --> bytes32 format))
    - voting_power (member voting power)
  
`python generate_bytecode.py addMember <target_member> <member_name> <voting_power>`

eg. "Lets add Nikola Madjarevic to congress and give him voting power 1. His address is 0x380249E32B620fbf2Fa53418B7141770524Da9C5"
- `python generate_bytecode.py addMember 0x380249E32B620fbf2Fa53418B7141770524Da9C5 0x4e696b6f6c61204d61646a617265766963000000000000000000000000000000 1`

___
#### Generate bytecode for removing a member from congress:
- Arguments:
    - target_member (member address)
 
`python generate_bytecode.py removeMember <target_member>`

eg. "Let's remove member with address 0x380249E32B620fbf2Fa53418B7141770524Da9C5 from congress"
- `python generate_bytecode.py removeMember 0x380249E32B620fbf2Fa53418B7141770524Da9C5`

___
#### Generate bytecode for freezeTransfers in TwoKeyEconomy
- Arguments:
  - /  
 
`python generate_bytecode.py freezeTransfers`

eg. "Let's freeze transfers in TwoKeyEconomy"
- `python generate_bytecode.py freezeTransfers`

___
#### Generate bytecode for unfreezeTransfers in TwoKeyEconomy
- Arguments:
  - /  
 
`python generate_bytecode.py unfreezeTransfers`

eg. "Let's unfreeze transfers in TwoKeyEconomy"
- `python generate_bytecode.py unfreezeTransfers`

___
#### Generate bytecode for changing Non-Upgradable contract
- Arguments:
  - contract_name (name of the contract)
  - new_contract_address (address of new contract)  
 
`python generate_bytecode.py changeNonUpgradableContract <contract_name> <new_contract_address>`

eg. "Let's change TwoKeyCongress to new implementation on address 0x380249E32B620fbf2Fa53418B7141770524Da9C5"
- `python generate_bytecode.py changeNonUpgradableContract "TwoKeyCongress" "0x380249E32B620fbf2Fa53418B7141770524Da9C5"`

___
#### Generate bytecode for approving new version for specific type of campaign 
- Arguments:
  - campaign_type (Currently: "TOKEN_SELL","DONATION")
  - version_to_approve (version we want to approve)  
 
`python generate_bytecode.py approveNewCampaign <campaign_type> <version_to_approve>`

eg. "Let's approve version 1.0.1 for all DONATION type campaigns"
- `python generate_bytecode.py approveNewCampaign "DONATION" "1.0.1"`


#### Connect remixd
*CHROME* : `remixd -s <absolute-path-to-the-shared-folder> --remix-ide https://remix.ethereum.org`
*BRAVE* : `remixd -s <absolute-path-to-the-shared-folder> --remix-ide http://remix.ethereum.org`
