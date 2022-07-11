# Compiling your contracts

Compiling contracts can be done using the command `junokit compile`.

## Compile all contracts

`junokit compile` by default compiles all the contracts in the `contracts/` directory. For each contract compiled, corresponding `.wasm` file is stored in the `artifacts/contracts` directory created in project's root directory.

## Compile one contract

To compile only one contract or a subset of all contracts in the `contract/` directory, use command `junokit compile <sourcePaths>` and this can look something like `junokit compile contracts/sample-project` or `junokit compile contracts/sample-project-1 contracts/sample-project-2`.

## Schema generation

Schema is also generated alongside the compiled `.wasm` file for each of the contract compiled using `junokit compile` command. Schema files are `.json` files (stored inside `artifacts/schema/`) directory and there are multiple `.json` files per contract but only one `.wasm` compiled file per contract. To skip schema generation while compiling use `junokit compile --skip-schema`.

In the `typescript_schema` directory of `artifacts/`, the typescript classes for each of the contracts' client object which can be imported into scripts and tests (`.ts`) as seen in the samples.

Single contract `artifacts/` directory structure:

```bash
.
├── checkpoints
│   └── counter.yaml
├── contracts
│   ├── counter.wasm
│   └── counter_compressed.wasm
├── schema
│   └── counter
│       ├── constants.json
│       ├── count_response.json
│       ├── execute_msg.json
│       ├── instantiate_msg.json
│       └── query_msg.json
└── typescript_schema
    └── Counter.ts

5 directories, 9 files
```

Multi contract `artifacts/` directory structure:

```bash
.
├── checkpoints
│   ├── counter.yaml
│   └── factorial.yaml
├── contracts
│   ├── counter.wasm
│   ├── counter_compressed.wasm
│   ├── factorial.wasm
│   └── factorial_compressed.wasm
├── schema
│   ├── counter
│   │   ├── constants.json
│   │   ├── count_response.json
│   │   ├── execute_msg.json
│   │   ├── instantiate_msg.json
│   │   └── query_msg.json
│   └── factorial
│       ├── constants.json
│       ├── execute_msg.json
│       ├── factorial_response.json
│       ├── instantiate_msg.json
│       └── query_msg.json
└── typescript_schema
    ├── Counter.ts
    └── Factorial.ts

6 directories, 18 files
```