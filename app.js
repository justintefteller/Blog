const express          = require('express'),
      expressSanitizer = require("express-sanitizer"),  
      bodyParser       = require('body-parser'),
      methodOverride   = require('method-override'),
      mongoose         = require('mongoose'),
      app              = express(),
      port             = 5004;
      options          = {
          useNewUrlParser: true,
          useUnifiedTopology: true,
          useFindAndModify: true
      }

mongoose.connect("mongodb://localhost/blog", options, function(err){
    if(err) {
        throw err
    } console.log("Connected to the DB")
});

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));

const blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    create: {type: Date, default: Date.now}
});

const Blog = mongoose.model("Blog", blogSchema);

Blog.create({
    title: "Test Blog",
    image: "https://images.unsplash.com/photo-1564223288351-a96bea22b5f9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
    body: "This is a sexy photo",
});

app.get("/", function(req, res){
    res.redirect("/blogs");
});

app.get("/blogs", function(req, res) {
    Blog.find({}, function(err, blogs){
        if(err){
            throw err
        } else {
        res.render("index", {blogs:blogs}); 
        }
    });
});

app.get("/blogs/new", function(req, res) {
    res.render('new');
});

app.post("/blogs", function(req, res) {
    req.body.blog.body = req.sanitize(req.body.blog.body)
    Blog.create(req.body.blog, function(err, newBlog){
        if(err){
            res.render("new");
        } else {
            res.redirect("/blogs");
        }
    });
});

app.get("/blogs/:id", function(req, res){
   Blog.findById(req.params.id, function(err, blog){
       if(err){
           res.redirect('/blogs');    
        } else {
           res.render("show", {blog:blog});
       }
   }); 
});

app.get("/blogs/:id/edit", function(req,res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            res.redirect("/blogs");
        }else {
            res.render("edit", {blog: foundBlog});
        }
        
    });
});

app.put("/blogs/:id", function(req, res){
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
        if(err){
            res.redirect("/blogs");
        }else {
            res.redirect("/blogs/" + req.params.id)
        }
    });
})

app.delete("/blogs/:id", function(req, res){
    Blog.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs");
        }
    });
});
app.set('port', process.env.PORT || port); // set express to use this port
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});