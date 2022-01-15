import { Request, Response } from "express";
import { StrongRewardAnalytics } from "./../schemas/strongRewardAnalyticsSchema.js";

export const getStrongAnalyticsByDate = async (req: Request, res: Response) => {
  try {
    const dateToFind: Date = new Date(req.body.dateToFind);
    const strongRewardAnalyticsByDate = await StrongRewardAnalytics.findOne({
      date: { $gte: dateToFind },
    }).exec();
    if (
      strongRewardAnalyticsByDate === null ||
      strongRewardAnalyticsByDate === undefined
    )
      throw "Result was not found!";

    res.status(200).json({
      success: true,
      message: "OK",
      details: null,
      result: strongRewardAnalyticsByDate,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error in getStrongAnalyticsByDate controller!",
      details: error,
      result: null,
    });
  }
};
