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
        const followers = []
        for(let i=0; i<user.follow.length; i++){
            const followingPlayer = user.follow[i]
            console.log(followingPlayer._id)
            followers.push(await User.findById({_id: followingPlayer}).lean())
        }
        console.log(followers)


        // scores.foreach((arraysOfScores=> find)

        res.render('peer',{
            followers,
        })
    }
    catch(err){console.error(err)}
})

module.exports = router