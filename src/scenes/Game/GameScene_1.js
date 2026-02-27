import BaseGameScene from './BaseGameScene.js';
import { CustomButton } from '../../UI/Button.js';
import { CustomPanel, CustomFailPanel } from '../../UI/Panel.js';
import GameManager from '../GameManager.js';

export class GameScene_1 extends BaseGameScene {
    constructor() {
        super('GameScene_1');
    }
    preload() {
        const path = 'assets/images/Game_1/';

        this.width = this.cameras.main.width;
        this.height = this.cameras.main.height;
        this.centerX = this.width / 2;
        this.centerY = this.height / 2;

        this.load.image('game1_npc_box_intro', `${path}game1_npc_box3.png`);

        this.load.image('game1_npc_box_boy_win', `${path}game1_npc_box4.png`);
        this.load.image('game1_npc_box_girl_win', `${path}game1_npc_girl_box4.png`);
        this.load.image('game1_npc_box_win', `${path}game1_npc_box5.png`);
        this.load.image('game1_npc_box_boy_win3', `${path}game1_npc_box6.png`);
        this.load.image('game1_npc_box_girl_win3', `${path}game1_npc_girl_box6.png`);

        this.load.image('game1_npc_box_tryagain', `${path}game1_npc_box7.png`);

        this.gender = 'M';
        if (localStorage.getItem('player')) {
            this.gender = JSON.parse(localStorage.getItem('player')).gender;
        }

        if (this.gender === 'M') {
            this.load.spritesheet('boy_fail', path +
                'game1_boy_fail.png', { frameWidth: 340, frameHeight: 500 });

            this.load.spritesheet('boy_left', path +
                'game1_boy_left.png', { frameWidth: 340, frameHeight: 500 });

            this.load.spritesheet('boy_middle', path +
                'game1_boy_middle.png', { frameWidth: 340, frameHeight: 500 });

            this.load.spritesheet('boy_right', path +
                'game1_boy_right.png', { frameWidth: 340, frameHeight: 500 });

            this.load.spritesheet('boy_success', path +
                'game1_boy_success.png', { frameWidth: 340, frameHeight: 500 });
        } else {
            this.load.spritesheet('girl_fail', path +
                'game1_girl_fail.png', { frameWidth: 623, frameHeight: 272 });

            this.load.spritesheet('girl_left', path +
                'game1_girl_left.png', { frameWidth: 623, frameHeight: 272 });

            this.load.spritesheet('girl_middle', path +
                'game1_girl_middle.png', { frameWidth: 623, frameHeight: 272 });

            this.load.spritesheet('girl_right', path +
                'game1_girl_right.png', { frameWidth: 623, frameHeight: 272 });

            this.load.spritesheet('girl_success', path +
                'game1_girl_success.png', { frameWidth: 623, frameHeight: 272 });
        }

    }

