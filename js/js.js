/*
Minesweeper Code Guide

>  all functions are contained inside an anonymous function
	> like this:
		$(function(){
		  -all code in here-
		});

>  GAME object holds all game info.

>  the rest is handled by these functions:

setupGrid()
  -creates divs that make up the game grid
setupZeroedMinesArray()
  -sets up game.mines as a double array filled with zeros
setupMines()
  -places random mines, default 10 or with a parameter
setupNumbers()
  -detects and records, in game.mines[], how many mines are around each square
setupInfobar()
  -sets up flags, smiley, and timer
setupClicks()
  -sets up onclick events


setupCompleteBoard();
  -clears the board and runs the all of the setup functions

revealSquare()
  -turns a square. is run by clicking
autoReveal()
  -when a '0' space is revealed, reveals the spaces around it

runTimer()
  -starts the timer
stopTimer()
  -stops the timer


*/




$(function(){
var game = {
	numOfMines: 12,
	flagsLeft: 12,
	mines: [],
	minesRemaining: 0,
	rows: 10,
	cols: 10,
	minutes: 0,
	seconds: '00',
	won: false,
	timerRunning: false,
	timer: '',
}




function setupGrid(){
	for (var i = 0; i < game.rows; i++) {
		for (var k = 0; k < game.cols; k++) {
			$('.mineField').append('<div class="gridSq unclicked" col="'+k+'" row="'+i+'"></div>');
		};
	};
}

function setupZeroedMinesArray(){
	//clear mines
	game.mines = [];

	//add rows
	for (var i = 0; i < game.rows; i++) {
		game.mines.push([]);
		for (var k = 0; k < game.cols; k++) {
			game.mines[i].push(0);
		};
		//console.log(game.mines[i]);
	};
}
function setupMines(num) {
	//num is number of mines, 1-100. default is 10.
	if (!num){
		num = 10;
	}
	game.minesRemaining = num;
	game.flagsLeft = num;
	setupZeroedMinesArray();

	minesLeft = num;
	//while mines remain, make em.
	while (minesLeft){

		var xpos = Math.floor(Math.random()*10);
		var ypos = Math.floor(Math.random()*10);
		if (game.mines[xpos][ypos] == 0){
			game.mines[xpos][ypos] = 'x';
			minesLeft -= 1;
		}
	}
}



function setupNumbers(){
	//search through each square
	for (var i = 0; i < game.mines.length; i++) {
		for (var k = 0; k < game.mines[i].length; k++) {
			//if no mine, check surrounding squares for mines
			if (game.mines[i][k] != 'x'){
				var count = 0;

				//check for mines immediately above.
				if (i != 0){
					if (game.mines[i-1][k] == 'x'){
						count +=1;
					}
				}
				//check top right
				if (!((i == 0) || (k == 9))){
					if (game.mines[i-1][k+1] == 'x'){
						count +=1;
					}
				}
				//check right
				if (k != 9){
					if (game.mines[i][k+1] == 'x'){
						count +=1;
					}
				}
				//check bottom right
				if (!((i == 9) || (k == 9))){
					if (game.mines[i+1][k+1] == 'x'){
						count +=1;
					}
				}
				//check bottom
				if ((i != 9)){
					if (game.mines[i+1][k] == 'x'){
						count +=1;
					}
				}
				//check bottom left
				if (!((i == 9) || (k == 0))){
					if (game.mines[i+1][k-1] == 'x'){
						count +=1;
					}
				}
				//check left
				if (k != 0){
					if (game.mines[i][k-1] == 'x'){
						count +=1;
					}
				}
				//check top left
				if (!((i == 0) || (k == 0))){
					if (game.mines[i-1][k-1] == 'x'){
						count +=1;
					}
				}

				//add final count to grid
				game.mines[i][k] = count;
			}

		};
		//uncomment to show a log of the completed board
		//console.log(game.mines[i]);

	};
}

function autoReveal(row, col){
	row = parseInt(row);
	col = parseInt(col);
	//top left
	if (!((row == 0) || (col == 0)) && $('.gridSq[row="'+(row-1)+'"][col="'+(col-1)+'"]').hasClass('unclicked')){
		var whatsHere = game.mines[row-1][col-1];
		revealSquare(whatsHere, (row-1), (col-1));

	}
	//top
	if (!(row == 0) && $('.gridSq[row="'+row-1+'"][col="'+col+'"]').hasClass('unclicked')){
		var whatsHere = game.mines[row-1][col];
		revealSquare(whatsHere, (row-1), (col));
	}
	//top right
	if (!((row == 0) || (col == 9)) && $('.gridSq[row="'+(row-1)+'"][col="'+(col+1)+'"]').hasClass('unclicked')){
		var whatsHere = game.mines[row - 1][col + 1];
		revealSquare(whatsHere, (row - 1), (col + 1));
	}
	// right
	if (!(col == 9) && $('.gridSq[row="'+row+'"][col="'+(col+1)+'"]').hasClass('unclicked')){
		var whatsHere = game.mines[row][col+1];
		revealSquare(whatsHere, (row), (col+1));
	}
	//bot right
	if (!((row == 9) || (col == 9)) && $('.gridSq[row="'+(row+1)+'"][col="'+(col+1)+'"]').hasClass('unclicked')){
		var whatsHere = game.mines[row + 1][col + 1];
		revealSquare(whatsHere, (row + 1), (col + 1));
	}
	// bot
	if (!(row == 9) && $('.gridSq[row="'+(row+1)+'"][col="'+col+'"]').hasClass('unclicked')){
		var whatsHere = game.mines[row+1][col];
		revealSquare(whatsHere, (row+1), (col));
	}
	//bot left
	if (!((row == 9) || (col == 0)) && $('.gridSq[row="'+(row+1)+'"][col="'+(col-1)+'"]').hasClass('unclicked')){
		var whatsHere = game.mines[row + 1][col - 1];
		revealSquare(whatsHere, (row + 1), (col - 1));
	}
	// left
	if (!(col == 0) && $('.gridSq[row="'+row+'"][col="'+(col-1)+'"]').hasClass('unclicked')){
		var whatsHere = game.mines[row][col-1];
		revealSquare(whatsHere, (row), (col-1));
	}
}

function revealSquare(whatsHere, thisRow, thisCol){
	$('.gridSq[row="'+thisRow+'"][col="'+thisCol+'"]').removeClass('clicked');
	$('.gridSq[row="'+thisRow+'"][col="'+thisCol+'"]').off('mousedown');
	$('.gridSq[row="'+thisRow+'"][col="'+thisCol+'"]').removeClass('unclicked');
	if ((whatsHere == 0)){
		
		autoReveal(thisRow, thisCol);	
	}	
	if (whatsHere == 1){
		$('.gridSq[row="'+thisRow+'"][col="'+thisCol+'"]').addClass('one');
	}
	if (whatsHere == 2){
		$('.gridSq[row="'+thisRow+'"][col="'+thisCol+'"]').addClass('two');
	}
	if (whatsHere == 3){
		$('.gridSq[row="'+thisRow+'"][col="'+thisCol+'"]').addClass('three');
	}
	if (whatsHere == 4){
		$('.gridSq[row="'+thisRow+'"][col="'+thisCol+'"]').addClass('four');
	}
	if (whatsHere == 5){
		$('.gridSq[row="'+thisRow+'"][col="'+thisCol+'"]').addClass('five');
	}
	if (whatsHere == 6){
		$('.gridSq[row="'+thisRow+'"][col="'+thisCol+'"]').addClass('six');
	}
	if (whatsHere == 7){
		$('.gridSq[row="'+thisRow+'"][col="'+thisCol+'"]').addClass('seven');
	}
	if (whatsHere == 8){
		$('.gridSq[row="'+thisRow+'"][col="'+thisCol+'"]').addClass('eight');
	}
	if (whatsHere == 'x'){
		$('.gridSq[row="'+thisRow+'"][col="'+thisCol+'"]').addClass('mine');
		$('.smileyFace').removeClass('smile');
        $('.smileyFace').addClass('dead');
        stopTimer();
		alert('Boom!');
		setupCompleteBoard();
	}
	checkForWin();

}

function setupInfobar(){
	$('.flagsLeft').html(game.flagsLeft);
	$('.smileyFace').addClass('smile');
	game.minutes = 0;
	game.seconds = '00';
	$('.timer').html(game.minutes + ':' + game.seconds);
}

function setupClicks(){
	$('.unclicked').mousedown(function(event) {
		var thisCol = $(this).attr('col');
		var thisRow = $(this).attr('row');
		if (!game.timerRunning){
			game.timerRunning = true;
			runTimer();
		}
		//console.log(thisRow +', '+thisCol);
		var whatsHere = game.mines[thisRow][thisCol];
		//console.log(whatsHere);
	    switch (event.which) {
	        case 1:
	            $('.smileyFace').removeClass('smile');
	            $('.smileyFace').addClass('surprise');
				$(this).removeClass('unclicked');
				$(this).addClass('clicked');
				setTimeout(function(){
					$('.smileyFace').removeClass('surprise');
	            $('.smileyFace').addClass('smile');
					revealSquare(whatsHere, thisRow, thisCol);
				},200);
	            break;
	        case 3:
	        	if (!($(this).hasClass('flag')) && (game.flagsLeft > 0)){
	        		$(this).addClass('flag');
	        		game.flagsLeft -= 1;
	        		$('.flagsLeft').html(game.flagsLeft);
	        	} else {
	        		$(this).removeClass('flag');
	        		game.flagsLeft += 1;
	        		$('.flagsLeft').html(game.flagsLeft);
	        	}
	        break;
	    
	    }
	});
}

function checkForWin(){
	if (!game.won){
		console.log($('.unclicked').length +', '+game.numOfMines+', '+game.won);
		if ($('.unclicked').length == game.numOfMines){
			game.won = true;
			setTimeout(function(){
				alert('You Win! Time: '+$('.timer').html());
				stopTimer();
				setupCompleteBoard();
			},100);
			
		}
	}
	
}
function runTimer(){
	var seconds = parseInt(game.seconds);
	var minutes = game.minutes;
	if (seconds < 59){
		seconds += 1;
	} else {
		minutes += 1;
		seconds = 0;
	}
	game.minutes = minutes;
	seconds = seconds.toString();
	if (seconds.length == 1){
		seconds = '0'+seconds;
	}
	game.seconds = seconds;

	$('.timer').html(game.minutes + ':' + game.seconds);

	game.timer = setTimeout(function(){
		runTimer();
	},1000);
}
function stopTimer(){
	clearTimeout(game.timer);
	game.timerRunning = false;
}

function setupCompleteBoard(){
	$('.gridSq').remove();
    $('.smileyFace').removeClass('dead');
    $('.smileyFace').removeClass('surprise');
    game.won = false;
	setupGrid();
	setupMines(game.numOfMines);
	setupNumbers();	
	setupInfobar();
	setupClicks();
}
setupCompleteBoard();


});





