const config = require( '../config' );
const logger = require('../utils/logger');

let crypto;
try {
    crypto = require('crypto');
    logger.debug('crypto support is enabled!');
} catch (err) {
    logger.error(`crypto support is disabled: ${err}`);
}
/**
 * This model encrypts / decrypts a string 
 * encryptionKey, algorithm, randomBytes all must be provided
 * in your ENV VARs or in the config
 * and returns the result in a single response
 * @module models/model-crypto
 */

const encryptionKey = config.encryptionKey;
const algorithm = config.algorithm;

module.exports.encrypt = (stringToEncrypt) => {
    logger.debug('in model postEncrypt');
    let encryptedFinal;
    let encryptedReturn;
    let iv = crypto.randomBytes(config.randomBytes);
    let cipher = crypto.createCipheriv(algorithm, encryptionKey, iv);
    let encryptedData = cipher.update(stringToEncrypt,'utf8');
    encryptedFinal = Buffer.concat([encryptedData, cipher.final()]);
    encryptedReturn =  `${iv.toString('base64')}:${encryptedFinal.toString('base64')}`;
    return encryptedReturn;
}


module.exports.decrypt = (stringToDecrypt) => {
    logger.debug('in model getDecrypt');
    let decryptedFinal;
    let decryptedReturn;
    let stringSplit = stringToDecrypt.split(':');
    let iv = new Buffer(stringSplit.shift(), 'base64');
    let encryptedText = new Buffer(stringSplit.join(':'), 'base64');
    let decipher = crypto.createDecipheriv(algorithm, encryptionKey, iv);
    let decryptedData = decipher.update(encryptedText,'utf8');
    decryptedFinal = Buffer.concat([decryptedData, decipher.final()]);
    decryptedReturn = decryptedFinal.toString();
    return decryptedReturn;
}