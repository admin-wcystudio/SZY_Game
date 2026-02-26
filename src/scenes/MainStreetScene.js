import { CustomButton } from '../UI/Button.js';
import UIHelper from '../UI/UIHelper.js';
import { CustomPanel, SettingPanel } from '../UI/Panel.js';
import NpcHelper from '../Character/NpcHelper.js';
import GameManager from './GameManager.js';

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

        this.load.image('npc1_bubble_1', 'assets/images/Game_4/game4_npc_box1.png');
        this.load.image('npc2_bubble_1', 'assets/images/Game_4/game4_npc_box1.png');
        this.load.image('npc3_bubble_1', 'assets/images/Game_2/game2_npc_box1.png');
        this.load.image('npc4_bubble_1', 'assets/images/Game_1/game1_npc_box1.png');


        // // Only load spritesheets for the selected gender
        let gender = 'F';
        try {
            if (localStorage.getItem('player')) {
                gender = JSON.parse(localStorage.getItem('player')).gender || 'M';
            }
        } catch (e) {
            gender = 'M';
        }

        if (gender === 'M') {
            this.load.spritesheet('boy_idle', 'assets/images/MainStreet/Boy/maincharacter_boy_middlestand.png',
                { frameWidth: 600, frameHeight: 700 });
            this.load.spritesheet('boy_left_talk', 'assets/images/MainStreet/Boy/maincharacter_boy_lefttalking.png',
                { frameWidth: 600, frameHeight: 700 });
            this.load.spritesheet('boy_right_talk', 'assets/images/MainStreet/Boy/maincharacter_boy_righttalking.png',
                { frameWidth: 600, frameHeight: 700 });
            this.load.spritesheet('boy_left_walk', 'assets/images/MainStreet/Boy/maincharacter_boy_leftwalk.png',
                { frameWidth: 600, frameHeight: 700 });
            this.load.spritesheet('boy_right_walk', 'assets/images/MainStreet/Boy/maincharacter_boy_rightwalk.png',
                { frameWidth: 600, frameHeight: 700 });
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

        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        const gender = localStorage.getItem('player') ? JSON.parse(localStorage.getItem('player')).gender : 'F';

        this.genderKey = gender === 'M' ? 'boy' : 'girl';
        const genderKey = this.genderKey;

        const playerPos = localStorage.getItem('playerPosition') ? JSON.parse(localStorage.getItem('playerPosition')) : { x: 800, y: 550 };
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

        const ui = UIHelper.createGameCommonUI(this, null, null, introPage, 0);

        // Check if intro has been seen in this session
        // const hasSeenIntro = sessionStorage.getItem('hasSeenMainStreetIntro');
        // if (hasSeenIntro) {
        //     if (ui && ui.descriptionPanel) {
        //         ui.descriptionPanel.setVisible(false);
        //     }
        // } else {
        //     sessionStorage.setItem('hasSeenMainStreetIntro', 'true');
        // }
        //
        //buttons
        this.isLeftDown = false;
        this.isRightDown = false;
        this.isTalking = false;

        this.btnLeft = new CustomButton(this, 150, height / 2, 'prev_button', 'prev_button_click',
            () => {
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
                this.isRightDown = true;
                this.handleAnimation(genderKey, true, false);
            },
            () => {
                this.isRightDown = false;
                this.handleAnimation(genderKey, false, true);
            }
        ).setScrollFactor(0).setDepth(100);



        const npc1_bubbles = ['npc1_bubble_1', 'npc1_bubble_2', 'npc1_bubble_3'];
        const npc2_bubbles = ['npc2_bubble_1', 'npc2_bubble_2'];
        const npc3_bubbles = ['npc3_bubble_1', 'npc3_bubble_2', 'npc3_bubble_3', 'npc3_bubble_4'];
        const npc4_bubbles = ['npc4_bubble_1', 'npc4_bubble_2', 'npc4_bubble_3', 'npc4_bubble_4'];
        const npc5_bubbles = ['npc5_bubble_1', 'npc5_bubble_2', 'npc5_bubble_3'];
        const npc5_reject_bubbles = ['npc5_bubble_reject'];
        const npc6_bubbles = ['npc6_bubble_1', 'npc6_bubble_2', 'npc6_bubble_3'];
        const npc6_reject_bubbles = ['npc6_bubble_reject'];

        const fake_npc1_bubbles = ['fake_npc_1_bubble1', 'fake_npc_1_bubble2'];
        const fake_npc3_bubbles = ['fake_npc_3_bubble'];
        const fake_npc4_bubbles = ['fake_npc_4_bubble1', 'fake_npc_4_bubble2'];
        const fake_npc5_bubbles = ['fake_npc_5_bubble'];

        // NPCs (trigger game)
        this.interactiveNpcs = [];
        this.fakeNpcs = [];


        const n1 = NpcHelper.createNpc(this, 1, 850, 550, 1, 'npc1', npc1_bubbles, 6, 'npc1_anim');
        const n2 = NpcHelper.createNpc(this, 2, 1450, 550, 1, 'npc2', npc2_bubbles, 6, 'npc2_anim');
        const n3 = NpcHelper.createNpc(this, 3, 2800, 550, 1, 'npc3', npc3_bubbles, 6, 'npc3_anim');
        const n4 = NpcHelper.createNpc(this, 4, 3350, 550, 1, 'npc4', npc4_bubbles, 6, 'npc4_anim');
        const n5 = NpcHelper.createNpc(this, 5, 3800, 750, 1, 'npc5', npc5_bubbles, 15, 'npc5_anim');
        const n6 = NpcHelper.createNpc(this, 6, 4500, 550, 1, 'npc6', npc6_bubbles, 6, 'npc6_anim');
        const n7 = NpcHelper.createNpc(this, 7, 5100, 650, 1, 'npc7', null, 6, 'npc7_anim');

        // this.interactiveNpcs.push(n1);
        // this.interactiveNpcs.push(n2);
        // this.interactiveNpcs.push(n3);
        // this.interactiveNpcs.push(n4);
        // this.interactiveNpcs.push(n5);
        // this.interactiveNpcs.push(n6);

        // // Fake NPCs (random talk)
        // const f1 = NpcHelper.createNpc(this, 7, 2800, 500, 1, 'fake_npc_1', fake_npc1_bubbles, 6, 'fake_npc_1_anim');
        // const f2 = NpcHelper.createNpc(this, 8, 3400, 440, 1, 'fake_npc_2', null, 6, 'fake_npc_2_anim');
        // const f3 = NpcHelper.createNpc(this, 9, 3250, 300, 1, 'fake_npc_3', fake_npc3_bubbles, 6, 'fake_npc_3_anim');
        // const f4 = NpcHelper.createNpc(this, 10, 4000, 850, 1, 'fake_npc_4', fake_npc4_bubbles, 15, 'fake_npc_4_anim');
        // const f5 = NpcHelper.createNpc(this, 11, 4450, 350, 1, 'fake_npc_5', fake_npc5_bubbles, 6, 'fake_npc_5_anim');

        // this.fakeNpcs.push(f1);
        // this.fakeNpcs.push(f2);
        // this.fakeNpcs.push(f3);
        // this.fakeNpcs.push(f4);
        // this.fakeNpcs.push(f5);

        this.currentInteractiveNpc = null;

        // Add global input listener to stop movement when pointer is released anywhere
        this.input.on('pointerup', () => {
            this.isLeftDown = false;
            this.isRightDown = false;
        });

        this.interactiveNpcs.forEach((npc, index) => {
            npc.on('pointerdown', () => {
                if (npc.canInteract) {
                    const gameNumber = index + 1;
                    const sceneKey = `GameScene_${gameNumber}`;
                    this.loadBubble(0, npc.bubbles, sceneKey, npc);
                }
            });
        });

        this.fakeNpcs.forEach(npc => {
            npc.on('pointerdown', () => {
                if (npc.canInteract) {
                    this.popRandomBubble(npc.bubbles, npc);
                }
            });
        });

        this.playerSprite = this.add.sprite(600, 600,
            `${genderKey}_idle`).setDepth(14).setScale(2);

        this.playerSprite.anims.play(`${genderKey}_idle_anim`);

        // 將相機鎖定在玩家身上
        this.cameras.main.startFollow(this.playerSprite, true, 0.1, 0.1);
    }

    update() {
        const speed = 5;
        let isMoving = false;
        let isLeft = this.playerSprite.lastDirectionLeft; // 保持最後的方向狀態

        // 純按鈕判定
        if (this.isLeftDown) {
            this.playerSprite.x -= speed;
            isLeft = true;
            isMoving = true;
        } else if (this.isRightDown) {
            this.playerSprite.x += speed;
            isLeft = false;
            isMoving = true;
        } else {
            this.playerSprite.x += 0;
            isMoving = false;
        }
        this.playerSprite.lastDirectionLeft = isLeft;

        this.playerSprite.x = Phaser.Math.Clamp(this.playerSprite.x, 600, 4800);
        const camView = this.cameras.main.worldView;
        const buffer = 100; // Load slightly before they appear

        const allNpcs = [...this.interactiveNpcs, ...this.fakeNpcs];
        this.currentNpcActivated = null;

        allNpcs.forEach(npc => {
            // Culling check
            // const inView = (npc.x > camView.x - buffer) && (npc.x < camView.x + camView.width + buffer);
            // // Only log occasionally to avoid lag
            // // if (Math.random() < 0.01) console.log(`NPC ${npc.id} ${npc.animKey} in view: ${inView}`);
            // if (inView) {
            //     // Only play if not already playing the correct animation
            //     if (!npc.anims.isPlaying || npc.anims.currentAnim?.key !== npc.animKey) {
            //         npc.anims.play(npc.animKey);
            //     }
            // } else {
            //     if (npc.anims.isPlaying) npc.anims.stop(); // Stop the lag from off-screen NPCs
            // }

            const dist = Math.abs(this.playerSprite.x - npc.x);

            if (dist < npc.proximityDistance) {
                npc.canInteract = true;
                npc.setTint(0x888888); // 遠離變暗

            } else {
                npc.canInteract = false;
                npc.setTint(0xffffff); // 靠近變亮

                if (this.currentActiveBubble && this.currentActiveBubble.ownerNpc === npc) {
                    this.currentActiveBubble.destroy();
                    this.currentActiveBubble = null;
                    // if (Math.random() < 0.01) console.log("玩家遠離，自動關閉對話框");
                }
            }
        });
    }

    handleAnimation(gender, isMoving, isLeft) {
        let walkKey = `${gender}_left_walk_anim`;
        let idleKey = `${gender}_idle_anim`;



        if (isMoving) {
            // true means: if 'walkKey' is already playing, don't restart it
            this.playerSprite.play(walkKey, true);
            if (!isLeft) {
                this.playerSprite.setFlipX(true);
            } else {
                this.playerSprite.setFlipX(false);
            }
        } else {
            this.playerSprite.play(idleKey, true);
        }
    }


    loadBubble(index = 0, bubbles, sceneKey, targetNpc) {

        if (this.currentActiveBubble) {
            this.currentActiveBubble.destroy();
        }

        // Special handling for NPC 5 and 6: Check if Games 1-4 are completed
        // if (targetNpc.id === 5 || targetNpc.id === 6) {
        //     const allResults = GameManager.loadGameResult();
        //     // Check if games 1, 2, 3, and 4 are finished
        //     const canStartGame = [1, 2, 3, 4].every(num => {
        //         const res = allResults.find(r => r.game === num);
        //         return res && res.isFinished;
        //     });

        //     if (!canStartGame) {
        //         console.log("Game is locked. Prerequisites (Games 1-4) not met.");
        //         // Use string arrays directly as the variables are not in scope here
        //         bubbles = targetNpc.id === 5 ? ['npc5_bubble_reject'] : ['npc6_bubble_reject'];
        //         sceneKey = null; // Prevent starting the game
        //     }
        // }

        const centerX = this.cameras.main.width / 2;
        const centerY = this.cameras.main.height / 2;

        let npcX = targetNpc.x + 200;
        let npcY = targetNpc.y - 220;

        let playerX = this.playerSprite.x - 200;
        let playerY = this.playerSprite.y + 200;

        if (targetNpc.id === 4) {
            npcY = targetNpc.y + 200;
            playerX = this.playerSprite.x + 200;
        } else if (targetNpc.id === 5) {
            npcY = targetNpc.y + 200;
        } else if (targetNpc.id === 6)
            npcX = targetNpc.x - 200; {
        }


        // 2. 生成新的對話框
        const startX = index % 2 === 1 ? playerX : npcX;
        const startY = index % 2 === 1 ? playerY : npcY;

        console.log("Loading bubble at:", startX, startY, "for NPC:", targetNpc.id);

        this.bubbleImg = this.add.image(startX, startY, bubbles[index])
            .setDepth(200)
            .setInteractive({ useHandCursor: true });

        // 綁定當前 NPC 到對話框，方便 update 檢查距離
        this.bubbleImg.ownerNpc = targetNpc;
        this.currentActiveBubble = this.bubbleImg;

        // 處理點擊邏輯
        this.bubbleImg.on('pointerdown', () => {
            index++;
            if (index < bubbles.length) {
                this.bubbleImg.setTexture(bubbles[index]);
                const nextX = index % 2 === 1 ? playerX : npcX;
                const nextY = index % 2 === 1 ? playerY : npcY;
                this.bubbleImg.setPosition(nextX, nextY);
                this.currentActiveBubble = this.bubbleImg;
            } else {
                // 對話結束
                this.bubbleImg.destroy();
                this.currentActiveBubble = null;
                if (sceneKey) {
                    console.log("Starting game scene:", sceneKey);
                    const playerPos = localStorage.setItem('playerPosition', JSON.stringify({ x: this.playerSprite.x, y: this.playerSprite.y }));
                    GameManager.switchToGameScene(this, sceneKey);
                }
            }
        });

        // 彈出動畫
        this.tweens.add({
            targets: this.bubbleImg,
            scale: { from: 0.5, to: 1 },
            duration: 200,
            ease: 'Back.easeOut'
        });
    }

    popRandomBubble(bubbles, targetNpc) {
        if (bubbles === null) return;

        if (this.currentActiveBubble) {
            this.currentActiveBubble.destroy();
        }

        let randomKey = Phaser.Utils.Array.GetRandom(bubbles);

        const centerX = this.cameras.main.width / 2;
        const centerY = this.cameras.main.height / 2;

        const npcX = targetNpc.x + 200;
        const npcY = targetNpc.y - 200;

        // Position at NPC (Index 0 behavior)
        this.bubbleImg = this.add.image(npcX, npcY, randomKey)
            .setDepth(200)
            .setInteractive({ useHandCursor: true });

        this.bubbleImg.ownerNpc = targetNpc;
        this.currentActiveBubble = this.bubbleImg;

        this.tweens.add({
            targets: this.bubbleImg,
            scale: { from: 0.5, to: 1 },
            duration: 200,
            ease: 'Back.easeOut'
        });

        this.time.delayedCall(3000, () => {
            if (this.bubbleImg) {
                this.bubbleImg.destroy();
                this.currentActiveBubble = null;
            }
        });
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
            key: 'npc2_anim',
            frames: this.anims.generateFrameNumbers('npc2', { start: 0, end: 68 }),
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
            key: 'npc4_anim',
            frames: this.anims.generateFrameNumbers('npc4', { start: 0, end: 94 }),
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
            key: 'npc6_anim',
            frames: this.anims.generateFrameNumbers('npc6', { start: 0, end: 94 }),
            frameRate: 30,
            repeat: -1
        });

        this.anims.create({
            key: 'npc7_anim',
            frames: this.anims.generateFrameNumbers('npc7', { start: 0, end: 94 }),
            frameRate: 30,
            repeat: -1
        });


        // Player character animations

        this.anims.create({
            key: 'boy_idle_anim',
            frames: this.anims.generateFrameNumbers('boy_idle', { start: 0, end: 152 }),
            frameRate: 24,
            repeat: -1
        });

        this.anims.create({
            key: 'boy_left_talk_anim',
            frames: this.anims.generateFrameNumbers('boy_left_talk', { start: 0, end: 168 }),
            frameRate: 24,
            repeat: -1
        });

        this.anims.create({
            key: 'boy_right_talk_anim',
            frames: this.anims.generateFrameNumbers('boy_right_talk', { start: 0, end: 168 }),
            frameRate: 24,
            repeat: -1
        });

        this.anims.create({
            key: 'boy_left_walk_anim',
            frames: this.anims.generateFrameNumbers('boy_left_walk', { start: 0, end: 48 }),
            frameRate: 24,
            repeat: -1
        });

        this.anims.create({
            key: 'boy_right_walk_anim',
            frames: this.anims.generateFrameNumbers('boy_right_walk', { start: 0, end: 48 }),
            frameRate: 24,
            repeat: -1
        });

        this.anims.create({
            key: 'girl_idle_anim',
            frames: this.anims.generateFrameNumbers('girl_idle', { start: 0, end: 152 }),
            frameRate: 24,
            repeat: -1
        });

        this.anims.create({
            key: 'girl_left_talk_anim',
            frames: this.anims.generateFrameNumbers('girl_left_talk', { start: 0, end: 168 }),
            frameRate: 24,
            repeat: -1
        });

        this.anims.create({
            key: 'girl_right_talk_anim',
            frames: this.anims.generateFrameNumbers('girl_right_talk', { start: 0, end: 168 }),
            frameRate: 24,
            repeat: -1
        });

        this.anims.create({
            key: 'girl_left_walk_anim',
            frames: this.anims.generateFrameNumbers('girl_left_walk', { start: 0, end: 48 }),
            frameRate: 24,
            repeat: -1
        });

        this.anims.create({
            key: 'girl_right_walk_anim',
            frames: this.anims.generateFrameNumbers('girl_right_walk', { start: 0, end: 48 }),
            frameRate: 10,
            repeat: -1
        });
    }

}