import { CustomButton } from '../UI/Button.js';
import UIHelper from '../UI/UIHelper.js';
import { CustomPanel, SettingPanel } from '../UI/Panel.js';
import NpcHelper from '../Character/NpcHelper.js';
import GameManager from './GameManager.js';
import VoiceOverHelper from '../Audio/VoiceOverHelper.js';

export class MainStreetScene extends Phaser.Scene {
    constructor() {
        super('MainStreetScene');
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
        //main street backgrounds
        this.load.image('stage1', 'assets/images/MainStreet/stage1.png');
        this.load.image('stage2', 'assets/images/MainStreet/stage2.png');
        this.load.image('stage3', 'assets/images/MainStreet/stage3.png');
        this.load.image('stage4', 'assets/images/MainStreet/stage4.png');
        this.load.image('stage_door', 'assets/images/MainStreet/stage_door.png');
        this.load.image('gameintro_01', 'assets/images/MainStreet/gameintro.png');
        this.load.image('gametimer', 'assets/images/MainStreet/gameintro_timer.png');

        VoiceOverHelper.preload(this);
        [1, 2, 3, 4, 5, 6, 7].forEach((gameId) => {
            VoiceOverHelper.preloadImages(this, VoiceOverHelper.streetImageKeys(gameId));
        });
        this.load.image('game7_npc_boy_box4', 'assets/images/Game_7/game7_npc_boy.png');
        this.load.image('game7_npc_girl_box4', 'assets/images/Game_7/game7_npc_girl.png');



        // // Only load spritesheets for the selected gender
        let gender = 'M';
        try {
            if (localStorage.getItem('player')) {
                gender = JSON.parse(localStorage.getItem('player')).gender || 'M';
            }
        } catch (e) {
            gender = 'M';
        }

        if (gender === 'M') {
            this.load.spritesheet('boy_idle', 'assets/images/MainStreet/Boy/maincharacter_boy_middlestand.png',
                { frameWidth: 300, frameHeight: 350 });
            this.load.spritesheet('boy_left_talk', 'assets/images/MainStreet/Boy/maincharacter_boy_lefttalking.png',
                { frameWidth: 300, frameHeight: 350 });
            this.load.spritesheet('boy_right_talk', 'assets/images/MainStreet/Boy/maincharacter_boy_righttalking.png',
                { frameWidth: 300, frameHeight: 350 });
            this.load.spritesheet('boy_left_walk', 'assets/images/MainStreet/Boy/maincharacter_boy_leftwalk.png',
                { frameWidth: 300, frameHeight: 350 });
            this.load.spritesheet('boy_right_walk', 'assets/images/MainStreet/Boy/maincharacter_boy_rightwalk.png',
                { frameWidth: 300, frameHeight: 350 });
        }

        if (gender === 'F') {
            this.load.spritesheet('girl_idle', 'assets/images/MainStreet/Girl/maincharacter_girl_middlestand.png',
                { frameWidth: 300, frameHeight: 350 });
            this.load.spritesheet('girl_left_talk', 'assets/images/MainStreet/Girl/maincharacter_girl_lefttalking.png',
                { frameWidth: 300, frameHeight: 350 });
            this.load.spritesheet('girl_right_talk', 'assets/images/MainStreet/Girl/maincharacter_girl_righttalking.png',
                { frameWidth: 300, frameHeight: 350 });
            this.load.spritesheet('girl_left_walk', 'assets/images/MainStreet/Girl/maincharacter_girl_leftwalk.png',
                { frameWidth: 300, frameHeight: 350 });
            this.load.spritesheet('girl_right_walk', 'assets/images/MainStreet/Girl/maincharacter_girl_rightwalk.png',
                { frameWidth: 300, frameHeight: 350 });
        }

        // // NPC spritesheets
        this.load.spritesheet('npc1', 'assets/images/MainStreet/NPCs/NPC1.png',
            { frameWidth: 195, frameHeight: 240 });
        this.load.spritesheet('npc1_glow', 'assets/images/MainStreet/NPCs/NPC1_glow.png',
            { frameWidth: 195, frameHeight: 240 });
        this.load.spritesheet('npc2', 'assets/images/MainStreet/NPCs/NPC2.png',
            { frameWidth: 195, frameHeight: 240 });
        this.load.spritesheet('npc2_glow', 'assets/images/MainStreet/NPCs/NPC2_glow.png',
            { frameWidth: 195, frameHeight: 240 });
        this.load.spritesheet('npc3', 'assets/images/MainStreet/NPCs/NPC3.png',
            { frameWidth: 195, frameHeight: 240 });
        this.load.spritesheet('npc3_glow', 'assets/images/MainStreet/NPCs/NPC3_glow.png',
            { frameWidth: 195, frameHeight: 240 });
        this.load.spritesheet('npc4', 'assets/images/MainStreet/NPCs/NPC4.png',
            { frameWidth: 195, frameHeight: 240 });
        this.load.spritesheet('npc4_glow', 'assets/images/MainStreet/NPCs/NPC4_glow.png',
            { frameWidth: 195, frameHeight: 240 });
        this.load.spritesheet('npc5', 'assets/images/MainStreet/NPCs/NPC5.png',
            { frameWidth: 195, frameHeight: 240 });
        this.load.spritesheet('npc5_glow', 'assets/images/MainStreet/NPCs/NPC5_glow.png',
            { frameWidth: 195, frameHeight: 240 });
        this.load.spritesheet('npc6', 'assets/images/MainStreet/NPCs/NPC6.png',
            { frameWidth: 195, frameHeight: 240 });
        this.load.spritesheet('npc6_glow', 'assets/images/MainStreet/NPCs/NPC6_glow.png',
            { frameWidth: 195, frameHeight: 240 });
        this.load.spritesheet('npc7', 'assets/images/MainStreet/NPCs/NPC7.png',
            { frameWidth: 195, frameHeight: 240 });
        this.load.spritesheet('npc7_glow', 'assets/images/MainStreet/NPCs/NPC7_glow.png',
            { frameWidth: 195, frameHeight: 240 });

    }

