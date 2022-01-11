import { Request, Response, NextFunction } from "express";

export const validateEthWallet = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.headers.ethWallet.slice(0, 2) === "0x") {
      next();
    } else {
      res
        .status(418)
        .json({
          success: false,
          message: "Eth wallet format is invalid!",
          details: `An eth wallet address must start with "0x"`,
          result: null,
        })
        .end();
    }
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Error in validateEthWallet middleware!",
        details: error,
        result: null,
      })
      .end();
    return false;
  }
};
