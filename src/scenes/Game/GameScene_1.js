import BaseGameScene from './BaseGameScene.js';
import { CustomButton } from '../../UI/Button.js';

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

        for (let i = 1; i <= 8; i++) {
            this.load.image(`game1_npc_box${i}`, `assets/images/Game_1/game1_npc_box${i}.png`);
        }
    }

    create() {
        this.createAnimations();

        this.initGame('game1_bg', 'game1_description', false, true, {
            targetRounds: 3,
            roundPerSeconds: 60,
            isAllowRoundFail: false,
            isContinuousTimer: true
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
        this.canSpawn = true;
        this.minX = 200;
        this.maxX = 1600;
        this.minY = 0;
        this.maxY = 700;
        this.fallspeed = 4;

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
                    item.y += this.fallspeed; // fall speed
                    if (item.y > this.maxY) {
                        item.setActive(false).setVisible(false);
                        this.fallingItems.splice(i, 1);
                    }
                }
            }
        }
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
        // Prevent double-triggering if the game is already in a win/loss state
        // if (!this.isGameActive) return;

        if (item.isSuccessObject) {
            console.log("Success item collected!");
            item.destroy(); // Remove from screen

            // Triggers the win flow defined in BaseGameScene
            this.handleWinBeforeBubble();
        } else {
            console.log("Fail item collected!");
            item.destroy();

            // Triggers the lose/try-again flow defined in BaseGameScene
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