---
sidebar_position: 1
---

# Introduction

This section gives overview of the most comman use cases. Read `Getting-started` and `Guides` sections for a detailed documentation.

## Initialize a project

```bash
$ junokit init "project-name"
```

This will create a directory "project-name" inside current directory with boiler-plate code. The `contracts/` directory has all the rust files for the contract logic. `scripts/` directory contains  `.ts` scripts that user can write according to the use case, a sample script has been added to give some understanding of how a user script should look like. `test/` directory contains `.ts` scripts to run tests for the deployed contracts.

## Listing Tasks

To see the possible tasks (commands) that are available, go to project's folder. 

```bash
$ junokit
``` 

This is the list of built-in tasks. This is your starting point to find out what tasks are available to run.

## Compile the project

To compile the contracts, Go to project directory:

```bash
$ cd "project-name"
$ junokit compile
```

This command will generate compiled .wasm files in artifacts/contracts/ dir and schema .json files in artifacts/schema/ dir.

## Cleanup Artifacts

To clear artifacts data, use

```bash
$ junokit clean
``` 
This will remove the artifacts directory completely. To clean artifacts for only one contract, use

```bash
$ junokit clean "contract-name"
``` 
This will remove specific files related to that contract.


## Running user scripts

User scripts are a way to define the flow of interacting with contracts on some network in form of a script. These scripts can be used to deploy a contract, query/transact with the contract.A sample script `scripts/sample-script.ts` is available in the boilerplate.

Run `yarn build` before running scripts, this will generate a `build/` directory in the project's directory with compiled `.js` files to be used by junokit.

