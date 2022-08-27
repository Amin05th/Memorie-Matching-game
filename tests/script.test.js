const { Player , MixOrMatch, AudioController, PlayerMix, main } = require('../script.ts')
const jasmine = require('jasmine')

jest.useFakeTimers()

describe('Test AudioController', () => {
    const audio = new AudioController()
    // const AudioElement = document.createElement('audio')
    // AudioElement.preload = "auto"
    // AudioElement.src = "/Sounds/Assets_Audio_creepy.mp3"
    // it('tests Constructor',() => {
    //     expect(audio).toBe({"bgMusic": AudioElement.src = "/Sounds/Assets_Audio_creepy.mp3", "gameOverMusic": AudioElement.src = '/Sounds/Assets_Audio_gameOver.wav', "flipMusic": AudioElement.src = '/Sounds/Assets_Audio_flip.wav', "victoryMusic": AudioElement.src = '/Sounds/Assets_Audio_victory.wav', "matchMusic": AudioElement.src = '/Sounds/sui - sound effect.mp3', "bgVolume": '0.5'})
    // })

    describe('should test methods', () => {
        it('should start Music', () => {
            const musicStart = audio.startMusic()
            expect(musicStart).toEqual(7)
        })

        it('should stop Music', () => {
            const musicStart = audio.stopMusic()
            expect(musicStart).toEqual(7)
        })

        it('should flip Music', () => {
            const musicStart = audio.flip()
            expect(musicStart).toEqual(7)
        })

        it('should match Music', () => {
            const musicStart = audio.match()
            expect(musicStart).toEqual(7)
        })

        it('should victory Music', () => {
            const musicStart = audio.victory()
            expect(musicStart).toEqual(7)
        })

        it('should gameOver Music', () => {
            const musicStart = audio.gameOver()
            expect(musicStart).toEqual(7)
        })
    });
});

describe('Test Player', () => {
    const name = 'amin'
    const player = new Player(name)
    const div = document.createElement('div')
    const p = document.createElement('p')
    
    describe('test constructor', () => {
        it('should default pass', () => {
            expect(player).toEqual({"box": div, "matchedCardsArray": [], "playerName": name, "playerNameBox": p, "scoreBox": p, "turn": false})
        })
    
        it('should pass with turn ture', () => {
            player.turn = true
            expect(player).toEqual({"box": div, "matchedCardsArray": [], "playerName": name, "playerNameBox": p, "scoreBox": p, "turn": true})
        })
    
        it('should pass with not a empty array', () => {
            player.matchedCardsArray.push('egewg')
            expect(player).toEqual({"box": div, "matchedCardsArray": ["egewg"], "playerName": name, "playerNameBox": p, "scoreBox": p, "turn": true})
        })
    })

    describe('test Methods', () => {
        it('should test createPlayer', () => {
            const createPlayer = player.createPlayer()
            div.classList.add('player')
            div.classList.add('whiteLargeFont')
            div.textContent = name
            div.append(p)
            expect(createPlayer).toEqual(div)
        })

        it('should test uptadescore', () => {
            const uptadedScore = player.updatescore()
            expect(uptadedScore).toBe(5)
        })

        it('should test addPlayerTurnClass', () => {
            const uptadeTurn = player.addPlayerTurnClass()
            expect(uptadeTurn).toBe(7)
        })

        it('should test addPlayerTurnClass', () => {
            const removeTurn = player.removePlayerTurnClass()
            expect(removeTurn).toBe(7)
        })
    })
});

