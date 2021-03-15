const { ApolloServer } = require('apollo-server')
const isAuth = require('./tools/isAuth')

const mongoose = require('mongoose')

const typeDefs = require('./graphql/typeDefs')

const resolvers = require('./graphql/resolvers')

mongoose.connect(require('./config/database'),{ useNewUrlParser: true, useUnifiedTopology: true },)

const server = new ApolloServer({
    cors:{
        origin: '*',
		credentials: true
    },
    typeDefs,
    resolvers,
    context:(context) => isAuth(context)
})

server.listen({ port: process.env.PORT || 4000 }).then(({url}) => {
    console.log(url)
})