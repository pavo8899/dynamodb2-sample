import { getOrderItemssRegular,getOrdersRegular,getUsersRegular } from "../functions/regularScan.js";

const getUsersRegularRoute = async  (req,res,next) => {
    // console.log("🚀 ~ getUsersRegularRoute ~ req:", req)

    var resp = await getUsersRegular(req.query?.filter);
    res.json({"message": resp, "itemCount": resp.length});
}

const getOrdersRegularRoute = async  (req,res,next) => {
    // console.log("🚀 ~ getUsersRegularRoute ~ req:", req)

    var resp = await getOrdersRegular(req.query?.filter);
    res.json({"message": resp, "itemCount": resp.length});
}

const getOrderItemsRegularRoute = async  (req,res,next) => {
    // console.log("🚀 ~ getUsersRegularRoute ~ req:", req)

    var resp = await getOrderItemssRegular(req.query?.filter);
    res.json({"message": resp, "itemCount": resp.length});
}







export {getUsersRegularRoute, getOrdersRegularRoute, getOrderItemsRegularRoute }