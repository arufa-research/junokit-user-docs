

## Overview

Trestle is a development framework for building juno contracts. The aim of the project is to make juno contracts development process simple, efficient and scalable. User can focus on logic of juno contract and not much about further steps in development. It facilitates features such as initiating project repo from contract templates, easy compilation of contracts, deployment, Interacting with contracts using schema and contract testing framework.

## Installation

Trestle can be installed using `npm` or `yarn` using below commands:

+    Using Yarn: `yarn global add juno-trestle`
+    Using NPM: `npm install -g juno-trestle`

Trestle requires a local rust environment available to be able to work. To install a rust environment, use command .
```bash
`$ cd infrastructure`
`$ make setup-rust`
```

## Quick Start

This guide will explore the basics of creating a simple Trestle project.

Trestle allows you to compile your Rust code, generate schema for it, run your scripts, tests and deploy to network, interact with contract instance on the network.

To create your Trestle project, run `trestle init <project-name>`:

```bash
$ trestle init yellow
★ Welcome to trestle v0.1.1
Initializing new project in /home/adarsh/Desktop/yellow.

★ Project created ★

You need to install these dependencies to run the sample project:
  npm install --global --save-dev chai

Success! Created project at /home/adarsh/Desktop/yellow.
Begin by typing:
  cd yellow
  trestle help
  trestle compile
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
├── Trestle.config.js
├── README.md
├── scripts
│   └── sample-script.js
└── test
    └── sample-test.js

5 directories, 15 files
```

The `contracts/` directory has all the rust files for the contract logic. `scripts/` directory can contain `.js` and `.ts` scripts that user can write according to the use case, a sample script has been added to give some understanding of how a user script should look like. `test/` directory can contain `.js` and `.ts` scripts to run tests for the deployed contracts.

#### Listing tasks

To see the possible tasks (commands) that are available, run `trestle` in your project's folder:

```bash
$ trestle
trestle version 0.1.1

Usage: trestle [GLOBAL OPTIONS] <TASK> [TASK OPTIONS]

GLOBAL OPTIONS:

      --command          	Name of trestle task ran. (default: "")
      --config           	Path to trestle config file. 
  -h, --help             	Shows this message, or a task's help if its name is provided 
      --network          	The network to connect to. (default: "default")
      --show-stack-traces	Show stack traces. 
      --use-checkpoints  	Specify if checkpoints should be used. 
      --verbose          	Enables verbose logging 
  -v, --version          	Shows version and exit. 


AVAILABLE TASKS:

  clean    	Clears the cache and deletes specified artifacts files
  compile  	Compile all secret contracts
  help     	Prints this message
  init     	Initializes a new project in the given directory
  install  	Setup rust compiler
  node-info	Prints node info and status
  repl     	Opens trestle console
  run      	Runs a user-defined script after compiling the project
  test     	Runs a user-defined test script after compiling the project

To get help for a specific task run: trestle help [task]

```

This is the list of built-in tasks. This is your starting point to find out what tasks are available to run.

If you take a look at the `trestle.config.js` file, you will find :

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

To compile the contracts, use command `trestle compile`. This will compile all the contracts in the project. To compile only one contracts or a subset of all contracts in the project, use command `trestle compile <contract-source-dir>`. To skip schema generation while compiling use `trestle compile --skip-schema`.

