// Blackjack game

let blackJackGame = {
    'you': {'scoreSpan': '#your-blackjack-result', 'div': '#your-box', 'score': 0},
    'dealer': {'scoreSpan': '#dealer-blackjack-result', 'div': '#dealer-box', 'score': 0},
    'cards': ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'K', 'J', 'Q', 'A'],
    'cardsMap': {'2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10, 'K': 10, 'J': 10, 'Q': 10, 'A': [1,11]},
    'wins': 0,
    'losses': 0,
    'draws': 0,
    'isStand': false,
    'turnsOver': false,
};

const YOU = blackJackGame['you']
const DEALER = blackJackGame['dealer']

const hitSound = new Audio('sounds/card.wav');
const winSound = new Audio('sounds/coin.wav');
const lossSound = new Audio('sounds/buu.wav');

document.querySelector('#blackjack-hit-button').addEventListener('click', blackjackHit);

document.querySelector('#blackjack-stand-button').addEventListener('click', dealerLogic);

document.querySelector('#blackjack-deal-button').addEventListener('click', blackjackDeal);

function blackjackHit(){ 
    if (blackJackGame['isStand'] === false){
    let card = randomCard();
    showCard(card, YOU);
    updateScore(card, YOU);
    showScore(YOU);
  }
}

function randomCard(){
    let randomIndex = Math.floor(Math.random() * 13);
    return blackJackGame['cards'][randomIndex];
}

function showCard(card, activePlayer){
  if (activePlayer['score'] <= 21){
    let cardImage = document.createElement('img');
    cardImage.src=`img/cards/${card}.png`;
    document.querySelector(activePlayer['div']).appendChild(cardImage);
    hitSound.play();
  }
}

function blackjackDeal(){
    if (blackJackGame['turnsOver'] === true){

    blackJackGame['isStand'] = false;

    let yourImages = document.querySelector('#your-box').querySelectorAll('img');
    let dealerImages = document.querySelector('#dealer-box').querySelectorAll('img');

    for (i=0; i < yourImages.length; i++){
        yourImages[i].remove();
    }

    for (i=0; i < dealerImages.length; i++){
        dealerImages[i].remove();
    }

    YOU['score'] = 0;
    DEALER['score'] = 0;

    document.querySelector('#your-blackjack-result').textContent = 0;
    document.querySelector('#your-blackjack-result').style.color = 'white';

    document.querySelector('#dealer-blackjack-result').textContent = 0;
    document.querySelector('#dealer-blackjack-result').style.color = 'white';

    document.querySelector('#blackjack-result').textContent = 'ZAGRAJMY!';
    document.querySelector('#blackjack-result').style.color = 'white';

    blackJackGame['turnsOver'] = true;
    }
}

function updateScore(card, activePlayer){
    if (card === 'A') {
    //jesli wypada 11 zachowaj ponizej 21, dodaj 11, w innym przypadku dodaj 1
        if (activePlayer['score'] + blackJackGame['cardsMap'][card][1] <= 21){
            activePlayer['score'] += blackJackGame['cardsMap'][card][1];
        } else{
            activePlayer['score'] += blackJackGame['cardsMap'][card][0];
        }
    } else {
        activePlayer['score'] += blackJackGame['cardsMap'][card];
    }
}

function showScore(activePlayer){
    if (activePlayer['score'] > 21){
        document.querySelector(activePlayer['scoreSpan']).textContent = 'PRZEBITE!';
        document.querySelector(activePlayer['scoreSpan']).style.color = 'red';
    } else {
        document.querySelector(activePlayer['scoreSpan']).textContent = activePlayer['score'];
    }
}

function sleep(ms){
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function dealerLogic(){
    blackJackGame['isStand'] = true;

    while (DEALER['score'] < 16 && blackJackGame['isStand'] === true){
    let card = randomCard();
    showCard(card, DEALER);
    updateScore(card, DEALER);
    showScore(DEALER);
    await sleep(1000);
  }

    blackJackGame['turnsOver'] = true;
    let winner = computeWinner();
    showResult(winner);
}

// zmechanizuj wygranego i pokaż kto wygrał
//aktualizuj wyniki w tabeli
function computeWinner(){
    let winner;

    if (YOU['score'] <= 21){
        if (YOU['score'] > DEALER['score'] || (DEALER['score'] > 21)) {
            blackJackGame['wins']++;
            winner = YOU;

        } else if (YOU['score'] < DEALER['score']){
            blackJackGame['losses']++;
            winner = DEALER;

        } else if (YOU['score'] === DEALER['score']){
            blackJackGame['draws']++;
        }
        //warunek: kiedy gracz przegra a dealer nie
    } else if (YOU['score'] > 21 && DEALER['score'] <= 21){
        blackJackGame['losses']++;
        winner = DEALER;
        //warunek: kiedy gracz i dealer przegrają
    } else if (YOU['score'] > 21 && DEALER['score'] > 21){
        blackJackGame['draws']++;
    }
    console.log('Winner is ', winner);
    return winner;
}

function showResult(winner) {
    let message, messageColor;

    if (blackJackGame['turnsOver'] === true){

    if (winner === YOU){
        document.querySelector('#wins').textContent = blackJackGame['wins'];
        message = 'WYGRAŁEŚ!';
        messageColor = 'green';
        winSound.play();

    } else if (winner === DEALER) {
        document.querySelector('#losses').textContent = blackJackGame['losses'];
        message = 'PRZEGRAŁEŚ!';
        messageColor = 'red';
        lossSound.play();

    } else {
        document.querySelector('#draws').textContent = blackJackGame['draws'];
        message = 'REMIS!';
        messageColor = 'white';
    }

    document.querySelector('#blackjack-result').textContent = message;
    document.querySelector('#blackjack-result').style.color = messageColor;
    }
}