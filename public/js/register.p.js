(function(document,window){
	'use strict';

	var message = document.getElementById("message");
	if (!message.innerHTML) {
		message.style.display ="none";
	}

	var form = document.getElementById("form");
	form.onsubmit = function(ev) {
		if (!document.getElementById("user").value) {
			message.innerHTML = "User account must not be empty";
			message.style.display = "";

		} else if (!document.getElementById("email").value) {
			message.innerHTML = "Email field must not be empty";
			message.style.display = "";

		} else {
			var pass = document.getElementById("pass");

			if (!pass.value) {
				message.innerHTML = "Password field must not be empty";
				message.style.display = "";

			} else if (pass.value == document.getElementById("pass2").value) {
				return true;

			} else {
				message.innerHTML = "Passwords doesn't match";
				message.style.display = "";
			}
		}
		return false;
	}
})(document,window);