```bash
$ trestle compile
🛠 Compiling your contract in directory: contracts
===========================================
warning: profiles for the non root package will be ignored, specify profiles at the workspace root:
package:   /home/adarsh/Desktop/yellow/contracts/Cargo.toml
workspace: /home/adarsh/Desktop/yellow/Cargo.toml
   Compiling proc-macro2 v1.0.37
   Compiling unicode-xid v0.2.3
   Compiling syn v1.0.92
   Compiling serde_derive v1.0.137
   Compiling serde v1.0.137
   Compiling serde_json v1.0.81
   Compiling crunchy v0.2.2
   Compiling ryu v1.0.9
   Compiling itoa v1.0.1
   Compiling schemars v0.8.8
   Compiling static_assertions v1.1.0
   Compiling byteorder v1.4.3
   Compiling hex v0.4.3
   Compiling dyn-clone v1.0.5
   Compiling forward_ref v1.0.0
   Compiling base64 v0.13.0
   Compiling uint v0.9.3
   Compiling quote v1.0.18
   Compiling serde_derive_internals v0.25.0
   Compiling thiserror-impl v1.0.31
   Compiling schemars_derive v0.8.8
   Compiling cosmwasm-derive v1.0.0-beta8
   Compiling thiserror v1.0.31
   Compiling serde-json-wasm v0.3.2
   Compiling cosmwasm-std v1.0.0-beta8
   Compiling cosmwasm-storage v1.0.0-beta8
   Compiling cw-erc20 v0.10.0 (/home/adarsh/Desktop/yellow/contracts)
    Finished release [optimized] target(s) in 51.34s
Creating schema for contract in directory: contracts
warning: profiles for the non root package will be ignored, specify profiles at the workspace root:
package:   /home/adarsh/Desktop/yellow/contracts/Cargo.toml
workspace: /home/adarsh/Desktop/yellow/Cargo.toml
   Compiling cfg-if v1.0.0
   Compiling once_cell v1.10.0
   Compiling subtle v2.4.1
   Compiling adler v1.0.2
   Compiling smallvec v1.8.0
   Compiling seahash v4.1.0
   Compiling gimli v0.26.1
   Compiling rustc-demangle v0.1.21
   Compiling zeroize v1.4.3
   Compiling more-asserts v0.2.2
   Compiling const-oid v0.6.2
   Compiling wasmparser v0.78.2
   Compiling scopeguard v1.1.0
   Compiling cpufeatures v0.2.2
   Compiling either v1.6.1
   Compiling opaque-debug v0.3.0
   Compiling rustc-hash v1.1.0
   Compiling stable_deref_trait v1.2.0
   Compiling fallible-iterator v0.2.0
   Compiling itoa v1.0.1
   Compiling hex v0.4.3
   Compiling ryu v1.0.9
   Compiling dyn-clone v1.0.5
   Compiling pin-project-lite v0.2.9
   Compiling remove_dir_all v0.5.3
   Compiling static_assertions v1.1.0
   Compiling fastrand v1.7.0
   Compiling leb128 v0.2.5
   Compiling forward_ref v1.0.0
   Compiling base64 v0.13.0
   Compiling clru v0.4.0
   Compiling parity-wasm v0.42.2
   Compiling tracing-core v0.1.26
   Compiling libloading v0.7.3
   Compiling miniz_oxide v0.5.1
   Compiling cranelift-bforest v0.76.0
   Compiling der v0.4.5
   Compiling libc v0.2.125
   Compiling typenum v1.15.0
   Compiling crc32fast v1.3.2
   Compiling memchr v2.5.0
   Compiling target-lexicon v0.12.3
   Compiling crossbeam-utils v0.8.8
   Compiling log v0.4.17
   Compiling crunchy v0.2.2
   Compiling memoffset v0.6.5
   Compiling getrandom v0.2.6
   Compiling region v3.0.0
   Compiling memmap2 v0.5.3
   Compiling getrandom v0.1.16
   Compiling num_cpus v1.13.1
   Compiling tempfile v3.3.0
   Compiling which v4.2.5
   Compiling spki v0.4.1
   Compiling generic-array v0.14.5
   Compiling regalloc v0.0.31
   Compiling crossbeam-channel v0.5.4
   Compiling uint v0.9.3
   Compiling addr2line v0.17.0
   Compiling crossbeam-epoch v0.9.8
   Compiling ahash v0.7.6
   Compiling rand_core v0.6.3
   Compiling rand_core v0.5.1
   Compiling pkcs8 v0.7.6
   Compiling digest v0.9.0
   Compiling crypto-mac v0.11.1
   Compiling block-buffer v0.9.0
   Compiling hashbrown v0.11.2
   Compiling hashbrown v0.12.1
   Compiling ff v0.10.1
   Compiling crypto-bigint v0.2.11
   Compiling crossbeam-deque v0.8.1
   Compiling serde v1.0.137
   Compiling thiserror v1.0.31
   Compiling ptr_meta v0.1.4
   Compiling enum-iterator v0.7.0
   Compiling tracing v0.1.34
   Compiling signature v1.3.2
   Compiling curve25519-dalek v3.2.0
   Compiling sha2 v0.9.9
   Compiling hmac v0.11.0
   Compiling group v0.10.0
   Compiling rayon-core v1.9.2
   Compiling dynasmrt v1.2.3
   Compiling bytecheck v0.6.8
   Compiling elliptic-curve v0.10.6
   Compiling enumset v1.0.11
   Compiling rayon v1.5.2
   Compiling ecdsa v0.12.4
   Compiling rend v0.3.6
   Compiling k256 v0.9.6
   Compiling indexmap v1.8.1
   Compiling serde_bytes v0.11.6
   Compiling serde_json v1.0.81
   Compiling ed25519-zebra v3.0.0
   Compiling serde-json-wasm v0.3.2
   Compiling cosmwasm-crypto v1.0.0-beta8
   Compiling loupe v0.1.3
   Compiling object v0.28.3
   Compiling gimli v0.25.0
   Compiling schemars v0.8.8
   Compiling rkyv v0.7.38
   Compiling cosmwasm-std v1.0.0-beta8
   Compiling cosmwasm-schema v1.0.0-beta8
   Compiling cranelift-codegen v0.76.0
   Compiling wasmer-types v2.2.1
   Compiling backtrace v0.3.65
   Compiling cosmwasm-storage v1.0.0-beta8
   Compiling wasmer-vm v2.2.1
   Compiling cw-erc20 v0.10.0 (/home/adarsh/Desktop/yellow/contracts)
   Compiling wasmer-compiler v2.2.1
   Compiling wasmer-engine v2.2.1
   Compiling wasmer-object v2.2.1
   Compiling wasmer-compiler-singlepass v2.2.1
   Compiling wasmer-engine-dylib v2.2.1
   Compiling wasmer-engine-universal v2.2.1
   Compiling cranelift-frontend v0.76.0
   Compiling wasmer-compiler-cranelift v2.2.1
   Compiling wasmer v2.2.1
   Compiling wasmer-middlewares v2.2.1
   Compiling cosmwasm-vm v1.0.0-beta8
    Finished dev [unoptimized + debuginfo] target(s) in 1m 11s
Created /home/adarsh/Desktop/yellow/contracts/schema/instantiate_msg.json
Created /home/adarsh/Desktop/yellow/contracts/schema/execute_msg.json
Created /home/adarsh/Desktop/yellow/contracts/schema/query_msg.json
Created /home/adarsh/Desktop/yellow/contracts/schema/balance_response.json
Created /home/adarsh/Desktop/yellow/contracts/schema/allowance_response.json
Created /home/adarsh/Desktop/yellow/contracts/schema/constants.json
Copying file cw_erc20.wasm from target/wasm32-unknown-unknown/release/ to artifacts/contracts
Copying file allowance_response.json from contracts/schema to artifacts/schema/cw_erc20
Copying file balance_response.json from contracts/schema to artifacts/schema/cw_erc20
Copying file constants.json from contracts/schema to artifacts/schema/cw_erc20
Copying file execute_msg.json from contracts/schema to artifacts/schema/cw_erc20
Copying file instantiate_msg.json from contracts/schema to artifacts/schema/cw_erc20
Copying file query_msg.json from contracts/schema to artifacts/schema/cw_erc20
```

