import BaseGameScene from './BaseGameScene.js';
import { CustomButton } from '../../UI/Button.js';
import { CustomPanel, CustomFailPanel } from '../../UI/Panel.js';
import GameManager from '../GameManager.js';

export class GameScene_2 extends BaseGameScene {
    constructor() {
        super('GameScene_2');
    }
    preload() {
        const path = 'assets/images/Game_2/';

        this.width = this.cameras.main.width;
        this.height = this.cameras.main.height;
        this.centerX = this.width / 2;
        this.centerY = this.height / 2;

        this.load.image('game2_npc_box_intro', `${path}game2_npc_box3.png`);
        this.load.image('game2_npc_box_win', `${path}game2_npc_box4.png`);
        this.load.image('game2_npc_box_tryagain', `${path}game2_npc_box5.png`);
        this.load.image('pen', `${path}game2_mazeobject1.png`);
        this.load.image('coin', `${path}game2_mazeobject2.png`);

        this.load.image('up_btn', `${path}game2_up_button.png`);
        this.load.image('up_btn_click', `${path}game2_up_button_click.png`);
        this.load.image('down_btn', `${path}game2_down_button.png`);
        this.load.image('down_btn_click', `${path}game2_down_button_click.png`);

        this.gender = 'M';
        if (localStorage.getItem('player')) {
            this.gender = JSON.parse(localStorage.getItem('player')).gender;
        }
        if (this.gender === 'M') {
            this.load.spritesheet('boy_backstop', path +
                'game2_boy_backstop.png', { frameWidth: 105, frameHeight: 105 });

            this.load.spritesheet('boy_backwalking', path +
                'game2_boy_backwalking.png', { frameWidth: 105, frameHeight: 105 });

            this.load.spritesheet('boy_frontstop', path +
                'game2_boy_frontstop.png', { frameWidth: 105, frameHeight: 105 });

            this.load.spritesheet('boy_frontwalking', path +
                'game2_boy_frontwalking.png', { frameWidth: 105, frameHeight: 105 });

            this.load.spritesheet('boy_leftstop', path +
                'game2_boy_leftstop.png', { frameWidth: 105, frameHeight: 105 });

            this.load.spritesheet('boy_leftwalking', path +
                'game2_boy_leftwalking.png', { frameWidth: 105, frameHeight: 105 });

            this.load.spritesheet('boy_rightstop', path +
                'game2_boy_rightstop.png', { frameWidth: 105, frameHeight: 105 });

            this.load.spritesheet('boy_rightwalking', path +
                'game2_boy_rightwalking.png', { frameWidth: 105, frameHeight: 105 });
        } else {
            this.load.spritesheet('girl_backstop', path +
                'game2_girl_backstop.png', { frameWidth: 105, frameHeight: 105 });

            this.load.spritesheet('girl_backwalking', path +
                'game2_girl_backwalking.png', { frameWidth: 105, frameHeight: 105 });

            this.load.spritesheet('girl_frontwalking', path +
                'game2_girl_frontwalking.png', { frameWidth: 105, frameHeight: 105 });

            this.load.spritesheet('girl_leftstop', path +
                'game2_girl_leftstop.png', { frameWidth: 105, frameHeight: 105 });

            this.load.spritesheet('girl_leftwalking', path +
                'game2_girl_leftwalking.png', { frameWidth: 105, frameHeight: 105 });

            this.load.spritesheet('girl_rightstop', path +
                'game2_girl_rightstop.png', { frameWidth: 105, frameHeight: 105 });

            this.load.spritesheet('girl_rightwalking', path +
                'game2_girl_rightwalking.png', { frameWidth: 105, frameHeight: 105 });
        }

    }

