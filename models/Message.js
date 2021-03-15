const { model, Schema } = require('mongoose')

const messageSchema = new Schema({
        content:{
            type:String,
            required:true
        },
        to:{
            type:Schema.Types.ObjectId,
            ref:'User',
            required:true
        },
        from:{
            type:Schema.Types.ObjectId,
            ref:'User',
            required:true
        }
    },
    { 
        timestamps:true 
    }
)

module.exports = model('Message',messageSchema)