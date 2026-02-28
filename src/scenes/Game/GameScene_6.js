import BaseGameScene from './BaseGameScene.js';
import { CustomButton } from '../../UI/Button.js';
import { CustomPanel, CustomFailPanel } from '../../UI/Panel.js';
import GameManager from '../GameManager.js';


export class GameScene_6 extends BaseGameScene {
    constructor() {
        super('GameScene_6');
    }

    preload() {
        const path = 'assets/images/Game_6/';
        const player = JSON.parse(localStorage.getItem('player') || '{"gender":"M"}');
        this.genderKey = player.gender === 'M' ? 'boy' : 'girl';

        this.load.image('confirm_button', `${path}game6_confirm_button.png`);
        this.load.image('confirm_button_select', `${path}game6_confirm_button_select.png`);

        if (this.genderKey === 'boy') {
            this.load.image('game6_npc_box_intro', `${path}game6_npc_boy_box3.png`);
        } else {
            this.load.image('game6_npc_box_intro', `${path}game6_npc_girl_box3.png`);
        }

        this.load.image('game6_npc_box_win', `${path}game6_npc_box4.png`);
        this.load.image('game6_npc_box_tryagain', `${path}game6_npc_box7.png`);

        this.load.image('game6_boy_npc_box1', `${path}game6_npc_boy_box3.png`);
        this.load.image('game5_boy_npc_box2', `${path}game6_npc_boy_box5.png`);

        this.load.image('game6_girl_npc_box1', `${path}game6_npc_girl_box3.png`);
        this.load.image('game6_girl_npc_box2', `${path}game6_npc_girl_box5.png`);


        for (let i = 1; i <= 8; i++) {
            this.load.image(`game6_object${i}`, `${path}game6_object${i}.png`);
        }

        this.load.image('game6_border1', `${path}game6_border1.png`);
        this.load.image('game6_border2', `${path}game6_border2.png`);

    }

    create() {
        // Initialize dimensions
        this.width = this.cameras.main.width;
        this.height = this.cameras.main.height;
        this.centerX = this.width / 2;
        this.centerY = this.height / 2;

        this.initGame('game6_bg', 'game6_description', false, false, {
            targetRounds: 1,
            roundPerSeconds: 30,
            isAllowRoundFail: false,
            isContinuousTimer: false,
            sceneIndex: 6
        });

        // Create confirm button
        this.confirmBtn = new CustomButton(this, this.centerX, this.height - 100,
            'confirm_button', 'confirm_button_select', () => {
                this.checkAnswer();
            });
        this.confirmBtn.setDepth(600).setVisible(false);
    }

