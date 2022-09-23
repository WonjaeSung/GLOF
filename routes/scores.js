const express = require("express")
const router = express.Router()
const mongoose = require('mongoose')
const { ensureAuth } = require('../middleware/auth')
const Comment = require('../models/Comment')
const Score = require('../models/Score')

//@desc Show add page
 //@route GET /scores/add
 //

 router.get('/add', ensureAuth, (req,res) => {
    res.render('scores/add')
})

//@desc Process add form
 //@route Post /scores
 //

 router.post('/', ensureAuth, async(req,res) => {
    try {
        req.body.user = req.user.id
        await Score.create(req.body)
        res.redirect('/dashboard')
    }catch (err){
        console.log(err)
        res.render('error/500')
    }

})

//@desc Show all scores with comments
 //@route GET /scores
 //

 router.get('/', ensureAuth, async(req,res) => {
    try{
        //populate() method inserts object that ties to the 'user' in scores
        const scores = await Score.find().populate('user')
        .sort({date: 'desc'})
        .lean();

        let following = ""

        for(const score of scores){
            score.comments = await Comment.find({scoreId: score._id}).populate('user').lean()
            console.log(score.likes)
            if(!score.likes.includes(req.user.id)|| score.likes !== undefined){following = false}
            if(score.likes.includes(req.user.id)){following = true}
            score.following = following
        }
        // console.log(scores)

        res.render('scores/scoreboard',{
            scores,
        })
    }catch(err){
        console.error(err)
        res.render('error/500')
    }
})

//@desc Show single score
 //@route GET /scores/:id
 //

 router.get('/:id', ensureAuth, async(req,res) => {
    try{
        //populate inserts user information in the data you are passind through
        let score = await Score.findById(req.params.id)
        .populate('user')
        .lean()

        if(!score){
            return res.render("error/404")
        }

        res.render('scores/show', {
            score,
        })
    } catch(err){
        console.error(err)
        res.render('error/404')

    }
})

//@desc Show edit page
 //@route GET /scores/edit/:id

 router.get('/edit/:id', ensureAuth, async (req,res) => {
    try{
        //look below. .findOne will find only one as to .find will find all. One of many mongo methods.
        const score = await Score.findOne({
            _id: req.params.id
        }).lean()

        
    
        if(!score){
            return res.render('error/404')
        }
        //this is ensuring no one is able to edit a score that they don't own.
        if(score.user != req.user.id){
            res.redirect('/scores')
        }else{
            res.render('scores/edit',{
                score,
            })
        }

    } catch(err){
        console.log(err)
        return res.render('error/500')
    }
})

//@desc Update score
 //@route PUT /scores/:id
 //

 router.put('/:id', ensureAuth, async (req,res) => {
    try{
    //another mongoose method, findById!
    let score = await Score.findById(req.params.id)

    if (!score){
        return res.render('error/404')
    }

    if(score.user != req.user.id){
        res.redirect('/scores')

    } else {
        score.score = req.body.score
        score.date = req.body.date
        score.course_rating = req.body.course_rating
        score.slope = req.body.slope
        score.courseName = req.body.courseName

        score.save()
        res.redirect('/dashboard')
    }
    }catch(err){
        console.log(err)
        return res.render('error/500')
    }
})

//@desc Delete score
 //@route DELETE /scores/:id

 router.delete('/:id', ensureAuth, async(req,res) => {
    try{
        await Score.remove({_id: req.params.id })
        res.redirect('/dashboard')
    }
    catch(err){
        console.log(err)
        return res.render('error/500')
    }
})

//@desc User scores and comments
 //@route GET /scores/user/:userId

 router.get('/user/:userId', ensureAuth, async(req,res) => {
    try{
        const scores = await Score.find({
            user: req.params.user,
        })
        .populate('user')
        .lean()

        res.render('scores/scoreboard',{
            scores
        })
    }catch(err){
        console.error(err)
        res.render('error/500')
    }
})

//@desc like score
 //@route PUT /scores/:id/like
//like a post

router.put("/:id/likes",ensureAuth, async (req,res)=> {
    try{
        const score = await Score.findById(req.params.id)
        
        //if id of a user who is requesting, is not included in the like array of the score, add user's ID to the like array.
        if(!score.likes.includes(req.user.id)){
            // The $push operator appends a specified value to an array.
            await score.updateOne({$push: {likes: req.user.id}})
         res.redirect('/scores')
    } else{

        // The $pull operator removes from an existing array ALL instances of a value or values that match a specified condition.
        await score.updateOne({ $pull: {likes: req.user.id}})
        res.redirect('/scores')
    }
}catch(err){
        console.log(req.body.id)
        res.status(500).json(err);
    }
})




module.exports = router