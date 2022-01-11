import { Router, Request, Response } from "express";
import { getAllStrongAnalytics } from "./../controllers/getAllStrongAnalytics.js";
import { getStrongAnalyticsByDate } from "./../controllers/getStrongAnalyticsByDate.js";

const router = Router();

router.get("/getAllStrongAnalytics", (req: Request, res: Response) => {
  getAllStrongAnalytics(req, res);
});

router.get("/getStrongAnalyticsByDate", (req: Request, res: Response) => {
  getStrongAnalyticsByDate(req, res);
});

export default router;
