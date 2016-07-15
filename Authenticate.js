/*Includes and global variables*/
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var https = require('https');
var CryptoJS = require('crypto-js');
var ActiveDirectory = require('activedirectory');
var config = {
    url: 'ldap://wdc-ad-vip.vmware.com',
    baseDN: 'dc=vmware,dc=com',
}
/*Add bodyParser to Express app and header to responses*/
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
    if ('OPTIONS' == req.method) {
        res.sendStatus(200);
    } else {
        next();
    }
});
/*Set server to listen to port 8080*/
app.listen(9999);
console.log("Listening on 9999");
app.post('/Authenticate/:userName', function (request, response) {
  if (true) {
    response.send(JSON.stringify({
                                   "cn": request.params.userName
                                 }));
    return;
  }
    var decrypted = CryptoJS.Rabbit.decrypt(request.body, "powerMeKey")
        .toString(CryptoJS.enc.Utf8);
    var ad = new ActiveDirectory({
        url: config.url,
        baseDN: config.baseDN,
        username: request.params.userName + "@vmware.com",
        password: decrypted
    });
    ad.authenticate(request.params.userName + "@vmware.com", decrypted, function (err, auth) {
        if (err) {
            console.log('ERROR: ' + JSON.stringify(err));
            return;
        }
        if (auth) {
            console.log('Authenticated!', true);
            ad.findUser(request.params.userName, function (err, user) {
                if (err) {
                    console.error('Error : ', err);
                } else if (!user) {
                    console.error('User not found : ', request.params.userName);
                }
                if (err || !user) {
                    response.send(JSON.stringify({
                        "cn": request.params.userName
                    }));
                    return;
                }
                console.info("User Information : ", user);
                response.send(JSON.stringify(user));
            });
        } else {
            console.log('Authentication failed!');
        }
    });
});
