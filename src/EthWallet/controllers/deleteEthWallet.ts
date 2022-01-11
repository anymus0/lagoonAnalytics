import { Request, Response } from "express";
import { EthWallet } from "./../schemas/ethWalletSchema.js";

export const deleteEthWallet = async (req: Request, res: Response) => {
  try {
    const ethWalletToDelete: string = req.body.ethWallet;
    const deletedEthWallet = await EthWallet.findOneAndDelete({
      address: ethWalletToDelete,
    });
    if (deletedEthWallet === null || deletedEthWallet === undefined)
      throw "Eth wallet to delete was not found!";
    res.status(200).json({
      success: true,
      message: "OK",
      details: null,
      result: deletedEthWallet,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error in deleteEthWallet controller!",
      details: error,
      result: null,
    });
  }
};
