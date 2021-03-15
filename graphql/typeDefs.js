const { gql } = require('apollo-server')

module.exports = gql`
    type Reaction{
        id:ID!,
        content:String!,
        message:Message!,
        user:User!,
        createdAt:String!,
        updatedAt:String!
    }
    type Message{
        to:ID!,
        from:ID!,
        content:String!,
        createdAt:String!,
        updatedAt:String!,
        id:ID!,
        reactions:[Reaction]
    }
    type User {
        username:String!
        email:String!
        password:String!,
        imageUrl:String!,
        id:ID!,
        token:String,
        createdAt:String!,
        updatedAt:String!,
        latestMessage:Message
    }
    type Query {
        getUsers:[User]!
        login(email:String! password:String!):User!
        getMessages(from:ID!):[Message]!
    }
    type Mutation {
        sendMessage(to:ID!,content:String!):Message!
        signUp(email:String!,username:String!,password:String!,confirmPassword:String!,imageUrl:String):User!
        sendReaction(content:String!,messageId:ID!):Reaction!
    }
    type Subscription {
        newMessage:Message!
        newReaction:Reaction!
    }
`