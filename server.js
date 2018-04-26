var express = require('express');
var app = express();
var path = require('path');
var formidable = require('formidable');
var fs = require('fs');
var http = require('http');
var crypto = require('crypto');
const contractInstance = require('./deployContract.js');
const web3 = require('./web3Client.js');
var algorithm = 'sha256';
var bodyParser = require('body-parser');
var mysql = require('mysql');
var con = mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "---------",
    database: "file-index-database"
});

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");

  app.get('/', function(req, res){
    res.sendFile(path.join(__dirname, 'views/index.html'));
  });

  app.get('/upload.html', function(req, res){
    res.sendFile(path.join(__dirname, 'views/upload.html'));
  });

  app.get('/download.html', function(req, res){
    res.sendFile(path.join(__dirname, 'views/download.html'));
  });

  app.get('/verify.html', function(req, res){
    res.sendFile(path.join(__dirname, 'views/verify.html'));
  });

  app.get('/:file(*)', function(req, res){ // this routes all types of file
    var path = require('path');
    var file = req.params.file;
    var path = path.resolve(".")+'/uploads/'+file;
    var shasum = crypto.createHash(algorithm);
    console.log(file);
    var sql = 'SELECT transaction FROM user WHERE file_name = ?';
    var blockchain_hash_value = '';
    var server_hash_value = '';
    con.query(sql, [file], function (err, result) {
    if (err) throw err;
      console.log("0");
      var transaction = result[0].transaction;
      console.log(transaction);
      var input = web3.eth.getTransaction(transaction).input;
      var temp_string = input.substr(138);
      var temp_string_length = temp_string.length;
      //console.log(temp_string_length);
      for (var i = 0; i<temp_string_length; i+=2) {
        var temp_hash = String.fromCharCode(parseInt(temp_string.substr(i, 2), 16));
        //console.log(temp_hash);
        blockchain_hash_value += temp_hash;    
      }
      console.log('Hash Value from Blockchain');
      console.log(blockchain_hash_value);

      fs.readFile(path, function(err, data) {
        if (err) console.log(err);
        else {
          shasum.update(data);
          server_hash_value = shasum.digest('hex');
          console.log('Hash Value from Server');
          console.log(server_hash_value);
          // res.render('verify', { h1: blockchain_hash_value, h2: server_hash_value});
          if (server_hash_value == blockchain_hash_value) {
            console.log('Both hash values are equal ==> Download success ');
            // res.render('verify', { h1: blockchain_hash_value, h2: server_hash_value});
            res.download(path, function(err){
              if (err) throw err;
              else {

              }
            }); // magic of download fuction
          }
          else {
            console.log('Both hash values are not equal ==> Download fail');
          }
        }

      });
    });
    
  });

  app.post('/filterSearch', function(req, res) {
    var uploader = req.body.uploader;
    var uploader_email = req.body.uploader_email;
    var year = req.body.year;
    res.send(req.body);
  });

  app.post('/download', function(req, res) {
    var sql = 'SELECT * FROM user'
    con.query(sql, function(err, result) {
      res.json(result);
    });
    
  });
 
  app.post('/UploadFile', (req, res) => {
    var uploader = req.body.uploader;
    var uploader_email = req.body.uploader_email;
    var year = req.body.year;
    var fake_files_name = req.body.files;
    files_name = fake_files_name.substring(12);
    // console.log(uploader);
    // console.log(uploader_email);
    // console.log(year);
    // console.log(files_name);
    var sql = 'INSERT INTO user (uploader, email, file_name, year) VALUES (' 
              + '"' + uploader + '"' + ',' + '"' + uploader_email + '"' + ',' + '"' + files_name + '"' + ',' + year + ')';
    console.log(sql);
    con.query(sql, function (err, result) {
    if (err) throw err;
      console.log("1 record inserted");
      
    });   
  })

  app.post('/upload', function(req, res){

    console.log("hello");
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
              var file_name = file.name;
              var transaction_id = contractInstance.file_dgst(d, {from: web3.eth.accounts[0]});
              //console.log(transaction_id);
              var blockNumber = web3.eth.getTransaction(transaction_id).blockNumber;
              // var input = web3.eth.getTransaction(transaction_id).input;
              // var temp_string = input.substr(138);
              
              // var sql = 'INSERT INTO user (file_name, transaction, blockNumber) VALUES (' 
              // + '"' + file_name + '"' + ',' + '"' + transaction_id + '"' +  ',' + '"' + blockNumber + '"' + ')';

              var sql = 'UPDATE user SET transaction = ' + '"' + transaction_id + '"' + ', blockNumber = ' + '"' + blockNumber + '"' + ' WHERE file_name = ' + '"' + file_name + '"';
              console.log(sql);
              con.query(sql, function (err, result) {
              if (err) throw err;
                console.log("1 record updated");
                
              });
              // console.log(temp_string);
              // console.log(d); 
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
      res.end('Success');
    });

    // parse the incoming request containing the form data
    form.parse(req);

  });
    
});

var server = app.listen(3000, function(){
  console.log('Server listening on port 3000');
});
