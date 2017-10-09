import Component from '@ember/component';
import { assert } from '@ember/debug';
import { assign } from '@ember/polyfills';
import { get, observer, set } from '@ember/object';
import { next } from '@ember/runloop';
import { inject as service } from '@ember/service';

export default Component.extend({

  gaEmbed: service(),

  classNames: ['ga-embed-authorize'],
  classNameBindings: ['gaEmbed.isAuthorized:ga-embed-is-authorized'],

  clientId: null,

  didInsertElement() {
    this._super(...arguments);
    get(this, 'gaEmbed')._onApiReady(() => {
      this.authorize();
    });

  },

  authorize() {

    if (get(this, 'accessToken')) { return this.authorizeWithAccessToken(); }

    const clientid = get(this, 'clientId') || get(this, 'gaEmbed.config.clientId');

    assert('[ember-google-analytics-embed] No Google Analytics clientId set in config/environment.js', clientid);

    let params = {
      container: this.elementId,
      clientid
    };

    const apiKey = get(this, 'apiKey') || get(this, 'gaEmbed.config.apiKey');

    if (apiKey) { assign(params, { apiKey }); }

    this._authorize(params);

  },

  onSignIn() {},
  onSignOut() {},
  onError() {},

  authorizeWithAccessToken() {

    this._authorize({
      'serverAuth': {
        'access_token': get(this, 'accessToken')
      }
    });

    set(this, 'gaEmbed.isAuthorized', true);
    get(this, 'onSignIn')();
    get(this, 'onSignOut')();

  },

  _authorize(params) {
    let authorize = window.gapi.analytics.auth.authorize(params);

    authorize.on('signIn', () => {
      set(this, 'gaEmbed.isAuthorized', true);
      get(this, 'onSignIn')();

    });

    authorize.on('signOut', () => {
      set(this, 'gaEmbed.isAuthorized', false);
      get(this, 'onSignOut')();

    });

    authorize.on('error', (err) => {
      get(this, 'onError')(err);
    });

  },

  // eslint-disable-next-line ember/no-observers
  hideOnAuthorize: observer('gaEmbed.isAuthorized', function() {
    const isAuthorized = get(this, 'gaEmbed.isAuthorized');
    let display = isAuthorized ? 'none' : 'block';

    next(() => {
      this.$().css({ display });
    });

  })

});
