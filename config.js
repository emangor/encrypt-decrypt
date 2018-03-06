config = {
    serviceName: process.env.SERVICENAME || 'crypto-rabbitmq',
    port: process.env.PORT || 3000,
    loggerLevel: 'info',
    encryptionKey: process.env.ENCRYPTION_KEY || '',
    randomBytes: parseInt(process.env.RANDOM_BYTES) || 16,
    algorithm: process.env.ALGORITHM || 'aes-256-cbc',
    rabbitConnString: process.env.RABBIT_CONN_STRING || '',
    rabbitQueueName: process.env.RABBIT_QUEUE_NAME || 'test' 
}

module.exports = config;
