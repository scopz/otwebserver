const doc = document;

export function createElement(tag, id, parent){
	let element = doc.createElement(tag);
	if (id) {
		if (id.startsWith('#')) element.id = id.substr(1);
		else                    element.className = id;
	}
	if (parent)    parent.appendChild(element);
	return element;
}


export function getElementById(id, parent = doc){
	return parent.getElementById(id);
}

export function querySelectorAll(selector, parent = doc){
	return [...parent.querySelectorAll(selector)];
}

export function querySelector(selector, parent = doc){
	return parent.querySelector(selector);
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

export function generateFromTemplate(id){
	let temp = getElementById(id);
	return temp.content.cloneNode(true);
}

export function ajax(url, params, options = {}) {
	if (params) {
		url = new URL(url, location.origin);

		let method = options.method || 'GET';

		if (method == 'GET') {
			url.search = new URLSearchParams(params).toString();

		} else if (method == 'POST' || method == 'DELETE' || method == 'PUT') {
			options.body = JSON.stringify(params);
			options.headers = {
				'Content-Type': 'application/json; charset=UTF-8' // 'application/x-www-form-urlencoded; charset=UTF-8'
			};
		}
	}

	return fetch(url, options);
}

export function redirectPost(url, data) {
	let form = createElement('form');
	form.action = url;
	form.method = 'POST';
	form.hide();

	for (const [key, value] of Object.entries(data)) {
		let input = createElement('input', false, form);
		input.name = key;
		input.value = value;
		input.type = 'hidden';
	}

	doc.body.appendChild(form);

	form.submit();

}