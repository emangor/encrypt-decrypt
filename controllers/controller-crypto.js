const logger = require('../utils/logger');
const cryptoModel = require('.././models/model-crypto');

/**
 * This controller encrypts / decrypts a string 
 * with a RESTful call
 * and returns the result in a single response
 * @module controllers/controller-crypto
 */


 /**
 * /encrypt route 
 * example route: POST http://localhost:3000/encrypt
 * @param {Object} req.body
 * body JSON example: 
 * {"string" : "NewBanking manages your identity"}
 */
module.exports.encrypt = (req, res) => {
    logger.debug(`in encrypt`);
    let stringToEncrypt = req.body.string.toString();
    let encryptedString = cryptoModel.encrypt(stringToEncrypt);
    res.status(200).json({"string": encryptedString});
}

 /**
 * /decrypt route 
 * example route: POST http://localhost:3000/decrypt
 * body JSON example: 
 * {"string" : "ZisdTWk0MukU0UCxz0GXlw==:KZfNvqL0fqLdcUA+Ym7MK+4Zf/lESaXovpYn6Gt64MV2bw7dPnfEnIovUA/UKzzW"}
 */
module.exports.decrypt = (req, res) => {
    logger.debug(`in decrypt`);
    let stringToDecrypt = req.body.string.toString();
    let decryptedString = cryptoModel.decrypt(stringToDecrypt);
    res.status(200).json({"string": decryptedString});    
}