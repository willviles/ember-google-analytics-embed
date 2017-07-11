import Ember from 'ember';

const { assert, get, set } = Ember;

export default Ember.Service.extend(Ember.Evented, {

  initialize() {

    if (typeof FastBoot !== 'undefined') { return; }

    /* jshint ignore:start */
    (function(w,d,s,g,js,fjs){
      g=w.gapi||(w.gapi={});g.analytics={q:[],ready:function(cb){this.q.push(cb)}};
      js=d.createElement(s);fjs=d.getElementsByTagName(s)[0];
      js.src='https://apis.google.com/js/platform.js';
      fjs.parentNode.insertBefore(js,fjs);js.onload=function(){g.load('analytics')};
    }(window,document,'script'));
    /* jshint ignore:end */

    window.gapi.analytics.ready(() => {
      set(this, 'apiReady', true);
      this.trigger('apiReady');
    });

  },

  setAuthorizedUser: Ember.on('apiReady', function() {
    window.gapi.analytics.auth.on('signIn', () => {
      const userData = window.gapi.analytics.auth.getUserProfile();
      set(this, 'authorizedUser', userData);
    });

  }),

  isAuthorized: false,

  _isAuthorized() {
    return this._onApiReady(() => {
      const isAuthorized = window.gapi.analytics.auth.isAuthorized();
      set(this, 'isAuthorized', isAuthorized);
      return isAuthorized;
    });

  },

  signOut() {
    return this._onApiReady(() => {
      return new Ember.RSVP.Promise((resolve) => {
        const auth = window.gapi.analytics.auth;
        auth.signOut();
        auth.on('signOut', () => {
          set(this, 'isAuthorized', false);
          resolve('[ember-google-analytics-embed] Successfully signed out');
        });
      });
    });

  },

  geoApisInitialized: false,

  initializeGeoApis() {

    const apiKey = get(this, 'config.apiKey');

    assert('[ember-google-analytics-embed] No API Key for loading Google Maps APIs set in config/environment.js', apiKey);

    if (!apiKey) { return; }

    /* jshint ignore:start */
    (function(w,d,s,g,js,fjs){
      if (!w.google) { js=d.createElement(s);fjs=d.getElementsByTagName(s)[0];
                       js.src=g;fjs.parentNode.insertBefore(js,fjs); }
    }(window,document,'script',`https://www.google.com/jsapi`));

    (function(w,d,s,m,js,fjs){
      js=d.createElement(s);fjs=d.getElementsByTagName(s)[0];
      js.src=m;fjs.parentNode.insertBefore(js,fjs);
    }(window,document,'script',`https://maps.googleapis.com/maps/api/js?key=${apiKey}`));
    /* jshint ignore:end */

    set(this, 'geoApisInitialized', true);

  },

  getData(query) {

    assert(`[ember-google-analytics-embed] no 'query' passed to getData() ember-google-analytics-embed/services/ga-embed`, query);

    assert(`[ember-google-analytics-embed] no authorized user whilst trying to access getData() ember-google-analytics-embed/services/ga-embed`, this._isAuthorized());

    return new Ember.RSVP.Promise((resolve, reject) => {

      // Buffer to ensure API is ready
      this._onApiReady(() => {
        let request = new window.gapi.analytics.report.Data({ query });
        request.on('success', data => { resolve(data); });
        request.on('error', err => { reject(err); });
        request.execute();
      });

    });

  },

  _onApiReady(callback) {

    if (get(this, 'apiReady')) { return callback(); }

    let defer = Ember.RSVP.defer();

    window.gapi.analytics.ready(() => {
      defer.resolve(callback());
    });

    return defer.promise.then(res => {
      return res;
    });

  }

});
