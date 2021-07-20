const doc = document;

export function getElementById(id, parent = doc){
	return parent.getElementById(id);
}

export function querySelectorAll(selector, parent = doc){
	return [...parent.querySelectorAll(selector)];
}