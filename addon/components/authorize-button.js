import Ember from 'ember';

const { assert, get, inject: { service }, set } = Ember;

export default Ember.Component.extend({

  gaEmbed: service(),

  clientId: null,

  didInsertElement() {

    get(this, 'gaEmbed')._onApiReady(() => {
      this.authorize();
    });

  },

  authorize() {
    const clientId = get(this, 'clientId');
    const clientid = clientId || get(this, 'gaEmbed.config.clientId');

    assert('[ember-google-analytics-embed] No Google Analytics clientId set in config/environment.js', clientid);

    let authorize = window.gapi.analytics.auth.authorize({
      container: this.elementId,
      clientid
    });

    authorize.on('success', () => {
      set(this, 'gaEmbed.isAuthorized', true);

    });

  }

});
