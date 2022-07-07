# Compiling your contracts

Compiling contracts can be done using the command `junokit compile`.

## Compile all contracts

`junokit compile` by default compiles all the contracts in the `contracts/` directory. For each contract compiled, corresponding `.wasm` file is stored in the `artifacts/contracts` directory created in project's root directory.

## Compile one contract

To compile only one contract or a subset of all contracts in the `contract/` directory, use command `junokit compile <sourcePaths>` and this can look something like `junokit compile contracts/sample-project` or `junokit compile contracts/sample-project-1 contracts/sample-project-2`.

## Schema generation

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