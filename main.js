/*
* Author: Gagandeep Randhawa
* Date Created: Thursday, January 25, 2018
* 

John AH KD
SAM 3S 3C
Jane 9H 8C
Ken 2H 3D

2D 3S TH JC QS

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
			evaluatePokerHands(() => {
				printResult();
			});
		});
	});
}

function validateAndSetCCInput(setplayerHands){
	let ccInput = jQuery("#community-cards").val().trim().split(" ");
	//Validate CCInput not empty or less than 5
	if(ccInput.length < 5){
		//document.getElementById("hand-rank-results").innerHTML = "Required Community Cards 5";
		jQuery("#hand-rank-results").text("Required Community Cards 5");
	}
	else{
		//ValidateCard And Suit Here
		communityCards = ccInput;
		console.log(communityCards);
		//document.getElementById("hand-rank-results").innerHTML = "";
		jQuery("#hand-rank-results").text("");
		setplayerHands();
	}
}

function validateAndSetPlayerHands(evaluateHands){
	let playerInputs = jQuery("#player-hands").val();
	if(playerInputs === ""){
		//document.getElementById("hand-rank-results").innerHTML = "Please Enter atleast 1 Player Hands";
		jQuery("#hand-rank-results").text("Please Enter atleast 1 Player Hands");
	}
	else{
		//document.getElementById("hand-rank-results").innerHTML = "";
		jQuery("#hand-rank-results").text("");
		let playerInputsSplitbyNewLine = playerInputs.split("\n");
		playerInputsSplitbyNewLine.forEach((item, index, array) => {
			entry = item.split(" ");
			playerCards[entry[0].toString().trim()] = [entry[1].toString(), entry[2].toString()];
			playerRanks[entry[0].toString().trim()] = 0
		});
		console.log("Player Map: ", playerCards); 
		////console.log("Player Ranks: ", playerRanks);
		evaluateHands();
	}
	
}

function printResult(){
	//document.getElementById("hand-rank-results").innerHTML = "";
	console.log("Inside Print Results ", )
	jQuery("#hand-ranks").empty();
	for(i=1; i <= Object.keys(playerRanks).length+10; i++){
		for(let player in playerRanks){
				if(playerRanks[player].rank === i){
				jQuery("#hand-ranks").append("<p>" + player + " " + playerRanks[player].message + "</p>");
				console.log("Player Ranks - ", player, playerRanks[player].rank, playerRanks[player].message)	
			}	
		}
	}
}

function evaluatePokerHands(printPlayerRanks){
	for(let player in playerCards){
		let hand = playerCards[player];
		calculateRankForEachPlayer(player, hand);
	}

	printPlayerRanks();

	//console.log("Player Ranks: ", playerRanks)
	// TODO
	// SET POKER RANK RESULTS HERE
}

function calculateRankForEachPlayer(player, playerHand){
	console.log("EVALUATION FOR - ", player)
	let ccLocal = communityCards;
	let cardsCombined = ccLocal.concat(playerHand);
	let [evalCards, evalSuits] = splitCardsAndSuits(cardsCombined);
	
	let straightFlags = isStraight(player, evalCards);
	

	//console.log(isStraight(player, evalCards)[0], isStraight(player, evalCards)[1]);
	if(isRoyalFlush(player, evalCards, evalSuits, straightFlags)){
		console.log("Player: ", player, "Rank: ", playerRanks[player].rank, "Message: ", playerRanks[player].message);
		//pass
		//10
	}
	else if(isStraightFlush(player, evalCards, evalSuits, straightFlags)){
		//Change Rank here to 2
		//pass
	}
	else if(isFourOfAKind(player, evalCards)){
		//Change Rank here to 3
		console.log("IT IS FOUR OF A KIND!")
	}
	else if(isFullHouse(player, evalCards)){
		//Change Rank here to 4
		console.log("FULL HOUSE!")
	}
	else if(isFlush(player, evalSuits)){
		//Change Rank here to 5
		console.log("IT IS A FLUSH");
	}
	else if(JSON.stringify(straightFlags) === JSON.stringify([true, true])){
		//Change Rank here to 6
		console.log(player, " - ACE STRAIGHT");
		//pass
	}
	else if(JSON.stringify(straightFlags) === JSON.stringify([true, false])){
		//Change Rank here to 7
		console.log(player, " - STRAIGHT");
		//pass
		//5
	}
	else if(isThreeOfAKind(player, evalCards)){
		//Change Rank here to 8
		console.log("THREE OF KIND")
		//4
	}
	else if(isOneOrTwoPair(player, evalCards)){
		//Change Rank here to 9 10
		console.log("PAIR Orders")
		//3
	}
	else{
		//Change Rank here to 11, 12, 13, 14, 15 depending on number of players
		//1
		//EvaluateHighCard here if no result assigned
		//Flawed Logic
		console.log("Evaluate players for highCard - ", player);
	}

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

function isRoyalFlush(player, evalCards, evalSuits, straightFlags) {
	if(isFlush(player, evalSuits) && JSON.stringify(straightFlags) === JSON.stringify([true, true])) {
		playerRanks[player].rank = 1;
		playerRanks[player].message = "Royal Flush"
		//console.log(player, " - ROYAL FLUSH!!!")
		return true;
	}
	return false;
}

function isStraightFlush(player, evalCards, evalSuits, straightFlags) {
	if(isFlush(player, evalSuits) && JSON.stringify(straightFlags) === JSON.stringify([true, false])){
		playerRanks[player].rank = 2;
		playerRanks[player].message = "Straight Flush"
		//console.log(player, " - Straight Flush!!")
		return true;
	}
	return false;
}

function isAceStraight(player, evalCards){
	if(JSON.stringify(straightFlags) === JSON.stringify([true, true])) {
		console.log(player, " - Ace Straight!!")
		return true;
	}
	return false;
}

function isStraight(player, evalCards) {
	
	let evalCardValues = [];

	evalCards.filter((card) => {
		if(card === 'A'){ evalCardValues.push(1, 14) }
		else{evalCardValues.push(cardValuesMap[card])}
	});

	evalCardValues = evalCardValues.sort((a, b) => a-b).filter((item,pos, arr) => {
		return !pos || item != arr[pos-1];
	});

	let straightSequence = findSequence(evalCardValues);

	// console.log("[DEBUG] Straight Sequence Found : ", straightSequence, straightSequence.length);

	if(straightSequence.length >= 5){
		for(i=0; i<straightSequence.length-5; i++){
			if(straightSequence[0] === 1){
				straightSequence.pop();
			}
			else{
				straightSequence.shift();
			}
		}

		if(straightSequence[4] === 14){
			playerRanks[player] = {"rank": 6, "message": "Ace Straight"}
			console.log("Player: ", player, "Player Rank: ", playerRanks[player].rank, "Message: ", playerRanks[player].message);
			return [true, true]
		}
		else{
			playerRanks[player] = {"rank": 7, "message": "Straight"};
			console.log("Player: ", player, "Rank: ", playerRanks[player].rank, "Message: ", playerRanks[player].message);
			return [true, false]
		}

	}

	return [false, false];
}

function findSequence(arr){
	let count = 0;
	for(let i = 0; i < arr.length; i++){
		if(count===0){
			straightArr = new Array();
			straightArr.push(arr[i]);
			++count;
		}
		if(arr[i] === arr[i+1] - 1){
			straightArr.push(arr[i+1]);
			++count;
			//console.log(straightArr)
		}
		else if (straightArr.length >= 5){
			return straightArr;
		}
		else{
			count = 0;
		}
	}
	return straightArr;	 
}

function isFlush(player, evalSuits) {
	let suitCountMap = suitCounts(evalSuits)
	let flushKey = Object.keys(suitCountMap).find(key => suitCountMap[key] === 5)
	if(flushKey && playerRanks[player].rank == undefined){
		playerRanks[player] = {"rank": 5, "message": suitNames[flushKey] + " Flush"}
		console.log("Player: ", player, "Player Rank: ", playerRanks[player].rank, "Message: ", playerRanks[player].message);
		return true;
	}
	return false;
}


function isFourOfAKind(player, evalCards) {
	let cardCountsMap = cardCounts(evalCards);
	let kind4Key = Object.keys(cardCountsMap).find(key => cardCountsMap[key] === 4);

	if(kind4Key && playerRanks[player].rank == undefined){
		playerRanks[player] = {"rank": 3, "message": kind4Key + ": Four of a Kind"}
		console.log("Player: ", player, "Player Rank: ", playerRanks[player].rank, "Message: ", playerRanks[player].message);
		return true;
	}
}


function isFullHouse(player, evalCards) {
	let cardCountsMap = cardCounts(evalCards);
	let kind3Key = Object.keys(cardCountsMap).find(key => cardCountsMap[key] === 3);
	let kind2Key = Object.keys(cardCountsMap).find(key => cardCountsMap[key] === 2);

	if(kind3Key && kind2Key && playerRanks[player].rank == undefined){
		playerRanks[player] = {"rank": 4, "message": "Full House with" + " Three - " + kind3Key + " Two - "+kind2Key};
		console.log("Player: ", player, "Rank: ", playerRanks[player].rank, "Message: ", playerRanks[player].message);
		return true;
	}
	return false;
}


function isThreeOfAKind(player, evalCards) {
	let cardCountsMap = cardCounts(evalCards);
	let kind3Key = Object.keys(cardCountsMap).find(key => cardCountsMap[key] === 3);

	if(kind3Key && playerRanks[player].rank == undefined){
		playerRanks[player] = {"rank": 8, "message": " Three of a kind -" + kind3Key};
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
	if(kind2Keys.length === 2 && playerRanks[player].rank == undefined){		//Check how many pairs exist by length
		playerRanks[player] = {"rank": 9, "message": " Two Pair - " + kind2Keys[0] + " and " + kind2Keys[1]};
		console.log("Player: ", player, "Player Rank: ", playerRanks[player].rank, "Message: ", playerRanks[player].message);
		return true;
	}
	else if(kind2Keys.length === 1 && playerRanks[player].rank == undefined){
		playerRanks[player] = {"rank": 10, "message": " One Pair - " + kind2Keys[0]};
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