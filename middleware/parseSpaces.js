// check for two space characters
function hasSpaces(aString) {
  return /\40\40+/gi.test(aString);   
 }
 /*
// while two spaces replace with markdown char for space
 function createSpaces(string) {
	while (hasSpaces(string)) {
		string = string.replaceAll("  ", "&nbsp; ");
  }
  // chars with no spaces only a problem if &nbsp;&nbsp; word&nbsp; is acceptable
	string = string.replaceAll("&nbsp;&nbsp;", "&nbsp; &nbsp;");
	return string;
} */
function createSpaces(string) {
	while (hasSpaces(string)) {
		string = string.replace(/\40\40/gi, "&nbsp; ");
	}
	string = string.replace(/&nbsp;&nbsp;/gi, "&nbsp; &nbsp;");
	return string;
}


module.exports = createSpaces;