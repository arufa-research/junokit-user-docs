# Documentation

## Getting Started

### Overview

Junokit is a development framework for building juno contracts. The aim of the project is to make juno contracts development process simple, efficient and scalable. User can focus on logic of juno contract and not much about further steps in development. It facilitates features such as initiating project repo from contract templates, easy compilation of contracts, deployment, Interacting with contracts using schema and contract testing framework.

### Installation

Junokit can be installed using `npm` or `yarn` using below commands:

+    Using Yarn: `yarn global add junokit`
+    Using NPM: `npm install -g junokit`

Junokit requires a local rust environment available to be able to work. To install a rust environment, use command `junokit install`.

### Quick Start

This guide will explore the basics of creating a simple Junokit project.

Junokit allows you to compile your Rust code, generate schema for it, run your scripts, tests and deploy to network, interact with contract instance on the network.

To create your Junokit project, run `junokit init <project-name>`:

```bash
$ junokit init yellow
★ Welcome to junokit v0.1.0
Initializing new project in /home/ay/yellow.

★ Project created ★

You need to install these dependencies to run the sample project:
  npm install --save-dev chai

Success! Created project at /home/ay/yellow.
Begin by typing:
  cd yellow
  junokit help
  junokit compile
```

The generated directory will have the following initial structure:

```bash
.
├── contracts
│   ├── Cargo.toml
│   ├── examples
│   │   └── schema.rs
│   ├── LICENSE
│   ├── NOTICE
│   ├── src
│   │   ├── contract.rs
│   │   ├── error.rs
│   │   ├── lib.rs
│   │   ├── msg.rs
│   │   └── state.rs
│   └── tests
│       └── integration.rs
├── package.json
├── README.md
├── scripts
│   └── sample-script.js
├── test
│   └── sample-test.js
└── junokit.config.js

6 directories, 17 files
```

The `contracts/` directory has all the rust files for the contract logic. `scripts/` directory can contain `.js` and `.ts` scripts that user can write according to the use case, a sample script has been added to give some understanding of how a user script should look like. `test/` directory can contain `.js` and `.ts` scripts to run tests for the deployed contracts.

#### Listing tasks

To see the possible tasks (commands) that are available, run `junokit` in your project's folder:

```bash
$ junokit
junokit version 0.1.0

Usage: junokit [GLOBAL OPTIONS] <TASK> [TASK OPTIONS]

GLOBAL OPTIONS:

      --config           	Path to junokit config file. 
  -h, --help             	Shows this message, or a task's help if its name is provided 
      --network          	The network to connect to. (default: "default")
      --show-stack-traces	Show stack traces. 
      --verbose          	Enables verbose logging 
  -v, --version          	Shows version and exit. 


AVAILABLE TASKS:

  clean    	Clears the cache and deletes specified artifacts files
  compile  	Compile all secret contracts
  help     	Prints this message
  init     	Initializes a new project in the given directory
  install  	Setup rust compiler
  node-info	Prints node info and status
  repl     	Opens junokit console
  run      	Runs a user-defined script after compiling the project
  test     	Runs a user-defined test script after compiling the project

To get help for a specific task run: junokit help [task]

```

This is the list of built-in tasks. This is your starting point to find out what tasks are available to run.

If you take a look at the `junokit.config.js` file, you will find :

```js
const accounts = [
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
// TODO: update fixture tests
const networks = {
  localnet: {
    endpoint: 'http://localhost:26657/'
  },
  // uni-2
  testnet: {
    endpoint: 'https://rpc.uni.juno.deuslabs.fi/',//https://lcd.uni.juno.deuslabs.fi/
    chainId: 'uni-2',
    trustNode: true,
    keyringBackend: 'test',
    accounts: accounts,
  },
};

module.exports = {
  networks: {
    default: networks.testnet,
    localnet: networks.localnet,
  },
  mocha: {
    timeout: 60000
  },
  rust: {
    version: "1.59.0",
  }
};
```

