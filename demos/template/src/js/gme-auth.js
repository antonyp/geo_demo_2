
// The Client ID for your application, as configured on the Google APIs console.
var clientId = '450202706519-q9cfcq3ah1ptlgm0aq1cnu517ld7jteu.apps.googleusercontent.com';

// The oauth scope for displaying Maps Engine data.
var scopes = 'https://www.googleapis.com/auth/mapsengine.readonly';

function gmeAuthInitialize() {
  authorizationFlow(authorizationComplete, refreshComplete);
}


function refreshComplete() {
  // The refreshed token is automatically stored and used by gapi.client for
  // any additional requests, so we do not need to do anything in this handler.
}

// The entry point to the auth flow.
// authorizationComplete is called with an access_token when the oauth flow
// first completes.
// refreshComplete is called with a new access_token once the token refreshes.
function authorizationFlow(authorization_complete, refresh_complete) {
  checkAuth(false, handleAuthResult);

  function checkAuth(prompt_user, callback) {
    var options = {
      client_id: clientId,
      scope: scopes,

      // Setting immediate to 'true' will avoid prompting the user for
      // authorization if they have already granted it in the past.
      immediate: !prompt_user
    }

    gapi.auth.authorize(options, callback);
  }

  function handleAuthResult(authResult) {
    var authorizeButton = document.getElementById('authorize_button');

    // Has the user authorized this application?
    if (authResult && !authResult.error) {
      // The application is authorized. Hide the 'Authorization' button.
      authorizeButton.style.display = 'none';
      authorization_complete(authResult);

      // We must refresh the token after it expires.
      window.setTimeout(refreshToken, authResult.expires_in * 1000);
    } else {
      // The application has not been authorized. Start the authorization flow
      // when the user clicks the button.
      authorizeButton.style.display = 'block';
      authorizeButton.onclick = handleAuthClick;
    }
  }

  function handleAuthClick(event) {
    checkAuth(true, handleAuthResult);
    return false;
  }

  function refreshToken() {
    checkAuth(false, refreshComplete);
  }

  function refreshComplete(authResult) {
    refresh_complete(authResult);

    // Refresh the token once it expires.
    window.setTimeout(refreshToken, authResult.expires_in * 1000);
  }
}