export function validateBody(schema) {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      convert: true,
      allowUnknown: false,
    });

    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validasi input gagal',
        data: null,
        error: error.details.map(({ path, message }) => ({
          field: path.join('.'),
          message,
        })),
      });
    }

    req.body = value;
    return next();
  };
}

export function validateId(req, res, next) {
  const id = Number(req.params.id);
  if (!Number.isSafeInteger(id) || id < 1) {
    return res.status(400).json({
      success: false,
      message: 'Parameter tidak valid',
      data: null,
      error: [{ field: 'id', message: 'id harus berupa bilangan bulat positif' }],
    });
  }

  req.params.id = id;
  return next();
}
