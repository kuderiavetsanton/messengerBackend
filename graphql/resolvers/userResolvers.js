const User = require('../../models/User')
const Message = require('../../models/Message')
const hasErrors = require('../../tools/validation')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const SECRET_KEY = require('../../config/secretKey')

const { UserInputError,AuthenticationError } = require('apollo-server')

module.exports = {
    Query:{
        async getUsers(_,__,{ user }){
            try {
                if(!user) throw new AuthenticationError('You are not logged in')
                let users = await User.find({email:{$ne:user.email}})

                const latestMessages = await Message.find({$or:[ { from:user.id }, { to: user.id }]}).sort({ createdAt:-1 })

                users = users.map(otherUser => {
                    let latestMessage = latestMessages.find(m => {
                        return m.to.equals(otherUser.id)  || m.from.equals(otherUser.id)
                    })
                    otherUser.latestMessage = latestMessage
                    return otherUser
                })
                return users
            }
            catch (error) {
                throw error
            }
        },
        async login(_,{ email, password }){
            const errors = {}

            try {
                if(email.trim() === '') errors.email = 'Enter email'
                if(password.trim() === '') errors.password = 'Enter password'

                if(Object.keys(errors).length > 0){
                    throw new UserInputError('Bad input',{errors})
                }
                const user = await User.findOne({ email })
                
                if(!user){
                    errors.email = 'User with that email doesnt exist'
                    throw new UserInputError('User doesnt exist',{errors})
                }
                const isMatch = await bcrypt.compare(password,user.password)
                if(!isMatch){
                    errors.password = 'Wrong password'
                    throw new UserInputError('Wrong password',{errors})
                }
                else{
                    const token = jwt.sign({ email, 
                        id:user.id, 
                        username:user.username 
                    },SECRET_KEY,{ expiresIn:'1h' })

                    return {
                        ...user._doc,
                        id:user._id,
                        token
                    }
                }
            } catch (error) {
                throw error
            }
            
            
        }
    },
    Mutation:{
        async signUp(_,{email,password,imageUrl,confirmPassword,username},{req}){
            const userData = { password, username, email }
            if(imageUrl !== ''){
                userData.imageUrl = imageUrl
            }
            if(password === confirmPassword){
                try {
                    const user =  await User.create({
                        ...userData
                    })   
                    return user
                } catch (error) {
                    let err = hasErrors(error)
                    throw new UserInputError('Validation error',{
                        errors:err
                    })
                }
                
            }else{
                throw new UserInputError('Passwords must match',{
                    errors:{
                        confirmPassword:'Passwords must match'
                    }
                })
            }
        }
    }
}