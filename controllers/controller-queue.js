const logger = require('../utils/logger');
const cryptoModel = require('.././models/model-crypto');
const queueModel = require('.././models/model-queue');

/**
 * This controller mediates the seperate JSON-RPC methods 
 * which push and pop items from the queue (RabbitMQ)
 * and returns the result in a single response
 * @module controllers/controller-queue
 */

/**
 * /queue route calls the mediator function
 * example route: POST http://localhost:3000/queue
 * @param {Object} req.body
 * body JSON examples: 
 * {"jsonrpc": "2.0", "method": "encrypt", "params": "NewBanking manages your identity", "id": null}
 * {"jsonrpc": "2.0", "method": "decrypt", "id": null}
 */
module.exports.mediator = (req, res) => {
    if (req.body){
        if (typeof req.body.jsonrpc !== 'undefined'){
            let json = req.body;
            switch (json.method){
                case 'encrypt':
                    encryptQueue(req, res, json);
                    break;
                case 'decrypt':                    
                    decryptQueue(req, res);
                    break;
                default:
                    logger.error(`unsupported rpc method: ${json.method}`);
                    res.status(400).json({"jsonrpc": "2.0", "error": {"code": -32601, "message": "Method not found"}, "id": "1"});
            }
        } else {
            res.status(400).json({"jsonrpc": "2.0", "error": {"code": -32600, "message": "Invalid Request"}, "id": null});
        }
    } else {
        res.status(400).json({"jsonrpc": "2.0", "error": {"code": -32600, "message": "Invalid Request"}, "id": null});
    }
}

function encryptQueue (req, res, json) {
    logger.debug(`in encryptQueue`);
    let string = json.params.toString();
    let encryptedString = cryptoModel.encrypt(string);
    queueModel.sendMessage(encryptedString, function(err, result){
        if(err){
            logger.error(`encryptQueue error: ${err}`);
            res.status(500).json({"jsonrpc": "2.0", "error": {"code": -32000, "message": "server error"}, "id": null});
        } else {
            res.status(200).json({"jsonrpc": "2.0", "result": result, "id": null});
        }
    });
}


function decryptQueue (req, res) {
    logger.debug(`in decryptQueue`);
    let string;
    queueModel.receiveMessage(function(err, result){
        if(err){
            logger.error(`decryptQueue error: ${err}`);
            res.status(500).json({"jsonrpc": "2.0", "error": {"code": -32000, "message": "server error"}, "id": null});
        } else {
            if (result === 'empty'){
                res.status(200).json({"jsonrpc": "2.0", "result": "empty queue", "id": null});
            } else {
                string = result.toString();
                let decryptedString = cryptoModel.decrypt(string);
                res.status(200).json({"jsonrpc": "2.0", "result": decryptedString , "id": null});
            } 
        }
    });
}
