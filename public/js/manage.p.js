(function(document,window){
	function getElementById(id){
		return document.getElementById(id);
	}

	function fillRow(el, values) {
		let tds = el.querySelectorAll("td");
		for (let i in values) {
			tds[i].textContent = values[i];
		}
	}

	players.forEach(pl=>{
		let temp = getElementById("pl-row");
		let clon = temp.content.cloneNode(true);

		clon.querySelector("tr").setAttribute("player-id",pl.id);

		fillRow(clon, [
			pl.name,
			pl.vocation,
			pl.level
		]);

		getElementById("pl-tbody").appendChild(clon);
	});


	getElementById("create-char").onclick = ev=>{
		location.pathname += "/create"
	}


})(document,window);