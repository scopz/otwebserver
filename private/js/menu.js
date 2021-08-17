import { createElement, getElementsByClassName, addClass, toggleClass } from './lib/utils';

function initMenu() {
	getElementsByClassName('section').forEach(section => {
		let [head] = getElementsByClassName('head', section);
		let [links] = getElementsByClassName('links', section);

		head.onChangeClass(menuClassChanged);
		head.onclick = () => toggleClass(head, "hide");
		headStyling(head);
		head.links = links;
		links._hei = links.offsetHeight+'px';

		let selected = [...links.children]
			.filter(a => location.href.indexOf(a.href) == 0)
			.peek(a => addClass(a, "selected"))
			.length > 0;

		if (!selected) addClass(head, "hide");
		else           links.style.height = links._hei;
	});
}

function menuClassChanged(element, className, added) {
	if (className == "hide"){
		let {links} = element;
		links.style.height = added? 0 : links._hei;
		element._hid = added;
	}
}

function headStyling(head){
	let text = head.textContent;
	head.clear();

	createElement('span', 'bg-animation', head);
	createElement('span', 'title', head).textContent = text;
}


initMenu();