**Note** that the accounts mentioned above are just a sample, don't use them in mainnet as it can lead to capital loss.

#### Compiling contracts

To compile the contracts, use command `junokit compile`. This will compile all the contracts in the project. To compile only one contracts or a subset of all contracts in the project, use command `junokit compile <contract-source-dir>`. To skip schema generation while compiling use `junokit compile --skip-schema`.

This command will generate compiled `.wasm` files in `artifacts/contracts/` dir and schema `.json` files in `artifacts/schema/` dir.

#### Running user scripts

User scripts are a way to define the flow of interacting with contracts on some network in form of a script. These scripts can be used to deploy a contract, query/transact with the contract.

A sample script `scripts/sample-script.js` is available in the boilerplate. Contents of the script is as follows:

To run it:
`junokit run scripts/sample-script.js`

```js
const { Contract, getAccountByName, getLogs } = require("junokit");

async function run() {
  const contract_owner = getAccountByName("account_1");
  const other = getAccountByName("account_2");
  const contract = new Contract("cw_erc20");
  await contract.setUpclient();
  await contract.parseSchema();

  console.log("Client setup done!! ");

  const deploy_response = await contract.deploy(
    contract_owner,
    { // custom fees
      amount: [{ amount: "750000", denom: "ujunox" }],
      gas: "3000000",
    }
  );
  console.log(deploy_response);

  const contract_info = await contract.instantiate(
    {
      "name": "ERC", "symbol": "ER", "decimals": 10,
      "initial_balances": [{
        "address": contract_owner.account.address,
        "amount": "100000000"
      }]
    }, "deploy test", contract_owner);
  console.log(contract_info);

  // const contract_addr = "secret76597235472354792347952394";
  // contract.instantiatedWithAddress(contract_addr);
  let balance_before = await contract.query.balance({ "address": contract_owner.account.address });
  console.log(balance_before);

  let transfer_response = await contract.tx.transfer(
    { account: contract_owner },
    {
      recipient: other.account.address,
      amount: "50000000"
    }
  );
  console.log(transfer_response);

  let balance_after = await contract.query.balance({ "address": contract_owner.account.address });
  console.log(balance_after);
}

module.exports = { default: run };
```

The script above deploys, inits contract `cw-erc20` using account `account_1`. It then transfers the some tokens using transaction `tx.transfer()` and finally queries count using query `query.balance()`.

For the above script to be able to run, an account with name `account_1` must be present in `junokit.config.js` and contract artifacts (compiled `.wasm` and schema `.json` files) in `artifacts/` dir must be present for contract `cw-erc20`.

#### Running test scripts

Test scripts are used to test the contract after deploying it to the network and asserting on the interactions with the contract instance.

To run it: `junokit test`

A sample test script `test/sample-test.js` is available in the boilerplate. Contents of the script is as follows:

```js
const { use } = require("chai");
const { Contract, getAccountByName, junokitChai } = require("junokit");

use(junokitChai);

describe("erc-20", () => {

  async function setup() {
    const contract_owner = getAccountByName("account_1");
    const other = getAccountByName("account_0");
    const contract = new Contract("cw_erc20");
    await contract.parseSchema();

    return { contract_owner, other, contract };
  }

  it("deploy and init", async () => {
    const { contract_owner, other, contract } = await setup();
    const deploy_response = await contract.deploy(contract_owner);
    console.log(deploy_response);

    const contract_info = await contract.instantiate(
    {
      "name": "ERC", "symbol": "ER", "decimals": 10,
      "initial_balances": [{
        "address": contract_owner.account.address,
        "amount": "100000000"
      }]
    }, "deploy test", contract_owner);
    console.log(contract_info);
  });
});
```

Detailed overview of testing is given the Guides section.

#### Using REPL

REPL (read–eval–print loop) gives the a console to do real time interactions with the network. Open the REPL using `junokit repl --network <network-name>`. Sample REPL interaction shown below as follows:

