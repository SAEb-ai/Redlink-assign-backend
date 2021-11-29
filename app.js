require('dotenv').config();
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
const nodemailer = require("nodemailer");
var connection = require("./db/connection.js");

app.use( bodyParser.json() );       
app.use(bodyParser.urlencoded({    
  extended: true
}));

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'borrow.helpers@gmail.com',
      pass: process.env.password
    }
});


//GET - Gets all the blogs
app.get('/blogs', function (req, res) {
    console.log(req);
    connection.query('Select * from blog', function (error, results, fields) {
       if (error) throw error;
       res.end(JSON.stringify(results));
     });
});

//POST - Saves the new blog
app.post('/blogs', function (req, res) {
    var postData  = req.body;
    var test;
    connection.query('Select email from blog where id!=?', [req.body.id], function (error, results, fields) {
        test=JSON.stringify(results);
    });
    connection.query('INSERT INTO blog SET ?', [postData], async function (error, results, fields) {
       if (error) throw error;
       var mailOptionsForBorrower = {
        from: 'borrow.helpers@gmail.com',
        to: test,
        subject: 'New Blog Post',
        html: `<b>New blog posted titled ${req.body.blog_title}</b>`,
        };
        await transporter.sendMail(mailOptionsForBorrower);
        res.end(JSON.stringify(results));
    });
});

//GET: Get all the blogs of a particular author 
app.get('/blogs/:author', function (req, res) {
   connection.query('Select * from blog where blog_author=?', [req.params.author], function (error, results, fields) {
	  if (error) throw error;
	  res.end(JSON.stringify(results));
	});
});


//PUT: Update each post using post id.
app.put('/blogs/:id', function (req, res) {
   connection.query('UPDATE blog SET blog_title=?, blog_description=? where id=?', [req.body.blog_title, req.body.blog_description, req.params.id], function (error, results, fields) {
	  if (error) throw error;
	  res.end(JSON.stringify(results));
	});
});

//DELETE: Delete post by id.
app.delete('/blogs/:id', function (req, res) {
    console.log(req.body);
    connection.query('DELETE FROM blog WHERE id=?', [req.params.id], function (error, results, fields) {
       if (error) throw error;
       res.end('Record has been deleted!');
     });
 });

app.listen(8080, () => console.log(`Server started listening at port 8080`));

