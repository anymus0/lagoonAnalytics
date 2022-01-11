import { Router, Request, Response } from "express";
// middlewares
import { validateEthWallet } from './../../global/middlewares/validateEthWallet.js';
import { apiKeyAuth } from './../../global/middlewares/apiKeyAuth.js'
// controllers
import { getEthWallet } from "./../controllers/getEthWallets.js";
import { addEthWallet } from "./../controllers/addEthWallet.js";
import { deleteEthWallet } from "./../controllers/deleteEthWallet.js";

const router = Router();

// GET /ethWallet/getEthWallet
router.get("/getEthWallet", (req: Request, res: Response) => {
  getEthWallet(req, res);
});

router.get("/addEthWallet", apiKeyAuth, validateEthWallet, (req: Request, res: Response) => {
  addEthWallet(req, res);
});

router.get("/deleteEthWallet", apiKeyAuth, validateEthWallet, (req: Request, res: Response) => {
  deleteEthWallet(req, res);
});

export default router;
