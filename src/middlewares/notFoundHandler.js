import createError from 'http-errors';

function notFoundHandler(req, res, next) {
  // 404 hatası oluşturup next() ile error handler'a gönderiyoruz
  next(createError(404, "Route not found"));
}

export default notFoundHandler;
