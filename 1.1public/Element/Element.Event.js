/*
Script: Element.Event.js
	Specs for Element.Event.js

License:
	MIT-style license.
*/

(function(){
	var e;
	window.addEvent('load', function(event) {
		e = new Event(event);
	});
	
	describe('Element.Event', {
		
		'Event target should be the document': function(){
			console.dir(e);
			value_of(e.target).should_be(document);
		},
		
		'Event type should be "load"': function(){
			value_of(e.type).should_be("load");
		},
		
		'Event methods should be present': function(){
			value_of($type(e.preventDefault)).should_be('function');
			value_of($type(e.stop)).should_be('function');
			value_of($type(e.stop)).should_be('function');
		}
		
	});
	

})();