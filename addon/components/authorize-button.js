import Ember from 'ember';

const { assert, get, inject: { service }, observer, set } = Ember;

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

  },

  hideOnAuthorize: observer('gaEmbed.isAuthorized', function() {
    const isAuthorized = get(this, 'gaEmbed.isAuthorized');
    let display = isAuthorized ? 'none' : 'block';

    Ember.run.next(() => {
      this.$().css({ display });
    });

  })

});
