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