    create() {
        // Create NPC animations
        this.createAnimations();
        VoiceOverHelper.ensureBgm(this);
        this.events.once('shutdown', () => VoiceOverHelper.stop(this));

        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        this.centerX = width / 2;
        this.centerY = height / 2;

        const gender = localStorage.getItem('player') ? JSON.parse(localStorage.getItem('player')).gender : 'M';

        this.genderKey = gender === 'M' ? 'boy' : 'girl';
        const genderKey = this.genderKey;

        const playerPos = localStorage.getItem('playerPosition')
            ? JSON.parse(localStorage.getItem('playerPosition')) : { x: 600, y: 600 };
        this.playerPos = playerPos;


        console.log(`Player gender: ${gender}, genderKey: ${genderKey}`);

        const bgKeys = ['stage1', 'stage2', 'stage3', 'stage4'];
        let currentX = 0;
        //background
        bgKeys.forEach((key, index) => {
            const bg = this.add.image(currentX, 540, key).setOrigin(0, 0.5).setDepth(1);
            currentX += bg.width; // 累加寬度，讓下一張接在後面
        });
        this.add.image(4150, 600, 'stage_door').setOrigin(0.5, 0.5).setDepth(15);

        // 設定相機邊界為總長度 8414px
        this.cameras.main.setBounds(0, 0, 5500, 1080);

        const introPage = [
            {
                content: 'gameintro_01',
                nextBtn: null, nextBtnClick: null,
                prevBtn: null, prevBtnClick: null,
                closeBtn: 'gameintro_closebutton', closeBtnClick: 'gameintro_closebutton_click'
            },
        ]

        const ui = UIHelper.createGameCommonUI(this, null, introPage, 0);

        // Check if intro has been seen in this session
        const hasSeenIntro = sessionStorage.getItem('hasSeenMainStreetIntro');
        if (hasSeenIntro) {
            if (ui && ui.descriptionPanel) {
                ui.descriptionPanel.setVisible(false);
            }
        } else {
            ui.descriptionPanel.setVisible(true);
            sessionStorage.setItem('hasSeenMainStreetIntro', 'true');
        }

        //buttons
        this.isLeftDown = false;
        this.isRightDown = false;
        this.isTalking = false;

        this.btnLeft = new CustomButton(this, 150, height / 2, 'prev_button', 'prev_button_click',
            () => {
                if (this.isTalking) return;
                this.isLeftDown = true;
                this.handleAnimation(genderKey, true, true);
            },
            () => {
                this.isLeftDown = false;
                this.handleAnimation(genderKey, false, true);
            }
        ).setScrollFactor(0).setDepth(100);

        this.btnRight = new CustomButton(this, width - 150, height / 2, 'next_button', 'next_button_click',
            () => {
                if (this.isTalking) return;
                this.isRightDown = true;
                this.handleAnimation(genderKey, true, false);
            },
            () => {
                this.isRightDown = false;
                this.handleAnimation(genderKey, false, false);
            }
        ).setScrollFactor(0).setDepth(100);


        this.bubbleTimers = [];
        const npc1_bubbles = VoiceOverHelper.getStreetLines(4);
        const npc2_bubbles = VoiceOverHelper.getStreetLines(3);
        const npc3_bubbles = VoiceOverHelper.getStreetLines(2);
        const npc4_bubbles = VoiceOverHelper.getStreetLines(1);
        const npc5_bubbles = VoiceOverHelper.getStreetLines(5);
        const npc6_bubbles = VoiceOverHelper.getStreetLines(6);
        const npc7_bubbles = VoiceOverHelper.getStreetLines(7);

        // NPCs (trigger game)
        this.interactiveNpcs = [];

        const n1 = NpcHelper.createNpc(this, 1, 850, 550, 1, 'npc1', npc1_bubbles, 6, 'npc1_anim');
        const n2 = NpcHelper.createNpc(this, 2, 1450, 550, 1, 'npc2', npc2_bubbles, 6, 'npc2_anim');
        const n3 = NpcHelper.createNpc(this, 3, 2800, 550, 1, 'npc3', npc3_bubbles, 6, 'npc3_anim');
        const n4 = NpcHelper.createNpc(this, 4, 3350, 550, 1, 'npc4', npc4_bubbles, 6, 'npc4_anim');
        const n5 = NpcHelper.createNpc(this, 5, 3800, 750, 1, 'npc5', npc5_bubbles, 15, 'npc5_anim');
        const n6 = NpcHelper.createNpc(this, 6, 4700, 550, 1, 'npc6', npc6_bubbles, 6, 'npc6_anim');
        const n7 = NpcHelper.createNpc(this, 7, 5100, 550, 1, 'npc7', npc7_bubbles, 6, 'npc7_anim');

        this.interactiveNpcs.push(n1);
        this.interactiveNpcs.push(n2);
        this.interactiveNpcs.push(n3);
        this.interactiveNpcs.push(n4);
        this.interactiveNpcs.push(n5);
        this.interactiveNpcs.push(n6);
        this.interactiveNpcs.push(n7);

        this.currentInteractiveNpc = null;

        // Add global input listener to stop movement when pointer is released anywhere
        this.input.on('pointerup', () => {
            this.isLeftDown = false;
            this.isRightDown = false;
        });

        const npcGameMap = { 1: 4, 2: 3, 3: 2, 4: 1, 5: 5, 6: 6, 7: 7 };
        this.npcGameMap = npcGameMap;
        this.interactiveNpcs.forEach((npc, index) => {
            npc.on('pointerdown', () => {
                if (npc.canInteract) {
                    const gameNumber = npcGameMap[npc.id] ?? (index + 1);
                    const locked = (gameNumber === 5 || gameNumber === 6 || gameNumber === 7)
                        && !VoiceOverHelper.arePrereqsMet(gameNumber);
                    const lines = VoiceOverHelper.getStreetLines(gameNumber, locked);
                    const sceneKey = locked ? null : `GameScene_${gameNumber}`;
                    this.loadBubble(0, lines, sceneKey, npc, locked);
                }
            });
        });


        this.playerSprite = this.add.sprite(playerPos.x, playerPos.y,
            `${genderKey}_idle`).setDepth(14).setScale(2);

        this.playerSprite.anims.play(`${genderKey}_idle_anim`);

        // 將相機鎖定在玩家身上
        this.cameras.main.startFollow(this.playerSprite, true, 0.1, 0.1);
    }

