const { model, Schema } = require('mongoose')
const { isEmail } = require('validator')
const bcrypt = require('bcryptjs')

const userSchema = new Schema({
    email:{
        type:String,
        unique:true,
        required:[true,'Please enter email'],
        validate:[isEmail,'Please enter valid email'],
        lowercase:true,
        trim:true
    },
    username:{
        type:String,
        required:[true,'Please enter username'],
        trim:true,
        minlength:[6,'Username must be atleast 6 character long']
    },
    password:{
        type:String,
        required:[true,'Please enter password'],
        minlength:[6,'Password must be atleast 6 character long'],
        trim:true
    },
    imageUrl:{
        type:String,
        default: 'data:image/png;base64,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',
        trim:true
    }
},{
    timestamps:true
})

userSchema.pre('save',async function(next){
    this.password = await bcrypt.hash(this.password,6)

    return next()
})

module.exports = model('User',userSchema)