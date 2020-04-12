(function(document,window){
	let message = getElementById("message");

	function getElementById(id){
		return document.getElementById(id);
	}

	function setMessage(msg) {
		message.innerHTML = msg;
		message.style.display = "";
	}

	if (!message.innerHTML) {
		message.style.display ="none";
	}

	let form = getElementById("form");
	if (form) form.onsubmit = ev => {
		if (!getElementById("user").value) {
			setMessage("User account must not be empty");

		} else if (!getElementById("email").value) {
			setMessage("Email field must not be empty");

		} else {
			let pass = getElementById("pass");

			if (!pass.value) {
				setMessage("Password field must not be empty");

			} else if (pass.value == getElementById("pass2").value) {
				return true;

			} else {
				setMessage("Passwords doesn't match");
			}
		}
		return false;
	}

	let forml = getElementById("forml");
	if (forml) forml.onsubmit = ev => {
		if (!getElementById("user").value) {
			setMessage("User account must not be empty");

		} else if (!getElementById("pass").value) {
			setMessage("Password field must not be empty");

		} else {
			return true;
		}
		return false;
	}

	let formc = getElementById("formc");
	if (formc) formc.onsubmit = ev => {
		let name = getElementById("name").value;
		if (!name || !name.match(/^[A-Z][a-z]+( [A-Z][a-z]+)?$/) || name.length > 20){
			setMessage("Name must start with capital letters, have less than 20 characters and no more than 2 words");

		} else {
			let sex = getElementById("sex").value;
			if (sex !== "0" && sex !== "1") {
				setMessage("Sex value is invalid");
			} else {
				return true;
			}
		}
		return false;
	}
})(document,window);