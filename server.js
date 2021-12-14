const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const admin = require('./config/firebase')
const db = admin.firestore();
var methodOverrride = require("method-override");


require('dotenv').config()

const PORT = process.env.PORT || 5000;

const checkAuthenticated = require('./middlewares/checkAuth');

const storyRoutes = require('./routes/Story');
const dashboardRoutes = require('./routes/Dashboard');
const threadRoutes = require('./routes/Thread')

app.set('view engine', 'ejs');
app.use(express.static(__dirname+"/public"));
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
app.use(methodOverrride("_method"));

app.use(async(req, res, next)=>{
  if(req.cookies.session){
    const decodedIdToken = await admin.auth().verifyIdToken(req.cookies.session);
    req.user = decodedIdToken; 
    next()
  }else{
    next()
  }
  
})
//Routes
app.use(storyRoutes)
app.use(dashboardRoutes)
app.use(threadRoutes)

app.get('/', (req, res)=>{
  var preloader;
  if(req.cookies.session){
    preloader = true
  }else preloader = true
    res.render('index', {preloader: preloader});
})


app.get('/about', (req, res)=>{
    res.render('about');
})



app.post('/', async(req,res)=>{
  const decodedIdToken = await admin.auth().verifyIdToken(req.cookies.session);
  req.user = decodedIdToken;
  var doc = db.collection('users').doc(req.user.user_id).get().then(async(docExists)=>{
    if(docExists.exists){
      console.log("user exists")
    }else{
      await db.collection('users').doc(req.user.user_id).set({
        name: req.user.name,
        email: req.user.email,
        profilePic: req.user.picture
      })
    }
  }) 
})

app.get('*', (req, res)=>{
  res.render('404')
})
app.listen(PORT, ()=>{
    console.log(`Listening on port ${PORT}`);
})