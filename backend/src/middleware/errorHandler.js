export function errorHandler(err, req, res, next) {
  const duration = Date.now() - (req.startTime || Date.now())
  res.status(err.status || 500).json({
    success: false,
    tool: req.toolName || 'unknown',
    target: req.target || req.body?.target || null,
    duration,
    data: null,
    error: {
      code: err.code || 'INTERNAL_ERROR',
      message: err.message || 'Unexpected error'
    }
  })
}
