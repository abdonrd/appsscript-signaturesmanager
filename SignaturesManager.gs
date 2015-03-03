/**
 * Creates a new signatures manager.
 *
 * @param {Service_} service The signatures OAuth2 service object.
 * @return {SignaturesManager_} The signatures manager object.
 */
function create(service) {
    return new SignaturesManager_(service);
}

/**
 * Creates a new signatures manager.
 *
 * @param {Service_} service The signature service object.
 * @constructor
 */
function SignaturesManager_(service) {
    this.service_ = service;
}

/**
 * Gets the signature of this user's email address.
 *
 * @param {string} email The user's email address.
 * @return {string|undefined} The user's signature if success or undefined if failure.
 */
SignaturesManager_.prototype.getSignatureByEmail = function (email) {
    var url = this.buildUrl_(email),
        response;

    try {
        response = UrlFetchApp.fetch(url, {
            headers: {
                Authorization: 'Bearer ' + this.service_.getAccessToken()
            }
        });
    } catch (err) {
        Logger.log(err);
        return;
    }

    if (response.getResponseCode() === 200) {
        return this.getFromPayload_(response);
    }

    Logger.log('Response code: ' + response.getResponseCode());
    return;
};

/**
 * Changes the signature of this user's email address.
 *
 * @param {string} email The user's email address.
 * @param {signature} signature The new user's signature.
 * @return {boolean} True if success or false if failure.
 */
SignaturesManager_.prototype.setSignatureByEmail = function (email, signature) {
    var url = this.buildUrl_(email),
        payload = this.createPayload_(signature),
        response;

    try {
        response = UrlFetchApp.fetch(url, {
            method: 'PUT',
            contentType: 'application/atom+xml',
            headers: {
                Authorization: 'Bearer ' + this.service_.getAccessToken()
            },
            payload: payload
        });
    } catch (err) {
        Logger.log(err);
        return;
    }

    if (response.getResponseCode() === 200) {
        return true;
    }

    Logger.log('Response code: ' + response.getResponseCode());
    return false;
};

/**
 * Builds a signature URL with the scope and the user email to makes the get or
 * set requests to the Google's API.
 *
 * @param {string} email The email address.
 * @return {string} The signature URL.
 * @private
 */
SignaturesManager_.prototype.buildUrl_ = function (email) {
    var scope = 'https://apps-apis.google.com/a/feeds/emailsettings/2.0/',
        emailSplitted = email.split('@'),
        username = emailSplitted[0],
        domain = emailSplitted[1];

    return Utilities.formatString('%s%s/%s/signature', scope, domain, username);
};

/**
 * Gets the signature's value from a payload.
 *
 * @param {string} payload The signature's payload.
 * @return {string} The signature's value.
 * @private
 */
SignaturesManager_.prototype.getFromPayload_ = function (payload) {
    var appsNamespace = XmlService.getNamespace('apps', 'http://schemas.google.com/apps/2006'),
        document = XmlService.parse(payload),
        appsElement = document.getRootElement().getChild('property', appsNamespace);

    return appsElement.getAttribute('value').getValue();
};

/**
 * Creates a signature's payload.
 *
 * @param {string} signature The signature's value.
 * @return {string} The signature's payload.
 * @private
 */
SignaturesManager_.prototype.createPayload_ = function (signature) {
    var appsNamespace = XmlService.getNamespace('apps', 'http://schemas.google.com/apps/2006'),
        document = XmlService.parse(
            '<?xml version="1.0" encoding="utf-8"?>' +
            '<atom:entry xmlns:atom="http://www.w3.org/2005/Atom" xmlns:apps="http://schemas.google.com/apps/2006">' +
            '    <apps:property name="signature" value="" />' +
            '</atom:entry>'),
        appsElement = document.getRootElement().getChild('property', appsNamespace);

    appsElement.getAttribute('value').setValue(signature);

    return XmlService.getPrettyFormat().format(document);
};

/**
 * Cant define two namespaces in one the root element
 * Issue: https://code.google.com/p/google-apps-script-issues/issues/detail?id=3119
 *
 * Creates the payload for the get signature function
 *
 * @param {string} signature The signature.
 * @return {string} The signature's payload.
 * @private
 */
/*SignaturesManager_.prototype.createPayload_ = function (signature) {
    var atomNamespace = XmlService.getNamespace('atom', 'http://www.w3.org/2005/Atom'),
        appsNamespace = XmlService.getNamespace('apps', 'http://schemas.google.com/apps/2006'),
        root = XmlService.createElement('atom').setName('entry'),
        apps = XmlService.createElement('apps').setName('property');

    root.setNamespace(atomNamespace);
    root.setNamespace(appsNamespace);

    apps.setAttribute('value', signature);

    root.addContent(apps);

    var document = XmlService.createDocument(root);

    return XmlService.getPrettyFormat().format(document);
};*/