    update() {
        const speed = 5;
        let isMoving = false;
        let isLeft = this.playerSprite.lastDirectionLeft;

        if (this.isTalking) {
            this.isLeftDown = false;
            this.isRightDown = false;
        } else if (this.isLeftDown) {
            this.playerSprite.x -= speed;
            isLeft = true;
            isMoving = true;
        } else if (this.isRightDown) {
            this.playerSprite.x += speed;
            isLeft = false;
            isMoving = true;
        }

        this.playerSprite.lastDirectionLeft = isLeft;
        this.playerSprite.x = Phaser.Math.Clamp(this.playerSprite.x, 600, 5300);
        this.handleAnimation(this.genderKey, isMoving, isLeft);


        const allNpcs = [...this.interactiveNpcs];
        this.currentNpcActivated = null;

        allNpcs.forEach(npc => {
            const dist = Math.abs(this.playerSprite.x - npc.x);

            if (dist < npc.proximityDistance) {
                npc.canInteract = true;
                //  npc.setTint(0x888888);
                this.switchToGlowAndBack(npc);
            } else {
                npc.canInteract = false;
                //  npc.setTint(0xffffff);
                this.restoreFromGlow(npc);

                // IF THIS NPC was the one owning the active bubbles
                if (this.currentActiveBubble && this.currentActiveBubble.ownerNpc === npc) {
                    this.closeActiveBubble();
                }
            }
        });
    }