    create() {
        this.createAnimations();

        // Movement settings
        this.moveStep = 80;  // Pixels per move
        this.isMoving = false;

        // Player start position
        this.playerStartX = this.centerX + 50;
        this.playerStartY = 800;

        // Item tracking
        this.coins = [];
        this.pens = [];
        this.collectedPens = 0;

        this.initGame('game2_bg', 'game2_description', false, false, {
            targetRounds: 3,
            roundPerSeconds: 60,
            isAllowRoundFail: true,
            isContinuousTimer: true,
            sceneIndex: 2
        });

        // Direction buttons
        this.leftBtn = new CustomButton(this, 1500, 900, 'left_btn', 'left_btn_click', () => {
            this.moveDirection('left');
        }, () => { }).setDepth(2);

        this.rightBtn = new CustomButton(this, 1800, 900, 'right_btn', 'right_btn_click', () => {
            this.moveDirection('right');
        }, () => { }).setDepth(2);

        this.upBtn = new CustomButton(this, 1650, 750, 'up_btn', 'up_btn_click', () => {
            this.moveDirection('up');
        }, () => { }).setDepth(2);

        this.downBtn = new CustomButton(this, 1650, 900, 'down_btn', 'down_btn_click', () => {
            this.moveDirection('down');
        }, () => { }).setDepth(2);

        // Character setup
        this.genderKey = this.gender === 'M' ? 'boy' : 'girl';
        console.log('genderKey:', this.genderKey);

        // Use frontstop for boy, frontwalking for girl (girl_frontstop doesn't exist)
        const idleKey = this.gender === 'M' ? 'frontstop' : 'frontwalking';
        this.idleAnimKey = `${this.genderKey}_${idleKey}_anim`;
        this.lastDirection = 'down';

        // Create player at starting position as a normal sprite (NO physics body)
        this.player = this.add.sprite(this.playerStartX, this.playerStartY, `${this.genderKey}_${idleKey}`)
            .setOrigin(0.5, 0.5).setDepth(2).setScale(2);



        this.maxCoins = 5;
        this.maxPens = 6;
        this.placeCoins();
        this.placePens();
        this.createWallColliders();

    }

    createWallColliders() {
        this.walls = this.physics.add.staticGroup();
        this.wallRects = [];

        const debugVisible = true;
        // Outer boundary walls
        this.createWall(this.centerX, 160, 2300, 210, debugVisible, true);
        this.createWall(this.centerX + 480, 250, 800, 150, debugVisible, true);
        this.createWall(this.centerX, this.centerY + 480, 2300, 210, debugVisible, true);
        this.createWall(this.centerX + 550, this.centerY + 430, 500, 210, debugVisible, true);

        // Interior walls
        this.createWall(800, 450, 290, 190, debugVisible, true);
        this.createWall(this.centerX - 520, this.centerY + 130, 280, 250, debugVisible, true);
        this.createWall(this.centerX - 430, this.centerY + 100, 400, 160, debugVisible, true);
        this.createWall(this.centerX - 150, this.centerY + 330, 320, 150, debugVisible, true);
        this.createWall(1000, 680, 320, 80, debugVisible, true);
        this.createWall(1050, 500, 750, 100, debugVisible, true);
        // Top-left / right grass/tree area
        this.createWall(100, 350, 250, 180, debugVisible, true);
        // Left side vertical grass path
        this.createWall(0, 520, 150, 980, debugVisible, true);
        // Bottom-left grass
        this.createWall(200, 800, 80, 500, debugVisible, true);
        this.createWall(120, 850, 100, 100, debugVisible, true);
        this.createWall(400, 320, 150, 100, debugVisible, true);
        this.createWall(450, 420, 280, 100, debugVisible, true);

        this.createWall(1120, 850, 120, 120, debugVisible, true);
        this.createWall(1820, 750, 150, 120, debugVisible, true);
        this.createWall(1870, 350, 100, 980, debugVisible, true);
        this.createWall(900, 560, 140, 180, debugVisible, true);
        this.createWall(1350, 600, 150, 330, debugVisible, true);
        this.createWall(1620, 690, 240, 350, debugVisible, true);
        this.createWall(1650, 320, 280, 200, debugVisible, true);

        console.log(`[GameScene_2] Created ${this.walls.getChildren().length} wall colliders`);
    }
    createWall(x, y, width, height, visible = false, confirmed = false) {
        const color = confirmed ? 0x00ff00 : 0xff0000; // Green if confirmed, red if not
        const wall = this.add.rectangle(x, y, width, height, color, 0.0).setDepth(500);
        this.physics.add.existing(wall, true);
        this.walls.add(wall);

        this.wallRects.push({
            x: x - width / 2,
            y: y - height / 2,
            width: width,
            height: height
        });

        return wall;
    }


    moveDirection(direction) {
        if (this.isMoving || !this.isGameActive) return;

        let targetX = this.player.x;
        let targetY = this.player.y;
        let walkAnimKey, stopAnimKey;

        switch (direction) {
            case 'left':
                targetX -= this.moveStep;
                walkAnimKey = `${this.genderKey}_leftwalking_anim`;
                stopAnimKey = `${this.genderKey}_leftstop_anim`;
                break;
            case 'right':
                targetX += this.moveStep;
                walkAnimKey = `${this.genderKey}_rightwalking_anim`;
                stopAnimKey = `${this.genderKey}_rightstop_anim`;
                break;
            case 'up':
                targetY -= this.moveStep;
                walkAnimKey = `${this.genderKey}_backwalking_anim`;
                stopAnimKey = `${this.genderKey}_backstop_anim`;
                break;
            case 'down':
                targetY += this.moveStep;
                walkAnimKey = `${this.genderKey}_frontwalking_anim`;
                stopAnimKey = this.gender === 'M'
                    ? `${this.genderKey}_frontstop_anim`
                    : `${this.genderKey}_frontwalking_anim`;
                break;
        }

        console.log(`[GameScene_2] Attempting move ${direction} to (${targetX}, ${targetY})`);

        // Manual intersection check against walls using points instead of Arcade physics
        if (this.wouldCollideWithWall(targetX, targetY)) {
            console.log('[GameScene_2] Blocked by wall!');
            return;
        }

        this.lastDirection = direction;
        this.isMoving = true;

        this.player.anims.play(walkAnimKey, true);

        // Smoothly tween the position since arcade physics velocity isn't being used
        this.tweens.add({
            targets: this.player,
            x: targetX,
            y: targetY,
            duration: 250,
            ease: 'Linear',
            onComplete: () => {
                this.isMoving = false;
                this.player.anims.play(stopAnimKey, true);

                this.checkCoinCollision();
                this.checkPenCollection();
            }
        });
    }