    create() {
        this.createAnimations();

        this.initGame('game1_bg', 'game1_description', false, false, {
            targetRounds: 3,
            roundPerSeconds: 6000,
            isAllowRoundFail: false,
            isContinuousTimer: true,
            sceneIndex: 1
        });

        this.leftBtn = new CustomButton(this, 1550, 900, 'left_btn', 'left_btn_click', () => {
            this.moveDirection('left');
            this.resetPlayerState();
        }, () => {
        }).setDepth(2);

        this.rightBtn = new CustomButton(this, 1750, 900, 'right_btn', 'right_btn_click',
            () => {
                this.moveDirection('right');
                this.resetPlayerState();
            }, () => {

            }).setDepth(2);

        // Initially disable buttons until game starts
        this.leftBtn.setVisible(false);
        this.rightBtn.setVisible(false);
        this.leftBtn.disableInteractive();
        this.rightBtn.disableInteractive();

        this.genderKey = this.gender === 'M' ? 'boy' : 'girl';
        console.log('genderKey:', this.genderKey);

        this.player = this.add.sprite(this.centerX, 1000, `${this.genderKey}_middle`)
            .setOrigin(0.5, 1).setDepth(2);
        this.player.anims.play(`${this.genderKey}_middle_anim`, true);

        this.playerBasket = this.add.zone(this.player.x, this.player.y - 150, 180, 80);

        this.physics.add.existing(this.playerBasket);
        this.playerBasket.body.setAllowGravity(false);
        this.playerBasket.body.setImmovable(true);

        this.basketGfx = this.add.graphics();
        this.basketGfx.setDepth(3);


        // spawn settings
        this.canSpawn = false;
        this.minX = 200;
        this.maxX = 1600;
        this.minY = 0;
        this.maxY = 700;
        this.failSpeed = 4;
        this.isSlowDown = false;
        this.slowDownSpeed = this.failSpeed / 2;


        // Create item sprites and store them in an array
        this.itemKeys = [
            'game1_failobject1',
            'game1_failobject2',
            'game1_failobject3',
            'game1_failobject4',
            'game1_successobject'
        ];
        // Shuffle the item order
        Phaser.Utils.Array.Shuffle(this.itemKeys);

        this.fallingItems = [];
        this.spawnTimer = 0;

        this.physics.add.overlap(this.playerBasket, this.fallingItems, (basket, item) => {
            this.handleItemCollection(item);
        }, null, this);
    }

    moveDirection(direction) {
        const speed = 100;
        // direction: 'left' or 'right'
        this.player.anims.play(`${this.genderKey}_${direction}_anim`, true);
        this.player.x += direction === 'left' ? -speed : speed;
    }

    resetPlayerState() {
        this.time.delayedCall(300, () => {
            this.player.anims.play(`${this.genderKey}_middle_anim`, true);
        });
    }

    enableGameInteraction(enabled) {
        this.canSpawn = enabled;
        this.leftBtn.setVisible(enabled);
        this.rightBtn.setVisible(enabled);

        if (enabled) {
            this.leftBtn.setInteractive();
            this.rightBtn.setInteractive();
        } else {
            this.leftBtn.disableInteractive();
            this.rightBtn.disableInteractive();
        }
    }


    update() {

        if (!this.canSpawn) return;

        if (this.player && this.playerBasket) {
            // Sync the invisible physics body
            this.playerBasket.x = this.player.x;
            this.playerBasket.y = this.player.y - 450;

            // Redraw the visual box
            this.basketGfx.clear();
            this.basketGfx.lineStyle(2, 0x00ff00, 1); // Green border
            this.basketGfx.strokeRect(
                this.playerBasket.x - 75, // Center it (150 width / 2)
                this.playerBasket.y - 25, // Center it (50 height / 2)
                this.playerBasket.width,
                this.playerBasket.height
            );
            // Spawn new item every 800ms (or adjust as needed)
            if (!this.lastSpawnTime) this.lastSpawnTime = this.time.now;
            if (this.time.now - this.lastSpawnTime > 800) {
                this.spawnRandomItem();
                this.lastSpawnTime = this.time.now;
            }

            // Make all falling items fall
            for (let i = this.fallingItems.length - 1; i >= 0; i--) {
                const item = this.fallingItems[i];
                if (item.active) {
                    item.y += this.failSpeed; // fall speed
                    if (item.y > this.maxY) {
                        item.setActive(false).setVisible(false);
                        this.fallingItems.splice(i, 1);
                    }
                }
            }
        }
    }



    handleLose() {
        if (this.gameState === 'gameLose') return;

        if (!this.isSlowDown) {
            this.failSpeed = this.slowDownSpeed;
            this.isSlowDown = true;
            console.log("Fail speed reduced for next rounds.");
        } else {
            this.currentFailCount = (this.currentFailCount || 0) + 1;
            this.isGameActive = false;
            this.gameState = 'gameLose';

            this.label = this.add.image(1650, 350, 'game_fail_label').setDepth(555);
            if (this.gameTimer) this.gameTimer.stop();
            this.enableGameInteraction(false);
            this.updateRoundUI(false);
            this.fallingItems.forEach(item => item.setActive(false).setVisible(false));
            this.showBubble('tryagain');
        }
    }

