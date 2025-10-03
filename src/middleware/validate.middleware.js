// src/middleware/validate.middleware.js
export function validate(schema, where = "body") {
  return (req, res, next) => {
    const data = where === "query" ? req.query : req.body;
    const { error, value } = schema.validate(data);

    if (error) {
      const detalles = error.details?.map(d => d.message) ?? [error.message];
      return res.status(400).json({
        message: "Parámetros inválidos",
        errorDetails: detalles,
        status: "Client error",
      });
    }

    // Reemplaza con la versión saneada (stripUnknown)
    if (where === "query") req.query = value;
    else req.body = value;

    next();
  };
}
