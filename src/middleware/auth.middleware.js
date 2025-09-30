import jwt from "jsonwebtoken";
import { handleErrorClient } from "../Handlers/responseHandlers.js";

export function authMiddleware(req, res, next) {

  const authHeader = req.headers["authorization"] || req.headers["Authorization"];

  if (!authHeader) {
    return handleErrorClient(res, 401, "Acceso denegado. No se proporcionó token.");
  }

  const parts = authHeader.trim().split(" ");
  const token = parts.length === 2 ? parts[1] : null;

  if (!token) {
    return handleErrorClient(res, 401, "Acceso denegado. Token malformado.");
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    const id =
      payload?.id ??
      payload?.userId ??
      payload?.uid ??
      payload?.user?.id ??
      null;

    const email =
      payload?.email ??
      payload?.user?.email ??
      null;

    if (!id && !email) {
      return handleErrorClient(res, 401, "Token válido pero sin identificador de usuario.");
    }

    req.user = { id, email, token };

    return next();
  } catch (error) {
    return handleErrorClient(res, 401, "Token inválido o expirado.", error.message);
  }
}
