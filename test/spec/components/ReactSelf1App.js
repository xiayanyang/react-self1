'use strict';

describe('Main', function () {
  var React = require('react/addons');
  var ReactSelf1App, component;

  beforeEach(function () {
    var container = document.createElement('div');
    container.id = 'content';
    document.body.appendChild(container);

    ReactSelf1App = require('components/ReactSelf1App.js');
    component = React.createElement(ReactSelf1App);
  });

  it('should create a new instance of ReactSelf1App', function () {
    expect(component).toBeDefined();
  });
});
