
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

        this.spawnCardPositions = [
            { x: centerX - 500, y: centerY - 150 },
            { x: centerX - 250, y: centerY - 150 },
            { x: centerX, y: centerY - 150 },
            { x: centerX + 250, y: centerY - 150 },
            { x: centerX + 500, y: centerY - 150 },
            { x: centerX - 500, y: centerY + 150 },
        ];

        this.initGame('game7_bg', 'game7_description', false, false, {
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
            {
                key: 'game7_answer1',
                fillKey: 'game7_fill_answer1',
                position: { x: this.centerX, y: this.centerY - 100 }
            },
            {
                key: 'game7_answer2',
                fillKey: 'game7_fill_answer2',
                position: { x: this.centerX, y: this.centerY }
            },
            {
                key: 'game7_answer3',
                fillKey: 'game7_fill_answer3',
                position: { x: this.centerX, y: this.centerY + 100 }
            },
            {
                key: 'game7_answer4',
                fillKey: 'game7_fill_answer4',
                position: { x: this.centerX + 200, y: this.centerY - 50 }
            },

            {
                key: 'game7_answer5',
                fillKey: 'game7_fill_answer5',
                position: { x: this.centerX + 200, y: this.centerY + 50 }
            },
            {
                key: 'game7_answer6',
                fillKey: 'game7_fill_answer6',
                position: { x: this.centerX + 200, y: this.centerY + 150 }
            }

        ]

        const answerKeys = ['game7_answer1', 'game7_answer2', 'game7_answer3', 'game7_answer4', 'game7_answer5', 'game7_answer6'];
        const fillAnswerKeys = ['game7_fill_answer1', 'game7_fill_answer2', 'game7_fill_answer3', 'game7_fill_answer4', 'game7_fill_answer5', 'game7_fill_answer6'];
    }

}
