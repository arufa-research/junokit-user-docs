

# Setting up a project

Project setup can be broken down to 3 steps broadly, which are boiler plate generation, updating project name and updating `junokit.config.js` file.

## Boilerplate code

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

## Updating name of contract

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

## junokit config

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