const mongoose = require("mongoose")

const connectDB = async() => {
    try {
        const conn = await mongoose.connect
        (process.env.MONGO_URI,  {
            //! these are not necessary since the new version 
            // useNewURLParser: true,
            // useUnifiedTopology: true,
            // useFindAndModify: false
        })
    
        console.log(`MongoDB Connected: ${conn.connection.host}`)

    } catch (err){
        console.log(err)
        process.exit(1)
    }
}

module.exports = connectDB
