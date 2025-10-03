import { Router } from "express";
import { login, register } from "../controllers/auth.controller.js";
import { validate } from "../middleware/validate.middleware.js";
import { registerUserValidation, loginValidation } from "../validations/usuario.validation.js";

const router = Router();

router.post("/login",   validate(loginValidation, "body"),   login);
router.post("/register", validate(registerUserValidation,"body"), register);

export default router;
