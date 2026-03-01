
import BaseGameScene from './BaseGameScene.js';
import { CustomButton } from '../../UI/Button.js';
import { CustomPanel, CustomFailPanel } from '../../UI/Panel.js';
import GameManager from '../GameManager.js';

export class GameScene_7 extends BaseGameScene {
    constructor() {
        super('GameScene_7');
    }

    preload() {
        const path = 'assets/images/Game_7/';
        const player = JSON.parse(localStorage.getItem('player') || '{"gender":"M"}');
        this.genderKey = player.gender === 'M' ? 'boy' : 'girl';

        for (let i = 1; i <= 6; i++) {
            this.load.image(`game7_answer${i}`, `${path}game7_answer${i}.png`);
            this.load.image(`game7_fill_answer${i}`, `${path}game7_fill_answer${i}.png`);
        }

        this.load.video('game7_final_boybg1', `${path}game7_final_boybg1.webm`);
        this.load.video('game7_final_boybg2', `${path}game7_final_boybg2.webm`);
        this.load.video('game7_final_girlbg1', `${path}game7_final_girlbg1.webm`);
        this.load.video('game7_final_girlbg2', `${path}game7_final_girlbg2.webm`);

        this.load.image('game7_npc_box_intro', `${path}game7_npc_box5.png`);
        this.load.image('game7_npc_box_feedback', `${path}game7_npc_box7.png`);
        this.load.image('game7_npc_box_tryagain', `${path}game7_npc_box8.png`);

        this.load.image('game7_npc_box_win1', `${path}game7_npc_box1.png`);
        this.load.image('game7_npc_box_win2', `${path}game7_npc_box2.png`);

        this.load.image('game7_boy_feedback', `${path}game7_npc_boy_box6.png`);
        this.load.image('game7_girl_feedback', `${path}game7_npc_girl_box6.png`);

        this.load.image('final_preview', `${path}game7_final_preview.png`);
        this.load.image('select_area', `${path}game7_select_area.png`);
        this.load.image('game7_border', `${path}game7_border.png`);


    }

    create() {
        this.width = this.cameras.main.width;
        this.height = this.cameras.main.height;
        this.centerX = this.width / 2;
        this.centerY = this.height / 2;

        this.spawnPositions = [
            { x: this.centerX - 800, y: this.centerY - 150 },
            { x: this.centerX - 800, y: this.centerY + 350 },
            { x: this.centerX - 800, y: this.centerY + 100 },
            { x: this.centerX + 800, y: this.centerY - 150 },
            { x: this.centerX + 800, y: this.centerY + 100 },
            { x: this.centerX + 800, y: this.centerY + 350 },
        ];



        this.confirmBtn = new CustomButton(this, this.centerX, this.height - 100,
            'confirm_button', 'confirm_button_select', () => {
                this.checkAnswer();
            });
        this.confirmBtn.setDepth(600).setVisible(false);

        this.initGame('game7_bg', 'game7_description', true, false, {
            targetRounds: 1,
            roundPerSeconds: 1000,
            isAllowRoundFail: false,
            isContinuousTimer: true,
            sceneIndex: 7
        });

    }

