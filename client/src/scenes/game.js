import Card from '../helpers/card';
import Zone from '../helpers/zone';
import io from 'socket.io-client';
import Dealer from '../helpers/dealer';

export default class Game extends Phaser.Scene {
    constructor() {
        super({
            key: 'Game'
        });
    }
    // {transports:["websocket"]});
    // These 3 functions are part of the phaser workflow
    preload() {
        this.load.image('cardBack_red5', 'src/cardSprites/cardBack_red5.png');
        this.load.image('cardClubs2', 'src/cardSprites/cardClubs2.png');
        this.load.image('cardClubs3', 'src/cardSprites/cardClubs3.png');
        this.load.image('cardClubs4', 'src/cardSprites/cardClubs4.png');
        this.load.image('cardClubs5', 'src/cardSprites/cardClubs5.png');
        this.load.image('cardClubs6', 'src/cardSprites/cardClubs6.png');
        this.load.image('cardClubs7', 'src/cardSprites/cardClubs7.png');
        this.load.image('cardClubs8', 'src/cardSprites/cardClubs8.png');
        this.load.image('cardClubs9', 'src/cardSprites/cardClubs9.png');
        this.load.image('cardClubs10', 'src/cardSprites/cardClubs10.png');
        this.load.image('cardClubsA', 'src/cardSprites/cardClubsA.png');
        this.load.image('cardClubsJ', 'src/cardSprites/cardClubsJ.png');
        this.load.image('cardClubsQ', 'src/cardSprites/cardClubsQ.png');
        this.load.image('cardDiamonds2', 'src/cardSprites/cardDiamonds2.png');
        this.load.image('cardDiamonds3', 'src/cardSprites/cardDiamonds3.png');
        this.load.image('cardDiamonds4', 'src/cardSprites/cardDiamonds4.png');
        this.load.image('cardDiamonds5', 'src/cardSprites/cardDiamonds5.png');
        this.load.image('cardDiamonds6', 'src/cardSprites/cardDiamonds6.png');
        this.load.image('cardDiamonds7', 'src/cardSprites/cardDiamonds7.png');
        this.load.image('cardDiamonds8', 'src/cardSprites/cardDiamonds8.png');
        this.load.image('cardDiamonds9', 'src/cardSprites/cardDiamonds9.png');
        this.load.image('cardDiamonds10', 'src/cardSprites/cardDiamonds10.png');
        this.load.image('cardDiamondsA', 'src/cardSprites/cardDiamondsA.png');
        this.load.image('cardDiamondsJ', 'src/cardSprites/cardDiamondsJ.png');
        this.load.image('cardDiamondsQ', 'src/cardSprites/cardDiamondsQ.png');
        this.load.image('cardHearts2', 'src/cardSprites/cardHearts2.png');
        this.load.image('cardHearts3', 'src/cardSprites/cardHearts3.png');
        this.load.image('cardHearts4', 'src/cardSprites/cardHearts4.png');
        this.load.image('cardHearts5', 'src/cardSprites/cardHearts5.png');
        this.load.image('cardHearts6', 'src/cardSprites/cardHearts6.png');
        this.load.image('cardHearts7', 'src/cardSprites/cardHearts7.png');
        this.load.image('cardHearts8', 'src/cardSprites/cardHearts8.png');
        this.load.image('cardHearts9', 'src/cardSprites/cardHearts9.png');
        this.load.image('cardHearts10', 'src/cardSprites/cardHearts10.png');
        this.load.image('cardHeartsA', 'src/cardSprites/cardHeartsA.png');
        this.load.image('cardHeartsJ', 'src/cardSprites/cardHeartsJ.png');
        this.load.image('cardHeartsQ', 'src/cardSprites/cardHeartsQ.png');
        this.load.image('cardSpades2', 'src/cardSprites/cardSpades2.png');
        this.load.image('cardSpades3', 'src/cardSprites/cardSpades3.png');
        this.load.image('cardSpades4', 'src/cardSprites/cardSpades4.png');
        this.load.image('cardSpades5', 'src/cardSprites/cardSpades5.png');
        this.load.image('cardSpades6', 'src/cardSprites/cardSpades6.png');
        this.load.image('cardSpades7', 'src/cardSprites/cardSpades7.png');
        this.load.image('cardSpades8', 'src/cardSprites/cardSpades8.png');
        this.load.image('cardSpades9', 'src/cardSprites/cardSpades9.png');
        this.load.image('cardSpades10', 'src/cardSprites/cardSpades10.png');
        this.load.image('cardSpadesA', 'src/cardSprites/cardSpadesA.png');
        this.load.image('cardSpadesJ', 'src/cardSprites/cardSpadesJ.png');
        this.load.image('cardSpadesQ', 'src/cardSprites/cardSpadesQ.png');
    }

    create() {
        // Insert game logic and game state variables here
		this.isPlayerA = false;
        this.opponentCards = [];

        this.zone = new Zone(this);
        this.dropZone = this.zone.renderZone();
        this.outline = this.zone.renderOutline(this.dropZone);

        this.dealer = new Dealer(this);

        let self = this;

        this.socket = io('http://localhost:3000',{transports:["websocket"]});

        this.socket.on('connect', function () {
            console.log('Connected!');
        });

        this.socket.on('isPlayerA', function () {
            self.isPlayerA = true;
        })

        this.socket.on('dealCards', function () {
            self.dealer.dealCards();
            self.dealText.disableInteractive();
        })

        this.socket.on('cardPlayed', function (gameObject, isPlayerA) {
            if (isPlayerA !== self.isPlayerA) {
                let sprite = gameObject.textureKey;
                self.opponentCards.shift().destroy();
                self.dropZone.data.values.cards++;
                let card = new Card(self);
                card.render(((self.dropZone.x - 350) + (self.dropZone.data.values.cards * 50)), (self.dropZone.y), sprite).disableInteractive();
            }
        })

        this.dealText = this.add.text(75, 350, ['DEAL CARDS']).setFontSize(18).setFontFamily('Trebuchet MS').setColor('#00ffff').setInteractive();

        this.dealText.on('pointerdown', function () {
            self.socket.emit("dealCards");
        })

        this.dealText.on('pointerover', function () {
            self.dealText.setColor('#ff69b4');
        })

        this.dealText.on('pointerout', function () {
            self.dealText.setColor('#00ffff');
        })

        this.input.on('drag', function (pointer, gameObject, dragX, dragY) {
            gameObject.x = dragX;
            gameObject.y = dragY;
        })

        this.input.on('dragstart', function (pointer, gameObject) {
            gameObject.setTint(0xff69b4);
            self.children.bringToTop(gameObject);
        })

        this.input.on('dragend', function (pointer, gameObject, dropped) {
            gameObject.setTint();
            if (!dropped) {
                gameObject.x = gameObject.input.dragStartX;
                gameObject.y = gameObject.input.dragStartY;
            }
        })

        this.input.on('drop', function (pointer, gameObject, dropZone) {
            dropZone.data.values.cards++;
            gameObject.x = (dropZone.x - 350) + (dropZone.data.values.cards * 50);
            gameObject.y = dropZone.y;
            gameObject.disableInteractive();
            self.socket.emit('cardPlayed', gameObject, self.isPlayerA);
        })
    }

    update() {

    }
}