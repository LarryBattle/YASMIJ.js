/**
* Singleton
*/
var Funcs = {
	constraint: {},
	data : {
		liveEvents : []
	},
	log : {},
	setup : {},
	util : {},
	view : {}
};
Funcs.data.count = 0;
/**
* Create a DOM element.
* @param {String} type - type of element to create
* @param {Object} obj - extends the properties to the DOM element
* @return {DOM Element}
*/
Funcs.util.createElement = function(type, obj){
	obj = obj || {};
	if(obj && typeof obj !== "object"){
		throw new Error("Funcs.util.createElement() requires an object to be passed.");
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
* Checks if an element is an object or not. Arrays are objects.
* @param {Object}
* @return {Boolean}
*/
Funcs.util.isObject = function(obj){
	return obj && typeof obj === "object";
};

/**
* Returns a DOM element by id.
* @param {String} id - id of element
* @return {DOM Element}
*/
Funcs.view.getElement = function(id){
	var el = document.getElementById(id);
	if(!el){
		throw new Error("Funcs.view.getElement() was unable to find element with id == `" + id + "`");
	}
	return el;
};
/**
* Checks if an element is Array.
* @param {Array}
* @return {Boolean}
*/
Funcs.util.isArray = function(arr){
	return Object.prototype.toString.call(arr) === "[object Array]";
};
/**
* Adds array of DOM elements to a parent
* @param {DOM Element} container
* @param {Array} elements - array of DOM elements
* @return {DOM Element}
*/
Funcs.util.addElements = function(container, elements){
	if(!Funcs.util.isObject(container) || !Funcs.util.isObject(elements) ){
		throw new Error("Funcs.util.addElements(), An object must be passed for both `container` and `elements`.");
	}
	elements = Funcs.util.isArray(elements) ? elements : [elements];
	for(var i = 0, len = elements.length; i < len; i++){
		container.appendChild(elements[i]);
	}
	return container;
};
// add new constraint block
Funcs.view.addConstraintBlock = function(){
	Funcs.data.count++;
	var idName = "constraint_" + Funcs.data.count;
	var container = Funcs.view.getElement("constraintArea");
	var constraintBlock = Funcs.view.createElement("div", {
		"id" : "div_"+idName
	});
	
	Funcs.util.addElements(
		container,
		[
			Funcs.util.createElement("input", {
				"type" : "text",
				"id" : "input_" + idName
			}),
			Funcs.util.createElement("input", {
				"type" : "button",
				"class" : "deleteConstraint",
				"for" : "delete_"+idName,
				"value" : "Delete"
			}),
			Funcs.util.createElement("br")
		]	
	);
};
// add events to document.onclick()
Funcs.view.addLiveEvent = function(fn){
	if(typeof fn !== "function" ){
		return;
	}
	var events = Funcs.data.liveEvents;
	events.push(fn);
	document.onclick = function(event) {
		console.log(event);
		console.log(events);
		return;
		for(var i = 0, len = events.length; i < len; i++ ){
			events[i](event);
		}
	};
};
// add message to the log
Funcs.log.addMessage = function(msg){
	var logs = Funcs.view.getElement("constraintArea");
	logs.innerHTML += "\r\n"+msg;
};
// setup all the events
Funcs.setup.addEvents = function(){
	Funcs.view.addLiveEvent(function(e){
		if(!e || !e.target || e.target.className !== "" ){
			return;
		}
		var el = e.target;
		var id = "#" + el["for"];
		Funcs.view.getElement("constraintArea").removeChild(
			Funcs.view.getElement(id)
		);
	});
	Funcs.view.getElement("addConstraint").onclick = function(){
		Funcs.view.addConstraintBlock(); 
	};
};
// Startup function
Funcs.setup.init = function(){
	Funcs.setup.addEvents();
};
Funcs.setup.init();
