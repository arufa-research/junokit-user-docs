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
