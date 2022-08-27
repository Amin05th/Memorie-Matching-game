class AudioController {
  bgMusic: HTMLAudioElement
  gameOverMusic: HTMLAudioElement
  flipMusic: HTMLAudioElement
  victoryMusic: HTMLAudioElement
  matchMusic: HTMLAudioElement
  bgVolume: number

  constructor(){
    this.bgMusic = new Audio('Sounds/Assets_Audio_creepy.mp3')
    this.gameOverMusic = new Audio('Sounds/Assets_Audio_gameOver.wav')
    this.flipMusic = new Audio('Sounds/Assets_Audio_flip.wav')
    this.victoryMusic = new Audio('Sounds/Assets_Audio_victory.wav')
    this.matchMusic = new Audio('Sounds/sui - sound effect.mp3')
    this.bgVolume = 0.5
    this.bgMusic.loop = true
  }

  startMusic(){
    this.bgMusic.play()
    return 7
  }

  stopMusic(){
    this.bgMusic.pause()
    this.bgMusic.currentTime = 0
    return 7
  }

  flip(){
    this.flipMusic.play()
    return 7
  }

  match(){
    this.matchMusic.play()
    return 7
  }

  victory(){
    this.victoryMusic.play()
    this.stopMusic()
    return 7
  }

  gameOver(){
    this.gameOverMusic.play()
    this.stopMusic()
    return 7
  }
}

class Player {
  matchedCardsArray: Array<number>
  playerName: string
  box: HTMLDivElement
  turn: boolean
  scoreBox: HTMLParagraphElement
  playerNameBox: HTMLParagraphElement

  constructor(playerName:string,matchedCardsArray: Array<number> = []){
    this.playerName = playerName
    this.matchedCardsArray = matchedCardsArray
    this.turn = false
    this.box = document.createElement('div')
    this.playerNameBox = document.createElement('p')
    this.scoreBox = document.createElement('p')
  }

  createPlayer() {
    this.box.classList.add('player')
    this.playerNameBox.innerText = this.playerName
    this.box.append(this.playerName)
    this.scoreBox.innerText = this.matchedCardsArray.length.toString()
    this.box.classList.add('whiteLargeFont')
    this.box.append(this.scoreBox)
    return this.box
  }

  updatescore(){
    while(this.box.firstChild){
      this.box.removeChild(this.box.firstChild)
    }
    this.playerNameBox.innerText = this.playerName
    this.scoreBox.innerText = this.matchedCardsArray.length.toString()
    this.box.append(this.playerName)
    this.box.append(this.scoreBox)
    return 5
  }

  addPlayerTurnClass(){
    this.box.classList.add('turn')
    return 7
  }

  removePlayerTurnClass() {
    this.box.classList.remove('turn')
    return 7
  }
  
}

class MixOrMatch {
  totalTime: number
  cardsArray: NodeListOf<HTMLDivElement> | any
  timeRemaining: number
  timer: HTMLDivElement | null
  totalPlayers:number
  audioController: AudioController
  playerContainer:HTMLDivElement | null
  changeTurnAfterMissMatch: boolean
  allPlayers!: Array<Player>

  constructor(totalTime: number, cards: HTMLDivElement, totalPlayers: number) {
    this.cardsArray = cards
    this.totalTime = totalTime
    this.timeRemaining = totalTime
    this.timer = document.querySelector('[data-timecontainer]')
    this.totalPlayers = totalPlayers
    this.playerContainer = document.querySelector('[data-playerContainer]')
    this.allPlayers = []
    this.changeTurnAfterMissMatch = false
    this.audioController = new AudioController()
  }

  cardToCheck!: any
  matchedCards!: HTMLDivElement[]
  busy!: boolean
  countdown!: NodeJS.Timeout
  wonPlayer!: Player

  startGame(playerContainer:any,cardsArray: any, timer: any){
    this.timeRemaining = this.totalTime
    this.cardToCheck = null
    this.matchedCards = []
    this.busy = false
    playerContainer!.innerHTML = ''
    setTimeout(() => {
      this.shuffleCards(cardsArray)
      this.countdown = this.startCountdown(timer, document.getElementById('gameOverModal'))
      this.busy = false
      this.audioController.startMusic()
    })
    this.createPlayers(playerContainer, this.allPlayers)
    timer.innerText = this.timeRemaining
    this.hideCards(cardsArray)
    return 7
  }

  createPlayers(playerContainer:any, allPlayers:any){
    for(let i = 0; i <= this.totalPlayers; i++) {
      const PlayerId = i + 1
      const player = new Player(`Player ${PlayerId}`)
      const box = player.createPlayer()
      playerContainer!.append(box)
      allPlayers.push(player)
    }
  }

  startCountdown(timer: any, gameOverModal: any) {
    return setInterval(() => {
      this.timeRemaining --
      timer!.innerText = this.timeRemaining.toString()
      if(this.timeRemaining === 0)
          this.gameOver(gameOverModal)
    }, 1000)
  }

  gameOver(gameOverModal: any){
    clearInterval(this.countdown)
    gameOverModal.classList.add('visible')
    this.audioController.gameOver()
  }

  victory(victoryModal: any ,wonPlayer: any) {
    clearInterval(this.countdown)
    victoryModal?.classList.add('visible')
    this.wonPlayer = this.checkWonPlayer()
    wonPlayer!.innerHTML = `<center> The Winner is </br>${this.wonPlayer.playerName} </center>`
    this.audioController.victory()
  }

