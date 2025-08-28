
// Generic
function getAge(form) {
	var formData = new FormData(form);
	let age = Object.fromEntries(formData)["inputAge"];

	// console.log(Object.fromEntries(formData));
	// console.log(JSON.stringify(Object.fromEntries(formData), null, 1));

	let msg;
	switch (true) {
		case age < 18:
			msg = "You are underaged! Get out...";
			break;
		case age < 65:
			msg = "You are an Adult!";
			break;
		case age < 85:
			msg = "You are a Senior!";
			break;
		default:
			msg = "You are in your Golden Years! :>"
			break;
	}
	document.getElementById("ageForm").innerHTML += msg;
}

document.getElementById("ageForm").addEventListener("submit", function (e) {
	e.preventDefault();
	getAge(e.target);
});