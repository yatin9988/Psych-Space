var express = require("express");
var router = express.Router();
const checkAuthenticated = require('../middlewares/checkAuth')
const admin = require('../config/firebase');
const { auth } = require("../config/firebase");
const db = admin.firestore();


router.get('/dashboard', checkAuthenticated, async(req, res)=>{
    if(req.user.email == "vidhi152@gmail.com" || req.user.email == "ankitvatsav23@gmail.com"){
      var stories = [];
      const storiesFetch = await db.collection('stories').get()
        storiesFetch.forEach( async (story)=>{
         var data = story.data();
         data.story_id = story.id;
         stories.push(data)
         });
   
      res.render('dashboard', {stories: stories});
    }else{
      res.status(403).send('Unauthorized');
    }
  })

router.put('/dashboard',checkAuthenticated, async(req, res)=>{
    if(req.user.email == "vidhi152@gmail.com" || req.user.email == "ankitvatsav23@gmail.com"){
        await db.collection('stories').doc(req.body.story_id).update({approved: true})
        res.redirect('/dashboard')
    }else{
        res.status(403).send('Do not try to hack me!');
    }
})

router.delete('/dashboard', checkAuthenticated, async(req, res)=>{
    if(req.user.email == "vidhi152@gmail.com" || req.user.email == "ankitvatsav23@gmail.com"){
        await db.collection('stories').doc(req.body.story_id).delete()
        res.redirect('/dashboard')
    }else{
        res.status(403).send('Do not try to hack me!');
    }
})

module.exports = router;
