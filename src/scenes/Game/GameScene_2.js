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
        this.load.image('game2_bg', `${path}game2_mazeobject1.png`);
        this.load.image('coin,', `${path}game2_mazeobject2.png`);

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

        this.initGame('game2_bg', 'game2_description', false, false, {
            targetRounds: 1,
            roundPerSeconds: 6000,
            isAllowRoundFail: false,
            isContinuousTimer: true,
            sceneIndex: 2
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


        this.upBtn = new CustomButton(this, 1650, 800, 'up_btn', 'up_btn_click', () => {
            this.moveDirection('up');
            this.resetPlayerState();
        }, () => {
        }).setDepth(2);

        this.downBtn = new CustomButton(this, 1650, 1000, 'down_btn', 'down_btn_click', () => {
            this.moveDirection('down');
            this.resetPlayerState();
        }, () => {
        }).setDepth(2);

        // Initially disable buttons until game starts
        this.leftBtn.setVisible(false);
        this.rightBtn.setVisible(false);
        this.upBtn.setVisible(false);
        this.downBtn.setVisible(false);

        this.leftBtn.disableInteractive();
        this.rightBtn.disableInteractive();
        this.upBtn.disableInteractive();
        this.downBtn.disableInteractive();

        this.genderKey = this.gender === 'M' ? 'boy' : 'girl';
        console.log('genderKey:', this.genderKey);

        // Use frontstop for boy, frontwalking for girl (since girl_frontstop doesn't exist)
        const idleKey = this.gender === 'M' ? 'frontstop' : 'frontwalking';
        this.player = this.add.sprite(this.centerX, 1000, `${this.genderKey}_${idleKey}`)
            .setOrigin(0.5, 1).setDepth(2).setScale(2);
        this.player.anims.play(`${this.genderKey}_${idleKey}_anim`, true);

        // Store idle animation key for resets
        this.idleAnimKey = `${this.genderKey}_${idleKey}_anim`;

    }

    moveDirection(direction) {
        const speed = 100;
        let animKey;

        switch (direction) {
            case 'left':
                animKey = 'leftwalking';
                this.player.x -= speed;
                break;
            case 'right':
                animKey = 'rightwalking';
                this.player.x += speed;
                break;
            case 'up':
                animKey = 'backwalking';
                this.player.y -= speed;
                break;
            case 'down':
                animKey = 'frontwalking';
                this.player.y += speed;
                break;
        }

        this.player.anims.play(`${this.genderKey}_${animKey}_anim`, true);
    }

    resetPlayerState() {
        this.time.delayedCall(300, () => {
            this.player.anims.play(this.idleAnimKey, true);
        });
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

    resetForNewRound() {

        // Reset player position to center
        if (this.player) {
            this.player.x = this.centerX;
            this.player.y = 1000;
            this.player.anims.play(this.idleAnimKey, true);
        }

        // Reset success counter
        this.successCount = 0;

        console.log('[GameScene_2] Reset for new round');
    }


    update() {

    }



    handleLose() {
        if (this.gameState === 'gameLose' || this.gameState === 'gameWin') return;

        if (!this.isSlowDown) {
            this.failSpeed = this.slowDownSpeed;
            this.isSlowDown = true;
            console.log("Fail speed reduced for next rounds.");
        } else {
            this.currentFailCount = (this.currentFailCount || 0) + 1;
            this.isGameActive = false;
            this.gameState = 'gameLose';
            this.fallingItems.forEach(item => item.destroy());
            this.label = this.add.image(1650, 350, 'game_fail_label').setDepth(555);
            if (this.gameTimer) this.gameTimer.stop();
            this.enableGameInteraction(false);
            this.updateRoundUI(false);

            this.showBubble('tryagain');
        }
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