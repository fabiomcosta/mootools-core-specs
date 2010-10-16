/*
Script: Element.Dimensions.js
	Specs for Element.Dimensions.js

License:
	MIT-style license.
*/

describe('Element.Dimensions', function(){

	var div, relDiv, absDiv, scrollDiv, tallDiv, fixedDiv, fixedDivChild, staticDiv, staticDivChild, table, orphanDiv;

	beforeEach(function(){
		
		/*
			// overview of element structure, please update if anything has changed
			// theres also an orphanDiv
			<document>

				<div absolute>
					<relDiv relative>
						<absDiv absolute>
						</absDiv>
					</relDiv>
				</div>
				
				<scrollDiv absolute>
					<tallDiv></tallDiv>
				</scrollDiv>
				
				<fixedDiv fixed>
					<fixedDivChild></fixedDivChild>
				</fixedDiv>
				
				<table></table>
				
				<staticDiv>
					<staticDivChild absolute></staticDivChild>
				</staticDiv>
				
			</document>
		*/
		
		div = new Element('div', {
			id: 'ElementDimensionsTest',
			styles: {
				width: 100,
				height: 100,
				margin: 2,
				padding: 3,
				border: '1px solid black',
				visibility: 'hidden',
				display: 'block',
				position: 'absolute',
				top: 100,
				left: 100,
				overflow: 'hidden',
				zIndex: 1
			}
		}).inject($(document.body));
		
		relDiv = new Element('div', {
			styles: {
				width: 50,
				height: 50,
				margin: 5,
				padding: 5,
				border: '1px solid green',
				visibility: 'hidden',
				position: 'relative',
				overflow: 'hidden',
				'float': 'left',
				'display': 'inline'
			}
		}).inject(div);
		
		absDiv = new Element('div', {
			styles: {
				width: 10,
				height: 10,
				margin: 5,
				padding: 5,
				border: '1px solid red',
				visibility: 'hidden',
				position: 'absolute',
				top: 10,
				left: 10,
				overflow: 'hidden'
			}
		}).inject(relDiv);
	
		scrollDiv = new Element('div', {
			styles: {
				width: 100,
				height: 100,
				overflow: 'scroll',
				visibility: 'hidden',
				position: 'absolute',
				top: 0,
				left: 0
			}
		}).inject($(document.body));
	
		tallDiv = new Element('div', {
			styles: {
				width: 200,
				height: 200,
				visibility: 'hidden'
			}
		}).inject(scrollDiv);
		
		fixedDiv = new Element('div', {
			styles: {
				width: 200,
				height: 200,
				position: 'fixed',
				top: 300,
				left: 300,
				visibility: 'hidden'
			}
		}).inject($(document.body));
		
		fixedDivChild = new Element('div', {
			styles: {
				width: 50,
				height: 50,
				visibility: 'hidden'
			}
		}).inject(fixedDiv);
		
		staticDiv = new Element('div', {
			styles: {
				width: 50,
				height: 50,
				visibility: 'hidden'
			}
		}).inject($(document.body));
		
		staticDivChild = new Element('div', {
			styles: {
				width: 50,
				height: 50,
				visibility: 'hidden'
			}
		}).inject(staticDiv);

		table = new Element('table').inject($(document.body));
		
		table.set('html','\
			<tbody>\
				<tr>\
					<td><span>a</span><div style="position: relative">b</div></td>\
					<th><span>a</span><div style="position: relative">b</div></th>\
				</tr>\
			</tbody>\
		');
		
		orphanDiv = new Element('div', {
			styles: {
				position: 'absolute',
				top: 0,
				left: 0,
				width: 50,
				height: 50,
				visibility: 'hidden'
			}
		});
		
	});

	afterEach(function(){
		[div, relDiv, absDiv, scrollDiv, tallDiv, fixedDiv, fixedDivChild, staticDiv, staticDivChild, table].each(function(el){
			$(el).destroy();
		});
	});

	describe('Element.getSize', function(){
		
		it('should measure the width and height of the element', function(){
			expect(div.getSize().x).toEqual(108);
			expect(div.getSize().y).toEqual(108);
		});
		
	});
	
	describe('Element.getPosition', function(){
		
		it('should measure the x and y position of the element', function(){
			expect(div.getPosition()).toEqual({x: 102, y: 102});
		});
		
		it('should measure the x and y position of the element relative to another', function(){
			expect(relDiv.getPosition(div)).toEqual({x: 8, y: 8});
		});
		
	});

	describe('Element.getCoordinates', function(){
		
		it('should return the coordinates relative to parent', function(){
			expect(absDiv.getCoordinates(relDiv)).toEqual({left:15, top:15, width:22, height:22, right:37, bottom:37});
		});
		
	});
	
	describe('Element.getScrollSize', function(){
		
		it('should return the scrollSize', function(){
			expect(scrollDiv.getScrollSize()).toEqual({x:200, y:200});
		});
		
	});
	
	describe('Element.scrollTo', function(){
		
		it('should scroll the element', function(){
			expect(scrollDiv.scrollTo(20, 20).getScroll()).toEqual({x:20, y:20});
		});
		
	});
	
	// http://www.w3.org/TR/cssom-view/#offset-attributes
	describe('Element.offsetParent', function(){
		
		it('should return null for the root node, the body, fixed positioned nodes and orphan nodes', function(){
			expect($(document.documentElement).getOffsetParent()).toEqual(null);
			expect($(document.body).getOffsetParent()).toEqual(null);
			expect(fixedDiv.getOffsetParent()).toEqual(null);
			expect(orphanDiv.getOffsetParent()).toEqual(null);
		});
		
		it('should return the body as last option', function(){
			expect(div.getOffsetParent()).toEqual(document.body);
			expect(staticDivChild.getOffsetParent()).toEqual(document.body);
		});
		
		it('should return a table if the element is static and child of a table', function(){
			var tr = table.getElement('tr');
			expect(tr.getOffsetParent()).toEqual(table);
		});
		
		it('should return a td if the element is static and child of a td or the first non-static element if the element is non-static', function(){
			var td = table.getElement('td');
			expect(td.getOffsetParent()).toEqual(table);
			expect(td.getElement('span').getOffsetParent()).toEqual(td);
			expect(td.getElement('div').getOffsetParent()).toEqual(document.body);
		});

		it('should return a th if the element is static and child of a th or the first non-static element if the element is non-static', function(){
			var th = table.getElement('th');
			expect(th.getOffsetParent()).toEqual(table);
			expect(th.getElement('span').getOffsetParent()).toEqual(th);
			expect(th.getElement('div').getOffsetParent()).toEqual(document.body);
		});

	});

});
