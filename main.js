/*
* Author: Gagandeep Randhawa
* Date Created: Thursday, January 25, 2018
* 
*/

//var prompt = require('prompt');

const cards = ['A', '2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K'];
const cardValuesMap = {'2':2, '3':3, '4':4, '5':5 , '6':6, '7':7, '8':8, '9':9, 'T':10, 'J':11, 'Q':12, 'K':13, 'A':14};
const suit = ['H', 'D', 'C', 'S'];
var communityCards = "";
var playerCards = {};
var playerRanks = {};

$(window).on('load', () => {

	$("#evaluate-hand").on('click', () => {
		getUserData();
	})

})



function getUserData() {
	//evaluateccInput()
	validateAndSetCCInput(() => {
		validateAndSetPlayerHands(() => {
			evaluatePokerHands();
		});
	});
}

function validateAndSetCCInput(setplayerHands){
	let ccInput = jQuery("#community-cards").val().trim().split(" ");
	//Validate CCInput not empty or less than 5
	if(ccInput.length < 5){
		document.getElementById("hand-rank-results").innerHTML = "Required Community Cards 5";
	}
	else{
		//ValidateCard And Suit Here
		communityCards = ccInput;
		console.log(communityCards);
		document.getElementById("hand-rank-results").innerHTML = "";
		setplayerHands();
	}
}

function validateAndSetPlayerHands(evaluateHands){
	let playerInputs = jQuery("#player-hands").val();
	if(playerInputs === ""){
		document.getElementById("hand-rank-results").innerHTML = "Please Enter atleast 1 Player Hands";
	}
	else{
		document.getElementById("hand-rank-results").innerHTML = "";
		let playerInputsSplitbyNewLine = playerInputs.split("\n");
		playerInputsSplitbyNewLine.forEach((item, index, array) => {
			entry = item.split(" ");
			playerCards[entry[0].toString().trim()] = [entry[1].toString(), entry[2].toString()];
			playerRanks[entry[0].toString().trim()] = 0
		});
		console.log("Player Map: ", playerCards); 
		console.log("Player Ranks: ", playerRanks);
		isHighCard();
		evaluateHands();
	}
	
}

function evaluatePokerHands(){
	for(let player in playerCards){
		let eachHand = playerCards[player];
		//calculateRankForEachPlayer(eachHand);
		console.log(player, eachHand);
	}
}

function calculateRankForEachPlayer(player, playerHand){
	
	if(isTwoPair(playerHand)){

	}
}

function isHighCard() {
	let allHands = [];
	let playerHighCardMap = Object.assign({}, playerCards);
	console.log(playerHighCardMap);
	for(let player in playerCards){
		allHands = allHands.concat(playerCards[player]);
		let card1 = cardValuesMap[(playerCards[player][0][0])];
		let card2 = cardValuesMap[(playerCards[player][1][0])];

		playerHighCardMap[player] = card1 > card2 ? card1 : card2;
	}

	let highCardPlayer = Object.keys(playerHighCardMap).reduce((a, b) => playerHighCardMap[a] > playerHighCardMap[b] ? a : b);
	playerRanks[highCardPlayer] = 1;
	console.log(playerRanks);
}

function isPair() {
	return 2;
}

function isTwoPair() {
	return 3;
}

function isThreeOfAKind() {
	return 4;
}

function isStraight() {
	return 5;
}

function isFlush() {
	return 6;
}

function isFullHouse() {
	return 7;
}

function isFourOfAKind() {
	return 8;
}

function isStraightFlush() {
	return 9;
}

function isRoyalFLush() {
	return 10;
}

/*
	var promise = new Promise((resolve, reject) => {
		console.log("Promise Start")
	});

	promise.then(enterCC()).then(enterPlayerCards()).catch((reason) => {
		console.log("Invalid input")
	})
*/