import Component from '@ember/component';
import { get, set } from '@ember/object';

export default Component.extend({

  classNames: ['ga-embed-view-selector'],

  onChange() {},

  didInsertElement() {
    let viewSelector = new window.gapi.analytics.ViewSelector({
      container: this.elementId
    });

    set(this, 'viewSelector', viewSelector);

    viewSelector.execute();

    viewSelector.on('change', (ids) => {
      set(this, 'ids', ids);
      get(this, 'onChange')(ids);
    });

  }

});
