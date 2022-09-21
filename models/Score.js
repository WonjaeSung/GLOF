const mongoose = require('mongoose')


//what does schema do? blueprint of what goes into our database. Validate the shape of my data.
const scoreSchema = new mongoose.Schema({
    differential: {
        type: Number,
    },
    score: {
        type: Number,
        required: true,
        min:1,
        max:200,
        validate : {
            validator : Number.isInteger,
            message   : '{VALUE} is not a valid score'
          }
    },
    date: {
        type: String,
        required: true,
    },
    course_rating: {
        type: Number,
        required: true,
    },
    slope: {
        type: Number,
        required: true,
        min:1,
        max:200,
        validate : {
            validator : Number.isInteger,
            message   : '{VALUE} is not a valid slope'
          }
    },
    courseName: {
        type: String,
        required: true,
    },
    
    likes:{
        type: Array,
        default:[]
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

scoreSchema.pre('save', function(next) {
    this.differential = ((113/this.slope)*(this.score-this.course_rating)).toFixed(1)
    next();
  });
  
//compiling model. All pre() and post() needs to be called before compiling or else, they won't execute.
module.exports = mongoose.model('scores', scoreSchema /*,'collection-name-if-you-have-one'*/)