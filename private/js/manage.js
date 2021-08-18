import { getElementById, querySelector, querySelectorAll, generateFromTemplate, ajax, createElement } from './lib/utils';

export function initManage() {
	players.forEach(pl=>{
		let clone = generateFromTemplate('pl-row');
		
		querySelector('tr', clone).playerId = pl.id;
		querySelector('.del button', clone).onclick = ev => clickDelete(ev, pl.id);
		querySelector('.del button', clone).oncontextmenu = ev => confirmDelete(ev, pl.id);

		fillRow(clone, [
			pl.name,
			pl.vocation,
			pl.level
		]);

		getElementById('pl-tbody').appendChild(clone);
	});

	getElementById('create-char').onclick = ev => location.pathname += '/create';
	getElementById('create-char').onclick = ev => location.pathname += '/create';
	window.players = [];
}

let deleteConfirmation = -1;
let tooltip, tooltipTimeout;
function cleanToolTip() {
	if (tooltip) {
		tooltip.style.height = 
		tooltip.style.paddingTop =
		tooltip.style.paddingBottom = 0;
		setTimeout(tooltip.remove.bind(tooltip), 200)
		clearTimeout(tooltipTimeout);
		tooltipTimeout = tooltip = undefined;
	}
}
function confirmDelete(ev, id) {
	if (deleteConfirmation == id) {
		cleanToolTip();
		callDeleteChar(id);
		return false;
	}
}
function clickDelete(ev, id) {
	function px(value) {
		return parseInt(value)+'px';
	}

	cleanToolTip();
	tooltip = createElement('div', '#tooltip', document.body);
	tooltip.innerHTML = 'Are you sure you want to remove this character?<br/>Right click to confirm';

	let rect = ev.target.getBoundingClientRect();
	tooltip.style.left = px(rect.left-(tooltip.offsetWidth-rect.width)/2+1);
	tooltip.style.top = px(rect.bottom);
	tooltip.style.height = px(tooltip.offsetHeight-4);

	deleteConfirmation = id;
	tooltipTimeout = setTimeout(_=>{
		deleteConfirmation = -1;
		cleanToolTip();
	}, 1500)
}

function callDeleteChar(id) {
	let pathname = location.pathname.replace(/\/+$/,'');
	ajax(pathname+'/delete', {id: id}, {method: 'POST'})
		.then(response => response.json())
		.then(json => {
			if (!json.success) {
				getElementById('message').textContent = json.msg;
			} else {
				querySelectorAll('tr')
					.find(tr => tr.playerId == id)
					.remove();
			}
		});
}

function fillRow(element, values) {
	querySelectorAll('td', element)
		.filter((td, i) => values[i])
		.forEach((td, i) => td.textContent = values[i])
}

initManage();