import { GameStartScene } from './scenes/GameStartScene.js';
import { BootScene } from './scenes/BootScene.js';
import { LoginScene } from './scenes/LoginScene.js';
import { TransitionScene } from './scenes/TransitionScene.js';
import { MainStreetScene } from './scenes/MainStreetScene.js';
import { GameScene_1 } from './scenes/Game/GameScene_1.js';


const config = {
    type: Phaser.AUTO,
    title: 'Overlord Rising',
    description: '',
    parent: 'game-container',
    width: 1920,
    height: 1080,
    backgroundColor: '#000000',
    preseveDrawingBuffer: true,
    pixelArt: false,
    scene: [
        BootScene,
        GameStartScene,
        LoginScene,
        TransitionScene,
        MainStreetScene,
        GameScene_1
    ],
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
}

new Phaser.Game(config);
