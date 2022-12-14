'use strict';

if (document.getElementById("count")) {
	const countHeader = document.getElementById("count");
	const incrementBtn = document.querySelector('.incrementBtn');
	const decrementBtn = document.querySelector('.decrementBtn');
	const resetBtn = document.querySelector('.resetBtn');
	countHeader.textContent = localStorage.getItem("Increment");

	incrementBtn.addEventListener('click', function() {
		countHeader.textContent = (+countHeader.textContent + 1);
		localStorage.setItem("Increment", countHeader.textContent);
	});

	decrementBtn.addEventListener('click', function() {
		countHeader.textContent = (+countHeader.textContent - 1);
		localStorage.setItem("Increment", countHeader.textContent);
	});

	resetBtn.addEventListener('click', function(){
		if (countHeader.textContent == '0') {
			return;
		}


		if (confirm("Are you sure you want to reset the counter?")) {
			countHeader.textContent = '0';
		}
		localStorage.setItem("Increment", countHeader.textContent);
	});
}



if (document.getElementById("todolist")) {
	const inputBox = document.getElementById('inputText');
	const submitBtn = document.querySelector('.submitBtn');
	const ul = document.getElementById('ul');

	inputBox.addEventListener("keypress", function(){
		if (event.key === 'Enter'){
			event.preventDefault();
			submitBtn.click();
		}
	});


	submitBtn.addEventListener('click', function() {
		const container = document.createElement("div");
		const li = document.createElement("li");
		const a = document.createElement("a");
		const xButton = document.createElement("button");
		const br = document.createElement("br");

		let inputText = document.getElementById('inputText').value;
		xButton.classList.add("xbutton");
		container.classList.add("liContainer");
		container.href = "#";

		xButton.addEventListener('click', function() {
			container.remove();
			br.remove();
		});

		container.onclick = function() {
			if (a.style.textDecoration == "line-through") {
				a.style.textDecoration = "none";
			} else {
				a.style.textDecoration = "line-through";
			}
		};

		if (inputText.replace(/\s/g, '')) {
			let t = document.createTextNode(inputText);
			container.appendChild(xButton);
			ul.appendChild(container);
			ul.appendChild(br);
			container.appendChild(li);
			li.appendChild(a);
			a.appendChild(t);

			document.getElementById('inputText').value = '';
		}
	});
}



/*
Bees will cost a base cost according to the stage of the game, cost will increase multiplicitavely for each bee buyd
Upgrade costs will increase by a flat amount according to how much income the player increases by?

*/
	
