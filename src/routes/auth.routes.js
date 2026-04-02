import { Router } from "express"
import * as authController from "../controller/auth.controller.js"

const authRouter = Router();
/** POST /API/auth/register*/

authRouter.post("/register",authController.registerUser)
 /**  * POST /API/auth/login */

authRouter.post("/login",authController.LoginUser)
/**GET /API/auth/profile */

authRouter.get("/get-me",authController.getMe)
/**GET-/API/auth/refresh-token */

authRouter.get("/refresh-token",authController.refreshToken)
/**GET /API/auth/logout */

authRouter.get("/logout",authController.logout)
/**GET /API/AUTH/LOGOUT-ALL */

authRouter.get("/logout-all",authController.logoutAll)
/**GET /API/auth/verify-otp */

authRouter.get("/verify-email",authController.verifyEmail)

export default authRouter;
  