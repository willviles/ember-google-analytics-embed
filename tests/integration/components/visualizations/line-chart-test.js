import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('visualizations/line-chart', 'Integration | Component | visualizations/line chart', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{visualizations/line-chart}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#visualizations/line-chart}}
      template block text
    {{/visualizations/line-chart}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
