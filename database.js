// config/database.js
let USERNAME = process.env.DATABASE_USERNAME
let PASSWORD = process.env.DATABASE_PASSWORD
module.exports = {
    
    'url' : `mongodb+srv://${USERNAME}:${PASSWORD}@cluster0.vkd0p.mongodb.net/?retryWrites=true&w=majority`, // looks like mongodb://<user>:<pass>@mongo.onmodulus.net:27017/Mikha4ot
    'dbName': 'myFirstDatabase'
};
