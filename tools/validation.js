const hasErrors = (err) => {
    let errors = {}
    if(err.code === 11000){
        Object.keys(err.keyValue).forEach(field => {
            errors[field] = `${field[0].toUpperCase() + field.slice(1)} must be unique`
        })
    }
    if(err.message.includes('User validation failed'))
    Object.values(err.errors).forEach(({ properties}) => {
        errors[properties.path] = properties.message
    })
    return errors
}

module.exports = hasErrors