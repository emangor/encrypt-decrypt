const config = require( '../config' );
const logger = require('../utils/logger');
const amqp = require('amqplib/callback_api');

/**
 * This model sends and receives messages to RabbitMQ
 * rabbitConnString , rabbitQueueName must be provided 
 * in your ENV VARs or in the config
 * and returns the result in a single response
 * @module models/model-crypto
 */

module.exports.sendMessage = (message, callback) => {
    logger.debug(`in model sendMessage, message: ${message}`);
    amqp.connect(config.rabbitConnString, function(err, conn) {
        conn.createChannel(function(err, ch) {
            if (err){
                logger.error('message failed to post');
                callback(err);
            }
            let q = config.rabbitQueueName;
            let msg = message;
    
            ch.assertQueue(q, {durable: false});
            ch.sendToQueue(q, new Buffer(msg));
            logger.info(" [x] Sent %s", msg);
        });
        setTimeout(function() { 
            conn.close(); 
            callback(null, message);
        }, 500);
    });
}

module.exports.receiveMessage = (callback) => {
    logger.debug('in model receiveMessage');
    amqp.connect(config.rabbitConnString, function(err, conn) {
        conn.createChannel(function(err, ch) {
            let q = config.rabbitQueueName;
            ch.assertQueue(q, {durable: false});                
            logger.info(" [*] Waiting for messages in %s. To exit press CTRL+C", q);
            ch.get(q, {noAck: true}, function(err, msg) {
                if (err){
                    logger.error(err);
                    callback(err);
                } else {
                    if (msg){
                        logger.info(" [x] Received %s", msg.content.toString());
                        callback(null, msg.content.toString());
                    } else {
                        callback(null, 'empty');
                    }
                }    
            });
        });
    });
}
