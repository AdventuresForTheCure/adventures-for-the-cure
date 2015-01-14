angular.module('app', ['ngResource', 'ngRoute', 'ui.bootstrap', 'angularFileUpload']);

angular.module('app').config(function($routeProvider, $locationProvider) {
  var routeRoleChecks = {
    admin: { auth: function(authorizationService) {
      return authorizationService.authorizeAuthorizedMemberForRoute('admin');
    }},
    board: { auth: function(authorizationService) {
      return authorizationService.authorizeAuthorizedMemberForRoute('board');
    }},
    inventory: { auth: function(authorizationService) {
      return authorizationService.authorizeAuthorizedMemberForRoute('inventory');
    }},
    member: { auth: function($route, authorizationService) {
      return authorizationService.authorizeAuthenticatedMemberForRoute($route);
    }}
  };

  $locationProvider.html5Mode(true);

  // configure the available routes
  $routeProvider
    .when('/', { redirectTo: '/home'
    })
    .when('/home', { templateUrl: '/partials/home/home'
    })
    .when('/donate', { templateUrl: '/partials/donate/donate'
    })
    .when('/events', { templateUrl: '/partials/events/events'
    })
    .when('/rides', { templateUrl: '/partials/rides/rides'
    })
    .when('/members', { templateUrl: '/partials/members/members'
    })
    .when('/results', { templateUrl: '/partials/results/results'
    })
    .when('/campaigns', { templateUrl: '/partials/campaigns/campaigns'
    })
    .when('/inventory', { templateUrl: '/partials/inventory/inventory'
    })
    .when('/contact', { templateUrl: '/partials/contact/contact'
    })
    .when('/join', { templateUrl: '/partials/join/join'
    })
    .when('/login', { templateUrl: '/partials/login/login',
      controller: 'loginCtrl'
    })
    .when('/member-edit/:id', { templateUrl: '/partials/memberEdit/member-edit',
      resolve: routeRoleChecks.member
    })
    .when('/member-list', { templateUrl: '/partials/memberList/member-list',
      resolve: routeRoleChecks.admin
    })
    .when('/member-create', { templateUrl: '/partials/memberCreate/member-create',
      resolve: routeRoleChecks.admin
    })
    .when('/volunteer-event-create', { templateUrl: '/partials/volunteerEventCreate/volunteer-event-create',
      resolve: routeRoleChecks.board
    })
    .when('/volunteer-event-edit/:id', { templateUrl: '/partials/volunteerEventEdit/volunteer-event-edit',
      resolve: routeRoleChecks.board
    })
    .when('/volunteer-event-list', { templateUrl: '/partials/volunteerEventList/volunteer-event-list',
      resolve: routeRoleChecks.board
    })
    .otherwise({
      templateUrl: '/partials/invalidPage/invalidPage'
    });
});

/**
 * If any route is attempted that the user is not authorized for then send
 * the user back to the home page
 */
angular.module('app').run(function($rootScope, $location, notifierService) {
  $rootScope.$on('$routeChangeError', function(evt, current, previous, rejection) {
    if (rejection === 'not authorized') {
      notifierService.error('You are not authorized to view this page.');
    }
  });
});