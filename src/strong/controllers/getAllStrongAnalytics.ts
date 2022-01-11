import { Request, Response } from "express";
import { StrongRewardAnalytics } from "./../schemas/strongRewardAnalyticsSchema.js";

export const getAllStrongAnalytics = async (req: Request, res: Response) => {
  try {
    const allStrongRewardAnalytics = await StrongRewardAnalytics.find(
      {}
    ).exec();
    if (
      allStrongRewardAnalytics === null ||
      allStrongRewardAnalytics === undefined
    )
      throw "Nothing was found!";

    res.status(200).json({
      success: true,
      message: "OK",
      details: null,
      result: allStrongRewardAnalytics,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error in getAllStrongAnalytics controller!",
      details: error,
      result: null,
    });
  }
};
