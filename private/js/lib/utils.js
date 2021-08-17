const doc = document;

export function createElement(tag, className, parent){
	let element = doc.createElement(tag);
	if (className) element.className = className;
	if (parent)    parent.appendChild(element);
	return element;
}


export function getElementById(id, parent = doc){
	return parent.getElementById(id);
}

export function querySelectorAll(selector, parent = doc){
	return [...parent.querySelectorAll(selector)];
}

export function getElementsByClassName(tags, parent = doc){
	return [...parent.getElementsByClassName(tags)];
}

export function addClass(element, className){
	return element.addClass(className);
}

export function removeClass(element, className){
	return element.removeClass(className);
}

export function toggleClass(element, className){
	return element.toggleClass(className);
}