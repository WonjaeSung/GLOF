const mongoose = require('mongoose')


//what does schema do? blueprint of what goes into our database. Validate the shape of my data.
const StorySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    body: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: 'public',
        enum: ['public','private']

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
})

module.exports = mongoose.model('Story', StorySchema /*,'collection-name-if-you-have-one'*/)