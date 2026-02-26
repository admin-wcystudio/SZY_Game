import { CustomButton } from '../../UI/Button.js';
import UIHelper from '../../UI/UIHelper.js';
import GameManager from '../GameManager.js';

/**
 * Enhanced BaseGameScene
 * Features: Centralized Sound, State Management, and Lifecycle Hooks for 7 Mini-Games
 */
export default class BaseGameScene extends Phaser.Scene {
    constructor(key) {
        super(key);

        // --- Core Configuration (Can be overridden in init) ---
        this.config = {
            depthUI: 1000,
            depthBubble: 1500,
            depthFeedback: 2000,
            roundDuration: 30,
            targetRounds: 3,
            isAllowRoundFail: false,
            isContinuousTimer: false
        };

        // --- Game State ---
        this.gameState = 'init'; // 'init', 'playing', 'paused', 'roundWin', 'gameWin', 'lose', 'gameLose'
        this.roundIndex = 0;
        this.totalUsedSeconds = 0;
        this.isGameActive = false;

        // --- References ---
        this.gameUI = null;
        this.gameTimer = null;
        this.currentBubbleImg = null;
        this.feedbackLabel = null;
    }

    /**
     * @param {Object} data - Configuration object from the calling script
     */
    init(data = {}) {
        // Merge passed data with default config
        this.config = { ...this.config, ...data };
        this.targetRounds = this.config.targetRounds;
        this.roundPerSeconds = this.config.roundDuration;
        this.isAllowRoundFail = this.config.isAllowRoundFail;
        this.isContinuousTimer = this.config.isContinuousTimer;
    }

    /**
     * Unified Initialization
     */
    initGame(bgKey, descriptionKey, skipIntroBubble = false, autoStart = false) {
        this.gameState = 'init';
        this.roundIndex = 0;
        this.totalUsedSeconds = 0;

        const player = JSON.parse(localStorage.getItem('player') || '{"gender":"M"}');
        const descriptionPages = this._formatDescription(descriptionKey);

        // 1. Setup UI via Helper
        this.gameUI = UIHelper.createGameCommonUI(this, bgKey,
            descriptionPages, this.targetRounds, this.config.depthUI);

        console.log('Game UI Initialized');

        // 2. Setup Timer
        this._setupTimer();

        // 3. Subclass Specific Objects
        this.setupGameObjects();

        // 4. Handle Entry Flow
        this._handleEntryFlow(skipIntroBubble, autoStart, player.gender);
    }

    // --- Internal Logic ---

    _formatDescription(key) {
        const keys = Array.isArray(key) ? key : [key];
        return keys.map(k => ({
            content: k,
            closeBtn: 'close_button',
            closeBtnClick: 'close_button_click'
        }));
    }

    _setupTimer() {
        if (this.roundPerSeconds > 0) {
            this.gameTimer = UIHelper.showTimer(this, this.roundPerSeconds, false, () => this.handleLose());
        } else {
            this.gameTimer = { start: () => { }, stop: () => { }, reset: () => { }, getRemaining: () => 0 };
        }
    }

    _handleEntryFlow(skip, auto, gender) {
        const startAction = () => {
            if (skip && auto) this.startGame();
            else if (skip) this.gameUI.descriptionPanel?.setCloseCallBack(() => this.startGame());
            else this.gameUI.descriptionPanel?.setCloseCallBack(() => this.showBubble('intro', gender));
        };
        startAction();
    }

    // --- Life Cycle Management ---

    startGame() {
        if (this.gameState === 'playing') return;

        this.gameState = 'playing';
        this.isGameActive = true;
        this.gameTimer.start();
        this.enableGameInteraction(true);
        this.events.emit('game-start', this.roundIndex);
        console.log(`[Game] Round ${this.roundIndex + 1} Started`);
    }

    pauseGame() {
        this.isGameActive = false;
        this.gameTimer.stop();
        this.enableGameInteraction(false);
        this.gameState = 'paused';
    }

    /**
     * Centralized Win Logic
     */
    handleWinBeforeBubble() {
        if (!this.isGameActive || this.gameState === 'gameWin') return;

        let isFinalWin = (this.roundIndex + 1 >= this.targetRounds) || this.isAllowRoundFail;
        this.gameState = isFinalWin ? 'gameWin' : 'roundWin';

        this.gameTimer.stop();
        this._calculateTiming(isFinalWin);
        this.enableGameInteraction(false);
        this.updateRoundUI(true);

        // Feedback Visuals
        this.showFeedbackLabel(true);
        this.playFeedback(true, () => this.showBubble('win'));
    }

    _calculateTiming(isFinalWin) {
        if (!this.gameTimer?.getRemaining) return;

        const used = Math.max(0, this.roundPerSeconds - this.gameTimer.getRemaining());
        if (this.isContinuousTimer) {
            if (isFinalWin) this.totalUsedSeconds = used;
        } else {
            this.totalUsedSeconds += used;
            this.gameTimer.reset(this.roundPerSeconds);
        }
    }

    /**
     * Visual Feedback Hook (e.g. "Excellent!" or "Keep Trying")
     */
    showFeedbackLabel(isSuccess) {
        const key = isSuccess ? 'game_success_label' : 'game_fail_label';
        if (this.feedbackLabel) this.feedbackLabel.destroy();

        this.feedbackLabel = this.add.image(1650, 350, key)
            .setDepth(this.config.depthFeedback)
            .setScale(0);

        this.tweens.add({
            targets: this.feedbackLabel,
            scale: 1,
            duration: 500,
            ease: 'Back.easeOut'
        });
    }

    // --- Abstract Hooks (To be implemented by your 7 games) ---

    setupGameObjects() {
        // Example: this.add.sprite(...) or this.physics.add.group(...)
    }

    enableGameInteraction(enabled) {
        // Example: input.setDraggable(...)
    }

    resetForNewRound() {
        // Example: reset sprite positions
    }

    // --- Utilities ---

    /**
     * Cleans up the scene to prevent memory leaks
     */
    shutdown() {
        if (this.gameTimer) this.gameTimer.stop();
        this.tweens.killAll();
        this.events.off('game-start');
    }
}