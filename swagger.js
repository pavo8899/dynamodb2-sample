import swaggerAutogen from 'swagger-autogen';

const doc = {
  info: {
    title: 'dynamodb2',
    description: 'Example of Dynamodb '
  },
  host: 'localhost:3000'
};

const outputFile = './swagger/api.json';
const routes = ['./api/index.js'];

/* NOTE: If you are using the express Router, you must pass in the 'routes' only the
root file where the route starts, such as index.js, app.js, routes.js, etc ... */

swaggerAutogen(outputFile, routes, doc);