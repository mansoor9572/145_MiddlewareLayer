export function requestLogger(req, res, next) {
  const startedAt = Date.now();

  res.on('finish', () => {
    console.info(JSON.stringify({
      method: req.method,
      path: req.originalUrl,
      status: res.statusCode,
      durationMs: Date.now() - startedAt,
    }));
  });

  next();
}
