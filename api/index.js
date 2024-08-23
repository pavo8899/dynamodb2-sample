import {helloRoute} from "./hello.js";
import { getUsersParallelRoute, getOrderItemsParallelRoute, getOrdersParallelRoute} from "./parallelScan.js";
import { getUsersRegularRoute, getOrderItemsRegularRoute, getOrdersRegularRoute} from "./regularScan.js";
import { createTablesRoute,deleteTablesRoute,populateTablesRoute } from "./tables.js";


const addHello = (app,path='hello') => {
    app.get(`/hello`,helloRoute)
}

const addTables = (app) => {
    app.get('/tables/create', createTablesRoute)
    app.get('/tables/populate', populateTablesRoute)
    app.get('/tables/delete', deleteTablesRoute)
}

const addParallelScan = (app) => {
    app.get('/UsersParallel', getUsersParallelRoute)
    app.get('/OrdersParallel', getOrdersParallelRoute)
    app.get('/OrderItemsParallel', getOrderItemsParallelRoute)
}

const addRegularScan = (app) => {
    app.get('/UsersRegular', getUsersRegularRoute)
    app.get('/OrdersRegular', getOrdersRegularRoute)
    app.get('/OrderItemsRegular', getOrderItemsRegularRoute)
}


const createApi = (app) => {
    addHello(app)
    addTables(app)
    addParallelScan(app)
    addRegularScan(app)
}

export default createApi;
