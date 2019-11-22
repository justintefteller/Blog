const express    = require('express'),
      bodyParser = require('body-parser'),
      mongoose   = require('mongoose'),
      app        = express(),
      port       = 5004;
      options    = {
          useNewUrlParser: true,
          useUnifiedTopology: true,
          useFindAndModify: true
      };
mongoose.connect("mongodb://localhost/blog", options, function(err){
    if(err) {
        throw err
    } console.log("Connected to the DB")
});

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

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

app.set('port', process.env.PORT || port); // set express to use this port
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});