export const errorHandler = (err, req, res, next) => {
  console.error(err.stack)

  let error = { ...err }
  error.message = err.message

  if (err.name === 'CastError') {
    error.message = '资源未找到'
    error.statusCode = 404
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0]
    error.message = `${field} 已存在`
    error.statusCode = 400
  }

  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((val) => val.message)
    error.message = messages.join(', ')
    error.statusCode = 400
  }

  res.status(error.statusCode || 500).json({
    message: error.message || '服务器内部错误',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  })
}

export const notFound = (req, res, next) => {
  res.status(404).json({ message: '资源未找到' })
}
