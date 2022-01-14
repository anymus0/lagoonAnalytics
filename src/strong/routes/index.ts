import { Router, Request, Response } from "express";
import { getAllStrongAnalytics } from "./../controllers/getAllStrongAnalytics.js";
import { getStrongAnalyticsByDate } from "./../controllers/getStrongAnalyticsByDate.js";
import { apiKeyAuth } from './../../global/middlewares/apiKeyAuth.js'

const router = Router();

// GET /strong/getAllStrongAnalytics
router.get("/getAllStrongAnalytics", (req: Request, res: Response) => {
  getAllStrongAnalytics(req, res);
});

// GET /strong/getStrongAnalyticsByDate
router.get("/getStrongAnalyticsByDate", (req: Request, res: Response) => {
  getStrongAnalyticsByDate(req, res);
});

// POST /strong/addStrongAnalytics
router.post("/addStrongAnalytics", apiKeyAuth, (req: Request, res: Response) => {
  getStrongAnalyticsByDate(req, res);
});

export default router;
