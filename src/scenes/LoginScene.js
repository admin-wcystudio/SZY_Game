import { CustomButton } from '../UI/Button.js';
import { CustomPanel, SettingPanel } from '../UI/Panel.js';
import UIHelper from '../UI/UIHelper.js';
import VoiceOverHelper from '../Audio/VoiceOverHelper.js';

export class LoginScene extends Phaser.Scene {
    constructor() {
        super('LoginScene');
    }

    preload() {

          // Create loading bar UI
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        // Loading bar background
        const barBg = this.add.rectangle(width / 2, height / 2, 400, 30, 0x222222);
        barBg.setStrokeStyle(2, 0xffffff);

        // Loading bar fill
        const barFill = this.add.rectangle(width / 2 - 195, height / 2, 0, 22, 0x00ff00);
        barFill.setOrigin(0, 0.5);

        // Loading text
        const loadingText = this.add.text(width / 2, height / 2 - 50, '載入中...', {
            fontSize: '24px',
            fontFamily: 'Arial',
            color: '#ffffff'
        }).setOrigin(0.5);

        // Percentage text
        const percentText = this.add.text(width / 2, height / 2 + 50, '0%', {
            fontSize: '20px',
            fontFamily: 'Arial',
            color: '#ffffff'
        }).setOrigin(0.5);

        // Update progress bar on load progress
        this.load.on('progress', (value) => {
            barFill.width = 390 * value;
            percentText.setText(Math.round(value * 100) + '%');
        });

        // Minimum wait time in ms (30 seconds)
        const minWaitTime = 30000;
        const startTime = Date.now();
        let isAssetsLoaded = false;

        const checkLoadingComplete = () => {
            const elapsedTime = Date.now() - startTime;
            if (isAssetsLoaded && elapsedTime >= minWaitTime) {
                barBg.destroy();
                barFill.destroy();
                loadingText.destroy();
                percentText.destroy();
            } else if (isAssetsLoaded) {
                // If assets loaded but time hasn't passed, check again later
                const remainingTime = minWaitTime - elapsedTime;
                this.time.delayedCall(remainingTime, checkLoadingComplete, [], this);
            }
        };

        // Clean up when loading complete
        this.load.on('complete', () => {
            isAssetsLoaded = true;
            checkLoadingComplete();
        });

        const loginPath = 'assets/images/Login/';
        this.load.video('login_bg_video', loginPath + 'choosepage_bg.mp4');

        this.load.image('login_boy_btn', loginPath + 'choosepage_boy_button.png');
        this.load.image('login_boy_btn_click', loginPath + 'choosepage_boy_button_click.png');

        this.load.image('login_girl_btn', loginPath + 'choosepage_girl_button.png');
        this.load.image('login_girl_btn_click', loginPath + 'choosepage_girl_button_click.png');

        this.load.image('login_namebar', loginPath + 'choosepage_namebar.png');
        this.load.image('bubble1', loginPath + 'choosepage_bubble1.png');
        this.load.image('bubble2', loginPath + 'choosepage_bubble2.png');

        // frame = png size / (cols x rows)
        this.load.spritesheet('boy_galaxy', loginPath + 'choosepage_boy_galaxy.png',
            { frameWidth: 700, frameHeight: 900 }); // 3500x3600 / 5x4

        this.load.spritesheet('boy_chinese', loginPath + 'choosepage_boy_chinese.png',
            { frameWidth: 700, frameHeight: 900 }); // 3500x3600 / 5x4

        this.load.spritesheet('boy_transition', loginPath + 'choosepage_boy_galaxytochinese_transition.png',
            { frameWidth: 700, frameHeight: 900 }); // 5600x7200 / 8x8

        this.load.spritesheet('girl_galaxy', loginPath + 'choosepage_girl_galaxy.png',
            { frameWidth: 700, frameHeight: 900 }); // 3500x3600 / 5x4

        this.load.spritesheet('girl_chinese', loginPath + 'choosepage_girl_chinese.png',
            { frameWidth: 350, frameHeight: 450 }); // 3500x4500 / 10x10
        this.load.spritesheet('girl_transition', loginPath + 'choosepage_girl_galaxytochinese_transition.png',
            { frameWidth: 700, frameHeight: 900 }); // 5600x3600 / 8x4

        this.load.video('transition', loginPath + 'Transition.mp4');
    }

