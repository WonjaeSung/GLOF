const express = require("express")
const passport = require('passport')
const router = express.Router()


//@desc AUth with Google
 //@route GET /auth/google

 router.get('/google', passport.authenticate('google', {scope: ['profile']}))


//@desc  Dashboard
//@route Get /dashboard
router.get('/google/callback', passport.authenticate('google',{ failureRedirect:'/'}), (req, res) => {
    //if user login was successful, send him/her to dashboard
    res.redirect('/dashboard')
})

//@desc Logout User
//@route /auth/logout
//!Change: Passport 0.6 requires logout to be async
router.get('/logout',(req,res,next)=>{
    req.logout(function(err){
        if (err){return next(err)}
        res.redirect('/')
    })
})

module.exports = router