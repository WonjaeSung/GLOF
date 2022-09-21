const mongoose = require('mongoose')



//what does schema do? blueprint of what goes into our database. Validate the shape of my data.
const commentSchema = new mongoose.Schema(
    {
        scoreId :{
            type: mongoose.Types.ObjectId,
            ref:'Score',
            required: true,
        },
        comment: {
            type: String,
            required: true,
        },
        likes:{
            type: Array,
            default:[]
        },
        img:{
            type: String,
        },
        user: {
            //looking for unique objectId in case there are other users with same name.
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        createdAt: {
            type: Date,
            default: Date.now
        },  
    }, 
{timestamps: true}
)

module.exports = mongoose.model('comments', commentSchema /*,'collection-name-if-you-have-one'*/)