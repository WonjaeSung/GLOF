const express = require("express")
const router = express.Router()
const { ensureAuth } = require('../middleware/auth')
const Score = require('../models/Score')
const User = require('../models/User')

//@desc Show profile
 //@route GET /profile/:id
 //

 router.get('/:id', ensureAuth, async(req,res) => {
    try{
        let following = ""
        scores = await Score.find({user: req.params.id}).sort({date: 'desc'}).populate('user').lean()
        profile = await User.findById(req.params.id).lean()
        if(profile.follow.includes(req.user.id)){following = true}
        else following = false
        res.render('profile',{
            scores,profile,following,
        })
        // console.log(req.user)    
        // console.log(profile)
    }
    catch(err){console.error(err)}
})


//@desc follow a player
 //@route PUT /profile/:id/follow
//like a post
//**Need to add an exception where Follow button doesn't show up if user is looking at their own account

router.put("/:id/follow",ensureAuth, async (req,res)=> {
    try{
        const follower = await User.findById(req.user.id)
        const followed = await User.findById(req.params.id)
        const currentId = req.params.id
        
        //if id of a user who is requesting, is not included in the like array of the score, add user's ID to the like array.
        if(!follower.follow.includes(req.params.id)){
            // The $push operator appends a specified value to an array.
            console.log(follower)
            console.log(followed)
            await follower.updateOne({$push: {follow: req.params.id}})
            await followed.updateOne({$push: {follow: req.user.id}})
         res.redirect(`/profile/${currentId}`)
    } else{

        // The $pull operator removes from an existing array ALL instances of a value or values that match a specified condition.
        console.log(follower)
        console.log(followed)
        await follower.updateOne({ $pull: {follow: req.params.id}})
        await followed.updateOne({ $pull: {follow: req.user.id}})
        res.redirect(`/profile/${currentId}`)
    }
}catch(err){
        res.status(500).json(err);
    }
})


module.exports = router