    showWin() {
        if (this.gameState === 'gameWin') return;

        this.bubbleImage = this.add.image(this.centerX, this.cameras.main.height * 0.8, 'game1_npc_box_win2')
            .setDepth(555).setInteractive({ useHandCursor: true })
            .on('pointerdown', () => {
                this.bubbleImage.destroy();
                this.characterBubble = this.add.image(this.centerX, this.cameras.main.height * 0.8,
                    'game1_npc_box_' + this.genderKey + '_win3').setDepth(555).setInteractive({ useHandCursor: true })
                    .on('pointerdown', () => {
                        this.characterBubble.destroy();
                        this.showObjectPanel();
                    });

            });
    }

    showObjectPanel() {
        const objectPanel = new CustomPanel(this, 960, 600, 'game1_object_description');
        objectPanel.setDepth(1000).setVisible(true);
        objectPanel.setCloseCallBack(() => GameManager.backToMainStreet(this));
    }

    spawnRandomItem() {
        // Pick a random item key from the shuffled array
        const key = Phaser.Utils.Array.GetRandom(this.itemKeys);
        // Spawn at random x, always y = minY
        const x = Phaser.Math.Between(this.minX, this.maxX);
        const y = this.minY;
        // Create the sprite
        const item = this.physics.add.sprite(x, y, key).setOrigin(0.5, 0.5).setDepth(2);
        item.isSuccessObject = (key === 'game1_successobject');

        item.setActive(true).setVisible(true);
        this.fallingItems.push(item);
    }


    handleItemCollection(item) {
        if (!this.isGameActive) return;

        if (item.isSuccessObject) {

            item.destroy();

            this.handleWinBeforeBubble();
        } else {

            item.destroy();

            this.handleLose();
        }
    }
    createAnimations() {
        // Boy animations
        this.anims.create({
            key: 'boy_fail_anim',
            frames: this.anims.generateFrameNumbers('boy_fail', { start: 0, end: 66 }),
            frameRate: 30,
            repeat: -1
        });
        this.anims.create({
            key: 'boy_left_anim',
            frames: this.anims.generateFrameNumbers('boy_left', { start: 0, end: 66 }),
            frameRate: 30,
            repeat: -1
        });
        this.anims.create({
            key: 'boy_middle_anim',
            frames: this.anims.generateFrameNumbers('boy_middle', { start: 0, end: 66 }),
            frameRate: 30,
            repeat: -1
        });
        this.anims.create({
            key: 'boy_right_anim',
            frames: this.anims.generateFrameNumbers('boy_right', { start: 0, end: 66 }),
            frameRate: 30,
            repeat: -1
        });
        this.anims.create({
            key: 'boy_success_anim',
            frames: this.anims.generateFrameNumbers('boy_success', { start: 0, end: 66 }),
            frameRate: 30,
            repeat: -1
        });

        // Girl animations
        this.anims.create({
            key: 'girl_fail_anim',
            frames: this.anims.generateFrameNumbers('girl_fail', { start: 0, end: 66 }),
            frameRate: 30,
            repeat: -1
        });
        this.anims.create({
            key: 'girl_left_anim',
            frames: this.anims.generateFrameNumbers('girl_left', { start: 0, end: 66 }),
            frameRate: 30,
            repeat: -1
        });
        this.anims.create({
            key: 'girl_middle_anim',
            frames: this.anims.generateFrameNumbers('girl_middle', { start: 0, end: 66 }),
            frameRate: 30,
            repeat: -1
        });
        this.anims.create({
            key: 'girl_right_anim',
            frames: this.anims.generateFrameNumbers('girl_right', { start: 0, end: 66 }),
            frameRate: 30,
            repeat: -1
        });
        this.anims.create({
            key: 'girl_success_anim',
            frames: this.anims.generateFrameNumbers('girl_success', { start: 0, end: 66 }),
            frameRate: 30,
            repeat: -1
        });
    }
}