```bash
$ junokit repl --network testnet
★★★  Welcome to junokit REPL ★★★
Try typing: config

junokit> config
{
  name: 'default',
  config: {
    endpoint: 'https://rpc.uni.juno.deuslabs.fi/',
    chainId: 'uni-2',
    trustNode: true,
    keyringBackend: 'test',
    accounts: [ [Object], [Object] ]
  }
}
```

When REPL is opened, `junokit` library is already imported, use `junokit.` to access classes and functions from the library. junokit Runtime Environment can be access using `env` variable and `junokit.config.js` data can be accessed using `config` variable.

#### Get node information

Node information can be fetched using `junokit node-info --network <network-name>` as follows:

```bash
$ junokit node-info --network testnet
Network: testnet
ChainId: uni-2
Block height: 1358994
```

#### Cleanup artifacts

To clear artifacts data, use `junokit clean` and to clean artifacts for only one contract, use `junokit clean <contract-name>`.

## Guides

### Setting up a project

Project setup can be broken down to 3 steps broadly, which are boiler plate generation, updating project name and updating `junokit.config.js` file.

#### Boilerplate code

Use command `junokit init <project-name>` to generate boilerplate code. Use command `junokit init <project-name> <template-name>` to generate boilerplate code using a particular template (template names can be found from repository `https://github.com/arufa-research/junokit-templates`).

```bash
$ junokit init yellow
★ Welcome to junokit v0.1.1
Initializing new project in /home/adarsh/Desktop/yellow.

★ Project created ★

You need to install these dependencies to run the sample project:
  npm install --global --save-dev chai

Success! Created project at /home/adarsh/Desktop/yellow.
Begin by typing:
  cd yellow
  junokit help
  junokit compile
```

The generated directory will have the following initial structure:

```bash
.
├── contracts
│   ├── Cargo.lock
│   ├── Cargo.toml
│   ├── examples
│   │   └── schema.rs
│   └── src
│       ├── contract.rs
│       ├── error.rs
│       ├── lib.rs
│       ├── msg.rs
│       └── state.rs
├── package.json
├── Cargo.toml
├── Cargo.lock
├── junokit.config.js
├── README.md
├── scripts
│   └── sample-script.js
└── test
    └── sample-test.js

5 directories, 15 files
```

The `contracts/` directory has all the rust files for the contract logic. `scripts/` directory can contain `.js` and `.ts` scripts that user can write according to the use case, a sample script has been added to give some understanding of how a user script should look like. `test/` directory can contain `.js` and `.ts` scripts to run tests for the deployed contracts.

#### Updating name of contract

Replace appearances of `sample-project` and `sample_project` from following files to your project name.

```bash
$ grep -r "sample-project"
package.json:  "name": "sample-project",
contracts/Cargo.lock:name = "sample-project"
contracts/Cargo.toml:name = "sample-project"
scripts/sample-script.js:  const contract = new Contract('sample-project');
```

```bash
$ grep -r "sample_project"
contracts/examples/schema.rs:use sample_project::msg::{ExecuteMsg, InstantiateMsg, QueryMsg, BalanceResponse, AllowanceResponse};
contracts/examples/schema.rs:use sample_project::state::Constants;
```

Replacing them with a project name suppose `yellow` should look like following:

```bash
$ grep -r "yellow"
package.json:  "name": "yellow",
contracts/Cargo.lock:name = "yellow"
contracts/Cargo.toml:name = "yellow"
contracts/examples/schema.rs:use yellow::msg::{ExecuteMsg, InstantiateMsg, QueryMsg, BalanceResponse, AllowanceResponse};
contracts/examples/schema.rs:use yellow::state::Constants;
scripts/sample-script.js:  const contract = new Contract('yellow', runtimeEnv);
```

Now compiling using `junokit compile` would create following structure in `artifacts/` dir:

