const Message = require('../../models/Message')
const { UserInputError, AuthenticationError, ForbiddenError, withFilter  } = require('apollo-server')
const User = require('../../models/User')
const Reaction = require('../../models/Reaction')

const { Types:{ ObjectId } } = require('mongoose')

module.exports = {
    Query:{
        async getMessages(_,{ from },{ user }){
            if(!user) throw new AuthenticationError('You are not logged in')
            let messages = await Message.find({
                to:{$in:[from,user.id]},
                from:{$in:[from,user.id]}
            }).sort({ createdAt:-1 })
            messages = messages.map(async m => {
                m.reactions = await Reaction.find({message:m.id})
                return m
            })
            return messages
        }
    },
    Mutation:{
        async sendMessage(_,{ to,content }, { user, pubsub }){
            try {
                if(!user) throw new AuthenticationError('You are not logged in')
                if(to === user.id) throw new UserInputError('You can not send messages to yourself')

                const reciver = await User.findById(to)

                if(!reciver){
                    throw new UserInputError('User that you try to send message doesn`t exist')
                }else{  

                    const newMessage = await Message.create({
                        to,
                        from:user.id,
                        content
                    })

                    pubsub.publish('NEW_MESSAGE',{ newMessage })

                    return newMessage
                }

                
            } catch (error) {
                throw error
            }
        },
        async sendReaction(_,{ messageId,content }, { user, pubsub }){
            let reactions = ['❤️', '😆', '😯', '😢', '😡', '👍', '👎']

            try {
                if(!user) throw new AuthenticationError('You are not logged in')
                
                if(!reactions.includes(content)) throw new UserInputError('Wrong reaction')

                let message = await Message.findById(messageId)

                if(!message) throw new UserInputError('Message not found')

                if(!message.to.equals(user.id) && !message.from.equals(user.id)){
                    throw new ForbiddenError('Unathorized')
                }

                let reaction = await Reaction.findOne({ message:messageId, user:user.id })

                if(reaction){
                    //update it
                    
                    if(reaction.content !== content){
                        const updatedReaction = await Reaction.findByIdAndUpdate(reaction.id,{$set:{content}},{ new:true })
                        reaction = await updatedReaction.populate('message').populate('user').execPopulate()
                    }
                }else{
                    //create it

                    reaction = await Reaction.create({
                        content,
                        message:messageId,
                        user:user.id
                    })
                    reaction = await reaction.populate('message').populate('user').execPopulate()
                }
                pubsub.publish('NEW_REACTION',{ newReaction : reaction})
                return reaction
                
            } catch (error) {
                throw error
            }
        }
    },
    Subscription:{
        newMessage:{
            subscribe:withFilter((_,__,{ pubsub, user }) => {
                if(!user) throw new AuthenticationError('Unauthenticated')
                return pubsub.asyncIterator('NEW_MESSAGE')
            },({ newMessage},_,{ user }) => {
                return newMessage.to.equals(user.id)
            })
        },
        newReaction:{
            subscribe:withFilter((_,__,{ pubsub, user }) => {
                if(!user) throw new AuthenticationError('Unauthenticated')
                return pubsub.asyncIterator('NEW_REACTION')
            },async ({ newReaction },_,{ user }) => {
                return newReaction.message.to.equals(user.id) || newReaction.message.from.equals(user.id)
            })
        }
    }
}