import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('ga-embed-authorize', 'Integration | Component | ga embed authorize', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{ga-embed-authorize}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#ga-embed-authorize}}
      template block text
    {{/ga-embed-authorize}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
