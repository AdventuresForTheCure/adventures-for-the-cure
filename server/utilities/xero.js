var crypto = require("crypto");
var oauth = require("oauth");
var config = require('../config/config');
var rsa_key = require('fs').readFileSync(config.rootPath + 'server/certs/www_adventuresforthecure_com.pem');

function Xero(key, secret) {
  this._key = key;
  this._secret = secret;

  this._request = new oauth.OAuth(null, null, this._key, this._secret, '1.0', null, "PLAINTEXT");
  this._request._signatureMethod = "RSA-SHA1";
  this._request._headers['Accept'] = 'application/json';

  this._request._createSignature = function(signatureBase, tokenSecret) {
    var signer = crypto.createSign("RSA-SHA1");
    signer.update(signatureBase);
    return signer.sign(rsa_key, output_format = "base64");
  }
}

Xero.prototype.call = function(method, path, body, callback) {
  path = 'https://api.xero.com/api.xro/2.0/' + path;
  this._request._performSecureRequest(this._key, this._secret, method, path, null, body, null, callback);
}

module.exports = Xero;