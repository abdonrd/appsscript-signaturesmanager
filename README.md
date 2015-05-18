# SignaturesManager for Google Apps Script

SignaturesManager for Google Apps Script is a library that provides the ability
to manage the signatures of Google Apps users in Google Apps Script.


## Setup

This library is already published as an Gooogle Apps Script, making it easy to
include in your project. To add it to your script, do the following in the
Google Apps Script code editor:

1. Click on the menu item "Resources > Libraries..."
2. In the "Find a Library" text box, enter the project key
   "MPv0nOH4iExMfjWuC7yAamfMyxiDDL4nZ" and click the "Select" button.
3. Choose a version in the dropdown box (usually best to pick the latest
   version).
4. Click the "Save" button.


## Usage

For use this library is necessary to use the
[OAuth2 for Apps Script library](https://github.com/googlesamples/apps-script-oauth2).

### 1. Create the OAuth2 service

Example:
``` javascript
function getSignaturesService() {
    return OAuth2.createService('signatures')
        .setAuthorizationBaseUrl('https://accounts.google.com/o/oauth2/auth')
        .setTokenUrl('https://accounts.google.com/o/oauth2/token')

        .setClientId('...')
        .setClientSecret('...')

        .setCallbackFunction('authCallback')

        .setPropertyStore(PropertiesService.getUserProperties())

        .setScope('https://apps-apis.google.com/a/feeds/emailsettings/2.0/')

        .setParam('login_hint', Session.getActiveUser().getEmail())
        .setParam('access_type', 'offline');
}
```

### 2. Direct the user to the authorization URL

Example:
``` javascript
function showAuthorization() {
    var signaturesService = getSignaturesService();

    if (!signaturesService.hasAccess()) {
        var authorizationUrl = signaturesService.getAuthorizationUrl();,
            template = HtmlService.createTemplate(
            '<a href="<?= authorizationUrl ?>" target="_blank">Authorize</a>. ' +
            'Refresh the page when the authorization is complete.');

        template.authorizationUrl = authorizationUrl;

        return template.evaluate().setSandboxMode(HtmlService.SandboxMode.IFRAME);
    } else {
        ...
    }
}
```

### 3. Handle the callback

Example:
``` javascript
function authCallback(request) {
    var signaturesService = getSignaturesService(),
        isAuthorized = signaturesService.handleCallback(request);

    if (isAuthorized) {
        return HtmlService.createHtmlOutput('Success! You can close this tab.');
    }

    return HtmlService.createHtmlOutput('Denied. You can close this tab.');
}
```

### 4. Make the request

Example:
``` javascript
var signaturesService = getSignaturesService(),
    sm = SignaturesManager.create(signaturesService);

var currentSignature = sm.getSignatureByEmail('username@domain.com');

sm.setSignatureByEmail('username@domain.com', 'This will be my new signature!');
```
