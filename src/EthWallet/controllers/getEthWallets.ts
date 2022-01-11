import { Request, Response } from "express";
import { EthWallet } from "./../schemas/ethWalletSchema.js";

export const getEthWallet = async (req: Request, res: Response) => {
  try {
    const ethWallets = await EthWallet.find({}).exec();
    if (ethWallets === null || ethWallets === undefined)
      throw "Nothing was found!";
    res.status(200).json({
      success: true,
      message: "OK",
      details: null,
      result: ethWallets,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error in getEthWallets controller!",
      details: error,
      result: null,
    });
  }
};