    wouldCollideWithWall(x, y) {
        // Just checking a very precise 10x10 area at the character's feet coordinates
        const hitBBoxSize = 15;
        const playerRect = new Phaser.Geom.Rectangle(x - hitBBoxSize / 2, y + 40, hitBBoxSize, hitBBoxSize);

        for (const wall of this.wallRects) {
            const wallRect = new Phaser.Geom.Rectangle(wall.x, wall.y, wall.width, wall.height);
            if (Phaser.Geom.Intersects.RectangleToRectangle(playerRect, wallRect)) {
                return true;
            }
        }
        return false;
    }

    /** Check collision with coins using distance */
    checkCoinCollision() {
        const hitRadius = 60;
        for (const coin of this.coins) {
            if (!coin.visible) continue;
            const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, coin.x, coin.y);
            if (dist < hitRadius) {
                coin.setVisible(false);
                this.lives--;
                console.log(`[GameScene_2] Coin hit! Lives: ${this.lives}`);
                this.handleLose();
                return;
            }
        }
    }

    /** Check collection of pens using distance */
    checkPenCollection() {
        const pickupRadius = 40;
        for (const pen of this.pens) {
            if (!pen.visible) continue;
            const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, pen.x, pen.y);
            if (dist < pickupRadius) {
                pen.setVisible(false);
                this.collectedPens++;
                console.log(`[GameScene_2] Pen collected! (${this.collectedPens}/3)`);
                if (this.collectedPens >= 3) {
                    console.log('[GameScene_2] 3 pens collected! You win!');
                    this.onRoundWin();
                }
                return;
            }
        }
    }

    placeCoins() {

        const coinPositions = [
            { x: 250, y: 330 },
            { x: 100, y: 500 },
            { x: 600, y: 350 },
            { x: 780, y: 600 },
            { x: 850, y: 280 },
            { x: 1200, y: 380 },
            { x: 1200, y: 580 },
            { x: 1450, y: 450 },
            { x: 1780, y: 650 },
        ];

        Phaser.Utils.Array.Shuffle(coinPositions);

        coinPositions.forEach(pos => {
            if (this.coins.length == this.maxCoins) return;
            const coinSprite = this.add.image(pos.x, pos.y, 'coin').setDepth(2);
            this.coins.push(coinSprite);
        });
        console.log(`[GameScene_2] Placed ${this.coins.length} coins`);
    }

    placePens() {

        const penPositions = [
            { x: 100, y: 700 },
            { x: 280, y: 420 },   // Upper-left corridor
            { x: 600, y: 500 },   // Center path
            { x: 750, y: 300 },
            { x: 1000, y: 300 }, // Upper middle
            { x: 1200, y: 700 },  // Lower-right path
            { x: 1450, y: 350 },
            { x: 1450, y: 650 },
            { x: 1780, y: 450 },// Far right upper
        ];

        Phaser.Utils.Array.Shuffle(penPositions);

        penPositions.forEach(pos => {
            if (this.pens.length == this.maxPens) return;
            const penSprite = this.add.image(pos.x, pos.y, 'pen').setDepth(2);
            this.pens.push(penSprite);
        });
        console.log(`[GameScene_2] Placed ${this.pens.length} pens`);
    }

    enableGameInteraction(enabled) {
        this.canSpawn = enabled;
        this.leftBtn.setVisible(enabled);
        this.rightBtn.setVisible(enabled);
        this.upBtn.setVisible(enabled);
        this.downBtn.setVisible(enabled);

        if (enabled) {
            this.leftBtn.setInteractive();
            this.rightBtn.setInteractive();
            this.upBtn.setInteractive();
            this.downBtn.setInteractive();
        } else {
            this.leftBtn.disableInteractive();
            this.rightBtn.disableInteractive();
            this.upBtn.disableInteractive();
            this.downBtn.disableInteractive();
        }
    }

    /** Reset player position only */
    resetPlayerPosition() {
        this.isMoving = false;
        if (this.player) {
            this.player.x = this.playerStartX;
            this.player.y = this.playerStartY;
            this.player.anims.play(this.idleAnimKey, true);
        }
    }

    resetForNewRound() {
        this.isMoving = false;
        this.lives = 3;
        this.collectedPens = 0;

        if (this.player) {
            this.player.x = this.playerStartX;
            this.player.y = this.playerStartY;
            this.player.anims.play(this.idleAnimKey, true);
        }

        // Destroy and re-place items
        if (this.coins) {
            this.coins.forEach(c => c.destroy());
            this.coins = [];
        }
        if (this.pens) {
            this.pens.forEach(p => p.destroy());
            this.pens = [];
        }
        this.placeCoins();
        this.placePens();

    }

    showWin() {
        this.showObjectPanel();
    }

    showObjectPanel() {
        const objectPanel = new CustomPanel(this, 960, 600, [{
            content: 'game2_object_description',
            closeBtn: 'close_btn',
            closeBtnClick: 'close_btn_click'
        }]);
        objectPanel.setDepth(1000);
        objectPanel.show();
        objectPanel.setCloseCallBack(() => GameManager.backToMainStreet(this));
    }

    createAnimations() {
        // Boy animations
        this.anims.create({
            key: 'boy_backstop_anim',
            frames: this.anims.generateFrameNumbers('boy_backstop', { start: 0, end: 66 }),
            frameRate: 30,
            repeat: -1
        });
        this.anims.create({
            key: 'boy_backwalking_anim',
            frames: this.anims.generateFrameNumbers('boy_backwalking', { start: 0, end: 66 }),
            frameRate: 30,
            repeat: -1
        });
        this.anims.create({
            key: 'boy_frontstop_anim',
            frames: this.anims.generateFrameNumbers('boy_frontstop', { start: 0, end: 66 }),
            frameRate: 30,
            repeat: -1
        });
        this.anims.create({
            key: 'boy_frontwalking_anim',
            frames: this.anims.generateFrameNumbers('boy_frontwalking', { start: 0, end: 66 }),
            frameRate: 30,
            repeat: -1
        });
        this.anims.create({
            key: 'boy_leftstop_anim',
            frames: this.anims.generateFrameNumbers('boy_leftstop', { start: 0, end: 66 }),
            frameRate: 30,
            repeat: -1
        });
        this.anims.create({
            key: 'boy_leftwalking_anim',
            frames: this.anims.generateFrameNumbers('boy_leftwalking', { start: 0, end: 66 }),
            frameRate: 30,
            repeat: -1
        });
        this.anims.create({
            key: 'boy_rightstop_anim',
            frames: this.anims.generateFrameNumbers('boy_rightstop', { start: 0, end: 66 }),
            frameRate: 30,
            repeat: -1
        });
        this.anims.create({
            key: 'boy_rightwalking_anim',
            frames: this.anims.generateFrameNumbers('boy_rightwalking', { start: 0, end: 66 }),
            frameRate: 30,
            repeat: -1
        });

        // Girl animations
        this.anims.create({
            key: 'girl_backstop_anim',
            frames: this.anims.generateFrameNumbers('girl_backstop', { start: 0, end: 66 }),
            frameRate: 30,
            repeat: -1
        });
        this.anims.create({
            key: 'girl_backwalking_anim',
            frames: this.anims.generateFrameNumbers('girl_backwalking', { start: 0, end: 66 }),
            frameRate: 30,
            repeat: -1
        });
        this.anims.create({
            key: 'girl_frontwalking_anim',
            frames: this.anims.generateFrameNumbers('girl_frontwalking', { start: 0, end: 66 }),
            frameRate: 30,
            repeat: -1
        });
        this.anims.create({
            key: 'girl_leftstop_anim',
            frames: this.anims.generateFrameNumbers('girl_leftstop', { start: 0, end: 66 }),
            frameRate: 30,
            repeat: -1
        });
        this.anims.create({
            key: 'girl_leftwalking_anim',
            frames: this.anims.generateFrameNumbers('girl_leftwalking', { start: 0, end: 66 }),
            frameRate: 30,
            repeat: -1
        });
        this.anims.create({
            key: 'girl_rightstop_anim',
            frames: this.anims.generateFrameNumbers('girl_rightstop', { start: 0, end: 66 }),
            frameRate: 30,
            repeat: -1
        });
        this.anims.create({
            key: 'girl_rightwalking_anim',
            frames: this.anims.generateFrameNumbers('girl_rightwalking', { start: 0, end: 66 }),
            frameRate: 30,
            repeat: -1
        });
    }
}