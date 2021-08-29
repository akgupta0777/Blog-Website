//jshint esversion:6
require('dotenv').config();
const express = require("express");

const bodyParser = require("body-parser");

const ejs = require("ejs");

const _ = require('lodash');
const MONGO_URL = process.env.MONGO_URL;

const mongoose = require('mongoose');
mongoose.connect(MONGO_URL,{useNewUrlParser:true,useUnifiedTopology:true});
const postSchema = {
  title: String,
  content : String
};

const Post = mongoose.model("Post",postSchema);

let homeContent = "Welcome To Blog Website.Here you can compose and write blogs and posts about your daily lives. You can read a individual blog by clicking Read More. Want to try it out Click on Compose.";

const aboutContent = "I am Abhay Gupta The creator of this awesome Website. I made this website because I want to practice what I learnt in Web Development and Specifically EJS(Embedded JavaScript). This website is made using Node.js Express ,EJS and MongoDB.Thanks For Reading.";


const contactContent = "So Do you want to Contact Me :- ";

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
var postContent = "";
var postTitle = "";

function SearchPosts(post){
  for(var i=0;i<posts.length;i++){
    const title = _.lowerCase(posts[i].Title);
    if(title === post){
      postTitle = posts[i].Title;
      postContent = posts[i].Body;
      return true;
      }
  }
  return false;
  }

app.get("/",function(req,res){
  Post.find({},function(err,posts){
    if(err){
      console.log(err);
    }
    else{
      res.render("home",{startContent:homeContent,posts:posts});
    }
  });
})

  app.get("/contact",function(req,res){
    const options = {contact : contactContent}
    res.render("contact",options);
})
  app.get("/about",function(req,res){
    res.render("about",{About : aboutContent})
})

  app.get("/compose",function(req,res){
    res.render("compose")
})
  app.post("/compose",function(req,res) {
    const post = new Post({
      title:req.body.posttitle,
      content:req.body.postbody
   });
    post.save();
    res.redirect("/");
})
  app.get("/posts/:postID",function(req,res){
    const postID = req.params.postID;
    Post.findOne({_id:postID},function(err,post){
      if(post){
        res.render("post",{Title:post.title,Content:post.content});
      }
      else{
        console.log(err);
        console.log("No Matching records Found");
      }
    })
})
app.post("/delete",function(req,res){
  const deletedPostID = req.body.deletedPost;

  Post.deleteOne({_id:deletedPostID},function(err){
    if(err){
      console.log(err);
    }
    else{
      console.log("Successfully deleted the post from Database.");
      res.redirect("/");
    }
  })
})

  app.listen(process.env.PORT || 3000, function() {
    console.log(MONGO_URL);
    console.log("Connected to Server. You are Connected");
});
