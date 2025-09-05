export default function ctrlWrapper(ctrl){
    return function (req, res, next){
        ctrl(req, res, next).catch(next);
    }
}