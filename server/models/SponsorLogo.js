var SponsorLogo = function(args) {
  var sponsorLogo = {
    path: '',
    name: ''
  };
  sponsorLogo.path = (args.path) ? args.path : '';
  sponsorLogo.name = (args.name) ? args.name : '';
  return sponsorLogo;
};
module.exports = SponsorLogo;