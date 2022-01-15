import { BigNumber, ethers } from "ethers";
import { ERC20Abi } from "../../global/models/ERC20Abi.js";
import { strongServiceV1Abi } from "../models/strongServiceV1Abi.js";
import { strongServiceV2Abi } from "../models/strongServiceV2Abi.js";
import dotenv from "dotenv";
dotenv.config();

const nodeRpcUrl = process.env.NODE_RPC_URL;
const web3Provider = new ethers.providers.JsonRpcProvider(nodeRpcUrl);

// contract instances
const strongTokenContractAddress = "0x990f341946a3fdb507ae7e52d17851b87168017c";
const strongServiceV1ContractAddress =
  "0xFbdDaDD80fe7bda00B901FbAf73803F2238Ae655";
const strongServiceV2ContractAddress =
  "0xc5622f143972a5da6aabc5f5379311ee5eb48568";

const strongTokenContract = new ethers.Contract(
  strongTokenContractAddress,
  ERC20Abi,
  web3Provider
);

const strongServiceV1Contract = new ethers.Contract(
  strongServiceV1ContractAddress,
  strongServiceV1Abi,
  web3Provider
);

const strongServiceV2Contract = new ethers.Contract(
  strongServiceV2ContractAddress,
  strongServiceV2Abi,
  web3Provider
);

export const getStrongBalanceOfWallet = async (walletAddress: string) => {
  try {
    const balanceInWei: BigNumber = await strongTokenContract.balanceOf(
      walletAddress
    );
    const balance: number = Number.parseFloat(
      ethers.utils.formatUnits(balanceInWei, 18)
    );
    return balance;
  } catch (error) {
    console.error(error);
    return 0;
  }
};

export const getServiceV1UnclaimedRewards = async (walletAddress: string) => {
  try {
    const currentBlock = await web3Provider.getBlockNumber();
    const unclaimedRewardsFromV1InWei: BigNumber =
      await strongServiceV1Contract.getRewardAll(walletAddress, currentBlock);
    const unclaimedRewardsFromV1 = Number.parseFloat(
      ethers.utils.formatUnits(unclaimedRewardsFromV1InWei, 18)
    );
    return unclaimedRewardsFromV1;
  } catch (error) {
    console.error(error);
    return 0;
  }
};

export const getServiceV2UnclaimedRewards = async (walletAddress: string) => {
  try {
    const entityNodeCount: number = Number.parseInt(
      await strongServiceV2Contract.entityNodeCount(walletAddress)
    );
    let unclaimedRewardsFromV2 = 0;
    for (let nodeId = 1; nodeId <= entityNodeCount; nodeId++) {
      console.log(nodeId);
      const rewardOfNodeIdInWei: BigNumber = await strongServiceV2Contract.getNodeReward(walletAddress, nodeId);
      const rewardOfNodeId: number = Number.parseFloat(ethers.utils.formatUnits(rewardOfNodeIdInWei, 18));
      unclaimedRewardsFromV2 += rewardOfNodeId;
      console.log(`Rew of node#${nodeId}: ${rewardOfNodeIdInWei}`);
    }
    return unclaimedRewardsFromV2;
  } catch (error) {
    console.error(error);
    return 0;
  }
};

export const getServiceV1NumOfNodes = async (walletAddress: string) => {
  try {
    const entityNodeCount: BigNumber =
      await strongServiceV1Contract.entityNodeCount(walletAddress);
    return entityNodeCount.toNumber();
  } catch (error) {
    console.error(error);
    return 0;
  }
};

export const getServiceV2NumOfNodes = async (walletAddress: string) => {
  try {
    const entityNodeCount: BigNumber =
      await strongServiceV2Contract.entityNodeCount(walletAddress);
    return entityNodeCount.toNumber();
  } catch (error) {
    console.error(error);
    return 0;
  }
};
