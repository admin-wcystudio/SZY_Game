export class BootScene extends Phaser.Scene {
    constructor() {
        super('BootScene');
    }

    preload() {
        // Load assets for the boot scene
        const gameStartPath = 'assets/images/GameStart/';

        this.load.video('cover_video', gameStartPath + 'cover_bg.webm');
        this.load.image('close_button', gameStartPath + 'close_button.png');
        this.load.image('close_button_click', gameStartPath + 'close_button_click.png');
        // Video/webm not supported by this.load.image
        this.load.image('cover_game_description_button', gameStartPath + 'cover_game_description_button.png');
        this.load.image('cover_game_description_button_click', gameStartPath + 'cover_game_description_button_click.png');
        this.load.image('cover_game_start', gameStartPath + 'cover_game_start.png');
        this.load.image('cover_game_start_click', gameStartPath + 'cover_game_start_click.png');
        this.load.image('game_description_button', gameStartPath + 'game_description_button.png');
        this.load.image('game_description_button_click', gameStartPath + 'game_description_button_click.png');
        this.load.image('left_arrow_button', gameStartPath + 'left_arrow_button.png');
        this.load.image('left_arrow_button_click', gameStartPath + 'left_arrow_button_click.png');
        this.load.image('program_information_button', gameStartPath + 'program_information_button.png');
        this.load.image('program_information_button_click', gameStartPath + 'program_information_button_click.png');
        this.load.image('program_information_p1', gameStartPath + 'program_information_p1.png');
        this.load.image('program_information_p2', gameStartPath + 'program_information_p2.png');
        this.load.image('program_information_p3', gameStartPath + 'program_information_p3.png');
        this.load.image('program_information_p4', gameStartPath + 'program_information_p4.png');
        this.load.image('right_arrow_button', gameStartPath + 'right_arrow_button.png');
        this.load.image('right_arrow_button_click', gameStartPath + 'right_arrow_button_click.png');
        this.load.image('setting_button', gameStartPath + 'setting_button.png');
        this.load.image('setting_button_click', gameStartPath + 'setting_button_click.png');
        // If you want to load cover_bg.webm, use this.load.video or this.load.webm if supported by your Phaser version
    }

    create() {
        this.scene.start('GameStartScene');
    }
}

