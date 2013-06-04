var Emitter = require('emitter');

/**
 * Expose `AutoComplete`
 */

module.exports = AutoComplete;


/**
 * Initialize a new AutoComplete by specifying
 * `view` Element.
 *
 * @params {Element} input
 * @returns {Self}
 * @api public
 */

function AutoComplete(input){
  if (!(this instanceof AutoComplete)) return new AutoComplete(input);
  this.input = input;

  input.onkeyup = this.emit.bind(this, 'keyup');
  input.onkeydown = this.emit.bind(this, 'keydown');
  input.onfocus = this.emit.bind(this, 'focus');
  input.onblur = this.emit.bind(this, 'blur');

  this.setupQuery();
  this.setupNavigation();
}


/**
 * Inherit from Emitter
 */

Emitter(AutoComplete.prototype);



/**
 * Sets up the events on input elements
 *
 * @returns {Self}
 * @api private
 */


AutoComplete.prototype.setupQuery = function(){
  var self = this
    , input = this.input;

  this.on('keyup', function(e){
    if (e.keyCode == 40 ||
        e.keyCode == 38 ||
        e.keyCode == 27 ||
        e.keyCode == 13) {

      e.preventDefault();
      return false;
    }

    self.query = {
      text: input.value,
      results: []
    }

    self.emit('query', input.value, self.handleQuery.bind(self));
  })

  return this;
}



AutoComplete.prototype.setupNavigation = function(){
  var self = this
    , input = this.input;

  this.on('keydown', function(e){
    if (e.keyCode == 40) {
      e.preventDefault();
      self.emit('nav down');
      return false;
    }

    if (e.keyCode == 38) {
      e.preventDefault();
      self.emit('nav up');
      return false;
    }

    if (e.keyCode == 27) {
      e.preventDefault();
      self.emit('escape');
      return false;
    }

    if (e.keyCode == 13) {
      e.preventDefault();
      self.emit('enter');
      return false;
    }
  });

  this.on('nav down', function(){
    var query = self.query;
    if (!query) return;

    var selected = query.selected
      , results = query.results;

    if (!selected) {
      if (results[0]) select.call(self, results[0]);
      return;
    }

    select.call(self, selected.next);
  })

  this.on('nav up', function(){
    var query = self.query;
    if (!query) return;

    var selected = query.selected
      , results = query.results
      , count = results.length;

    if (!selected) {
      var last = results[count - 1];
      if (last) select.call(self, last);
      return;
    }

    select.call(self, selected.prev);
  })
}


/**
 * This is used to build the dropdown
 * with an `Array` of `results`.
 *
 * @params {Array} results
 * @returns {Self}
 * @api public
 */

AutoComplete.prototype.handleQuery = function(results){
  var self = this
    , container = document.createElement('ul')
    , query = this.query
    , nested = []
    , results = results || [];

  results.forEach(function(result){
    nested.push({data:result});
  })

  query.results = nested;

  nested.forEach(function(result, i){
    self.emit('template', result.data, query, function(html){
      var li = document.createElement('li');
      li.innerHTML = html;
      container.appendChild(li);
      result.el = li;
    })

    result.index = i;
    result.prev = previous(nested, i);
    result.next = next(nested, i);
    result.select = select.bind(self, nested[i]);
  })

  this.emit('rendered', container);
}



function next(results, index){
  if (index == (results.length - 1)) {
    return;
  }
  var _next = results[index + 1];
  if (_next) return _next;

}


function previous(results, index){
  if (index == 0) return;

  var _prev = results[index - 1];
  if (_prev) return _prev;
}


function select(item) {
  this.query.selected = item;
  this.emit('selected', item);
}