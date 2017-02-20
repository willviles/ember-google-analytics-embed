import Ember from 'ember';

const { set } = Ember;

export default Ember.Component.extend({

  classNames: ['ga-embed-view-selector'],

  didInsertElement() {
    let viewSelector = new window.gapi.analytics.ViewSelector({
      container: this.elementId
    });

    set(this, 'viewSelector', viewSelector);

    viewSelector.execute();

    viewSelector.on('change', (ids) => {
      set(this, 'ids', ids);
      this.sendAction('onChange', ids);

    });

  }

});
