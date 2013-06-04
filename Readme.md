# autocomplete
Extremely versatile autocomplete component heavily relying on component/emitter.

## Introduction
This component does not deal with any ajax or templates leaving you the ability to define that as you please.

AutoComplete will assign keyup and keydown events to a textbox you specify, and will fire event emitters at certain times, allowing you to hook in and have huge control over it.

Please note: The documentation is not complete as of yet. Please take a look at the code to see how it works fully.


## Installation

    $ component install nickjackson/autocomplete

## API

### AutoComplete(input)
initialise a new AutoComplete.

### .on('query', callback)
This is fired on a keydown event that is not a up, down, escape or an return key. The callback accepts the following two arguments:

* `query` - the string that has been searched for
* `fn` - upon a successful search, call the callback with an array of search results

	
		.on('query', function(query, fn){
			var results = [{name:'Foo'}];
			fn(results);
		})


### .on('template', callback)
Use this to render a template. This will be fired for each result specified in the above `query` callback. The callback for this emitter accepts the following 

* `result` - the current result object that is being iterated.
* `query` - the string that has been searched for.
* `fn` - call this callback along with a single argument: the stringified representation of the DOM you would like to display for this current item.

		.on('template', function(result, query, fn){
			var str = '<div>' + result.name + '</div>';
			fn(str);
		})

### .on('rendered', callback)
This will be emitted when all templates are rendered. The callback accepts the following argument.

* `resultsContainer` - the container holding all the rendered templates.


### .on('selected', callback)
This will fire if a user uses the arrow keys or mouses over particular result. The callback accepts:

* `result` - the current item that is selected.


## License

  MIT
