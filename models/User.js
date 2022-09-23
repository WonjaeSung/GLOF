const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    googleId: {
        type: String,
        required: true
    },
    displayName: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    image: {
        type: String,
    },
    follow: {
        type: Array,
        default: []
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    handicapIndex: {
        type: Number,
    }
})

UserSchema.methods.calculateHandicap = async function(){
    const Score = require('../models/Score')
    const scores = await Score.find({ user: this._id }).lean().sort( {date: -1})

    let differentials = []
    let handicapIndex = ""
    for(let i=0; i<scores.length; i++){
        differentials.push(scores[i].differential)
    }
    //These handicap Index calculations are following USGA rules. 
    //https://www.usga.org/content/usga/home-page/handicapping/roh/Content/rules/5%202%20Calculation%20of%20a%20Handicap%20Index.htm
    if(differentials.length<=2){handicapIndex = false}
    else if(differentials.length<=3){handicapIndex = (differentials.sort((a,b)=> a-b)[0]-2).toFixed(1)}
    else if(differentials.length<=4){handicapIndex = (differentials.sort((a,b)=> a-b)[0]-1).toFixed(1)}
    else if(differentials.length<=5){handicapIndex = (differentials.sort((a,b)=> a-b)[0].toFixed(1))}
    else if(differentials.length<=6){handicapIndex = ((differentials.sort((a,b)=> a-b).slice(0,2).reduce((curr,acc)=>curr+=acc,-1))/2).toFixed(1)}
    else if(differentials.length<=8){handicapIndex = ((differentials.sort((a,b)=> a-b).slice(0,2).reduce((curr,acc)=>curr+=acc,0))/2).toFixed(1)}
    else if(differentials.length<=11){handicapIndex = ((differentials.sort((a,b)=> a-b).slice(0,3).reduce((curr,acc)=>curr+=acc,0))/3).toFixed(1)}
    else if(differentials.length<=14){handicapIndex = ((differentials.sort((a,b)=> a-b).slice(0,4).reduce((curr,acc)=>curr+=acc,0))/4).toFixed(1)}
    else if(differentials.length<=16){handicapIndex = ((differentials.sort((a,b)=> a-b).slice(0,5).reduce((curr,acc)=>curr+=acc,0))/5).toFixed(1)}
    else if(differentials.length<=18){handicapIndex = ((differentials.sort((a,b)=> a-b).slice(0,6).reduce((curr,acc)=>curr+=acc,0))/6).toFixed(1)}
    else if(differentials.length<=19){handicapIndex = ((differentials.sort((a,b)=> a-b).slice(0,7).reduce((curr,acc)=>curr+=acc,0))/7).toFixed(1)}
    else (handicapIndex = ((differentials.sort((a,b)=> a-b).slice(0,8).reduce((curr,acc)=>curr+=acc,0))/8).toFixed(1))
    
    this.handicapIndex = handicapIndex
    this.save()
}

module.exports = mongoose.model('User', UserSchema /*,'collection-name-if-you-have-one'*/)