    setupGameObjects() {
        this.content = this.add.image(this.centerX, this.centerY, 'game7_border').setDepth(1);

        this.targetContents = [
            { key: 'game7_answer1', fillKey: 'game7_fill_answer1', position: { x: this.centerX - 75, y: this.centerY - 250 } },
            { key: 'game7_answer5', fillKey: 'game7_fill_answer5', position: { x: this.centerX - 100, y: this.centerY - 100 } },
            { key: 'game7_answer4', fillKey: 'game7_fill_answer4', position: { x: this.centerX + 60, y: this.centerY + 80 } },
            { key: 'game7_answer6', fillKey: 'game7_fill_answer6', position: { x: this.centerX + 410, y: this.centerY - 100 } },
            { key: 'game7_answer2', fillKey: 'game7_fill_answer2', position: { x: this.centerX + 200, y: this.centerY + 175 } },
            { key: 'game7_answer3', fillKey: 'game7_fill_answer3', position: { x: this.centerX + 500, y: this.centerY + 175 } },
        ];

        // --- 1. Create fill slots – select_area indicator only, hidden by default, no hint texture ---
        this.fillSlots = this.targetContents.map(tc => {
            const selectArea = this.add.image(tc.position.x, tc.position.y, 'select_area')
                .setDepth(500)
                .setVisible(false);
            return {
                selectArea,
                fillKey: tc.fillKey,
                targetKey: tc.key,
                position: tc.position,
                droppedKey: null,
            };
        });

        // --- 2. Randomize spawn positions and create draggable answer keys ---
        const answerKeys = ['game7_answer1', 'game7_answer2', 'game7_answer3', 'game7_answer4', 'game7_answer5', 'game7_answer6'];
        const shuffledPositions = Phaser.Utils.Array.Shuffle([...this.spawnPositions]);

        this.answerKeyObjects = [];
        const SNAP_RADIUS = 120;

        answerKeys.forEach((key, i) => {
            const pos = shuffledPositions[i];
            const img = this.add.image(pos.x, pos.y, key)
                .setDepth(10)
                .setInteractive({ draggable: true });

            img.answerKey = key;
            img.originalX = pos.x;
            img.originalY = pos.y;
            img.currentSlot = null;

            // drag – move with pointer; highlight nearest slot within range
            img.on('drag', (pointer, dragX, dragY) => {
                img.x = dragX;
                img.y = dragY;
                img.setDepth(20);

                // Show select_area only for the closest empty-or-current slot within range
                let closestSlot = null;
                let closestDist = SNAP_RADIUS;
                this.fillSlots.forEach(slot => {
                    // Don't highlight a slot already occupied by another key
                    if (slot.droppedKey && slot.droppedKey !== img.answerKey) return;
                    const dist = Phaser.Math.Distance.Between(dragX, dragY, slot.position.x, slot.position.y);
                    if (dist < closestDist) { closestDist = dist; closestSlot = slot; }
                });

                this.fillSlots.forEach(slot => {
                    slot.selectArea.setVisible(slot === closestSlot);
                });
            });

            // dragend – snap to nearest slot or return to origin
            img.on('dragend', () => {
                // Hide all select_area indicators
                this.fillSlots.forEach(slot => slot.selectArea.setVisible(false));

                let closestSlot = null;
                let closestDist = SNAP_RADIUS;
                this.fillSlots.forEach(slot => {
                    if (slot.droppedKey && slot.droppedKey !== img.answerKey) return;
                    const dist = Phaser.Math.Distance.Between(img.x, img.y, slot.position.x, slot.position.y);
                    if (dist < closestDist) { closestDist = dist; closestSlot = slot; }
                });

                if (closestSlot) {
                    // Evict any key already in that slot – revert its texture and send it home
                    if (closestSlot.droppedKey && closestSlot.droppedKey !== img.answerKey) {
                        const prev = this.answerKeyObjects.find(a => a.answerKey === closestSlot.droppedKey);
                        if (prev) {
                            prev.setTexture(prev.answerKey);
                            prev.x = prev.originalX;
                            prev.y = prev.originalY;
                            prev.setDepth(10);
                            prev.currentSlot = null;
                        }
                    }

                    // Revert the slot this key was previously in
                    if (img.currentSlot) {
                        img.currentSlot.droppedKey = null;
                    }

                    // Snap into the new slot and switch to fill texture
                    img.x = closestSlot.position.x;
                    img.y = closestSlot.position.y;
                    img.setDepth(505);
                    img.setTexture(closestSlot.fillKey);
                    closestSlot.droppedKey = img.answerKey;
                    img.currentSlot = closestSlot;

                } else {
                    // Return to spawn origin and restore original texture
                    if (img.currentSlot) {
                        img.currentSlot.droppedKey = null;
                        img.currentSlot = null;
                    }
                    img.setTexture(img.answerKey);
                    img.x = img.originalX;
                    img.y = img.originalY;
                    img.setDepth(10);
                }
            });

            this.answerKeyObjects.push(img);
        });

        this.confirmBtn.setVisible(true);
    }

    checkAnswer() {
        // Require all blanks to be filled first
        const allFilled = this.fillSlots.every(slot => slot.droppedKey !== null);
        if (!allFilled) return;

        // Each slot's droppedKey must match its targetKey
        const allCorrect = this.fillSlots.every(slot => slot.droppedKey === slot.targetKey);

        if (allCorrect) {
            this.onRoundWin();
        } else {
            this.handleLose();
        }
    }

}