import bcrypt from "bcryptjs";
import { AppDataSource } from "../config/configDb.js";
import { User } from "../entities/user.entity.js";
import {
  handleSuccess,
  handleErrorClient,
  handleErrorServer,
} from "../Handlers/responseHandlers.js";

const repo = () => AppDataSource.getRepository(User);

export function getPublicProfile(req, res) {
  return handleSuccess(res, 200, "Perfil público obtenido exitosamente", {
    message: "¡Hola! Este es un perfil público. Cualquiera puede verlo.",
  });
}

export function getPrivateProfile(req, res) {
  const user = req.user;
  return handleSuccess(res, 200, "Perfil privado obtenido exitosamente", {
    message: `Hola, ${user?.email}! Este es tu perfil privado. Solo tú puedes verlo.`,
    userData: user,
  });
}

export async function updateMyProfile(req, res) {
  try {
    let userId = req.user?.id;
    const tokenEmail = req.user?.email;
    let { email, password } = req.body || {};

    if (typeof email === "string") email = email.trim().toLowerCase();
    if (typeof password === "string") password = password.trim();

    if (!userId && tokenEmail) {
      const me = await repo().findOne({ where: { email: tokenEmail } });
      if (me) userId = me.id;
    }
    if (!userId) return handleErrorClient(res, 401, "No autenticado.");

    if (!email && !password) {
      return handleErrorClient(res, 400, "Debes enviar email y/o password.");
    }

    const user = await repo().findOne({ where: { id: userId } });
    if (!user) return handleErrorClient(res, 404, "Usuario no encontrado.");

    if (typeof email === "string") {
      if (email.length === 0) {
        return handleErrorClient(res, 400, "Email inválido.");
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return handleErrorClient(res, 400, "Email inválido.");
      }
      const existing = await repo().findOne({ where: { email } });
      if (existing && existing.id !== user.id) {
        return handleErrorClient(res, 409, "Ese email ya está en uso.");
      }
      user.email = email;
    }

    if (typeof password === "string") {
      if (password.length < 6) {
        return handleErrorClient(
          res,
          400,
          "La contraseña debe tener al menos 6 caracteres."
        );
      }
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    const saved = await repo().save(user);
    const { password: _omit, ...safe } = saved;
    return handleSuccess(res, 200, "Perfil actualizado correctamente.", safe);
  } catch (error) {
    return handleErrorServer(res, 500, "No se pudo actualizar el perfil.", error.message);
  }
}


export async function deleteMyAccount(req, res) {
  try {
    let userId = req.user?.id;
    const tokenEmail = req.user?.email;

    if (!userId && tokenEmail) {
      const me = await repo().findOne({ where: { email: tokenEmail } });
      if (me) userId = me.id;
    }

    if (!userId) return handleErrorClient(res, 401, "No autenticado.");

    const user = await repo().findOne({ where: { id: userId } });
    if (!user) return handleErrorClient(res, 404, "Usuario no encontrado.");

    await repo().remove(user);
    return handleSuccess(res, 200, "Cuenta eliminada correctamente.");
  } catch (error) {
    return handleErrorServer(res, 500, "No se pudo eliminar la cuenta.", error.message);
  }
}

