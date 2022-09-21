const express = require("express")
const router = express.Router()
const { ensureAuth } = require('../middleware/auth')
const Score = require('../models/Score')
const User = require('../models/User')

//@desc Show scores of follower
 //@route GET /peer
 //

 router.get('/', ensureAuth, async(req,res) => {
    try{
        const user = await User.findById(req.user.id).lean()

        const diffs = []
        for(let i=0; i<user.follow.length; i++){
            const followingPlayer = user.follow[i]
        followers.push(await Score.find({user: followingPlayer}).lean())
        }


        // scores.foreach((arraysOfScores=> find)
        // console.log(scores)

        res.render('peer',{
            scores
        })
    }
    catch(err){console.error(err)}
})

module.exports = router