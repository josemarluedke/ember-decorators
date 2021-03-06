import { DEBUG } from '@glimmer/env';

import Component from '@ember/component';
import { layout } from '@ember-decorators/component';

import hbs from 'htmlbars-inline-precompile';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { find } from 'ember-native-dom-helpers';

module('@layout', function(hooks) {
  setupRenderingTest(hooks);

  test('decorator sets layout of component', async function(assert) {
    @layout(hbs`<section class='foo'>Hello, world!</section>`)
    class FooComponent extends Component {}

    this.owner.register('component:foo-component', FooComponent);

    await render(hbs`{{foo-component}}`);
    assert.ok(find('section.foo'));
  });

  if (DEBUG) {
    test('decorator throws an error if given a non-template value', function(assert) {
      assert.throws(
        () => {
          @layout([`{{foo-component}}`])
          class FooComponent extends Component {}

          new FooComponent();
        },
        /The @layout decorator must be provided a template/,
        'error thrown correctly'
      );
    });
    test('decorator throws a specialized error if given a string value', function(assert) {
      assert.throws(
        () => {
          @layout(`{{foo-component}}`)
          class FooComponent extends Component {}

          new FooComponent();
        },
        /use 'htmlbars-inline-precompile'/,
        'error thrown correctly'
      );
    });

    test('decorator throws an error if given more than one value', function(assert) {
      assert.throws(
        () => {
          @layout('foo', 'bar')
          class FooComponent extends Component {}

          new FooComponent();
        },
        /The @layout decorator must be provided exactly one argument/,
        'error thrown correctly'
      );
    });

    test('decorator throws an error if given no values', function(assert) {
      /*
        Note: We cannot test for the following case:

        ```js
        @layout
        class FooComponent extends Component {}
        ```

        @see https://github.com/ember-decorators/ember-decorators/pull/451#issuecomment-508807480
      */

      assert.throws(
        () => {
          @layout()
          class FooComponent extends Component {}

          new FooComponent();
        },
        /The @layout decorator must be provided exactly one argument, received: 0/,
        'error thrown correctly'
      );
    });
  }
});
