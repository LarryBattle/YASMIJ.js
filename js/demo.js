var view = {
  constraint: {},
	data : {},
	setup : {},
	util : {}
};
view.data.count = 0;
/**
* Create a DOM element.
* @param {String} type - type of element to create
* @param {Object} obj - extends the properties to the DOM element
* @return {DOM Element}
*/
view.util.createElement = function(type, obj){
	obj = obj || {};
	if(obj && typeof obj !== "object"){
		throw new Error("view.util.createElement() requires an object to be passed.");
	}
	var el = document.createElement(type);
	
	for(var prop in obj){
		if(obj.hasOwnProperty(prop)){
			el.setAttribute( prop, obj[prop]);
		}
	}
	return el;
};
/**
* Returns a DOM element by id.
* @param {String} id - id of element
* @return {DOM Element}
*/
view.util.getElement = function(id){
	var el = document.getElementById(id);
	if(!el){
		throw new Error("view.util.getElement() was unable to find element with id == `" + id + "`");
	}
	return el;
};
/**
* Checks if an element is an object or not. Arrays are objects.
* @param {Object}
* @return {Boolean}
*/
view.util.isObject = function(obj){
	return obj && typeof obj === "object";
};
/**
* Checks if an element is Array.
* @param {Array}
* @return {Boolean}
*/
view.util.isArray = function(arr){
	return Object.prototype.toString.call(arr) === "[object Array]";
};
view.util.addElements = function(container, elements){
	if(!view.util.isObject(container) || !view.util.isObject(elements) ){
		throw new Error("view.util.addElements(), An object must be passed for both `container` and `elements`.");
	}
	elements = view.util.isArray(elements) ? elements : [elements];
	for(var i = 0, len = elements.length; i < len; i++){
		container.appendChild(elements[i]);
	}
	return container;
};
view.contraint.add = function(){
	view.data.count++;
	var idName = "constraint_" + view.data.count;
	var container = view.util.getElement("constraintArea");
	view.util.addElements(
		container,
		[
			view.util.createElement("input", {
				"type" : "text",
				"id" : idName
			}),
			view.util.createElement("input", {
				"type" : "button",
				"class" : "deleteConstraint",
				"for" : idName,
				"value" : "Delete"
			}),
			view.util.createElement("br")
		]
	);
};
view.util.addLiveEvent = function(){
	var events = [];
	document.onclick = function(event) {
		for(var i = 0, len = events.length; i < len; i++ ){
			events[i](event);
		}
	};
};
view.logs.addMessage = function(msg){
	var logs = view.util.getElement("constraintArea");
	logs.innerHTML += "\r\n"+msg;
};
view.setup.addEvents = function(){
	
};
view.setup.init = function(){
	view.setup.addEvents();
};
view.setup.init();