describe('Test MixOrMatch', () => {
    const div = document.createElement('div')
    const InitalGame = new MixOrMatch(100, [div], 4)
    describe('test constructor', () => {
        class MixOrMatch {
            constructor(totalTime, cards, totalPlayers) {
                this.cardsArray = cards
                this.totalTime = totalTime
                this.timeRemaining = totalTime
                this.timer = document.querySelector('[data-timecontainer]')
                this.totalPlayers = totalPlayers
                this.playerContainer = document.querySelector('.playerContainer')
                this.allPlayers = []
                this.changeTurnAfterMissMatch = false
                this.audioController = new AudioController()
            }
        }

        it('should default pass', () => {
            expect(InitalGame).toEqual(new MixOrMatch(100, [div], 4))
        })

        it('should pass with not equal', () => {
            expect(InitalGame).not.toEqual(5)
        })
    })
    
    describe('test methods', () => {
        describe('test startGame', () => {
            it('should pass correctly', () => {
                const div = document.createElement('div')
                const cardsArray = []
                const start = InitalGame.startGame(div, cardsArray , div)
                expect(start).toEqual(7)
                jest.advanceTimersByTime(2000)
            })
        })

        describe('test hideCards', () => {
            it('should pass correctly', () => {
                const cardsArray = [div, div]
                expect(InitalGame.hideCards(cardsArray)).toBeUndefined()
            })
        })

        describe('test startCountdown', () => {
            it('should pass correctly', () => {
                const timer = document.createElement('div')
                InitalGame.timeRemaining = 2
                expect(InitalGame.startCountdown(timer, div))
                jest.advanceTimersByTime(2000)
                console.log(InitalGame)
            })
        })

        describe('test gameOver', () => {
            it('should pass correctly', () => {
                const div = document.createElement('div')
                expect(InitalGame.gameOver(div)).toBeUndefined()
            })
        })

        describe('test victory', () => {
            it('should pass correctly', () => {
                const div = document.createElement('div')
                expect(InitalGame.victory(div, div)).toBeUndefined()
            })
        })

        describe('test flipCard', () => {
            class Player {
                constructor(){
                    this.matchedCardsArray = []
                }

                updatescore() {
                    return null
                }
            }
            const card = document.createElement('div')
            const image = document.createElement('img')
            image.classList.add('card-face')
            image.src = 'HAHA SUIII'
            card.append(image)

            it('should pass correctly', () => {
                expect(InitalGame.flipCard(card, new Player)).toBeUndefined()
            })

            it('should take the if branch and take the CardMissMatch Branch', () => {
                const card2 = document.createElement('div')
                const image2 = document.createElement('img')
                image2.classList.add('card-face')
                image2.src = 'HAHA'
                card2.append(image2)
                InitalGame.cardToCheck = card2
                expect(InitalGame.flipCard(card, new Player)).toBeUndefined()
                jest.advanceTimersByTime(2000)
            })

            it('should take the if branch and take the CardMatch Branch', () => {
                const card2 = document.createElement('div')
                const image2 = document.createElement('img')
                image2.classList.add('card-face')
                image2.src = 'HAHA SUIII'
                card2.append(image2)
                InitalGame.cardToCheck = card2
                expect(InitalGame.flipCard(card, new Player)).toBeUndefined()
                jest.advanceTimersByTime(2000)
            });
        })

        describe('test cardMatch', () => {
            class Player {
                constructor(){
                    this.matchedCardsArray = []
                }
                updatescore(){return null}
            }

            const player1 = new Player()
            it('should pass correctly', () => {
                const div = document.createElement('div')
                InitalGame.cardMatch(div, div, player1, div, div)
                InitalGame.cardsArray.push(7)
                InitalGame.cardsArray.push(7)
                InitalGame.cardsArray.push(7)
                expect(InitalGame.matchedCards.length).toBe(4)
            })
        });

        describe('test victory', () => {
            it('should pass correctly', () => {
                class Player {
                    constructor() {
                        this.matchedCardsArray = []
                    }
                    updatescore() {return null}
                }
                InitalGame.cardsArray.push(0)
                InitalGame.cardsArray.push(0)
                expect(InitalGame.cardMatch(1,1, new Player(), div, div)).toBeUndefined()
            })
        });
        
        describe('test shuffleCards', () => {
            it('should pass correctly', () => {
                expect(InitalGame.shuffleCards([div, div])).toBeUndefined()
            });
        });
    })
    
})

describe('Test PlayerMix', () => {
    const div = document.createElement('div')
    const InitalPlayerMix = new PlayerMix(100, [div, div], 4)
    describe('test constructor', () => {
        it('should default pass', () => {
            expect(InitalPlayerMix).toEqual(new PlayerMix(100, [div, div], 4)) // make a better test
        })
    })

    describe('Test Methods', () => {

        class testPlayer {
            constructor(turn){
                this.turn = turn
            }

            removePlayerTurnClass(){
                return null
            }

            addPlayerTurnClass() {
                return null
            }
        }

        describe('Test start', () => {
            it('should pass correctly', () => {
                const allPlayerArray = [new testPlayer(false), new testPlayer(false), new testPlayer(false)]
                const div = document.createElement('div')
                expect(InitalPlayerMix.start(allPlayerArray, [div, div, div])).toBeUndefined()
            })
        })

        describe('Test addCardToFlipCard', () => {
            const Player1 = new testPlayer(true)
            const Player2 = new testPlayer(true)
            const Player3 = new testPlayer(true)
            const PlayerTurnTrue = new testPlayer(false)
            const allPlayers = [Player1, Player2, Player3]
            it('should pass correctly', () => {
                const div = document.createElement('div')

                jest.spyOn(div, 'addEventListener').mockImplementationOnce((event, handler) => {
                    handler()
                })

                InitalPlayerMix.addCardToFlipCard(Player1, allPlayers, [div])

                expect(div.addEventListener).toHaveBeenCalledWith('click', expect.any(Function))

            })

            it('should take the if path', () => {
                const div = document.createElement('div')

                jest.spyOn(div, 'addEventListener').mockImplementationOnce((event, handler) => {
                    handler()
                })

                InitalPlayerMix.addCardToFlipCard(PlayerTurnTrue, allPlayers, [div])

                expect(div.addEventListener).toHaveBeenCalledWith('click', expect.any(Function))
            })
        })

        describe('Test changePlayerturn', () => {
            it('should pass correctly', () => {  
                InitalPlayerMix.changeTurnAfterMissMatch = true
                InitalPlayerMix.allPlayers = [new testPlayer(),new testPlayer()]
                expect(InitalPlayerMix.changePlayerturn(new testPlayer(true), [new testPlayer(true), new testPlayer(true)])).toBeUndefined()
                jest.advanceTimersByTime(2000)
            })
        })

        // if know how addEventListener delete changePlayerturn

        describe('Test getNextPlayer and take the if branch', () => {
            it('should pass correctly', () => {
                const singlePlayerGame = new PlayerMix(100, [div, div], 1)
                const player1 = new testPlayer(true)
                const player2 = new testPlayer(true)
                const array = [player1, player2]
                expect(singlePlayerGame.getNextPlayer(player2, array)).toBeUndefined()
                jest.advanceTimersByTime(2000)
            })
        })
    });
})

describe('Test Ready', () => {
    it('should pass correctly', () => {
        Object.defineProperty(document, 'readyState', {
            get() {return "loading"}
        })
        expect(main()).toBe(undefined)
    })
})