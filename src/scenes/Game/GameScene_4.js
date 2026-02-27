import BaseGameScene from './BaseGameScene.js';
import { CustomButton } from '../../UI/Button.js';
import { CustomPanel, CustomFailPanel } from '../../UI/Panel.js';
import GameManager from '../GameManager.js';


export class GameScene_4 extends BaseGameScene {
    constructor() {
        super('GameScene_4');
    }

    preload() {
        const path = 'assets/images/Game_4/';

        this.width = this.cameras.main.width;
        this.height = this.cameras.main.height;
        this.centerX = this.width / 2;
        this.centerY = this.height / 2;

        this.load.image('game4_npc_box_intro', `${path}game4_npc_box3.png`);
        this.load.image('game4_npc_box_win', `${path}game4_npc_box3.png`);
        this.load.image('game4_npc_box_tryagain', `${path}game4_npc_box4.png`);

        this.load.image('game4_hit_button', `${path}game4_click_button.png`);
        this.load.image('game4_hit_button_select', `${path}game4_click_button_select.png`);
        this.load.image('game4_target_arrow', `${path}game4_arrow.png`);

        for (let i = 1; i <= 3; i++) {
            this.load.image(`game4_q${i}`, `${path}game4_q${i}.png`);
            this.load.image(`game4_q${i}_bar`, `${path}game4_q${i}_bar.png`);
        }

    }

    create() {
        this.arrow = this.add.image(this.centerX, this.centerY - 100, 'game4_target_arrow')
            .setDepth(501).setVisible(true);

        this.bar = this.add.image(this.centerX, this.centerY + 100, 'game4_q1_bar')
            .setDepth(500).setVisible(true);

        this.initGame('game4_bg', 'game4_description', false, false, {
            targetRounds: 3,
            roundPerSeconds: 60,
            isAllowRoundFail: false,
            isContinuousTimer: true,
            sceneIndex: 4
        });

    }

    setupGameObjects() {
        this.arrowSpeed = 10; // Initial speed of the arrow
        this.isHit = false;
        this.successfulHits = 0; // Track number of successful hits

        // Define success ranges for each bar (min and max x positions)
        this.hitRanges = [
            { min: 200, max: 650 },  // Bar 1 success range
            { min: 1250, max: 1600 },  // Bar 2 success range
            { min: 650, max: 1050 }   // Bar 3 success range
        ];

        this.hitButton = new CustomButton(this, 1720, 880,
            'game4_hit_button', 'game4_hit_button_select', () => this.handleHitButtonClick())
            .setDepth(502);

        // Add hover effect to hit button
        this.hitButton.on('pointerover', () => {
            this.hitButton.setTexture('game4_hit_button_select');
        });

        this.hitButton.on('pointerout', () => {
            this.hitButton.setTexture('game4_hit_button');
        });
    }

    update() {
        if (!this.arrow || this.isHit) return;

        // Bouncing logic
        this.arrow.x += this.arrowSpeed;

        // Bar range approximation (480 to 1440)
        if (this.arrow.x >= 1420) {
            this.arrow.x = 1420;
            this.arrowSpeed = -Math.abs(this.arrowSpeed); // Turn left
        } else if (this.arrow.x <= 500) {
            this.arrow.x = 500;
            this.arrowSpeed = Math.abs(this.arrowSpeed); // Turn right
        }
    }

    handleHitButtonClick() {
        if (this.isHit || !this.isGameActive) return; // Prevent multiple clicks

        this.isHit = true;

        // Stop the arrow movement
        this.arrowSpeed = 0;

        // Check if hit was successful based on current round
        this.checkHitSuccess();
    }

    checkHitSuccess() {
        const currentBarIndex = this.successfulHits; // 0, 1, or 2
        const range = this.hitRanges[currentBarIndex];
        const arrowX = this.arrow.x;

        console.log(`Arrow at x=${arrowX}, Range: ${range.min}-${range.max}`);

        // Check if arrow is within the success range
        if (arrowX >= range.min && arrowX <= range.max) {
            // Success!
            this.successfulHits++;
            console.log(`Hit ${this.successfulHits}/3 successful!`);

            // Check if all 3 hits are successful
            if (this.successfulHits >= 3) {
                // Win the game!
                this.time.delayedCall(500, () => {
                    this.handleWinBeforeBubble();
                });
            } else {
                // Move to next bar
                this.time.delayedCall(500, () => {
                    this.nextBar();
                });
            }
        } else {
            // Failed - outside the range
            console.log('Hit failed - outside range');
            this.time.delayedCall(500, () => {
                this.handleLose();
            });
        }
    }

    nextBar() {
        // Reset for next round
        this.isHit = false;
        this.arrow.x = this.centerX;
        this.arrowSpeed = 10;

        // Update bar image for next question
        const barKeys = ['game4_q1_bar', 'game4_q2_bar', 'game4_q3_bar'];
        this.bar.setTexture(barKeys[this.successfulHits]);

        console.log(`Moving to bar ${this.successfulHits + 1}`);
    }

    resetForNewRound() {
        // Reset game state
        this.isHit = false;
        this.successfulHits = 0;
        this.arrowSpeed = 10;

        if (this.arrow) {
            this.arrow.x = this.centerX;
        }

        if (this.bar) {
            this.bar.setTexture('game4_q1_bar');
        }
    }

    enableGameInteraction(enabled) {
        if (this.hitButton) {
            if (enabled) {
                this.hitButton.setInteractive();
            } else {
                this.hitButton.disableInteractive();
            }
        }
    }

    showWin() {
        // Navigate back to main street after winning
        GameManager.backToMainStreet(this);
    }

}
