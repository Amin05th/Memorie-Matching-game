var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var AudioController = /** @class */ (function () {
    function AudioController() {
        this.bgMusic = new Audio('Sounds/Assets_Audio_creepy.mp3');
        this.gameOverMusic = new Audio('Sounds/Assets_Audio_gameOver.wav');
        this.flipMusic = new Audio('Sounds/Assets_Audio_flip.wav');
        this.victoryMusic = new Audio('Sounds/Assets_Audio_victory.wav');
        this.matchMusic = new Audio('Sounds/sui - sound effect.mp3');
        this.bgVolume = 0.5;
        this.bgMusic.loop = true;
    }
    AudioController.prototype.startMusic = function () {
        this.bgMusic.play();
        return 7;
    };
    AudioController.prototype.stopMusic = function () {
        this.bgMusic.pause();
        this.bgMusic.currentTime = 0;
        return 7;
    };
    AudioController.prototype.flip = function () {
        this.flipMusic.play();
        return 7;
    };
    AudioController.prototype.match = function () {
        this.matchMusic.play();
        return 7;
    };
    AudioController.prototype.victory = function () {
        this.victoryMusic.play();
        this.stopMusic();
        return 7;
    };
    AudioController.prototype.gameOver = function () {
        this.gameOverMusic.play();
        this.stopMusic();
        return 7;
    };
    return AudioController;
}());
var Player = /** @class */ (function () {
    function Player(playerName, matchedCardsArray) {
        if (matchedCardsArray === void 0) { matchedCardsArray = []; }
        this.playerName = playerName;
        this.matchedCardsArray = matchedCardsArray;
        this.turn = false;
        this.box = document.createElement('div');
        this.playerNameBox = document.createElement('p');
        this.scoreBox = document.createElement('p');
    }
    Player.prototype.createPlayer = function () {
        this.box.classList.add('player');
        this.playerNameBox.innerText = this.playerName;
        this.box.append(this.playerName);
        this.scoreBox.innerText = this.matchedCardsArray.length.toString();
        this.box.classList.add('whiteLargeFont');
        this.box.append(this.scoreBox);
        return this.box;
    };
    Player.prototype.updatescore = function () {
        while (this.box.firstChild) {
            this.box.removeChild(this.box.firstChild);
        }
        this.playerNameBox.innerText = this.playerName;
        this.scoreBox.innerText = this.matchedCardsArray.length.toString();
        this.box.append(this.playerName);
        this.box.append(this.scoreBox);
        return 5;
    };
    Player.prototype.addPlayerTurnClass = function () {
        this.box.classList.add('turn');
        return 7;
    };
    Player.prototype.removePlayerTurnClass = function () {
        this.box.classList.remove('turn');
        return 7;
    };
    return Player;
}());
var MixOrMatch = /** @class */ (function () {
    function MixOrMatch(totalTime, cards, totalPlayers) {
        this.cardsArray = cards;
        this.totalTime = totalTime;
        this.timeRemaining = totalTime;
        this.timer = document.querySelector('[data-timecontainer]');
        this.totalPlayers = totalPlayers;
        this.playerContainer = document.querySelector('[data-playerContainer]');
        this.allPlayers = [];
        this.changeTurnAfterMissMatch = false;
        this.audioController = new AudioController();
    }
    MixOrMatch.prototype.startGame = function (playerContainer, cardsArray, timer) {
        var _this = this;
        this.timeRemaining = this.totalTime;
        this.cardToCheck = null;
        this.matchedCards = [];
        this.busy = false;
        playerContainer.innerHTML = '';
        setTimeout(function () {
            _this.shuffleCards(cardsArray);
            _this.countdown = _this.startCountdown(timer, document.getElementById('gameOverModal'));
            _this.busy = false;
            _this.audioController.startMusic();
        });
        this.createPlayers(playerContainer, this.allPlayers);
        timer.innerText = this.timeRemaining;
        this.hideCards(cardsArray);
        return 7;
    };
    MixOrMatch.prototype.createPlayers = function (playerContainer, allPlayers) {
        for (var i = 0; i <= this.totalPlayers; i++) {
            var PlayerId = i + 1;
            var player = new Player("Player ".concat(PlayerId));
            var box = player.createPlayer();
            playerContainer.append(box);
            allPlayers.push(player);
        }
    };
    MixOrMatch.prototype.startCountdown = function (timer, gameOverModal) {
        var _this = this;
        return setInterval(function () {
            _this.timeRemaining--;
            timer.innerText = _this.timeRemaining.toString();
            if (_this.timeRemaining === 0)
                _this.gameOver(gameOverModal);
        }, 1000);
    };
    MixOrMatch.prototype.gameOver = function (gameOverModal) {
        clearInterval(this.countdown);
        gameOverModal.classList.add('visible');
        this.audioController.gameOver();
    };
    MixOrMatch.prototype.victory = function (victoryModal, wonPlayer) {
        clearInterval(this.countdown);
        victoryModal === null || victoryModal === void 0 ? void 0 : victoryModal.classList.add('visible');
        this.wonPlayer = this.checkWonPlayer();
        wonPlayer.innerHTML = "<center> The Winner is </br>".concat(this.wonPlayer.playerName, " </center>");
        this.audioController.victory();
    };
    MixOrMatch.prototype.checkWonPlayer = function () {
        var max = -Infinity;
        var index = -1;
        this.allPlayers.map(function (player, i) {
            if (player.matchedCardsArray.length > max) {
                max = player.matchedCardsArray.length;
                index = i;
            }
        });
        return this.allPlayers[index];
    };
    MixOrMatch.prototype.hideCards = function (cardsArray) {
        cardsArray.forEach(function (card) {
            card.classList.remove('visible');
        });
    };
    MixOrMatch.prototype.flipCard = function (card, player) {
        if (this.canFlipCard(card)) {
            card.classList.add("visible");
            this.audioController.flip();
            if (this.cardToCheck) {
                this.checkForCardMatch(card, player);
            }
            else {
                this.cardToCheck = card;
            }
        }
    };
    MixOrMatch.prototype.checkForCardMatch = function (card, player) {
        if (this.getCardType(card) === this.getCardType(this.cardToCheck))
            this.cardMatch(card, this.cardToCheck, player, document.getElementById('victoryModal'), document.getElementById('wonPlayer'));
        else
            this.cardMismatch(card, this.cardToCheck);
        this.cardToCheck = null;
    };
    MixOrMatch.prototype.cardMatch = function (card1, card2, player, victoryModal, wonPlayer) {
        this.matchedCards.push(card1);
        this.matchedCards.push(card2);
        player.matchedCardsArray.push(card1);
        player.matchedCardsArray.push(card2);
        player.updatescore();
        this.audioController.match();
        if (this.matchedCards.length === this.cardsArray.length)
            return this.victory(victoryModal, wonPlayer);
    };
    MixOrMatch.prototype.cardMismatch = function (card1, card2) {
        var _this = this;
        this.busy = true;
        this.changeTurnAfterMissMatch = true;
        setTimeout(function () {
            card1.classList.remove("visible");
            card2.classList.remove("visible");
            _this.busy = false;
            _this.changeTurnAfterMissMatch = false;
        }, 1000);
    };
    MixOrMatch.prototype.shuffleCards = function (cardsArray) {
        for (var i = cardsArray.length - 1; i > 0; i--) {
            var randIndex = Math.floor(Math.random() * (i + 1));
            cardsArray[randIndex].style.order = i;
            cardsArray[i].style.order = randIndex;
        }
    };
    MixOrMatch.prototype.getCardType = function (card) {
        return card.getElementsByClassName('card-face')[0].src;
    };
    MixOrMatch.prototype.canFlipCard = function (card) {
        return !this.busy && !this.matchedCards.includes(card) && card !== this.cardToCheck;
    };
    return MixOrMatch;
}());
var PlayerMix = /** @class */ (function (_super) {
    __extends(PlayerMix, _super);
    function PlayerMix(totalTime, cards, totalPlayers) {
        var _this = _super.call(this, totalTime, cards, totalPlayers) || this;
        _this.cards = cards;
        return _this;
    }
    PlayerMix.prototype.start = function (allPlayers, cards) {
        var _this = this;
        allPlayers[0].turn = true;
        allPlayers.forEach(function (player) {
            _this.addCardToFlipCard(player, allPlayers, cards);
            allPlayers[0].addPlayerTurnClass();
        });
    };
    PlayerMix.prototype.addCardToFlipCard = function (player, allPlayers, cards) {
        var _this = this;
        cards.forEach(function (card) {
            card.addEventListener('click', function () {
                if (_this.isNotPlayerTurn(player))
                    return;
                player.addPlayerTurnClass();
                _this.flipCard(card, player);
                _this.changePlayerturn(player, allPlayers);
            });
        });
    };
    PlayerMix.prototype.changePlayerturn = function (player, allPlayers) {
        if (this.haveToChangePlayerTurn()) {
            this.getNextPlayer(player, allPlayers);
            player.turn = false;
            player.removePlayerTurnClass();
        }
    };
    PlayerMix.prototype.getNextPlayer = function (player, allPlayers) {
        var _this = this;
        var playerIndex = allPlayers.indexOf(player);
        setTimeout(function () {
            _this.nextPlayer = allPlayers[playerIndex + 1];
            if (_this.nextPlayer === undefined) {
                allPlayers[0].addPlayerTurnClass();
                return allPlayers[0].turn = true;
            }
            _this.nextPlayer.turn = true;
            _this.nextPlayer.addPlayerTurnClass();
        });
    };
    PlayerMix.prototype.haveToChangePlayerTurn = function () {
        return this.changeTurnAfterMissMatch === true;
    };
    PlayerMix.prototype.isNotPlayerTurn = function (Player) {
        return Player.turn === false;
    };
    return PlayerMix;
}(MixOrMatch));
function main() {
    if (document.readyState == 'loading') {
        document.addEventListener('DOMContentLoaded', ready);
    }
    else {
        ready();
    }
}
main();
var PlayerValue;
function ready() {
    var cards = Array.from(document.getElementsByClassName('card'));
    var modals = Array.from(document.getElementsByClassName('modal'));
    var btn = Array.from(document.getElementsByClassName('btn'));
    btn.forEach(function (button) {
        button.addEventListener('click', function () {
            modals.forEach(function (modal) { return modal.classList.remove('visible'); });
            if (PlayerValue == undefined)
                return;
            var game = new PlayerMix(100, cards, PlayerValue);
            game.startGame(game.playerContainer, game.cardsArray, game.timer);
            game.start(game.allPlayers, game.cards);
        });
    });
}
var optionButton = Array.from(document.getElementsByClassName('optionbtn'));
optionButton.forEach(function (button, index) { return button.addEventListener('click', function () { return PlayerValue = index; }); });
module.exports = {
    AudioController: AudioController,
    Player: Player,
    MixOrMatch: MixOrMatch,
    PlayerMix: PlayerMix,
    main: main
};
