const userResolvers = require('./userResolvers')
const messageResolvers = require('./messageResolvers')

module.exports = {
    Message:{
        createdAt(parent){
            return parent.createdAt.toISOString()
        },
        updatedAt(parent){
            return parent.updatedAt.toISOString()
        }
    },
    Query:{
        ...userResolvers.Query,
        ...messageResolvers.Query
    },
    Mutation:{
        ...userResolvers.Mutation,
        ...messageResolvers.Mutation
    },
    Subscription:{
        ...messageResolvers.Subscription
    }
}