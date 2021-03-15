const { model, Schema } = require('mongoose')

const reactionSchema = new Schema({
    content:{
        type:String,
        required:true
    },
    message:{
        type:Schema.Types.ObjectId,
        ref:'Message',
        required:true
    },
    user:{
        type:Schema.Types.ObjectId,
        ref:'User',
        required:true
    }
},{ timestamps:true})

module.exports = model('Reaction',reactionSchema)