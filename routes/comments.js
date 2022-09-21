const express = require("express")
const router = express.Router()
const {ensureAuth} = require('../middleware/auth')
const Comment = require("../models/Comment")

//@desc Login/landing page
 //@route GET /

//  router.get('/', ensureAuth, (req,res) => {
//     console.log("comment")
// })

//create a post

router.post('/:id',ensureAuth, async(req,res)=> {
    try{
        req.body.user = req.user
        const scoreId = req.params.id
        await Comment.create({...req.body,scoreId})
 
        
        res.redirect('/scores')
        
    }catch(err){
        console.error(err)
        res.status(500).json(err)
    }
}), 

//update a post

router.put('/:id',ensureAuth, async(req,res)=>{
    try{
        const comment = await Comment.findById(req.params.id);
        if(comment.user.toString() === req.body.user){
            await comment.updateOne({$set:req.body})
            res.status(200).json("The comment has been updated")
        }else{
            res.status(403).json( "you can only update your own comment")
        }
    } catch(err){
    res.status(500).json(err)
    }
})
//delete a post

router.delete('/:id',ensureAuth, async(req,res)=>{
    try{
        const comment = await Comment.findById(req.params.id);
        if(comment.user.toString()  === req.user.id){
            await comment.deleteOne()
            return res.redirect('/scores')
            alert('The comment has been deleted')
            // res.status(200).json("The comment has been deleted")
        }else{
            res.status(403).json( "you can only delete your own comment")
        }
    } catch(err){
    res.status(500).json(err)
    }
})

module.exports = router