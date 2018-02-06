var express = require('express');
var app = express();
var path = require('path');
var formidable = require('formidable');
var fs = require('fs');
var crypto = require('crypto');
const contractInstance = require('./deployContract.js');
const web3 = require('./web3Client.js');
var algorithm = 'sha256';

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res){
  res.sendFile(path.join(__dirname, 'views/index.html'));
});

app.post('/upload', function(req, res){

  // create an incoming form object
  var form = new formidable.IncomingForm();

  // specify that we want to allow the user to upload multiple files in a single request
  form.multiples = true;

  // store all uploads in the /uploads directory
  form.uploadDir = path.join(__dirname, '/uploads');

  // every time a file has been uploaded successfully,
  // rename it to it's orignal name
  form.on('file', function(field, file) {
    fs.rename(file.path, path.join(form.uploadDir, file.name), function(err) {
      if(err) console.log(err);
      else
      {
        //console.log("hello");
        //console.log(file.name);
        const file_path = path.join(form.uploadDir, file.name);
        //console.log(file_path);
        const shasum = crypto.createHash(algorithm);
        // readFile --> buffer limit file size
        fs.readFile(file_path, function(err, data) {
          if (err) console.log(err);
          else {
            shasum.update(data);
            const d = shasum.digest('hex');
            contractInstance.file_dgst(d, {from: web3.eth.accounts[0]});
            console.log(d); 
          }
        })
      } 
    });
  });

  // log any errors that occur
  form.on('error', function(err) {
    console.log('An error has occured: \n' + err);
  });

  // once all the files have been uploaded, send a response to the client
  form.on('end', function() {
    res.end('success');
  });

  // parse the incoming request containing the form data
  form.parse(req);

});

var server = app.listen(3000, function(){
  console.log('Server listening on port 3000');
});
