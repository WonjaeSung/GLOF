const express = require("express")
const router = express.Router()
const {ensureAuth, ensureGuest } = require('../middleware/auth')

const Score = require('../models/Score')

//@desc Login/landing page
 //@route GET /

 router.get('/', ensureGuest, (req,res) => {
    res.render('Login',{
       layout: 'login',
    })
})

//@desc  Dashboard
//@route Get /dashboard
router.get('/dashboard', ensureAuth, async(req,res) => {
    try{
        const sort = {date: -1}
        //.lean basically unpacks mongoose object into plain object. Sort is sorting the scores on dashboard by descending date order.
        const scores = await Score.find({ user: req.user.id }).lean().sort(sort)
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
        console.log(handicapIndex)
    
        // let handicapIndex = ((differentials.slice(0,8).reduce((acc,cur)=> acc+=cur,0))/8).toFixed(1)

        res.render('Dashboard',{
            name: req.user.firstName,
            scores,
            handicapIndex,
        })
    } catch (err) {
        console.error(err)
        res.render('error/500')
    }
})

module.exports = router