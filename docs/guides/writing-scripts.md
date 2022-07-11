# Writing scripts

## Sample script walkthrough

Junokit boilerplate code has sample script `scripts/sample-script.ts` with following content: 

```js
import { getAccountByName } from "junokit";

import { CounterContract } from "../artifacts/typescript_schema/Counter";

async function run() {
  const runTs = String(new Date());
  const contract_owner = getAccountByName("account_0");
  const counter_contract = new CounterContract();
  await counter_contract.setUpclient();

  console.log("Client setup done!! ");

  const deploy_response = await counter_contract.deploy(
    contract_owner,
    { // custom fees
      amount: [{ amount: "900000", denom: "ujunox" }],
      gas: "35000000",
    }
  );
  console.log(deploy_response);
  const contract_info = await counter_contract.instantiate(
    {
      "count": 102
    }, `deploy test ${runTs}`, contract_owner);
  console.log(contract_info);

  const inc_response = await counter_contract.increment({account: contract_owner});
  console.log(inc_response);

  const response = await counter_contract.getCount();
  console.log(response);

}

module.exports = { default: run };
```

Following is a line-by-line breakdown of the above script:

+ Import `getAccountByName` method from `junokit` library.
+ Import `Counter` clas from `../artifacts/typescript_schema/Counter.ts` file.

```js
const { getAccountByName } = require("junokit");
import { CounterContract } from "../artifacts/typescript_schema/Counter";
```

+ `run` function definition. It should have the same signature as below with no argument. This `run` function is called by junokit.

```js
async function run () {
```

+ Fetch details of account `account_0` into `contract_owner` object.

```js
  const contract_owner = getAccountByName("account_0");
```

+ Create `CounterContract` object for counter contract.

```js
  const contract = new CounterContract();
```

+ Deploy the contract. Network is specified in the `junokit run scripts/<script-name> --network <network-name>` command.

```js
  const deploy_response = await contract.deploy(contract_owner);
``` 

+ Instantiate contract instance with name `{"name": "ERC20"}`, symbol `{"symbol": "ERC"}`, decimals `{"decimals": 10}` and initial_balances `{"initial_balances": [{"address": contract_owner.account.address, "amount": "100000000"}]}` .
```js
  const contract_info = await contract.instantiate(
    {
      "name": "ERC20", "symbol": "ERC", "decimals": 10,
      "initial_balances": [{
        "address": contract_owner.account.address,
        "amount": "100000000"
      }]
    }, "deploy test", contract_owner);
```

+ Execute `transfer()` transaction using account `contract_owner`. For each contract execute method, calling signature is `contract.<method_name>({account: <signing_account>, transferAmount: <tokens_to_send_with_txn>, customFees: <custom_fees_struct>}, ...<method_args>);`.

```js
  let transfer_response = await contract.transfer(
    { account: contract_owner },
    {
      recipient: other.account.address,
      amount: "50000000"
    }
  );
```

+ Fetch count value using query `balance`.

```js
  let balance = await contract.balance({ "address": contract_owner.account.address });
```

+ Export `run` function as default for the script. Default function is called by junokit runner.

```js
module.exports = { default: run };
```

## junokit Runtime Environment

junokit runtime environment is used internally by junokit. It is created when a junokit task is executed using bash command `junokit ...`. It can be accessed in REPL using variable `env`. It has following parameters:

+ **config**: Has paths of config file, contract sources, artifacts, project root and test path. Other config values such as networks config and mocha timeout.

+ **runtimeArgs**: Runtime metadata such as network to use etc. Network can be specified in a junokit command like `junokit ... --network <network-name>`.

+ **tasks**: List of available tasks with details.

+ **network**: Details of the network currently being used.

## Contract class

Contract class is used to create an object which does operations related to a contract such as deploying, interacting with network. One can also list query, execute methods available for the contract using this class.

**Constructor**

Contract constructor requires 1 argument, contract name. If contract `.wasm` file is not present in artifacts then this constructor will throw an error.

```js
const contract = new CounterContract();
```

**deploy()**

Deploys the contract.

```js
const deploy_response = await contract.deploy(contract_owner);
```

Gives following response:

```js
{
  codeId: <code-id-val>,
  contractCodeHash: <code-hash-val>,
  deployTimestamp: <timestamp>
}
```

**instantiate()**

Instantiate the contract.

```js
const contract_info = await contract.instantiate(
  {
    "name": "ERC20", "symbol": "ERC", "decimals": 10,
    "initial_balances": [{
      "address": contract_owner.account.address,
      "amount": "100000000"
    }]
  }, "deploy test", contract_owner);
```

Gives following response:

```js
{
  contractAddress: <contract-address>,
  instantiateTimestamp: <timestamp>
}
```

<!-- **tx methods**

To list contract's execute methods, print `contract.tx`.

```js
junokit> contract.tx
{ Approve: [Function (anonymous)], Transfer: [Function (anonymous), TransferFrom: [Function (anonymous), Burn: [Function (anonymous)] }
```

**query methods**

To list contract's query methods, print `contract.query`.

```js
junokit> contract.query
{ Balance: [Function (anonymous), Allowance: [Function (anonymous)] }
``` -->

## getAccountByName

In the sample `junokit.config.js` file, the accounts are defined as below:

```js
const testnet_accounts = [
  {
    name: 'account_0',
    address: 'juno1evpfprq0mre5n0zysj6cf74xl6psk96gus7dp5',
    mnemonic: 'omit sphere nurse rib tribe suffer web account catch brain hybrid zero act gold coral shell voyage matter nose stick crucial fog judge text'
  },
  {
    name: 'account_1',
    address: 'juno1njamu5g4n0vahggrxn4ma2s4vws5x4w3u64z8h',
    mnemonic: 'student prison fresh dwarf ecology birth govern river tissue wreck hope autumn basic trust divert dismiss buzz play pistol focus long armed flag bicycle'
  }
];
```

These accounts can be easily accessed inside the scripts or in repl using the method, `getAccountByName(<account_name>)`, for example:

```js
const { getAccountByName } = require("junokit");

const account_0 = getAccountByName("account_0");
const account_1 = getAccountByName("account_1");

console.log(account_0.name);  // account_0
console.log(account_0.address); // juno1evpfprq0mre5n0zysj6cf74xl6psk96gus7dp5
console.log(account_0.mnemonic); // omit sphere nurse rib tribe suffer web account catch brain hybrid zero act gold coral shell voyage matter nose stick crucial fog judge text
```

## createAccounts

This method is used to generate new accounts and then can be filled with some balance using a testnet faucet `https://stakely.io/en/faucet/juno` (faucet are only for testnets). 

```js
const { createAccounts } = require("junokit");

const res = await createAccounts(1); // array of one account object
const res = await createAccounts(3);  // array of three account objects
```

## Checkpoints

Checkpoints store the metadata of contract instance on the network. It stores the deploy metadata (codeId, contractCodeHash, deployTimestamp) and instantiate metadata (contractAddress, instantiateTimestamp). This comes handy when a script is run which deploys, inits and does some interactions with the contracts. 

Suppose the script fails after init step and now script is to be rerun after some fixes in the contract, here one does not want for the contract to be deployed and instantiated again, so junokit picks up the saved metadata from checkpoints file and directly skips to part after init and uses the previously deployed instance and user does not have to pay the extra gas and wait extra time to deploy, init the contract again. Same happens when there is error before init and rerun skips deploy and directly executes init step.

To skip using checkpoints when running script, use `junokit run <script-path> --skip-checkpoints`.
