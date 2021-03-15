const jwt = require('jsonwebtoken')
const SECRET_KEY = require('../config/secretKey')
const { PubSub } = require('apollo-server')

const pubsub = new PubSub()

module.exports = (context) => {
    let token;
    if(context.req && context.req.headers.authorization) {
        token = context.req.headers.authorization.split('Bearer ')[1]
    }
    if(context.connection && context.connection.context.Authorization){
        token = context.connection.context.Authorization.split('Bearer ')[1]
    }
    if(token){
        const user = jwt.verify(token,SECRET_KEY)
        context.user = user
    }
    context.pubsub = pubsub
    return context
}