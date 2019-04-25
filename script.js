var GoogleAuth;
  var SCOPE = 'https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/photoslibrary.appendonly https://www.googleapis.com/auth/photoslibrary.readonly.appcreateddata';
  function handleClientLoad() {
    // Load the API's client and auth2 modules.
    // Call the initClient function after the modules load.
    gapi.load('client:auth2', initClient);
  }

  function initClient() {
    // Retrieve the discovery document for version 3 of Google Drive API.
    // In practice, your app can retrieve one or more discovery documents.
    var discoveryUrl = 'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest';

    // Initialize the gapi.client object, which app uses to make API requests.
    // Get API key and client ID from API Console.
    // 'scope' field specifies space-delimited list of access scopes.
    gapi.client.init({
        // 'apiKey': '852848336687-3ceri8a4cb8993s3htgb688avljgdr8s.apps.googleusercontent.com',
        'discoveryDocs': [discoveryUrl],
        'clientId': '852848336687-f9fuvp0tjh39ha8q12tskt0n5rplc1bh.apps.googleusercontent.com',
        'scope': SCOPE
    }).then(function () {
      GoogleAuth = gapi.auth2.getAuthInstance();

      // Listen for sign-in state changes.
      GoogleAuth.isSignedIn.listen(updateSigninStatus);

      // Handle initial sign-in state. (Determine if user is already signed in.)
      var user = GoogleAuth.currentUser.get();
      setSigninStatus();

      // Call handleAuthClick function when user clicks on
      //      "Sign In/Authorize" button.
      $('#sign-in-or-out-button').click(function() {
        handleAuthClick();
      }); 
      $('#revoke-access-button').click(function() {
        revokeAccess();
      }); 
    });
  }

  function handleAuthClick() {
    if (GoogleAuth.isSignedIn.get()) {
      // User is authorized and has clicked 'Sign out' button.
      GoogleAuth.signOut();
    } else {
      // User is not signed in. Start Google auth flow.
      GoogleAuth.signIn();
    }
  }

  function revokeAccess() {
    GoogleAuth.disconnect();
  }

  function setSigninStatus(isSignedIn) {
    var user = GoogleAuth.currentUser.get();
    var isAuthorized = user.hasGrantedScopes(SCOPE);
    if (isAuthorized) {
      const token = 'http://ec2-18-219-109-248.us-east-2.compute.amazonaws.com:8082/upload?token='+user.getAuthResponse().access_token;
      $('#sign-in-or-out-button').hide();
      $('#label').show().html(token);
      // $('#revoke-access-button').css('display', 'inline-block');
    } else {
      $('#sign-in-or-out-button').show();
      // $('#revoke-access-button').css('display', 'none');
    }
  }

  function updateSigninStatus(isSignedIn) {
    setSigninStatus();
  }