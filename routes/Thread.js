var express = require("express");
var router = express.Router();
const checkAuthenticated = require('../middlewares/checkAuth')
const admin = require('../config/firebase');
const db = admin.firestore();


router.get('/story/:id/threads', async(req, res)=>{
    var user = "";
    const threads = await db.collection('stories').where('parent_id', '==', req.params.id).get();
    var threadArray = [];
    threads.forEach((thread)=>{
        let threadjson = thread.data()
        threadjson.thread_id = thread.id;
        threadArray.push(threadjson)
    })
    if(req.user){
        user = req.user;
    }
    res.render('Thread/threads', {threads: threadArray, user: user})

})
router.get('/story/:id/thread/new', checkAuthenticated, (req, res)=>{
    res.render('Thread/newThread', {parent_id: req.params.id, user: req.user})
})

router.post('/story/:id/thread', checkAuthenticated, async(req, res)=>{
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
        parent_id: req.params.id,
        approved: false
    }).then(()=>{
        res.redirect('/stories')
    }).catch((err)=>console.log(err))
})
module.exports = router;