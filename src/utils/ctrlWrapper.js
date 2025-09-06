export default function ctrlWrapper(ctrl) {
  return function (req, res, next) {
    Promise.resolve(ctrl(req, res, next)).catch(next);
  };
}