    create() {
        this.bgVideo = this.add.video(960, 540, 'login_bg_video');
        this.bgVideo.getFirstFrame();

        this.createAnimations();

        this.bgVideo.setMute(false);

        this.bgVideo.play(true); // loop

        const descriptionPages = [
            {
                content: 'game_description_p1',
                nextBtn: 'next_button', nextBtnClick: 'next_button_click',
                prevBtn: null, prevBtnClick: null,
                closeBtn: 'close_button', closeBtnClick: 'close_button_click'
            },
            {
                content: 'game_description_p2',
                nextBtn: 'next_button', nextBtnClick: 'next_button_click',
                prevBtn: 'prev_button', prevBtnClick: 'prev_button',
                closeBtn: 'close_button', closeBtnClick: 'close_button_click'
            }
        ];

        const programPages = [
            {
                content: 'program_information_p1',
                nextBtn: 'next_button', nextBtnClick: 'next_button_click',
                prevBtn: 'prev_button', prevBtnClick: 'prev_button_click',
                closeBtn: 'close_button', closeBtnClick: 'close_button_click'
            },
            {
                content: 'program_information_p2',
                nextBtn: 'next_button', nextBtnClick: 'next_button_click',
                prevBtn: 'prev_button', prevBtnClick: 'prev_button',
                closeBtn: 'close_button', closeBtnClick: 'close_button_click'
            },
            {
                content: 'program_information_p3',
                nextBtn: 'next_button', nextBtnClick: 'next_button_click',
                prevBtn: 'prev_button', prevBtnClick: 'prev_button',
                closeBtn: 'close_button', closeBtnClick: 'close_button_click'
            },
            {
                content: 'program_information_p4',
                nextBtn: 'next_button', nextBtnClick: 'next_button_click',
                prevBtn: 'prev_button', prevBtnClick: 'prev_button',
                closeBtn: 'close_button', closeBtnClick: 'close_button_click'
            }

        ]

        const ui = UIHelper.createCommonUI(this, programPages, descriptionPages,);

        this.add.image(960, 150, 'login_namebar').setDepth(10);

        const width = 350;
        const height = 50;


        this.nameInput = this.add.rexInputText(1080, 200, width, height, {
            type: 'text',
            placeholder: '_',
            fontSize: '48px',
            color: '#fbb03b',
            fontFamily: 'Arial',
            fontWeight: 'bold',
            backgroundColor: 'transparent'
        }).setDepth(20).setVisible(true);

        this.selectedGender = 'M';
        this.genderLocked = false;

        this.nameInput.on('textchange', () => {
            this.updateGenderButtonsEnabled();
        });

        // 1. Add the sprite (using the first spritesheet as initial texture)
        this.boySprite = this.add.sprite(620, 540, 'boy_galaxy')
            .setDepth(10)
            .setScrollFactor(0).setScale(1);

        this.boySprite.play('boy_galaxy_anim');

        this.girlSprite = this.add.sprite(1300, 560, 'girl_galaxy')
            .setDepth(10)
            .setScrollFactor(0).setScale(1);

        this.girlSprite.play('girl_galaxy_anim');


        this.add.image(340, 350, 'bubble1').setDepth(11);
        this.add.image(1650, 360, 'bubble2').setDepth(11);

        this.boyBtn = new CustomButton(
            this, 620, 950,
            'login_boy_btn', 'login_boy_btn_click',
            () => {
                this.savePlayerInfo('M');
            }, () => { });

        this.girlBtn = new CustomButton(
            this, 1300, 950,
            'login_girl_btn', 'login_girl_btn_click',
            () => {
                this.savePlayerInfo('F');
            }, () => { });

        this.updateGenderButtonsEnabled();
    }

