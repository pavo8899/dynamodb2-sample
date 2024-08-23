import express from 'express'
import fs from 'fs'
import swaggerUi from 'swagger-ui-express'
// const swaggerUi = require('swagger-ui-express');
import swaggerDocument from './swagger/api.json' with { type: "json" };
// const swaggerDocument = require('./swagger/api.json');
import createApi from './api/index.js'

const app = express();
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

createApi(app);

app.listen(3000, () => {
 console.log("Server running on port 3000");
});