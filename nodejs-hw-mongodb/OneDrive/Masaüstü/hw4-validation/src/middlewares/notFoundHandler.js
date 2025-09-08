import createError from 'http-errors';

function notFoundHandler(req, res, next) {
  next(createError(404, 'Route not found'));
}

export default notFoundHandler;