This command will generate compiled `.wasm` files in `artifacts/contracts/` dir and schema `.json` files in `artifacts/schema/` dir.

#### Running user scripts

User scripts are a way to define the flow of interacting with contracts on some network in form of a script. These scripts can be used to deploy a contract, query/transact with the contract.

A sample script `scripts/sample-script.js` is available in the boilerplate. Contents of the script is as follows:

```js
const { Contract, getAccountByName, getLogs } = require("juno-trestle");

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

The script above deploys, inits contract `sample-project` using account `account_0` and add `100000000` amount `ERC` token to the contract_owner address. It then query balance of contract_owner account using `query.balance`. After that it transfers `50000000` token from contract_owner account to the other account address using `tx.transfer`. ANd again query the contract_owner address.

For the above script to be able to run, an account with name `account_0` must be present in `trestle.config.js` and contract artifacts (compiled `.wasm` and schema `.json` files) in `artifacts/` dir must be present for contract `sample-project`.

#### Running test scripts

Test scripts are used to test the contract after deploying it to the network and asserting on the interactions with the contract instance.

A sample test script `test/sample-test.js` is available in the boilerplate. Contents of the script is as follows:

```js
const { use } = require("chai");
const { Contract, getAccountByName, trestleChai } = require("juno-trestle");

use(trestleChai);

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

REPL (read–eval–print loop) gives the a console to do real time interactions with the network. Open the REPL using `trestle repl --network <network-name>`. Sample REPL interaction shown below as follows:

```bash
$ trestle repl --network testnet
★★★  Welcome to trestle REPL ★★★
Try typing: config

trestle> config
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

When REPL is opened, `trestle` library is already imported, use `trestle.` to access classes and functions from the library. Trestle Runtime Environment can be access using `env` variable and `trestle.config.js` data can be accessed using `config` variable.

#### Get node information

Node information can be fetched using `trestle node-info --network <network-name>` as follows:

```bash
$ trestle node-info --network testnet
Network: testnet
ChainId: uni-2
Block height: 1358994
```


#### Cleanup artifacts

To clear artifacts data, use `trestle clean` and to clean artifacts for only one contract, use `trestle clean <contract-name>`.