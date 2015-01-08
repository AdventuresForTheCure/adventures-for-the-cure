var nodemailer = require('nodemailer');
var htmlUtils = require('../utilities/htmlUtils');
var Member = require('mongoose').model('Member');

var emailSubjectPrefix = '[afc-website]';

exports.sendAuditMessageEMail = function(message) {
  sendAdminOnlyEmail('Audit Msg', htmlUtils.encode(message));
};

exports.sendErrorMessageEMail = function(message) {
  sendAdminOnlyEmail('Error Msg', htmlUtils.encode(message));
};

// create reusable transport method (opens pool of SMTP connections)
smtpTransport = nodemailer.createTransport('SMTP',{
  service: 'Gmail',
  auth: {
    user: 'adventuresforthecure@gmail.com',
    pass: 'OakieHouseChurch'
  }
});

sendEmail = function(tos, subject, message) {
  // setup e-mail data with unicode symbols
  var mailOptions = {
    from: 'afc.website@gmail.com', // sender address
    to: tos, // list of receivers
    subject: emailSubjectPrefix + ' ' + subject, // Subject line
    html: message
  };

  // send mail with defined transport object
  smtpTransport.sendMail(mailOptions, function(error, response){
    if(error) {
      console.log('Error sending email', error);
    }
  });
};

sendAdminOnlyEmail = function(subject, message) {
  Member.find({'roles': 'admin'}).exec(function(err, admins) {
    var adminTos = '';
    for (var i = 0; i < admins.length; i++) {
      adminTos += (adminTos.length === 0) ? admins[i].username : ',' + admins[i].username;
    }
    sendEmail(adminTos, subject, message);
  });
};