import { Request, Response } from "express";
import { EthWallet } from "./../schemas/ethWalletSchema.js";

export const addEthWallet = async (req: Request, res: Response) => {
  try {
    const ethWalletToAdd: string = req.body.ethWallet;
    // check for duplicates
    const ethWalletDuplicate = await EthWallet.findOne({
      address: ethWalletToAdd,
    }).exec();
    if (ethWalletDuplicate) throw "Eth wallet aldready exists!";
    const newEthWallet = new EthWallet({
      address: ethWalletToAdd,
    });
    await newEthWallet.save();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error in addEthWallet controller!",
      details: error,
      result: null,
    });
  }
};