    switchToGlowAndBack(npc, glow) {
        if (!npc || npc.isGlow) return;
        if (!npc.glowKey || !npc.glowAnimKey) return;

        npc.setTexture(npc.glowKey);
        npc.play(npc.glowAnimKey, true);
        npc.isGlow = true;
    }

    restoreFromGlow(npc) {
        if (!npc || !npc.isGlow) return;
        if (!npc.baseKey || !npc.baseAnimKey) return;

        npc.setTexture(npc.baseKey);
        npc.play(npc.baseAnimKey, true);
        npc.isGlow = false;
    }

    handleAnimation(gender, isMoving, isLeft) {
        if (!this.playerSprite || this.isTalking) return;

        const walkKey = isLeft ? `${gender}_left_walk_anim` : `${gender}_right_walk_anim`;
        const idleKey = `${gender}_idle_anim`;

        this.playerSprite.setFlipX(false);
        if (isMoving) {
            this.playerSprite.play(walkKey, true);
        } else {
            this.playerSprite.play(idleKey, true);
        }
    }

    switchTalkingAnimation(gender, isLeft) {
        if (!this.playerSprite) return;
        if (isLeft === undefined) isLeft = this.playerSprite.lastDirectionLeft;
        const talkKey = isLeft ? `${gender}_left_talk_anim` : `${gender}_right_talk_anim`;
        this.playerSprite.setFlipX(false);
        if (this.anims.exists(talkKey)) {
            this.playerSprite.play(talkKey, true);
        } else {
            this.playerSprite.play(`${gender}_idle_anim`, true);
        }
    }


    closeActiveBubble() {
        this.isTalking = false;
        VoiceOverHelper.stop(this);
        if (this.bubbleTimers) {
            this.bubbleTimers.forEach(t => t.remove());
            this.bubbleTimers = [];
        }
        if (this.currentActiveBubble) {
            this.currentActiveBubble.destroy();
            this.currentActiveBubble = null;
        }
        if (this.characterActiveBubble) {
            this.characterActiveBubble.destroy();
            this.characterActiveBubble = null;
        }
        this.bubbleImg = null;
        this.characterBubbleImg = null;
        if (this.playerSprite) {
            this.playerSprite.setFlipX(false);
            this.playerSprite.play(`${this.genderKey}_idle_anim`, true);
        }
    }

    startGameFromStreet(sceneKey) {
        if (!sceneKey) return;
        localStorage.setItem('playerPosition', JSON.stringify({
            x: this.playerSprite.x,
            y: this.playerSprite.y
        }));
        GameManager.switchToGameScene(this, sceneKey);
    }

    loadBubble(index = 0, bubbles, sceneKey, targetNpc, locked = false) {
        const facingLeft = (this.playerSprite.x - targetNpc.x) > 0;
        this.closeActiveBubble();

        this.isTalking = true;
        this.isLeftDown = false;
        this.isRightDown = false;
        this.playerSprite.lastDirectionLeft = facingLeft;
        this.switchTalkingAnimation(this.genderKey, facingLeft);

        if (!bubbles || bubbles.length === 0) {
            this.startGameFromStreet(sceneKey);
            return;
        }

        const showLine = (lineIndex) => {
            while (lineIndex < bubbles.length && !VoiceOverHelper.resolveTexture(this, bubbles[lineIndex])) {
                lineIndex++;
            }
            if (lineIndex >= bubbles.length) {
                this.closeActiveBubble();
                this.startGameFromStreet(sceneKey);
                return;
            }

            const textureKey = VoiceOverHelper.resolveTexture(this, bubbles[lineIndex]);
            const isPlayerLine = locked || lineIndex % 2 === 1;
            this.switchTalkingAnimation(this.genderKey, facingLeft);

            if (!this.bubbleImg) {
                this.bubbleImg = this.add.image(this.centerX, 900, textureKey)
                    .setDepth(200)
                    .setInteractive({ useHandCursor: true })
                    .setScrollFactor(0)
                    .setAlpha(0);
                this.bubbleImg.ownerNpc = targetNpc;
                this.currentActiveBubble = this.bubbleImg;
                this.bubbleImg.on('pointerdown', () => {
                    showLine(this.currentLineIndex + 1);
                });
                this.tweens.add({
                    targets: this.bubbleImg,
                    scale: { from: 0.5, to: 1 },
                    alpha: { from: 0, to: 1 },
                    duration: 200,
                    ease: 'Back.easeOut'
                });
            } else {
                this.bubbleImg.setTexture(textureKey);
            }
            this.currentLineIndex = lineIndex;
            this.currentActiveBubble = this.bubbleImg;
            VoiceOverHelper.playBubbleVo(this, bubbles[lineIndex], isPlayerLine);
        };

        showLine(index);
    }

