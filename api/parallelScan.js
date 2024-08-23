import { getUsersParallel, getOrdersParallel, getOrderItemssParallel } from "../functions/parallelScan.js";

const getUsersParallelRoute = async  (req,res,next) => {
    // console.log("🚀 ~ getUsersParallelRoute ~ req:", req)

    var resp = await getUsersParallel(req.query?.filter);
    res.json({"message": resp, "itemCount": resp.length});
}

const getOrdersParallelRoute = async  (req,res,next) => {
    // console.log("🚀 ~ getUsersParallelRoute ~ req:", req)

    var resp = await getOrdersParallel(req.query?.filter);
    res.json({"message": resp, "itemCount": resp.length});
}

const getOrderItemsParallelRoute = async  (req,res,next) => {
    // console.log("🚀 ~ getUsersParallelRoute ~ req:", req)

    var resp = await getOrderItemssParallel(req.query?.filter);
    res.json({"message": resp, "itemCount": resp.length});
}







export {getUsersParallelRoute, getOrdersParallelRoute, getOrderItemsParallelRoute }