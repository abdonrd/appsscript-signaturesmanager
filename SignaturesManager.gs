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
