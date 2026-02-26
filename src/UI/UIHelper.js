import { CustomButton } from './Button.js';
import { CustomPanel, ItemsPanel, SettingPanel } from './Panel.js';

export default class UIHelper {
    // Shared UI Depth Constants
    static DEPTH = {
        BG: 1,
        TITLE: 3,
        BUTTONS: 1000,
        PANELS: 1100,
        TOAST: 2000
    };

    /**
     * Internal helper to handle the exclusive opening of panels
     */
    static #managePanels(panels, buttons) {
        const openPanel = (targetPanel, activeBtn) => {
            // Hide all panels using the new .hide() method from our enhanced Panel.js
            panels.forEach(p => {
                if (p && p !== targetPanel) p.setVisible(false);
            });

            // Reset all button states except the active one
            buttons.forEach(btn => {
                if (btn !== activeBtn) btn.resetStatus?.();
            });

            // Show target
            if (targetPanel) {
                // If using the enhanced Panel.js, we use .show(), otherwise setVisible
                if (targetPanel.show) targetPanel.show();
                else targetPanel.setVisible(true);

                if (targetPanel.refresh) targetPanel.refresh();
            }
        };

        // Link buttons to panels
        buttons.forEach((btn, index) => {
            const linkedPanel = panels[index];
            if (!linkedPanel) return;

            linkedPanel.toggleBtn = btn;
            btn.needClicked = true;

            // Assign the toggle logic
            btn.cbDown = () => openPanel(linkedPanel, btn);
            btn.cbUp = () => linkedPanel.hide ? linkedPanel.hide() : linkedPanel.setVisible(false);
        });
    }

    static createCommonUI(scene, programPages, descriptionPages, depthOffset = 0) {
        const baseDepth = this.DEPTH.PANELS + depthOffset;

        // 1. Initialize Panels
        const panels = [
            new SettingPanel(scene, 960, 540).setDepth(baseDepth).setScrollFactor(0),
            new CustomPanel(scene, 960, 540, descriptionPages).setDepth(baseDepth).setScrollFactor(0),
            new CustomPanel(scene, 960, 540, programPages).setDepth(baseDepth).setScrollFactor(0)
        ];

        // 2. Initialize Buttons
        const buttons = [
            new CustomButton(scene, 100, 100, 'setting_btn', 'setting_btn_click').setDepth(this.DEPTH.BUTTONS).setScrollFactor(0),
            new CustomButton(scene, 250, 100, 'desc_button', 'desc_button_click').setDepth(this.DEPTH.BUTTONS).setScrollFactor(0),
            new CustomButton(scene, 400, 100, 'program_btn', 'program_btn_click').setDepth(this.DEPTH.BUTTONS).setScrollFactor(0)
        ];

        // 3. Apply Management Logic
        this.#managePanels(panels, buttons);

        return {
            settingBtn: buttons[0], descBtn: buttons[1], programBtn: buttons[2],
            settingPanel: panels[0], descriptionPanel: panels[1], programPanel: panels[2]
        };
    }

    static createGameCommonUI(scene, bgKey, descriptionPages, targetRounds = 3) {
        const { width, height } = scene.scale;

        if (bgKey) scene.add.image(width / 2, height / 2, bgKey).setDepth(this.DEPTH.BG);

        // UI Setup
        const panels = [
            new SettingPanel(scene, 960, 540).setDepth(this.DEPTH.PANELS).setScrollFactor(0),
            new CustomPanel(scene, 960, 540, descriptionPages).setDepth(this.DEPTH.PANELS).setScrollFactor(0),
            new ItemsPanel(scene, 960, 540).setDepth(this.DEPTH.PANELS).setScrollFactor(0)
        ];

        const buttons = [
            new CustomButton(scene, 100, 100, 'setting_btn', 'setting_btn_click').setDepth(this.DEPTH.BUTTONS).setScrollFactor(0),
            new CustomButton(scene, 250, 100, 'desc_button', 'desc_button_click').setDepth(this.DEPTH.BUTTONS).setScrollFactor(0),
            new CustomButton(scene, 400, 100, 'gameintro_bag', 'gameintro_bag_click').setDepth(this.DEPTH.BUTTONS).setScrollFactor(0)
        ];

        this.#managePanels(panels, buttons);


        // Round/Life Icons logic
        const roundStates = [];
        for (let i = 0; i < targetRounds; i++) {
            const icon = scene.add.image(1755 - (i * 145), 200, 'game_gamechance')
                .setScale(0.8)
                .setDepth(555);
            roundStates.push({ round: i + 1, content: icon, isSuccess: false });
        }

        return { settingBtn: buttons[0], descBtn: buttons[1], itemBtn: buttons[2], roundStates };
    }

    // ================== UTILITIES ==================

    static showToast(scene, message, color = '#ff0000') {
        const toast = scene.add.text(960, 800, message, {
            fontSize: '32px',
            color: color,
            backgroundColor: '#000000',
            padding: { x: 20, y: 10 }
        }).setOrigin(0.5).setDepth(this.DEPTH.TOAST);

        scene.tweens.add({
            targets: toast,
            y: 750,
            alpha: 0,
            delay: 1500,
            duration: 500,
            onComplete: () => toast.destroy()
        });
    }

    static showTimer(scene, seconds, onComplete) {
        const timerBg = scene.add.image(1640, 80, 'game_timer_bg').setDepth(this.DEPTH.BUTTONS);

        let timeLeft = seconds;
        const timerText = scene.add.text(1640, 80, this.#formatTime(timeLeft), {
            fontSize: '60px', color: '#ffffff', fontStyle: 'bold'
        }).setOrigin(0.5).setDepth(this.DEPTH.BUTTONS + 1);

        const timerEvent = scene.time.addEvent({
            delay: 1000,
            callback: () => {
                timeLeft--;
                timerText.setText(this.#formatTime(timeLeft));
                if (timeLeft <= 0) {
                    timerEvent.destroy();
                    if (onComplete) onComplete();
                }
            },
            loop: true
        });

        return {
            stop: () => timerEvent.paused = true,
            start: () => timerEvent.paused = false,
            destroy: () => { timerBg.destroy(); timerText.destroy(); timerEvent.destroy(); }
        };
    }

    static #formatTime(s) {
        const mins = Math.floor(s / 60);
        const secs = s % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
}