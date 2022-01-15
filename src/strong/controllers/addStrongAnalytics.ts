import { Request, Response } from "express";
import mongoose from "mongoose";
import { CryptocurrencyDataResponse } from "./../../global/models/CryptoData.js";
import { getStrongCryptocurrencyData } from "./../fetch/getStrongCryptocurrencyData.js";
import { strongRewardAnalytics } from "../models/strongRewardAnalytic.js";
import { StrongRewardAnalytics } from "./../schemas/strongRewardAnalyticsSchema.js";
import { EthWallet } from "./../../EthWallet/schemas/ethWalletSchema.js";

import {
  getServiceV1NumOfNodes,
  getServiceV2NumOfNodes,
  getServiceV1UnclaimedRewards,
  getServiceV2UnclaimedRewards,
  getStrongBalanceOfWallet,
} from "./../fetch/web3fetch.js";

export const addStrongAnalytics = async (req: Request, res: Response) => {
  try {
    // get ethWallets
    const ethWallets = await EthWallet.find({}).exec();
    if (
      ethWallets === undefined ||
      ethWallets === null ||
      ethWallets.length <= 0
    )
      throw "No wallets were found!";

    // get strong market data
    const strongCryptoData: CryptocurrencyDataResponse =
      await getStrongCryptocurrencyData();

    // aggregate balances accross eth wallets
    let claimedRewards = 0;
    let serviceV1NumOfNodes = 0;
    let serviceV1UnclaimedRewards = 0;
    let serviceV2NumOfNodes = 0;
    let serviceV2UnclaimedRewards = 0;
    // loop through eth wallets
    for (const ethWallet of ethWallets) {
      claimedRewards += await getStrongBalanceOfWallet(ethWallet.address);
      serviceV1NumOfNodes += await getServiceV1NumOfNodes(ethWallet.address);
      serviceV1UnclaimedRewards += await getServiceV1UnclaimedRewards(
        ethWallet.address
      );
      serviceV2NumOfNodes += await getServiceV2NumOfNodes(ethWallet.address);
      serviceV2UnclaimedRewards += await getServiceV2UnclaimedRewards(
        ethWallet.address
      );
    }
    // calculate values for the analytics
    const allUnclaimedRewards =
      serviceV1UnclaimedRewards + serviceV2UnclaimedRewards;
    const allRewards = allUnclaimedRewards + claimedRewards;
    const allUnclaimedRewardsInUSD =
      claimedRewards * strongCryptoData.result.current_price;
    const allClaimedRewardsInUSD =
      claimedRewards * strongCryptoData.result.current_price;
    const allRewardsInUSD = allRewards * strongCryptoData.result.current_price;
    const numOfAllNodes = serviceV1NumOfNodes + serviceV2NumOfNodes;

    // get strongAnalytics of the previous snapshot
    const strongAnalyticsOfPreviousSnapshotArr =
      await StrongRewardAnalytics.find({}).exec();

    // populate the 'differencesFromPreviousSnapshot' property if there was a previous day
    if (
      strongAnalyticsOfPreviousSnapshotArr !== null &&
      strongAnalyticsOfPreviousSnapshotArr !== undefined &&
      strongAnalyticsOfPreviousSnapshotArr.length > 0
    ) {
      const strongAnalyticsOfPreviousSnapshot =
        strongAnalyticsOfPreviousSnapshotArr[
          strongAnalyticsOfPreviousSnapshotArr.length - 1
        ];
      const strongAnalytics: strongRewardAnalytics = {
        _id: new mongoose.Types.ObjectId(),
        date: new Date(),
        analytics: {
          _id: new mongoose.Types.ObjectId(),
          marketPriceinUSD: strongCryptoData.result.current_price,
          allUnclaimedRewards: allUnclaimedRewards,
          allUnclaimedRewardsInUSD: allUnclaimedRewardsInUSD,
          allClaimedRewards: claimedRewards,
          allClaimedRewardsInUSD: allClaimedRewardsInUSD,
          allRewards: allRewards,
          allRewardsInUSD: allRewardsInUSD,
          numOfAllNodes: numOfAllNodes,
          serviceV1: {
            _id: new mongoose.Types.ObjectId(),
            numOfNodes: serviceV1NumOfNodes,
            unclaimedRewards: serviceV1UnclaimedRewards,
          },
          serviceV2: {
            _id: new mongoose.Types.ObjectId(),
            numOfNodes: serviceV2NumOfNodes,
            unclaimedRewards: serviceV2UnclaimedRewards,
          },
        },
        differencesFromPreviousSnapshot: {
          _id: new mongoose.Types.ObjectId(),
          marketPriceinUSD:
            strongCryptoData.result.current_price -
            strongAnalyticsOfPreviousSnapshot.analytics.marketPriceinUSD,
          allUnclaimedRewards:
            allUnclaimedRewards -
            strongAnalyticsOfPreviousSnapshot.analytics.allUnclaimedRewards,
          allUnclaimedRewardsInUSD:
            allUnclaimedRewardsInUSD -
            strongAnalyticsOfPreviousSnapshot.analytics
              .allUnclaimedRewardsInUSD,
          allClaimedRewards:
            claimedRewards -
            strongAnalyticsOfPreviousSnapshot.analytics.allClaimedRewards,
          allClaimedRewardsInUSD:
            allClaimedRewardsInUSD -
            strongAnalyticsOfPreviousSnapshot.analytics.allClaimedRewardsInUSD,
          allRewards:
            allRewards - strongAnalyticsOfPreviousSnapshot.analytics.allRewards,
          allRewardsInUSD:
            allRewardsInUSD -
            strongAnalyticsOfPreviousSnapshot.analytics.allRewardsInUSD,
          numOfAllNodes:
            numOfAllNodes -
            strongAnalyticsOfPreviousSnapshot.analytics.numOfAllNodes,
          serviceV1: {
            _id: new mongoose.Types.ObjectId(),
            numOfNodes:
              serviceV1NumOfNodes -
              strongAnalyticsOfPreviousSnapshot.analytics.serviceV1.numOfNodes,
            unclaimedRewards:
              serviceV1UnclaimedRewards -
              strongAnalyticsOfPreviousSnapshot.analytics.serviceV1
                .unclaimedRewards,
          },
          serviceV2: {
            _id: new mongoose.Types.ObjectId(),
            numOfNodes:
              serviceV2NumOfNodes -
              strongAnalyticsOfPreviousSnapshot.analytics.serviceV2.numOfNodes,
            unclaimedRewards:
              serviceV2UnclaimedRewards -
              strongAnalyticsOfPreviousSnapshot.analytics.serviceV2
                .unclaimedRewards,
          },
        },
      };
      // save strongAnalytics into DB
      const newStrongRewardAnalytics = new StrongRewardAnalytics(
        strongAnalytics
      );
      await newStrongRewardAnalytics.save();

      res.status(200).json({
        success: true,
        message: "OK",
        details: null,
        result: strongAnalytics,
      });
    } else {
      // set 'differencesFromPreviousSnapshot' to null if there is no previous day
      const strongAnalytics: strongRewardAnalytics = {
        _id: new mongoose.Types.ObjectId(),
        date: new Date(),
        analytics: {
          _id: new mongoose.Types.ObjectId(),
          marketPriceinUSD: strongCryptoData.result.current_price,
          allUnclaimedRewards: allUnclaimedRewards,
          allUnclaimedRewardsInUSD: allUnclaimedRewardsInUSD,
          allClaimedRewards: claimedRewards,
          allClaimedRewardsInUSD: allClaimedRewardsInUSD,
          allRewards: allRewards,
          allRewardsInUSD: allRewardsInUSD,
          numOfAllNodes: numOfAllNodes,
          serviceV1: {
            _id: new mongoose.Types.ObjectId(),
            numOfNodes: serviceV1NumOfNodes,
            unclaimedRewards: serviceV1UnclaimedRewards,
          },
          serviceV2: {
            _id: new mongoose.Types.ObjectId(),
            numOfNodes: serviceV2NumOfNodes,
            unclaimedRewards: serviceV2UnclaimedRewards,
          },
        },
        differencesFromPreviousSnapshot: null,
      };
      // save strongAnalytics into DB
      const newStrongRewardAnalytics = new StrongRewardAnalytics(
        strongAnalytics
      );
      await newStrongRewardAnalytics.save();

      res.status(200).json({
        success: true,
        message: "OK",
        details: null,
        result: strongAnalytics,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error in addStrongAnalytics controller!",
      details: error,
      result: null,
    });
  }
};
