const express = require("express")
const router = express.Router()
const {ensureAuth, ensureGuest } = require('../middleware/auth')

//@desc Login/landing page
 //@route GET /

 router.get('/', ensureGuest, (req,res) => {
    res.render('Login',{
       layout: 'login',
    })
})

//@desc  Dashboard
//@route Get /dashboard
router.get('/dashboard', ensureAuth, (req,res) => {
    console.log(req.user)
    res.render('Dashboard')
})

module.exports = router