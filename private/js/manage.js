import { getElementById, querySelectorAll } from './lib/utils';

function fillRow(el, values) {
	querySelectorAll('td', el)
		.filter((td, i) => values[i])
		.forEach((td, i) => td.textContent = values[i])
}

players.forEach(pl=>{
	let temp = getElementById('pl-row');
	let clone = temp.content.cloneNode(true);

	clone.querySelector('tr').setAttribute('player-id',pl.id);

	fillRow(clone, [
		pl.name,
		pl.vocation,
		pl.level
	]);

	getElementById('pl-tbody').appendChild(clone);
});


getElementById('create-char').onclick = ev => location.pathname += '/create';