    hasPlayerName() {
        return !!(this.nameInput?.text && this.nameInput.text.trim());
    }

    updateGenderButtonsEnabled() {
        if (this.genderLocked) return;
        const hasName = this.hasPlayerName();
        this.boyBtn.setActive(hasName);
        this.girlBtn.setActive(hasName);
    }

    lockGenderButtons(gender) {
        const selectedBtn = gender === 'M' ? this.boyBtn : this.girlBtn;
        const otherBtn = gender === 'M' ? this.girlBtn : this.boyBtn;

        selectedBtn.isClicked = true;
        selectedBtn.setPressedState();
        selectedBtn.setLocked(true);

        otherBtn.setActive(false);
        otherBtn.setLocked(true);

        if (this.nameInput?.setReadOnly) {
            this.nameInput.setReadOnly(true);
        }
    }

    savePlayerInfo(gender) {
        if (this.genderLocked) return;
        if (!this.hasPlayerName()) {
            UIHelper.showToast(this, "請先輸入名字");
            return;
        }

        this.genderLocked = true;
        this.selectedGender = gender;
        this.lockGenderButtons(gender);
        this.switchAnimation();
        VoiceOverHelper.ensureBgm(this);

        const player = { name: this.nameInput.text.trim(), gender: gender };
        localStorage.setItem('player', JSON.stringify(player));

        const allGamesResult = [
            { game: 1, isFinished: false, seconds: 0 },
            { game: 2, isFinished: false, seconds: 0 },
            { game: 3, isFinished: false, seconds: 0 },
            { game: 4, isFinished: false, seconds: 0 },
            { game: 5, isFinished: false, seconds: 0 },
            { game: 6, isFinished: false, seconds: 0 },
            { game: 7, isFinished: false, seconds: 0 },
        ];
        localStorage.setItem('allGamesResult', JSON.stringify(allGamesResult));

        this.switchToTransitionScene();
    }

    switchAnimation() {
        if (this.selectedGender === 'M') {
            this.girlSprite.play('girl_galaxy_anim');
            this.boySprite.play('boy_transition_anim');
            this.boySprite.once('animationcomplete', () => {
                this.boySprite.play('boy_chinese_anim');
            });

        } else {
            this.boySprite.play('boy_galaxy_anim');
            this.girlSprite.play('girl_transition_anim');
            this.girlSprite.once('animationcomplete', () => {
                this.girlSprite.setScale(2);
                this.girlSprite.play('girl_chinese_anim');
            });
        }
    }

    switchToTransitionScene() {
        this.time.delayedCall(4000, () => {
            this.scene.start('TransitionScene');
        });
    }

    createAnimations() {
        this.anims.create({
            key: 'boy_galaxy_anim',
            frames: this.anims.generateFrameNumbers('boy_galaxy', { start: 0, end: 19 }),
            frameRate: 16,
            repeat: -1
        });
        this.anims.create({
            key: 'boy_chinese_anim',
            frames: this.anims.generateFrameNumbers('boy_chinese', { start: 0, end: 19 }),
            frameRate: 16,
            repeat: -1
        });

        this.anims.create({
            key: 'boy_transition_anim',
            frames: this.anims.generateFrameNumbers('boy_transition', { start: 0, end: 63 }),
            frameRate: 16,
            repeat: 0
        });

        this.anims.create({
            key: 'girl_galaxy_anim',
            frames: this.anims.generateFrameNumbers('girl_galaxy', { start: 0, end: 19 }),
            frameRate: 16,
            repeat: -1
        });

        this.anims.create({
            key: 'girl_chinese_anim',
            frames: this.anims.generateFrameNumbers('girl_chinese', { start: 0, end: 99 }),
            frameRate: 16,
            repeat: -1
        });

        this.anims.create({
            key: 'girl_transition_anim',
            frames: this.anims.generateFrameNumbers('girl_transition', { start: 0, end: 31 }),
            frameRate: 16,
            repeat: 0
        });
    }

}