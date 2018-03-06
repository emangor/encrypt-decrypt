const config = require( './config' );
const express = require('express');
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;
const logger = require('./utils/logger');
const bodyParser = require('body-parser');
const healthcheckController = require('./controllers/controller-healthcheck');
const cryptoController = require('./controllers/controller-crypto');
const queueController = require('./controllers/controller-queue');

if (cluster.isMaster) {
    // create a worker for each CPU
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }
    cluster.on('online', (worker) => {
        logger.info(`worker online, worker id: ${worker.id}`);
    });
    //if worker dies, create another one
    cluster.on('exit', (worker, code, signal) => {
        logger.error(`worker died, worker id: ${worker.id} | signal: ${signal} | code: ${code}`);
        cluster.fork();
    });
} else {
    //create express app
    const app = express();
    const router = express.Router();

    app.use(bodyParser.json());
    app.use(router);  // tell the app this is the router we are using
    //healthcheck routes
    router.get('/', healthcheckController.healthcheck);
    router.get('/healthcheck', healthcheckController.healthcheck);
    
    //REST routes
    router.post('/decrypt', cryptoController.decrypt);
    router.post('/encrypt', cryptoController.encrypt);

    //JSON RPC route - methods available: encrypt , decrypt
    router.post('/queue', queueController.mediator);
    
    app.listen(config.port, function () {
        logger.info(`worker started: ${cluster.worker.id} | server listening on port: ${config.port}`);
    });
}
