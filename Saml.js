/**
 * Created by tapathan on 12/1/2015.
 */

var saml2 = require('saml2-js');
var fs = require('fs');
var bodyParser = require('body-parser');
var express = require('express');
var proxy = require('http-proxy');
var app = express();
var http = require('http');
var https = require('https');

console.log('cwd : ', process.cwd());
eval(fs.readFileSync('dist/scripts/constants.js') + '');

console.log('env : ', environment);

var apiProxy = proxy.createProxyServer({changeOrigin: true});

app.use('/es', function (req, res) {
  var url = environment.esUri + req.url;
  console.log('Proxy request to ', url);
  apiProxy.web(req, res, {target: environment.esUri});
});

app.use(express.static('dist'));
app.use(bodyParser.urlencoded({
                                extended: false
                              }));
app.use(bodyParser.json());

var sp_options = {
  entity_id: "PowerMePrd",
  private_key: fs.readFileSync("key-file.pem").toString(),
  certificate: fs.readFileSync("powerme-cert.crt").toString(),
  assert_endpoint: environment.assert_endpoint,
  force_authn: false,
  auth_context: {comparison: "exact", class_refs: ["urn:oasis:names:tc:SAML:1.0:am:password"]},
  nameid_format: "urn:oasis:names:tc:SAML:1.1:nameid-format:unspecified",
  sign_get_request: false,
  allow_unencrypted_assertion: true

};
var sp = new saml2.ServiceProvider(sp_options);

var idp_options = {
  sso_login_url: environment.sso_login_url,
  sso_logout_url: environment.sso_logout_url,
  certificates: [fs.readFileSync("powerme-cert.crt").toString()],
  force_authn: false,
  sign_get_request: false,
  allow_unencrypted_assertion: true

};
var idp = new saml2.IdentityProvider(idp_options);

//Local Authentication
app.post('/Authenticate/:userName', function (request, response) {
  if (true) {
    response.send(JSON.stringify({
                                   "cn": request.params.userName
                                 }));
    return;
  }
});

app.get("/login", function (req, res) {
  sp.create_login_request_url(idp, {}, function (err, login_url, request_id) {
    console.log("SAML Login URL Response : ", login_url);
    console.log("SAML Requiet ID Response : ", request_id);
    console.log("SAML ERR Response : ", err);
    if (err != null) {
      return res.send(500);
    }
    res.redirect(login_url);
  });
});

app.post("/assert", function (req, res) {
  var options = {request_body: req.body};

  sp.post_assert(idp, options, function (err, saml_response) {
    console.log("SAML Response : ", saml_response);
    console.log("Error : ", err);
    if (err != null) {
      return res.sendStatus(500);
    }

    name_id = saml_response.user.name_id;
    session_index = saml_response.user.session_index;

    console.log("User Name : ", name_id);

    res.cookie('currentUser', JSON.stringify({username: name_id})).redirect(environment.appUri + '/#/app/dashboard');
  });
});

// application -------------------------------------------------------------
app.get('*', function (req, res) {
  res.sendFile(__dirname + '/dist/index.html'); // load the single view file (angular will handle the page changes on the front-end)
});

if (environment.name === 'prod') {
// This line is from the Node.js HTTPS documentation.
  var options = {
    key: fs.readFileSync('bicatalog-key.pem'),
    cert: fs.readFileSync('bicatalog_vmware_com.crt'),
    ca: fs.readFileSync('DigiCertCA.crt'),
    requestCert: true,
    rejectUnauthorized: false
  };

  https.createServer(options, app).listen(3000);
} else {
  app.listen(3000);
}
