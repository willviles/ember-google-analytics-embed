import Ember from 'ember';

const { assert, assign, get, inject: { service }, observer, set } = Ember;

export default Ember.Component.extend({

  gaEmbed: service(),

  classNames: ['ga-embed-authorize'],
  classNameBindings: ['gaEmbed.isAuthorized:ga-embed-is-authorized'],

  clientId: null,

  didInsertElement() {

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

  authorizeWithAccessToken() {

    this._authorize({
      'serverAuth': {
        'access_token': get(this, 'accessToken')
      }
    });

    set(this, 'gaEmbed.isAuthorized', true);
    this.sendAction('onSignIn');

  },

  _authorize(params) {
    let authorize = window.gapi.analytics.auth.authorize(params);

    authorize.on('signIn', () => {
      set(this, 'gaEmbed.isAuthorized', true);
      this.sendAction('onSignIn');

    });

    authorize.on('signOut', () => {
      set(this, 'gaEmbed.isAuthorized', false);
      this.sendAction('onSignOut');

    });

    authorize.on('error', (err) => {
      this.sendAction('onError', err);
    });

  },

  hideOnAuthorize: observer('gaEmbed.isAuthorized', function() {
    const isAuthorized = get(this, 'gaEmbed.isAuthorized');
    let display = isAuthorized ? 'none' : 'block';

    Ember.run.next(() => {
      this.$().css({ display });
    });

  })

});
