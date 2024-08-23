import {createTables, deleteTables, populateTables} from '../functions/tables.js'

const createTablesRoute = async  (req,res,next) => {
    var resp = await createTables();
    res.json({"message": resp});
}

const populateTablesRoute = async  (req,res,next) => {
    // var users = req.query?.users === 1 || true;
    // var orders = req.query?.orders === 1 || true;
    // var items = req.query?.items === 1 || true;
    var resp = await populateTables();
    res.json({"message": resp});
}

const deleteTablesRoute = async  (req,res,next) => {
    var resp = await deleteTables();
    res.json({"message": resp});
}




export {createTablesRoute, populateTablesRoute, deleteTablesRoute}