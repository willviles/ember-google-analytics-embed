import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('ga-embed-datachart', 'Integration | Component | ga embed datachart', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{ga-embed-datachart}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#ga-embed-datachart}}
      template block text
    {{/ga-embed-datachart}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
