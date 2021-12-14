var express = require("express");
var router = express.Router();
const checkAuthenticated = require('../middlewares/checkAuth')
const admin = require('../config/firebase');
const db = admin.firestore();
const moment = require('moment')

router.get('/stories',  async(req,res)=>{
    var user = "";
    var stories = [];
    const storiesFetch = await db.collection('stories').get()
      storiesFetch.forEach( async (story)=>{
       var data = story.data();
       data.story_id = story.id;
       stories.push(data)
       });
       if(req.user){
        user = req.user;
       }
    res.render('Story/stories', { stories: stories, user: user});   
})

router.get('/stories/new', checkAuthenticated, (req,res)=>{
    res.render('Story/newStory', {user: req.user}); 
})

router.post('/stories',checkAuthenticated, async(req, res)=>{
    var title = req.body.storyTitle;
    var content = req.body.storyContent;
    var date_posted = new Date().toString()
    var author = await (await db.collection('users').doc(req.user.user_id).get()).data();
    author.uid = req.user.user_id;
    await db.collection('stories').add({
        title,
        content,
        date_posted,
        author: author,
        comments: [],
        likes: [],
        parent_id: "null",
        approved: false
    }).then(()=>{
        res.redirect('/stories')
    }).catch((err)=>console.log(err))
})

router.get('/story/:id', async(req,res)=>{
    var user = "";
    const doc = await db.collection('stories').doc(req.params.id).get()
    const story = doc.data()
    const threads = await db.collection('stories').where('parent_id', '==', req.params.id).limit(5).get();
    var threadArray = [];
    threads.forEach((thread)=>{
        let threadjson = thread.data()
        threadjson.thread_id = thread.id;
        threadArray.push(threadjson)
    })
    if(req.user){
        user = req.user;
       }
    res.render('Story/singleStory', {story: story, story_id: doc.id, user: user, threads: threadArray})
})
router.post('/story/:id/like',checkAuthenticated, async(req, res)=>{
    const doc = await db.collection('stories').doc(req.params.id).get();
    let likes = doc.data().likes
    if(likes.includes(req.user.user_id)){
        likes = likes.filter((value)=>{
            return value !== req.user.user_id
        })
    }else{
        likes.push(req.user.user_id);
    }
    await db.collection('stories').doc(req.params.id).update({likes: likes})
    // res.redirect('/stories')
    res.redirect(req.get('referer'))
})
router.post('/story/:id/comment', checkAuthenticated, async(req, res)=>{
    const doc = await db.collection('stories').doc(req.params.id).get()
    let comments = doc.data().comments;
    let userdoc = await db.collection('users').doc(req.user.user_id).get()
    let commentUser = userdoc.data()
    let comment = {
        content: req.body.comment,
        author: commentUser,
        date_created: new Date().toString()
    }
    comments.push(comment)
    await db.collection('stories').doc(req.params.id).update({comments: comments})
    res.redirect(req.get('referer'))
})

router.delete('/story/:id',checkAuthenticated,  async(req, res)=>{
    const doc = await db.collection('stories').doc(req.params.id).get()
    const story = doc.data()
    if(req.user.user_id == story.author.uid){
        await db.collection('stories').doc(req.params.id).delete()
        res.redirect('/stories')
    }else{
        res.status(403).send("Don't do that")
    }
})

module.exports = router;