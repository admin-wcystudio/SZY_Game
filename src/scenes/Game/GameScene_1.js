import BaseGameScene from './BaseGameScene.js';

export class GameScene_1 extends BaseGameScene {
    constructor() {
        super('GameScene_1');
    }
    preload() {
        const path = 'assets/images/Game_1/';
    }

    create() {
        this.initGame('game1_bg', 'game1_title', 'game1_description', false, true);
    }

}