```bash
artifacts/
├── contracts
│   └── yellow.wasm
└── schema
    └── allowance_response.json
    └── balance_response.json
    └── constants.json
    └── execute_msg.json
    └── instantiate_msg.json
    └── query_msg.json

2 directories, 7 files
```

#### junokit config

junokit uses config file `junokit.config.js` to execute tasks for the given project. Initial contents of `junokit.config.js` file are explained below:

**Network config**. Has following parameters:

+ endpoint: Network endpoint.
+ chainId: Network chain id.
+ trustNode: Should be set to `true`.
+ keyringBackend: Alias of keyring backend to be used.
+ accounts: Array of accounts.
+ fess: custom fees limits for each type of txns from upload, init, execute and send.

```js
networks: {
  // uni-2
  testnet: {
    endpoint: 'https://rpc.uni.juno.deuslabs.fi/',//https://lcd.uni.juno.deuslabs.fi/
    chainId: 'uni-2',
    trustNode: true,
    keyringBackend: 'test',
    accounts: accounts,
    types: {},
    fees: {
      upload: {
          amount: [{ amount: "500000", denom: "ujunox" }],
          gas: "2000000",
      },
      init: {
          amount: [{ amount: "125000", denom: "ujunox" }],
          gas: "500000",
      },
    }
  }
}
```

**Accounts config**. It is an array of account objects. Each account object has following parameters:

+ name: Account name (alias). Does not need to match the account name anywhere else outside the project.
+ address: Account address.
+ mnemonic: Mnemonic for the account. Do not push this value to a public repository.

```js
const accounts = [
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

**Mocha test config**. Increase/decrease the `timeout` value to tweak test framework timeout.

```js
mocha: {
  timeout: 60000
}
```
### Compiling your contracts

Compiling contracts can be done using the command `junokit compile`.

#### Compile all contracts

`junokit compile` by default compiles all the contracts in the `contracts/` directory. For each contract compiled, corresponding `.wasm` file is stored in the `artifacts/contracts` directory created in project's root directory.

#### Compile one contract

To compile only one contract or a subset of all contracts in the `contract/` directory, use command `junokit compile <sourcePaths>` and this can look something like `junokit compile contracts/sample-project` or `junokit compile contracts/sample-project-1 contracts/sample-project-2`.

#### Schema generation

Schema is also generated alongside the compiled `.wasm` file for each of the contract compiled using `junokit compile` command. Schema files are `.json` files (stored inside `artifacts/schema/`) directory and there are multiple `.json` files per contract but only one `.wasm` compiled file per contract. To skip schema generation while compiling use `junokit compile --skip-schema`.

Single contract `artifacts/` directory structure:

```bash
artifacts/
├── contracts
│   └── yellow.wasm
└── schema
    └── allowance_response.json
    └── balance_response.json
    └── constants.json
    └── execute_msg.json
    └── instantiate_msg.json
    └── query_msg.json
2 directories, 7 files
```

Multi contract `artifacts/` directory structure:

```bash
.
├── contracts
|   ├── sample_project_1.wasm
│   └── sample_project_2.wasm
└── schema
    ├── sample_project_1
    │   ├── allowance_response.json
    │   ├── balance_response.json
    │   ├── constants.json
    │   ├── execute_msg.json
    │   └── instantiate_msg.json
    │   └── query_msg.json
    └── sample_project_2
        ├── allowance_response.json
    │   ├── balance_response.json
    │   ├── constants.json
    │   ├── execute_msg.json
    │   └── instantiate_msg.json
    │   └── query_msg.json

4 directories, 14 files
```
### Writing scripts

#### Sample script walkthrough

Junokit boilerplate code has sample script `scripts/sample-script.js` with following content: 

```js
const { Contract, getAccountByName, getLogs } = require("junokit");

