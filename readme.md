# encrypt / decrypt node app
1. clone repo
2. navigate to directory
3. run `npm install`
4. set values in config.js for encryptionKey, rabbitConnString and whatever else you want changed
5. to start app, run `node app.js`

## available routes:

### POST - /encrypt - REST
http://localhost:3000/encrypt
Header: Content-Type:application/json
Body:
```{"string": "NewBanking manages your identity"}```

### POST - /decrypt - REST
http://localhost:3000/decrypt
Header: Content-Type:application/json
Body:
```{"string": "String that was returned from being encrypted"}```

### POST - /queue - JSON-RPC - method: encrypt
http://localhost:3000/queue
Header: Content-Type:application/json
Body:
```{"jsonrpc": "2.0", "method": "encrypt", "params": "NewBanking manages your identity", "id": null}```

### POST - /queue - JSON-RPC - method: decrypt
http://localhost:3000/queue
Header: Content-Type:application/json
Body:
```{"jsonrpc": "2.0", "method": "decrypt", "id": null}```