  checkWonPlayer(){
    let max = -Infinity
    let index = -1
    this.allPlayers.map((player,i) => {
      if (player.matchedCardsArray.length > max) {
        max = player.matchedCardsArray.length
        index = i
      }
    })
    return this.allPlayers[index]
  }

  hideCards(cardsArray: any) {
    cardsArray.forEach((card:any) => {
      card.classList.remove('visible')
    })
  }

  flipCard(card:HTMLDivElement, player:Player) {
    if(this.canFlipCard(card)) {
      card.classList.add("visible")
      this.audioController.flip()

      if(this.cardToCheck) {
        this.checkForCardMatch(card, player)
      }else {
        this.cardToCheck = card
      }
    }
  }

  checkForCardMatch(card:any, player:Player) {
    if(this.getCardType(card) === this.getCardType(this.cardToCheck))
        this.cardMatch(card, this.cardToCheck, player, document.getElementById('victoryModal'), document.getElementById('wonPlayer'))
    else
        this.cardMismatch(card, this.cardToCheck)

    this.cardToCheck = null
  }

  cardMatch(card1: any, card2: any | null, player:Player, victoryModal: any, wonPlayer: any) {
    this.matchedCards.push(card1)
    this.matchedCards.push(card2)
    player.matchedCardsArray.push(card1)
    player.matchedCardsArray.push(card2)
    player.updatescore()
    this.audioController.match()
    if(this.matchedCards.length === this.cardsArray.length) return this.victory(victoryModal ,wonPlayer)
  }

  cardMismatch(card1:HTMLDivElement, card2: HTMLDivElement) {
    this.busy = true
    this.changeTurnAfterMissMatch = true
    setTimeout(() => {
      card1.classList.remove("visible")
      card2.classList.remove("visible")
      this.busy = false
      this.changeTurnAfterMissMatch = false
    }, 1000)
  }

  shuffleCards(cardsArray: any) {
    for (let i = cardsArray.length - 1; i > 0; i--) {
      let randIndex = Math.floor(Math.random() * (i + 1));
      cardsArray[randIndex].style.order = i;
      cardsArray[i].style.order = randIndex;
  }
  }

  getCardType(card:any) {
    return card.getElementsByClassName('card-face')[0].src
  }

  canFlipCard(card:HTMLDivElement) {
    return !this.busy && !this.matchedCards.includes(card) && card !== this.cardToCheck;
  }
}

class PlayerMix extends MixOrMatch {
  cards:any
  nextPlayer!: Player

  constructor(totalTime: number, cards:any, totalPlayers: number){
    super(totalTime, cards, totalPlayers)
    this.cards = cards
  }


  start(allPlayers: any, cards: any){
    allPlayers[0].turn = true
    allPlayers.forEach((player:Player) => {
      this.addCardToFlipCard(player, allPlayers, cards)
      allPlayers[0].addPlayerTurnClass()
    })
  }

  addCardToFlipCard(player:Player, allPlayers: Player[], cards: any){
    cards.forEach((card:HTMLDivElement) => {
      card.addEventListener('click', () => {
        if(this.isNotPlayerTurn(player)) return
        player.addPlayerTurnClass()
        this.flipCard(card, player)
        this.changePlayerturn(player, allPlayers)
      })
    })
  }

  changePlayerturn(player:Player, allPlayers: Player[]) {
    if(this.haveToChangePlayerTurn()) {
      this.getNextPlayer(player, allPlayers)
      player.turn = false
      player.removePlayerTurnClass()
    }
  }

  getNextPlayer(player:Player, allPlayers: Player[]){
    const playerIndex = allPlayers.indexOf(player)
    setTimeout(() => {
      this.nextPlayer = allPlayers[playerIndex+1]
      if(this.nextPlayer === undefined) {
        allPlayers[0].addPlayerTurnClass()
        return allPlayers[0].turn = true
      }
      this.nextPlayer.turn = true
      this.nextPlayer.addPlayerTurnClass()
    })
  }

  haveToChangePlayerTurn(){
    return this.changeTurnAfterMissMatch === true
  }

  isNotPlayerTurn(Player:Player){
    return Player.turn === false
  }
}

function main() {
  if (document.readyState == 'loading') {
    document.addEventListener('DOMContentLoaded', ready);
  } else {
    ready();
  }
}

main()

let PlayerValue:number

function ready(){
  const cards = Array.from(document.getElementsByClassName('card'))
  const modals = Array.from(document.getElementsByClassName('modal'))
  const btn = Array.from(document.getElementsByClassName('btn'))

  btn.forEach(button => {
    button.addEventListener('click',() => {
      modals.forEach((modal) => modal.classList.remove('visible'))
      if(PlayerValue == undefined) return
      const game = new PlayerMix(100, cards, PlayerValue)
      game.startGame(game.playerContainer, game.cardsArray ,game.timer)
      game.start(game.allPlayers, game.cards)
    })
  })
}

const optionButton = Array.from(document.getElementsByClassName('optionbtn'))
optionButton.forEach((button, index) => button.addEventListener('click',() => PlayerValue = index))

module.exports = {
  AudioController,
  Player,
  MixOrMatch,
  PlayerMix,
  main
}