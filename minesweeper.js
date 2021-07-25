// This is the main code, which I have put into a separate file because Github
// The version number is as follows (use dashes instead of dots, and use semver (M.m.b). Don't use letters.
const VERSION = "0-0-0";
// Values which will be replaced by a form or something and are here for testing
var cols = 3;
var rows = 3;
var score = 0;
var time = 0;
var lat = "0";
var lon = "0";
// Getting info from the hyperlink (after the ? but before the &)
var val=document.URL;
function getLinkInfo(key,equals) { // very cheaty way to get info submitted by form (after ?)
	try {
		if (equals) {
			var start;
			start = val.search(key+"=");
			var end;
			end = val.split(key+"=")[1].search("&");
			if (start != -1) {
				var thispos = val.substring(start+key.length+1);
				if (end != -1) {
					thispos = thispos.slice(0,end);
				}
				return thispos;
			} else {
				return undefined;
			}
		} else {
			var start;
			find = val.search("\\?"+key);
			if (find === -1) {
				find = val.search("&"+key);
			}
			if (find === -1) {
				return false;
			} else {
				return true;
			}
		}
	} catch(err) {
		return undefined;
	}
}
// Variables based on above function
var mapID = getLinkInfo("region",true);
// Checking if ABOUT is true
// Getting the correct map from maps.txt
var map = ["","","0","2","0","2","\nooo\nooo\nooo"];
var yes = false;
var textByTR = txt.split(/;\n[^;o0#]/); //txt is the contents of maps.txt... technically.
totalLines = 1;
for (let i = 1; i < textByTR.length; i++) {
	textByTR[i] = txt.split("\n")[totalLines].charAt(0) + textByTR[i];
	totalLines += textByTR[i].split("\n").length;
}
textByTR = textByTR.slice(1)
var textBySub = [];
for (let i = 0; i < textByTR.length; i++) {
	textBySub.push(textByTR[i].split(";\n;"));
}
textBySub = textBySub.slice(0,-1);
var mapList = [];
for (let i = 0; i < textBySub.length; i++) {
	let ml = [];
	for (let j = 0; j < textBySub[i].length; j++) {
		ml.push(textBySub[i][j].split(";"));
	}
	mapList.push(ml);
}
console.log(mapList);

window.onload = function() {
	var canvas = document.getElementById("minesweeper");
	var ctx = canvas.getContext("2d");
	var about = document.getElementById("pre-canvas");
	function draw(src, x, y) {
		var sprite = new Image();
		sprite.src = "sprites/"+src+".png";
		sprite.onload = () => ctx.drawImage(sprite, x, y);
	}
	if (getLinkInfo("version")) {
		canvas.width = 13*VERSION.length
		canvas.height = 23
		ctx.fillStyle = "#000000"
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		about.innerHTML = "<h2>Version:</h2>";
		for (let i = 0; i < VERSION.length; i++) {
			draw("num/"+VERSION[i],1+13*i,1);
		}
	} else if (getLinkInfo("about")) {
		var abt = "<h2>All regions available:</h2>\n<table>\n<tr>\n<th>Region</th>\n<th>Subregion</th>\n</tr>\n"
		for (let i = 0; i < mapList.length; i++) {
			var sub = "<td>";
			abt += "<tr>\n<td>"+mapList[i][0][0]+" ("+mapList[i][0][1]+")</td>\n";
			for (let j = 1; j < mapList[i].length; j++) {
				sub += mapList[i][j][0]+" ("+mapList[i][j][1].split(":")[0]+")";
				if (j != mapList[i].length-1) {
					sub += ", ";
				}
			}
			sub += "</td>\n";
			abt += sub + "</tr>";
		}
		abt += "</table>"
		about.innerHTML = abt;
	} else {
		// Finding which map it is and behaving accordingly
		about.innerHTML = "<h2>Canvas below:</h2>";
		if (mapID) {
			if (mapID.split(":").length > 1) {
				for (let i = 0; i < mapList.length; i++) {
					for (let j = 1; j < mapList[i].length; j++) {
						if (mapList[i][0][0]+":"+mapList[i][j][0] === mapID || mapList[i][0][1]+":"+(mapList[i][j][1].split(":")[0]) === mapID) {
							map = mapList[i][j];
						}
					}
				}
			} else {
				for (let i = 0; i < mapList.length; i++) {
					if (mapList[i][0][0] === mapID || mapList[i][0][1] === mapID) {
						map = mapList[i][0];
					}
				}
			}
		}
		var rowMap = map[6].split("\n").slice(1);
		rows = rowMap.length;
		cols = rowMap[0].length
		if (map[6] === "\nooo\nooo\nooo"){
			alert("The region code is incorrect.");
		}
		// Sorting out the canvas
		canvas.width = 24+16*cols;
		canvas.height = 66+16*rows;
		ctx.fillStyle = "#C0C0C0";
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		
		// Drawing non-main-area to the canvas
		draw("tl",0,0);
		draw("tr",13+16*cols,0);
		draw("bl",0,55+16*rows);
		draw("br",13+16*cols,55+16*rows);
		for (let i = 0; i < cols; i++) {
			draw("t", 13+16*i, 0);
			draw("m", 13+16*i, 44);
			draw("b", 13+16*i, 55+16*rows);
		}
		for (let i = 0; i < rows; i++) {
			draw("l", 0, 55+16*i);
			draw("r", 13+16*cols, 55+16*i);
		}
		// drawing main-area stuff to the canvas (including borders)
		for (let row = 0; row < rows; row++) {
			for (let col = 0; col < cols; col++) {
				if (rowMap[row][col] === "0" || rowMap[row][col] === "#") {
					draw("pressed",13+16*col,55+16*row);
					if (row !== 0 && col !== 0) {
						if ((rowMap[row][col] == "0" && rowMap[row-1][col-1] == "#") || (rowMap[row][col] == "#" && rowMap[row-1][col-1] == "0")) {
							draw("bord/tl",13+16*col,55+16*row);
						}
					}
					if (row !== 0) {
						if ((rowMap[row][col] == "0" && rowMap[row-1][col] == "#") || (rowMap[row][col] == "#" && rowMap[row-1][col] == "0")) {
							draw("bord/t",13+16*col,55+16*row);
						}
					}
					if (col !== 0) {
						if ((rowMap[row][col] == "0" && rowMap[row][col-1] == "#") || (rowMap[row][col] == "#" && rowMap[row][col-1] == "0")) {
							draw("bord/l",13+16*col,55+16*row);
						}
					}
					/*if (row !== 0 && col !== 0) {
						if ((rowMap[row][col] === "0" && rowMap[row-1][col] === "#" && rowMap[row][col-1] === "#") || (rowMap[row][col] === "#" && rowMap[row-1][col] === "0" && rowMap[row][col-1] === "0")) { // top and left
							draw("bord/a",13+16*col,55+16*row);
						}
					} else if (true) { // top
						draw("bord/t",13+16*col,55+16*row);
					} else if (true) { // left
						draw("bord/l",13+16*col,55+16*row);
					} else if (true) { // all 3 corners
						draw("bord/c",13+16*col,55+16*row);
					} else if (true) { // top 2 corners
						draw("bord/tc",13+16*col,55+16*row);
					} else if (true) { // left 2 corners
						draw("bord/lc",13+16*col,55+16*row);*/
				} else {
					draw("unpressed",13+16*col,55+16*row);
				}
			}
		}
		// drawing the top-left & top-right numbers
		function numBlock(num, x, y) {
			draw("numbers",x,y)
			draw("num/"+num[0],x+2,y+2);
			draw("num/"+num[1],x+15,y+2);
			draw("num/"+num[2],x+28,y+2);
		}
		score = String(score).padStart(3, '0');
		numBlock(score,16,16);
		if (time) {
			time = String(time).padStart(3, '0');
			numBlock(time,canvas.width-55,16);
		}
		// numBlock(score,x,y);
		draw("smile",((24+16*cols)/2)-13,15);
	}
};