if (document.getElementById("pollinationsimulation")) {

	const bee0upgrades = [1, 2, 4, 8, 16]; //multipliers per upgrade
	const bee1upgrades = [1, 2, 4, 8, 16];
	let beeCounts = [0, 0, 0, 0, 0];
	let beeCosts = [1, 0, 0, 0, 0];
	let upgradeStatus = [0, 0, 0, 0, 0]; //index = which bee, number = which upgrade
	let flowerUpgradeStatus = 0;
	let flowerUpgradePath = 0; // 1 = slow, 2 = fast

	let income = 0;

	incomeOverTime();

	let beeUpgrades = {
	bee0_0: "Flies will now generate 2x pollen per fly", bee0_0cost: 3000,
	bee0_1: "Flies will now generate 4x pollen per fly", bee0_1cost: 10000,
	bee0_2: "Flies will now generate 8x pollen per fly", bee0_2cost: 15000,
	bee0_3: "No more upgrades!", bee0_3cost: Infinity,

	bee1_0: "Moths will now generate 2x pollen per moth", bee1_0cost: 500000,
	bee1_1: "Moths will now generate 4x pollen per moth", bee1_1cost: 1000000,
	bee1_2: "Moths will now generate 8x pollen per moth", bee1_2cost: 5000000,
	bee1_3: "No more upgrades!", bee1_3cost: Infinity,
	};

	//page loaders

	//checking which upgrade for flowers
	if (!localStorage.getItem("flowerUpgradeStatus")) {
		localStorage.setItem("flowerUpgradeStatus", 0);
	}

	else {
		flowerUpgradeStatus = localStorage.getItem("flowerUpgradeStatus");

		if (flowerUpgradeStatus == 0) {
			document.getElementById("initialFlowerUpgradeContainer").style.zIndex = 4;
			document.getElementById("slowFlowerImg").style.zIndex = 5;
			document.getElementById("fastFlowerImg").style.zIndex = 5;
		}
	}

	//checking which flower upgrade they chose
	if (flowerUpgradeStatus > 0) {
		document.getElementById("initialFlowerUpgradeContainer").style.visibility = "hidden";
	}

	//checking which tab the user left off with
	if (localStorage.getItem("whichUpgradeTab")) {
		if (localStorage.getItem("whichUpgradeTab") == 0) {
			document.getElementById("beeUpgradeContainer").style.zIndex = 4;
		}
		else if (localStorage.getItem("whichUpgradeTab") == 1) {
			document.getElementById("flowerUpgradeContainer").style.zIndex = 4;
		}
		else if (localStorage.getItem("whichUpgradeTab") == 2) {
			document.getElementById("clickerUpgradeContainer").style.zIndex = 4;
		}
	}

	// loading each bug's upgrade status/count, loading income as well
	for (let i = 0; i <= 1; i++) {
		if (!localStorage.getItem("bee" + i + "UpgradeStatus")) {
			localStorage.setItem("bee" + i + "UpgradeStatus", 0);
		}

		if (localStorage.getItem("bee" + i + "UpgradeStatus")) {
			upgradeStatus[i] = +localStorage.getItem("bee" + i + "UpgradeStatus");
			document.getElementById("bee" + i + "UpgradeText").textContent = beeUpgrades["bee" + i + "_" + upgradeStatus[i]];
			document.getElementById("bee" + i + "UpgradeCost").textContent = "$" + beeUpgrades["bee" + i + "_" + upgradeStatus[i] + "cost"];

			if (localStorage.getItem("bee" + i + "UpgradeStatus") == 3) {
				document.getElementById("bee" + i + "UpgradeCost").style.visibility = "hidden";
			}
		}

		if (localStorage.getItem("bee" + i + "Count")) {
			beeCounts[i] = localStorage.getItem("bee" + i + "Count");
			document.getElementById("bee" + i + "count").textContent = beeCounts[i];
			console.log("i = ", i, " ", beeCounts[i]);
			income = setIncome();

			if (i == 0) {
				beeCosts[i] = getCostFormula(i);
				document.getElementById("bee" + i + "Tooltip").textContent = "buy fly for " + reduceNumber(beeCosts[i]) + " pollen";
				document.getElementById("bee0Income").textContent = (Math.trunc((beeCounts[0] * 2 * bee0upgrades[upgradeStatus[0]]) * .8) * 1.5) + " pollen/sec"
			}

			else if (i == 1) {
				beeCosts[i] = getCostFormula(i);
				document.getElementById("bee" + i + "Tooltip").textContent = "buy bee for " + reduceNumber(beeCosts[i]) + " pollen";
				document.getElementById("bee1Income").textContent = (Math.trunc(((beeCounts[1] * 100 * bee0upgrades[upgradeStatus[1]]) * .8) * 1.5)) + " pollen/sec"
			}
		}
	}

	//loading pollen count from localstorage
	if (localStorage.getItem("pollenCount")) {
		document.getElementById("pollenCount").textContent = reduceNumber((+localStorage.getItem("pollenCount")));
	}

	document.getElementById("flowerImg").onclick = function () {
		localStorage.setItem("pollenCount", +localStorage.getItem("pollenCount") + 200);
		document.getElementById("pollenCount").textContent = reduceNumber((+localStorage.getItem("pollenCount")));
	}



	document.getElementById("bee0").onclick = function () {
		beeCosts[0] = getCostFormula(0);

		if (localStorage.getItem("pollenCount") > beeCosts[0]) {
			localStorage.setItem("pollenCount", localStorage.getItem("pollenCount") - beeCosts[0]);

			beeCounts[0] = +beeCounts[0] + 1;
			localStorage.setItem("bee0Count", beeCounts[0]);
			document.getElementById("bee0count").textContent = beeCounts[0];
			income = setIncome();
			document.getElementById("bee0Tooltip").textContent = "buy fly for " + reduceNumber((getCostFormula(0))) + " pollen";
			document.getElementById("pollenCount").textContent = reduceNumber((+localStorage.getItem("pollenCount")));
			document.getElementById("bee0Income").textContent = (Math.trunc((beeCounts[0] * 2 * bee0upgrades[upgradeStatus[0]]) * .8) * 1.5) + " pollen/sec"
		}
	}

	document.getElementById("bee1").onclick = function () {
		beeCosts[1] = getCostFormula(1);

		if (localStorage.getItem("pollenCount") > beeCosts[1]) {
			localStorage.setItem("pollenCount", localStorage.getItem("pollenCount") - beeCosts[1]);

			beeCounts[1] = +beeCounts[1] + 1;
			localStorage.setItem("bee1Count", beeCounts[1]);
			document.getElementById("bee1count").textContent = beeCounts[1];
			income = setIncome(income, 1);
			document.getElementById("bee1Tooltip").textContent = "buy bee for " + reduceNumber((getCostFormula(1))) + " pollen";
			document.getElementById("pollenCount").textContent = reduceNumber((+localStorage.getItem("pollenCount")));
			document.getElementById("bee1Income").textContent = (Math.trunc(((beeCounts[1] * 100 * bee0upgrades[upgradeStatus[1]]) * .8) * 1.5)) + " pollen/sec"
		}
	}

	document.getElementById("bee0UpgradeContainer").onclick = function () {
		//checking if user has enough pollen
		if (localStorage.getItem("pollenCount") >= beeUpgrades["bee0_" + upgradeStatus[0] + "cost"]) {
			localStorage.setItem("pollenCount", localStorage.getItem("pollenCount") - beeUpgrades["bee0_" + upgradeStatus[0] + "cost"])  

			upgradeStatus[0] = upgradeStatus[0] + 1;

			income = setIncome();

			localStorage.setItem("bee0UpgradeStatus", upgradeStatus[0])
			document.getElementById("bee0UpgradeText").textContent = beeUpgrades["bee0_" + upgradeStatus[0]];
			document.getElementById("bee0UpgradeCost").textContent = "$" + beeUpgrades["bee0_" + upgradeStatus[0] + "cost"];

			document.getElementById("pollenCount").textContent = reduceNumber((+localStorage.getItem("pollenCount")));
			document.getElementById("bee0Income").textContent = (Math.trunc((beeCounts[0] * 2 * bee0upgrades[upgradeStatus[0]]) * .8) * 1.5) + " pollen/sec"

			if (localStorage.getItem("bee" + 0 + "UpgradeStatus") == 3) {
				document.getElementById("bee" + 0 + "UpgradeCost").style.visibility = "hidden";
			}
		}
	}

	document.getElementById("bee1UpgradeContainer").onclick = function () {
		//checking if user has enough pollen
		if (localStorage.getItem("pollenCount") >= beeUpgrades["bee1_" + upgradeStatus[1] + "cost"]) {
			localStorage.setItem("pollenCount", localStorage.getItem("pollenCount") - beeUpgrades["bee1_" + upgradeStatus[1] + "cost"])  

			upgradeStatus[1] = upgradeStatus[1] + 1;

			income = setIncome();

			localStorage.setItem("bee1UpgradeStatus", upgradeStatus[1])
			document.getElementById("bee1UpgradeText").textContent = beeUpgrades["bee1_" + upgradeStatus[1]];
			document.getElementById("bee1UpgradeCost").textContent = "$" + beeUpgrades["bee1_" + upgradeStatus[1] + "cost"];
			
			document.getElementById("pollenCount").textContent = reduceNumber((+localStorage.getItem("pollenCount")));
			document.getElementById("bee1Income").textContent = (Math.trunc(((beeCounts[1] * 100 * bee0upgrades[upgradeStatus[1]]) * .8) * 1.5)) + " pollen/sec"
		
			if (localStorage.getItem("bee" + 1 + "UpgradeStatus") == 3) {
				document.getElementById("bee" + 1 + "UpgradeCost").style.visibility = "hidden";
			}
		}
	}

	document.getElementById("slowFlowerImg").onclick = function () {
		flowerUpgradePath = 0;
		document.getElementById("initialFlowerUpgradeContainer").style.visibility = "hidden";
		localStorage.setItem("flowerUpgradeStatus", 1);
		flowerUpgradeStatus = 1;
		localStorage.setItem("flowerUpgradePath", 2);
	}

	document.getElementById("fastFlowerImg").onclick = function () {
		flowerUpgradePath = 2;
		document.getElementById("initialFlowerUpgradeContainer").style.visibility = "hidden";
		localStorage.setItem("flowerUpgradeStatus", 1);
		flowerUpgradeStatus = 1;
		localStorage.setItem("flowerUpgradePath", 2);
	}

	document.getElementById("beeTab").onclick = function () {
		localStorage.setItem("whichUpgradeTab", 0);
		document.getElementById("flowerUpgradeContainer").style.zIndex = 2;
		document.getElementById("beeUpgradeContainer").style.zIndex = 3;
		document.getElementById("clickerUpgradeContainer").style.zIndex = 2;
	}

	document.getElementById("flowerTab").onclick = function () {
		localStorage.setItem("whichUpgradeTab", 1);
		if (flowerUpgradeStatus == 0) {
			document.getElementById("initialFlowerUpgradeContainer").style.zIndex = 4;
		}
		document.getElementById("flowerUpgradeContainer").style.zIndex = 3;
		document.getElementById("beeUpgradeContainer").style.zIndex = 2;
		document.getElementById("clickerUpgradeContainer").style.zIndex = 2;
	}

	document.getElementById("clickerTab").onclick = function () {
		localStorage.setItem("whichUpgradeTab", 2);
		document.getElementById("flowerUpgradeContainer").style.zIndex = 2;
		document.getElementById("beeUpgradeContainer").style.zIndex = 2;
		document.getElementById("clickerUpgradeContainer").style.zIndex = 3;
	}

	function getCostFormula(i) {
		if (i == 0) {
			return (+beeCounts[0] + 1) ** 2;
		}

		if (i == 1) {
			return (200000 + ((+beeCounts[1] * 20) ** 2));
		}
	}

	function setIncome() {
		income = 0;

		for (let i = 0; i <= 1; i++) {
			if (i == 0) {
				income += Math.trunc((beeCounts[i] * 2 * bee0upgrades[upgradeStatus[0]]) * .8);
			}

			else if (i == 1) {
				income += Math.trunc((beeCounts[i] * 100 * bee0upgrades[upgradeStatus[1]]) * .8)
			}
		}
		return income;
	}

	function incomeOverTime() {
		let currpollen = +localStorage.getItem("pollenCount");
		document.getElementById("pollenCount").textContent = reduceNumber(currpollen + income);
		localStorage.setItem("pollenCount", currpollen + income);
		document.getElementById("totalIncome").textContent = reduceNumber(Math.trunc(income * 1.5)) + " pollen/sec";
		setTimeout(incomeOverTime, 400);

		if (localStorage.getItem("pollenCount") >= getCostFormula(0)) {
			document.getElementById("bee0").style.opacity = "100%";
		}

		else {
			document.getElementById("bee0").style.opacity = "35%";
		}

		if (localStorage.getItem("pollenCount") >= getCostFormula(1)) {
			document.getElementById("bee1").style.opacity = "100%";
		}

		else {
			document.getElementById("bee1").style.opacity = "35%";
		}
	}

	function reduceNumber(number) {
		number = number.toString();
		let numberLength = number.toString().length;

		//above hundred trillion
		if (numberLength >= 16) {
				return(((+number).toExponential(3)));
			}

		//trillions
		else if (numberLength >= 13) {

			if (numberLength == 13) {
				return(parseFloat(number.slice(0,1) + "." + number.slice(1,4)) + "t");
			}

			else if (numberLength == 14) {
				return(parseFloat(number.slice(0,2) + "." + number.slice(2,5))+ "t");
			}

			else if (numberLength == 15) {
				return(parseFloat(number.slice(0,3) + "." + number.slice(3,6))+ "t");
			}
		}

		//billions
		else if (numberLength >= 10) {

			if (numberLength == 10) {
				return(parseFloat(number.slice(0,1) + "." + number.slice(1,4))+ "b");
			}

			else if (numberLength == 11) {
				return(parseFloat(number.slice(0,2) + "." + number.slice(2,5))+ "b");
			}

			else if (numberLength == 12) {
				return(parseFloat(number.slice(0,3) + "." + number.slice(3,6))+ "b");
			}
		}

		//millions
		else if (numberLength >= 7) {

			if (numberLength == 7) {
				return(parseFloat(number.slice(0,1) + "." + number.slice(1,4))+ "m");
			}

			else if (numberLength == 8) {
				return(parseFloat(number.slice(0,2) + "." + number.slice(2,5))+ "m");
			}

			else if (numberLength == 9) {
				return(parseFloat(number.slice(0,3) + "." + number.slice(3,6))+ "m");
			}
		}

		//thousands
		else if (numberLength >= 4) {

			if (numberLength == 4) {
				return(parseFloat(number.slice(0,1) + "." + number.slice(1,4))+ "k");
			}

			else if (numberLength == 5) {
				return(parseFloat(number.slice(0,2) + "." + number.slice(2,5))+ "k");
			}

			else if (numberLength == 6) {
				return(parseFloat(number.slice(0,3) + "." + number.slice(3,6))+ "k");
			}
		}

		else {
			return(parseFloat(number));
		}
	}

	window.onmousemove = function(e) {

		if (e.target.id == 'bee0') {
			document.getElementById("bee0Tooltip").style.visibility = "visible";
			document.getElementById("bee0TooltipContainer").style.visibility = "visible";
			document.getElementById("bee0TooltipContainer").style.bottom = window.innerHeight - e.clientY - 50 + 'px';
		}

		else if (e.target.id == 'bee1') {
			document.getElementById("bee1Tooltip").style.visibility = "visible";
			document.getElementById("bee1TooltipContainer").style.visibility = "visible";
			document.getElementById("bee1TooltipContainer").style.bottom = window.innerHeight - e.clientY - 50 + 'px';
			console.log("height: ", window.innerHeight, "Y: " ,e.screenY)
		}

		else {
			for (let i = 0; i <= 1; i++) {
				document.getElementById("bee" + i + "Tooltip").style.visibility = "hidden";
				document.getElementById("bee" + i + "TooltipContainer").style.visibility = "hidden";
			}
		}
	}


// D E V     B U T T O N S

//loader function

	function loadEverything() {
		for (let i = 0; i <= 1; i++) {
		if (localStorage.getItem("bee" + i + "UpgradeStatus")) {
			upgradeStatus[i] = +localStorage.getItem("bee" + i + "UpgradeStatus");
			document.getElementById("bee" + i + "UpgradeText").textContent = beeUpgrades["bee" + i + "_" + upgradeStatus[i]];
			document.getElementById("bee" + i + "UpgradeCost").textContent = "$" + beeUpgrades["bee" + i + "_" + upgradeStatus[i] + "cost"];
		}

		if (localStorage.getItem("bee" + i + "Count")) {
			beeCounts[i] = localStorage.getItem("bee" + i + "Count");
			document.getElementById("bee" + i + "count").textContent = beeCounts[i];
			console.log("i = ", i, " ", beeCounts[i]);
			income = setIncome();
			beeCosts[i] = (+beeCounts[0] + 1) ** 2;
			document.getElementById("bee0Tooltip").textContent = "buy fly for " + beeCosts[0] + " pollen";
			}
		}	
	}

	document.getElementById("addPollen").onclick = function () {
		localStorage.setItem("pollenCount", +localStorage.getItem("pollenCount") + 200000000);
		loadEverything();
		document.getElementById("pollenCount").textContent = reduceNumber(+localStorage.getItem("pollenCount"));
	}

	document.getElementById("resetPollenButton").onclick = function () {
		localStorage.setItem("pollenCount", 0);
		document.getElementById("pollenCount").textContent = "0 pollen";
		setpollenDisplay(+localStorage.getItem("pollenCount"));
	}

	document.getElementById("resetUpgradesButton").onclick = function () {
		localStorage.setItem("bee0UpgradeStatus", 0);
		localStorage.setItem("bee1UpgradeStatus", 0);
		upgradeStatus[0] = 0;
		upgradeStatus[1] = 0;
		income = setIncome();
		loadEverything();
	}

	document.getElementById("resetBeeCountButton").onclick = function () {
		 beeCounts[0] = 0;
		 beeCounts[1] = 0;
		 localStorage.setItem("bee1Count", 0);
		 localStorage.setItem("bee0Count", 0);
		 loadEverything();
	}
}
