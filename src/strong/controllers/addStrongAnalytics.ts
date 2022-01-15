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

    // get strongAnalytics of the previous day
    const prevoiusDay = new Date();
    prevoiusDay.setDate(prevoiusDay.getDate() - 1);
    prevoiusDay.setHours(0, 0, 0)
    const strongAnalyticsOfPreviousDay = await StrongRewardAnalytics.findOne({
      date: { $gte: prevoiusDay },
    }).exec();

    // populate the 'differencesFromPreviousDay' property if there was a previous day
    if (strongAnalyticsOfPreviousDay) {
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
        differencesFromPreviousDay: {
          _id: new mongoose.Types.ObjectId(),
          marketPriceinUSD:
            strongCryptoData.result.current_price -
            strongAnalyticsOfPreviousDay.analytics.marketPriceinUSD,
          allUnclaimedRewards:
            allUnclaimedRewards -
            strongAnalyticsOfPreviousDay.analytics.allUnclaimedRewards,
          allUnclaimedRewardsInUSD:
            allUnclaimedRewardsInUSD -
            strongAnalyticsOfPreviousDay.analytics.allUnclaimedRewardsInUSD,
          allClaimedRewards:
            claimedRewards -
            strongAnalyticsOfPreviousDay.analytics.allClaimedRewards,
          allClaimedRewardsInUSD:
            allClaimedRewardsInUSD -
            strongAnalyticsOfPreviousDay.analytics.allClaimedRewardsInUSD,
          allRewards:
            allRewards - strongAnalyticsOfPreviousDay.analytics.allRewards,
          allRewardsInUSD:
            allRewardsInUSD -
            strongAnalyticsOfPreviousDay.analytics.allRewardsInUSD,
          numOfAllNodes:
            numOfAllNodes -
            strongAnalyticsOfPreviousDay.analytics.numOfAllNodes,
          serviceV1: {
            _id: new mongoose.Types.ObjectId(),
            numOfNodes:
              serviceV1NumOfNodes -
              strongAnalyticsOfPreviousDay.analytics.serviceV1.numOfNodes,
            unclaimedRewards:
              serviceV1UnclaimedRewards -
              strongAnalyticsOfPreviousDay.analytics.serviceV1.unclaimedRewards,
          },
          serviceV2: {
            _id: new mongoose.Types.ObjectId(),
            numOfNodes:
              serviceV2NumOfNodes -
              strongAnalyticsOfPreviousDay.analytics.serviceV2.numOfNodes,
            unclaimedRewards:
              serviceV2UnclaimedRewards -
              strongAnalyticsOfPreviousDay.analytics.serviceV2.unclaimedRewards,
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
      // set 'differencesFromPreviousDay' to null if there is no previous day
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
        differencesFromPreviousDay: null,
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
