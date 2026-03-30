import { Router } from "express"
import * as authController from "../controller/auth.controller.js"

const authRouter = Router();
/**
 * POST /API/auth/register
 */
authRouter.post("/register",authController.registerUser)
// /**
//  * POST /API/auth/login
//  */
// authRouter.post("/login",authController.LoginUser)
/**GET /API/auth/profile */

authRouter.get("/get-me",authController.getMe)

/**GET-/API/auth/refresh-token */
authRouter.get("/refresh-token",authController.refreshToken)

export default authRouter;
