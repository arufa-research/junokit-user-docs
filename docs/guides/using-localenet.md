# Using localnet with junokit

## Setup the Local Developer Testnet

In this document you'll find information on setting up a local Juno Network.

## Running the docker container

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

## Checking the node info

We can then check the node info of the node. Open a new terminal :

```bash
junokit node-info
Network: default
ChainId: uni-2
Block height: 1358994
```

## Compile the contract

Then we need to compile the contract. This can be done by the following command:

```bash
junokit compile
```

## Running scripts on Localnet

To run any script on localnet open a new terminal and execute:

```bash
junokit run scripts/sample-script.js
```
