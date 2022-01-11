import { Request, Response, NextFunction } from "express";

export const apiKeyAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.headers.API_KEY === process.env.API_KEY) {
      next();
    } else {
      res
        .status(401)
        .json({
          success: false,
          message: "API key does not match, access denied!",
          details: `The following API key was rejected: ${req.headers.API_KEY}`,
          result: null,
        })
        .end();
    }
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Error in apiKeyAuth middleware!",
        details: error,
        result: null,
      })
      .end();
    return false;
  }
};
