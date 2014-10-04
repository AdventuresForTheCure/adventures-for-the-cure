var nodemailer = require('nodemailer');
var User = require('mongoose').model('User');

var emailSubjectPrefix = '[afc-website]';

exports.sendAuditMessageEMail = function(message) {
  sendAdminOnlyEmail('Audit Msg', message);
};

exports.sendErrorMessageEMail = function(message) {
  sendAdminOnlyEmail('Error Msg', message);
};

// create reusable transport method (opens pool of SMTP connections)
smtpTransport = nodemailer.createTransport('SMTP',{
  service: 'Gmail',
  auth: {
    user: 'mosaic.groups@gmail.com',
    pass: 'ilovemosiac!'
  }
});

sendEmail = function(tos, subject, message) {
  // setup e-mail data with unicode symbols
  var mailOptions = {
    from: 'mosaic.groups@gmail.com', // sender address
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
  User.find({'roles': 'admin'}).exec(function(err, superadmins) {
    var adminTos = '';
    for (var i = 0; i < superadmins.length; i++) {
      adminTos += (adminTos.length === 0) ? superadmins[i].username : ',' + superadmins[i].username;
    }
    sendEmail(adminTos, subject, message);
  });
};