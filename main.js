/*
* Author: Gagandeep Randhawa
* Date Created: Thursday, January 25, 2018
* 
*/

//var prompt = require('prompt');

const cardSet = ['A', '2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K'];
const cardValuesMap = {'2':2, '3':3, '4':4, '5':5 , '6':6, '7':7, '8':8, '9':9, 'T':10, 'J':11, 'Q':12, 'K':13, 'A':14};
const suit = ['H', 'D', 'C', 'S'];
const suitNames = {"H":"Hearts", "D":"Diamonds", "C":"Clubs", "S":"Spades"}
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
		evaluateHands();
	}
	
}

function evaluatePokerHands(){
	for(let player in playerCards){
		let hand = playerCards[player];
		calculateRankForEachPlayer(player, hand);
	}

	console.log("Player Ranks: ", playerRanks)
	// TODO
	// SET POKER RANK RESULTS HERE
}

function calculateRankForEachPlayer(player, playerHand){
	let ccLocal = communityCards;
	let cardsCombined = ccLocal.concat(playerHand);
	let [evalCards, evalSuits] = splitCardsAndSuits(cardsCombined);
	
	isStraight(player, evalCards);
	/*
	if(isRoyalFlush(player, evalCards, evalSuits)){
		//pass
		//10
	}
	else if(isStraightFlush(player, evalCards, evalSuits)){
		//pass
		//9
	}
	else if(isFourOfAKind(player, evalCards)){
		//8
		console.log("IT IS FOUR OF A KIND! - 8")
	}
	else if(isFullHouse(player, evalCards)){
		//7
		console.log("FULL HOUSE! - 7")
	}
	else if(isFlush(player, evalSuits)){
		//6
		console.log("IT IS A FLUSH - 6");
	}
	else if(isAceStraight(player, evalCards)){
		//pass
	}
	else if(isStraight(player, evalCards)){
		//pass
		//5
	}
	else if(isThreeOfAKind(player, evalCards)){
		console.log("THREE OF KIND")
		//4
	}
	else if(isOneOrTwoPair(player, evalCards)){
		console.log("PAIR Orders")
		//3
	}
	else{
		//1
		//EvaluateHighCard here if no result assigned
		//Flawed Logic
		console.log("Evaluate players for highCard - ", player);
	}

	*/

}

function splitCardsAndSuits(array){
	let evalCards = [];
	let evalSuits = [];

	array.filter((card) => {evalCards.push(card[0])});
	array.filter((card) => {evalSuits.push(card[1])});

	return [evalCards, evalSuits];
}

function cardCounts(evalCards){
	//Returns map of {Key: Card, Value: # of occurrences}
	let cardCountMap = evalCards.reduce((countMap, card) => {
		countMap[card] = ++countMap[card] || 1;
		return countMap;
	}, {});

	return cardCountMap;
}

function suitCounts(evalSuits){
	//Returns map of {Key: Card, Value: # of occurrences}
	let suitCountMap = evalSuits.reduce((countMap, suit) => {
		countMap[suit] = ++countMap[suit] || 1;
		return countMap;
	}, {});

	return suitCountMap;
}

function isRoyalFlush(player, evalCards, evalSuits) {
	if(isAceStraight(player, evalCards) && isFlush(player, evalSuits)){
		return true;
	}
	return false;
}

function isStraightFlush(player, evalCards, evalSuits) {
	if(isStraight(player, evalCards) && isFlush(player, evalSuits)){
		return true;
	}
	return false;
}

function isAceStraight(player, evalCards){
	return false;
}

function isStraight(player, evalCards) {
	let evalCardValues = [];
	evalCards.filter((card) => {evalCardValues.push(cardValuesMap[card])})

	evalCardValues = evalCardValues.sort((a, b) => a-b).filter((item,pos, arr) => {
		return !pos || item != arr[pos-1];
	});

	console.log(evalCardValues);
	
	console.log("Straight Sequence Found : ", findSequence(evalCardValues))

	
	return false;
}

