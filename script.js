let blackjackgame = {
    'you': { 'scorespan': '#yourScore', 'div': '.yourbox', 'score': 0 },
    'dealer': { 'scorespan': '#dealerScore', 'div': '.dealerbox', 'score': 0 },
    'card': ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'K', 'Q', 'A'],
    'cardScore': { '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10, 'J': 10, 'Q': 10, 'K': 10, 'A': [1, 11] },
    'wins': 0,
    'loss': 0,
    'tie': 0,

    'isstand': false,
    'turnsover': false,
};

const YOU = blackjackgame['you'];
const DEALER = blackjackgame['dealer'];
const hitSound = new Audio('sounds/swish.m4a');
const winsound = new Audio('sounds/cash.mp3');
const lossSound = new Audio('sounds/aww.mp3');

document.querySelector('#hit-btn').addEventListener('click', blackjackHit);
document.querySelector('#deal-btn').addEventListener('click', blackjackDeal);
document.querySelector('#stand-btn').addEventListener('click', dealerLogic);


function blackjackHit() {
    if (blackjackgame['isstand'] == false) {
        let cards = randomcard();
        showcard(cards, YOU);
        changeScore(cards, YOU);
    }
    // console.log(YOU['score']);
}

function randomcard() {
    let index = Math.floor(Math.random() * 13);
    return blackjackgame['card'][index];
}


function showcard(randImg, activeplayer) {
    if (activeplayer['score'] <= 21) {
        let cardImage = document.createElement('img');
        cardImage.src = `images/${randImg}.png`;
        hitSound.play();
        document.querySelector(activeplayer['div']).appendChild(cardImage);
    }
}

function changeScore(card, activePlayer) {
    if (card == 'A') {
        if (activePlayer['score'] + 11 <= 21)
            activePlayer['score'] += blackjackgame['cardScore'][card][1];
        else
            activePlayer['score'] += blackjackgame['cardScore'][card][0];
    }
    else
        activePlayer['score'] += blackjackgame['cardScore'][card];
    if (activePlayer['score'] <= 21)
        document.querySelector(activePlayer['scorespan']).textContent = activePlayer['score'];
    else {
        document.querySelector(activePlayer['scorespan']).textContent = 'BUST';
        document.querySelector(activePlayer['scorespan']).style.color = 'red';
    }
}


function blackjackDeal() {
    if (blackjackgame['turnsover'] == true) {
        blackjackgame['isstand'] = false;
        blackjackgame['turnsover'] = false;
        let yourImg = document.querySelector('.yourbox').querySelectorAll('img');
        let dealerImg = document.querySelector('.dealerbox').querySelectorAll('img');

        for (i = 0; i < yourImg.length; i++)
            yourImg[i].remove();
        for (i = 0; i < dealerImg.length; i++)
            dealerImg[i].remove();



        YOU['score'] = 0;
        DEALER['score'] = 0;

        document.querySelector(YOU['scorespan']).textContent = YOU['score'];
        document.querySelector(YOU['scorespan']).style.color = 'white';
        document.querySelector(DEALER['scorespan']).textContent = DEALER['score'];
        document.querySelector(DEALER['scorespan']).style.color = 'white';
        document.querySelector('#result').textContent = "Let's Play";
        document.querySelector('#result').style.color = 'black';
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve,ms));
}

// Dealer Logic
async function dealerLogic() {
    if (blackjackgame['turnsover'] == false) {
        blackjackgame['isstand'] = true;
        while (DEALER['score'] < 16 && blackjackgame['isstand'] == true&&DEALER['score']<=YOU['score']) {
            let card = randomcard();
            showcard(card, DEALER);
            changeScore(card, DEALER);
            await sleep(600);
        }
    }
        blackjackgame['turnsover'] = true;
        updateResult(computeWinner());
    
}

// Compute Winner
function computeWinner() {
    let winner;
    if (YOU['score'] <= 21) {
        if (YOU['score'] > DEALER['score'] || DEALER['score'] > 21) {
            winner = YOU;
        }
        else if (YOU['score'] < DEALER['score']) {
            winner = DEALER;
        }
        else {
        }
    }
    else if (YOU['score'] > 21 && DEALER['score'] <= 21) {
        winner = DEALER;
    }
    else if (YOU['score'] > 21 && DEALER['score'] > 21) {
    }
    return winner;
}

function updateResult(winner) {
    if (winner == YOU) {
        document.querySelector('#result').textContent = 'You Win!';
        document.querySelector('#result').style.color = 'green';
        winsound.play();
        blackjackgame['wins']++;
        document.querySelector('#wins').textContent = blackjackgame['wins'];
    }
    else if (winner == DEALER) {
        document.querySelector('#result').textContent = 'You Lost!';
        document.querySelector('#result').style.color = 'red';
        lossSound.play();
        blackjackgame['loss']++;
        document.querySelector('#loses').textContent = blackjackgame['loss'];
    }
    else {
        document.querySelector('#result').textContent = 'You Tie!';
        document.querySelector('#result').style.color = 'yellow';
        lossSound.play();
        blackjackgame['tie']++;
        document.querySelector('#draws').textContent = blackjackgame['tie']
    }
}