async function run() {
  const contract_owner = getAccountByName("account_0");
  const other = getAccountByName("account_1");
  const contract = new Contract("cw_erc20");
  await contract.setUpclient();
  await contract.parseSchema();

  console.log("Client setup done!! ");

  const deploy_response = await contract.deploy(
    contract_owner,
    { // custom fees
      amount: [{ amount: "750000", denom: "ujunox" }],
      gas: "3000000",
    }
  );
  console.log(deploy_response);

  const contract_info = await contract.instantiate(
    {
      "name": "ERC", "symbol": "ER", "decimals": 10,
      "initial_balances": [{
        "address": contract_owner.account.address,
        "amount": "100000000"
      }]
    }, "deploy test", contract_owner);
  console.log(contract_info);

  let balance_before = await contract.query.balance({ "address": contract_owner.account.address });
  console.log(balance_before);

  let transfer_response = await contract.tx.transfer(
    { account: contract_owner },
    {
      recipient: other.account.address,
      amount: "50000000"
    }
  );
  console.log(transfer_response);

  let balance_after = await contract.query.balance({ "address": contract_owner.account.address });
  console.log(balance_after);
}

module.exports = { default: run };
```

Following is a line-by-line breakdown of the above script:

+ Import `Contract` class and `getAccountByName` method from `junokit` library.

```js
const { Contract, getAccountByName } = require("junokit");
```

+ `run` function definition. It should have the same signature as below with no argument. This `run` function is called by junokit.

```js
async function run () {
```

+ Fetch details of account `account_0` into `contract_owner` object.

```js
  const contract_owner = getAccountByName("account_0");
```

+ Create `Contract` object for contract with name `sample-project`.

```js
  const contract = new Contract('sample-project');
```

+ Load schema files for contract `sample-json`. Will generate error if schema files are not present, so make sure to run `junokit compile` before running this.

```js
  await contract.parseSchema();
```

+ Deploy the contract. Network is specified in the `junokit run scripts/<script-name> --network <network-name>` command.

```js
  const deploy_response = await contract.deploy(contract_owner);
``` 
+ Instantiate contract instance with name `{"name": "ERC"}`, symbol `{"symbol": "ER"}`, decimals `{"decimals": 10}` and initial_balances `{"initial_balances": [{"address": contract_owner.account.address, "amount": "100000000"}]}` .
```js
  const contract_info = await contract.instantiate(
    {
      "name": "ERC", "symbol": "ER", "decimals": 10,
      "initial_balances": [{
        "address": contract_owner.account.address,
        "amount": "100000000"
      }]
    }, "deploy test", contract_owner);
```

+ Execute `transfer()` transaction using account `contract_owner`. For each contract execute method, calling signature is `contract.tx.<method_name>({account: <signing_account>, transferAmount: <tokens_to_send_with_txn>, customFees: <custom_fees_struct>}, ...<method_args>);`.

```js
  let transfer_response = await contract.tx.transfer(
    { account: contract_owner },
    {
      recipient: other.account.address,
      amount: "50000000"
    }
  );
```

+ Fetch count value using query `balance`.

```js
  let balance = await contract.query.balance({ "address": contract_owner.account.address });;
```

+ Export `run` function as default for the script. Default function is called by junokit runner.

```js
module.exports = { default: run };
```

#### Junokit Runtime Environment

junokit runtime environment is used internally by junokit. It is created when a junokit task is executed using bash command `junokit ...`. It can be accessed in REPL using variable `env`. It has following parameters:

+ **config**: Has paths of config file, contract sources, artifacts, project root and test path. Other config values such as networks config and mocha timeout.

+ **runtimeArgs**: Runtime metadata such as network to use etc. Network can be specified in a junokit command like `junokit ... --network <network-name>`.

+ **tasks**: List of available tasks with details.

+ **network**: Details of the network currently being used.

#### Contract class

Contract class is used to create an object which does operations related to a contract such as deploying, interacting with network. One can also list query, execute methods available for the contract using this class.

**Constructor**

Contract constructor requires 1 argument, contract name. If contract `.wasm` file is not present in artifacts then this constructor will throw an error.

```js
const contract = new Contract(<contract-name>);
```

**parseSchema()**

This method reads schema files from `artifacts/schema/` dir and fills query methods in `contract.query` object and execute methods in `contract.tx` object. This method will throw error if schema is not generated.

```js
contract.parseSchema();
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
      "name": "ERC", "symbol": "ER", "decimals": 10,
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

**tx methods**

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
```

#### getAccountByName

In the sample `junokit.config.js` file, the accounts are defined as below:

```js
const accounts = [
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

#### createAccounts

This method is used to generate new accounts and then can be filled with some balance using a testnet faucet `https://stakely.io/en/faucet/juno` (faucet are only for testnets). 

```js
const { createAccounts } = require("junokit");

const res = await createAccounts(1); // array of one account object
const res = await createAccounts(3);  // array of three account objects
```

#### Checkpoints

Checkpoints store the metadata of contract instance on the network. It stores the deploy metadata (codeId, contractCodeHash, deployTimestamp) and instantiate metadata (contractAddress, instantiateTimestamp). This comes handy when a script is run which deploys, inits and does some interactions with the contracts. 

Suppose the script fails after init step and now script is to be rerun after some fixes in the contract, here one does not want for the contract to be deployed and instantiated again, so junokit picks up the saved metadata from checkpoints file and directly skips to part after init and uses the previously deployed instance and user does not have to pay the extra gas and wait extra time to deploy, init the contract again. Same happens when there is error before init and rerun skips deploy and directly executes init step.

To skip using checkpoints when running script, use `junokit run <script-path> --skip-checkpoints`.


### Testing contracts

Contracts can be tested in two ways, one by writing rust tests in the `contract.rs` file itself, and other way is to write a mocha test script that interacts with deployed contract and assert the returned values. There are examples for both in the `sample-project` created after `junokit init` step.

#### Rust tests

These tests can be run by going into the contract's directory having `Cargo.toml` file and running the command `cargo test`.

#### Client interaction tests

These tests can be run by running the command `junokit test --network <network-name>`.

#### Test scripts

junokit has support for user to write tests on top of js interactions with the deployed contract instance. These scripts are stored in the `test/` directory in the project's root directory.

A junokit test script has the same structure as a mocha test file with `describe` and `it` blocks, a sample test is explained below:

```js
const { use } = require("chai");
const { Contract, getAccountByName, junokitChai } = require("junokit");

use(junokitChai);

describe("erc-20", () => {

  async function setup() {
    const contract_owner = getAccountByName("account_1");
    const other = getAccountByName("account_0");
    const contract = new Contract("cw_erc20");
    await contract.parseSchema();
    const deploy_response = await contract.deploy(
    contract_owner,
    { // custom fees
      amount: [{ amount: "750000", denom: "ujunox" }],
      gas: "3000000",
    }
  );
  console.log(deploy_response)

    return { contract_owner, other, contract };
  }

  it("deploy and init", async () => {
    const contract_info = await contract.instantiate(
    {
      "name": "ERC", "symbol": "ER", "decimals": 10,
      "initial_balances": [{
        "address": contract_owner.account.address,
        "amount": "100000000"
      }]
    }, "deploy test", contract_owner);
  console.log(contract_info);
  });

  it("transfer and query balance", async () => {
    const { contract_owner, other, contract } = await setup();
    const deploy_response = await contract.deploy(contract_owner);
    console.log(deploy_response);

    const contract_info = await contract.instantiate(
    {
      "name": "ERC", "symbol": "ER", "decimals": 10,
      "initial_balances": [{
        "address": contract_owner.account.address,
        "amount": "100000000"
      }]
    }, "deploy test", contract_owner);
  console.log(contract_info);
    let transfer_response = await contract.tx.transfer(
    { account: contract_owner },
    {
      recipient: other.account.address,
      amount: "50000000"
    }
  );
  console.log(transfer_response);
  let balance_after = await ;
  await expect(contract.query.balance({ "address": contract_owner.account.address })).to.respondWith({"balance": "50000000"});
  });
});
```

Following is a breakdown of the above script:

+ Import `expect` and `use` from chai, `Contract`, `getAccountByName` and `junokitChai` from junokit and add junokit asserts to chai using `use(junokitChai)`.

```js
const { expect, use } = require("chai");
const { Contract, getAccountByName, junokitChai } = require("junokit");

use(junokitChai);
```

+ `setup()` method does the initial common steps for each test, such as creating `Account` objects, creating `Contract` objects, parsing contract's schema files and deploying the contract.

```js
  async function setup() {
    const contract_owner = getAccountByName("account_1");
    const other = getAccountByName("account_0");
    const contract = new Contract("sample-project");
    await contract.parseSchema();
  const deploy_response = await contract.deploy(
    contract_owner,
    { // custom fees
      amount: [{ amount: "750000", denom: "ujunox" }],
      gas: "3000000",
    }
  );
  console.log(deploy_response)
    return { contract_owner, other, contract };
  }
```

+ First test: Deploys and inits the contract . junokit automatically creates dynamic label for test deploys, which means that below label "deploy test" is not used instead "deploy <contract_name> <curr_ts>" is used which is always unique, so you don't have to manually change label for each test run.

**Note:** It is fine to have `deploy`, `instantiate` in each test as they are not executed multiple times for a given contract. Moving these steps in the `setup()` method is fine.

#### Chai matchers

A set of chai matchers, makes your test easy to write and read. Before you can start using the matchers, you have to tell chai to use the junokitChai plugin:

```js
const { expect, use } = require("chai");
const { Contract, getAccountByName, junokitChai } = require("junokit");

use(junokitChai);
```

Below is the list of available matchers:

+ **Execution Response**

Testing what response was received after transaction execution:

```js
await expect(contract.query.balance({ "address": contract_owner.account.address })).to.respondWith({"balance": "50000000"});

```

<!--

## Troubleshooting

### Verbose logging
### Common problems
### Error codes

## API -->


### Using localnet with junokit

#### Setup the Local Developer Testnet

In this document you'll find information on setting up a local Juno Network.

#### Running the docker container

The developer blockchain is configured to run inside a docker container. Install Docker for your environment .
Open a terminal window and change to your project directory. Then start JunoNetwork from here on(Keep juno version updated wth juno repo. It is currently 5.0.0):
```bash
docker run -it \
  --name juno_node_1 \
  -p 26656:26656 \
  -p 26657:26657 \
  -e STAKE_TOKEN=ujunox \
  -e UNSAFE_CORS=true \
  ghcr.io/cosmoscontracts/juno:v5.0.0 \
  ./setup_and_run.sh juno16g2rahf5846rxzp3fwlswy08fz8ccuwk03k57y 
```
Copy mnemonics from terminal to the junokit.config.js file- 
```bash
`mnemonic : camera battle reward view obtain obvious stadium display harbor original link trigger venture tip exhibit ladder ride captain breeze replace brand tape narrow recycle`
```
There is a prebuilt docker image for you to use. This will start a container with a seeded user. The address and mnemonic used here can be found in the docker/ directory of the juno network repo. When you're done, you can use ctrl+c to stop the container running.


we need to copy the name, address and mnemonic info of the account that we get on running the docker in our junokit.config.js file. Also it should be noted that the accounts that are to be interacted with must be on the same network. In this case the account must be present on the localnet.

The docker container can be stopped by CTRL+C. At this point you're running a local JunoNetwork full-node. 

#### Checking the node info

We can then check the node info of the node. Open a new terminal :

```bash
junokit node-info
Network: default
ChainId: uni-2
Block height: 1358994
```

#### Compile the contract

Then we need to compile the contract. This can be done by the following command:

```bash
junokit compile
```

#### Running scripts on Localnet

To run any script on localnet open a new terminal and execute:

```bash
junokit run scripts/sample-script.js
```