    createAnimations() {

        // NPC Animations
        this.anims.create({
            key: 'npc1_anim',
            frames: this.anims.generateFrameNumbers('npc1', { start: 0, end: 70 }),
            frameRate: 30,
            repeat: -1
        });

        this.anims.create({
            key: 'npc1_glow_anim',
            frames: this.anims.generateFrameNumbers('npc1_glow', { start: 0, end: 70 }),
            frameRate: 30,
            repeat: -1
        });

        this.anims.create({
            key: 'npc2_anim',
            frames: this.anims.generateFrameNumbers('npc2', { start: 0, end: 68 }),
            frameRate: 30,
            repeat: -1
        });

        this.anims.create({
            key: 'npc2_glow_anim',
            frames: this.anims.generateFrameNumbers('npc2_glow', { start: 0, end: 68 }),
            frameRate: 30,
            repeat: -1
        });

        this.anims.create({
            key: 'npc3_anim',
            frames: this.anims.generateFrameNumbers('npc3', { start: 0, end: 75 }),
            frameRate: 30,
            repeat: -1
        });

        this.anims.create({
            key: 'npc3_glow_anim',
            frames: this.anims.generateFrameNumbers('npc3_glow', { start: 0, end: 75 }),
            frameRate: 30,
            repeat: -1
        });

        this.anims.create({
            key: 'npc4_anim',
            frames: this.anims.generateFrameNumbers('npc4', { start: 0, end: 94 }),
            frameRate: 30,
            repeat: -1
        });

        this.anims.create({
            key: 'npc4_glow_anim',
            frames: this.anims.generateFrameNumbers('npc4_glow', { start: 0, end: 94 }),
            frameRate: 30,
            repeat: -1
        });

        this.anims.create({
            key: 'npc5_anim',
            frames: this.anims.generateFrameNumbers('npc5', { start: 0, end: 80 }),
            frameRate: 30,
            repeat: -1
        });

        this.anims.create({
            key: 'npc5_glow_anim',
            frames: this.anims.generateFrameNumbers('npc5_glow', { start: 0, end: 80 }),
            frameRate: 30,
            repeat: -1
        });

        this.anims.create({
            key: 'npc6_anim',
            frames: this.anims.generateFrameNumbers('npc6', { start: 0, end: 94 }),
            frameRate: 30,
            repeat: -1
        });

        this.anims.create({
            key: 'npc6_glow_anim',
            frames: this.anims.generateFrameNumbers('npc6_glow', { start: 0, end: 94 }),
            frameRate: 30,
            repeat: -1
        });

        this.anims.create({
            key: 'npc7_anim',
            frames: this.anims.generateFrameNumbers('npc7', { start: 0, end: 94 }),
            frameRate: 30,
            repeat: -1
        });

        this.anims.create({
            key: 'npc7_glow_anim',
            frames: this.anims.generateFrameNumbers('npc7_glow', { start: 0, end: 94 }),
            frameRate: 0,
            repeat: -1
        });


        // Player character animations
        const lastFrame = (key, frameWidth, frameHeight) => {
            const texture = this.textures.get(key);
            if (!texture || !texture.getSourceImage) return 0;
            const src = texture.getSourceImage();
            if (!src) return 0;
            const cols = Math.max(1, Math.floor(src.width / frameWidth));
            const rows = Math.max(1, Math.floor(src.height / frameHeight));
            return cols * rows - 1;
        };

        const makePlayerAnim = (key) => {
            if (!this.textures.exists(key) || this.anims.exists(`${key}_anim`)) return;
            this.anims.create({
                key: `${key}_anim`,
                frames: this.anims.generateFrameNumbers(key, {
                    start: 0,
                    end: lastFrame(key, 300, 350)
                }),
                frameRate: 24,
                repeat: -1
            });
        };

        ['boy', 'girl'].forEach((prefix) => {
            ['idle', 'left_talk', 'right_talk', 'left_walk', 'right_walk'].forEach((name) => {
                makePlayerAnim(`${prefix}_${name}`);
            });
        });
    }

}