    setupGameObjects() {

        this.border1 = this.add.image(this.centerX - 400, this.centerY, 'game6_border1').setDepth(500).setVisible(true);
        this.border2 = this.add.image(this.centerX + 400, this.centerY, 'game6_border2').setDepth(500).setVisible(true);

        // Define snap positions (grey circles) for both borders
        // Border 1 (left) - 4 positions in a 2x2 grid
        this.snapPositions = [
            // Border 1 positions
            { x: this.centerX - 480, y: this.centerY - 100 },
            { x: this.centerX - 320, y: this.centerY - 100 },
            { x: this.centerX - 480, y: this.centerY + 100 },
            { x: this.centerX - 320, y: this.centerY + 100 },
            // Border 2 positions (right)
            { x: this.centerX + 320, y: this.centerY - 100 },
            { x: this.centerX + 480, y: this.centerY - 100 },
            { x: this.centerX + 320, y: this.centerY + 100 },
            { x: this.centerX + 480, y: this.centerY + 100 }
        ];

        this.snapRadius = 90; // Distance threshold for snapping

        // Debug graphics - draw snap positions
        this.debugGraphics = this.add.graphics();
        this.debugGraphics.lineStyle(2, 0xff0000, 0.5);
        this.debugGraphics.fillStyle(0xff0000, 0.2);
        this.snapPositions.forEach(pos => {
            this.debugGraphics.strokeCircle(pos.x, pos.y, 60); // Draw outer circle
            this.debugGraphics.fillCircle(pos.x, pos.y, 5); // Draw center point
        });
        this.debugGraphics.setDepth(999); // Just below borders

        // Define spawn positions (random positions around the center, avoiding borders)
        const spawnPositions = [
            { x: this.centerX - 780, y: this.centerY - 100 },
            { x: this.centerX - 800, y: this.centerY + 100 },
            { x: this.centerX, y: this.centerY + 200 },
            { x: this.centerX, y: this.centerY - 200 },
            { x: this.centerX + 100, y: this.centerY },
            { x: this.centerX - 100, y: this.centerY },
            { x: this.centerX + 800, y: this.centerY - 100 },
            { x: this.centerX + 780, y: this.centerY + 100 }
        ];

        // Shuffle positions
        const shuffledPositions = Phaser.Utils.Array.Shuffle([...spawnPositions]);

        this.objects = [];
        for (let i = 1; i <= 8; i++) {
            const pos = shuffledPositions[i - 1];
            const obj = this.add.image(pos.x, pos.y, `game6_object${i}`)
                .setDepth(505)
                .setInteractive({ draggable: true })
                .setVisible(false);

            obj.objectId = i;
            obj.originalX = pos.x;
            obj.originalY = pos.y;

            this.objects.push(obj);
        }

        // Set up drag events
        this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
            gameObject.x = dragX;
            gameObject.y = dragY;
        });

        // Add dragend event for snapping
        this.input.on('dragend', (pointer, gameObject) => {
            const snapPos = this.findNearestSnapPosition(gameObject.x, gameObject.y);
            if (snapPos) {
                // Snap to position with animation
                this.tweens.add({
                    targets: gameObject,
                    x: snapPos.x,
                    y: snapPos.y,
                    duration: 150,
                    ease: 'Power2'
                });
            }
        });

        // Border zones for collision detection
        this.border1_correctObjects = [2, 3, 6, 8];
        this.border2_correctObjects = [1, 4, 5, 7];
        this.border1Zone = new Phaser.Geom.Rectangle(
            this.border1.x - 150, this.border1.y - 200, 300, 400
        );
        this.border2Zone = new Phaser.Geom.Rectangle(
            this.border2.x - 150, this.border2.y - 200, 300, 400
        );
    }

    findNearestSnapPosition(x, y) {
        let nearestPos = null;
        let minDistance = this.snapRadius;

        for (let pos of this.snapPositions) {
            const distance = Phaser.Math.Distance.Between(x, y, pos.x, pos.y);
            if (distance < minDistance) {
                minDistance = distance;
                nearestPos = pos;
            }
        }

        return nearestPos;
    }

    enableGameInteraction(enable) {
        this.objects.forEach(obj => {
            obj.setVisible(enable);
            obj.setInteractive(enable);
        });
        if (this.confirmBtn) {
            this.confirmBtn.setVisible(enable);
        }
    }

    checkAnswer() {
        let allCorrect = true;

        for (let obj of this.objects) {
            const objId = obj.objectId;
            const inBorder1 = this.border1Zone.contains(obj.x, obj.y);
            const inBorder2 = this.border2Zone.contains(obj.x, obj.y);

            const shouldBeInBorder1 = this.border1_correctObjects.includes(objId);
            const shouldBeInBorder2 = this.border2_correctObjects.includes(objId);

            if (shouldBeInBorder1 && !inBorder1) {
                allCorrect = false;
                break;
            }
            if (shouldBeInBorder2 && !inBorder2) {
                allCorrect = false;
                break;
            }
        }

        if (allCorrect) {
            console.log('All objects correctly placed!');
            this.onRoundWin();
        } else {
            console.log('Incorrect placement!');
            this.handleLose();
        }
    }

    resetForNewRound() {
        // Reset objects to original positions
        this.objects.forEach(obj => {
            obj.x = obj.originalX;
            obj.y = obj.originalY;
        });
    }

    showWin() {
        this.objects.forEach(obj => obj.setVisible(false));
        if (this.confirmBtn) this.confirmBtn.setVisible(false);

        this.time.delayedCall(1500, () => {
            GameManager.backToMainStreet(this);
        });
    }
}