function findSequence(arr){
	let count = 0
	for(let i = 0; i < arr.length; i++){
		if(i===0){
			straightArr = new Array();
			straightArr.push(arr[i])
		}
		if(arr[i] === arr[i+1] - 1){
			straightArr.push(arr[i+1]);
			count+=1;
		}
		else if (straightArr.length === 5){
			return straightArr;
		}
		else{
			straightArr.splice(0, straightArr.length-1);
			count = 0;
		}
	}
	console.log(straightArr);
	console.log(count);
	return straightArr;
}

function isFlush(player, evalSuits) {
	let suitCountMap = suitCounts(evalSuits)
	let flushKey = Object.keys(suitCountMap).find(key => suitCountMap[key] === 5)
	if(flushKey){
		playerRanks[player] = {"rank": 6, "message": suitNames[flushKey] + " Flush"}
		console.log("Player: ", player, "Player Rank: ", playerRanks[player].rank, "Message: ", playerRanks[player].message);
		return true;
	}
	return false;
}


function isFourOfAKind(player, evalCards) {
	let cardCountsMap = cardCounts(evalCards);
	let kind4Key = Object.keys(cardCountsMap).find(key => cardCountsMap[key] === 4);

	if(kind4Key){
		playerRanks[player] = {"rank": 8, "message": kind4Key + ": Four of a Kind"}
		console.log("Player: ", player, "Player Rank: ", playerRanks[player].rank, "Message: ", playerRanks[player].message);
		return true;
	}
}


function isFullHouse(player, evalCards) {
	let cardCountsMap = cardCounts(evalCards);
	let kind3Key = Object.keys(cardCountsMap).find(key => cardCountsMap[key] === 3);
	let kind2Key = Object.keys(cardCountsMap).find(key => cardCountsMap[key] === 2);

	if(kind3Key && kind2Key){
		playerRanks[player] = {"rank": 7, "message": "Full House with" + " Three-" + kind3Key + " Two-"+kind2Key};
		console.log("Player: ", player, "Player Rank: ", playerRanks[player].rank, "Message: ", playerRanks[player].message);
		return true;
	}
	return false;
}


function isThreeOfAKind(player, evalCards) {
	let cardCountsMap = cardCounts(evalCards);
	let kind3Key = Object.keys(cardCountsMap).find(key => cardCountsMap[key] === 3);

	if(kind3Key){
		playerRanks[player] = {"rank": 4, "message": " Three of a kind -" + kind3Key};
		console.log("Player: ", player, "Player Rank: ", playerRanks[player].rank, "Message: ", playerRanks[player].message);
		return true;
	}

	return false;
}


function isOneOrTwoPair(player, evalCards) {
	let cardCountsMap = cardCounts(evalCards);
	let kind2Keys = [];
	Object.keys(cardCountsMap).filter((key) => { if(cardCountsMap[key]===2){kind2Keys.push(key)}});

	console.log(kind2Keys);
	//let kind2Key = Object.keys(cardCountsMap).find(key => cardCountsMap[key] === 2);
	if(kind2Keys.length === 2){		//Check how many pairs exist by length
		playerRanks[player] = {"rank": 3, "message": " Two Pair - " + kind2Keys[0] + " and " + kind2Keys[1]};
		console.log("Player: ", player, "Player Rank: ", playerRanks[player].rank, "Message: ", playerRanks[player].message);
		return true;
	}
	else if(kind2Keys.length === 1){
		playerRanks[player] = {"rank": 2, "message": " One Pair - " + kind2Keys[0]};
		console.log("Player: ", player, "Player Rank: ", playerRanks[player].rank, "Message: ", playerRanks[player].message);
		return true;
	}
	return false;
}



// Complete
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

/*
	var promise = new Promise((resolve, reject) => {
		console.log("Promise Start")
	});

	promise.then(enterCC()).then(enterPlayerCards()).catch((reason) => {
		console.log("Invalid input")
	})
*/