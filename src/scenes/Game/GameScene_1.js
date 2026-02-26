import BaseGameScene from './BaseGameScene.js';

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
                'game1_boy_fail.png', { frameWidth: 623, frameHeight: 272 });

            this.load.spritesheet('boy_left', path +
                'game1_boy_left.png', { frameWidth: 623, frameHeight: 272 });

            this.load.spritesheet('boy_middle', path +
                'game1_boy_middle.png', { frameWidth: 340, frameHeight: 500 });

            this.load.spritesheet('boy_right', path +
                'game1_boy_right.png', { frameWidth: 623, frameHeight: 272 });

            this.load.spritesheet('boy_success', path +
                'game1_boy_success.png', { frameWidth: 623, frameHeight: 272 });
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
        this.initGame('game1_bg', 'game1_description', false, true);

        this.genderKey = this.gender === 'M' ? 'boy' : 'girl';
        console.log('genderKey:', this.genderKey);

        this.player = this.add.sprite(this.centerX, 1000, `${this.genderKey}_middle`)
            .setOrigin(0.5, 1).setDepth(2);
        this.player.anims.play(`${this.genderKey}_middle_anim`, true);
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