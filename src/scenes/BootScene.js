export class BootScene extends Phaser.Scene {
    constructor() {
        super('BootScene');
    }

    preload() {
        this.load.plugin('rexinputtextplugin', 'https://cdn.jsdelivr.net/npm/phaser3-rex-plugins@1.80.17/dist/rexinputtextplugin.min.js', true);

        this.load.audio('bgm', 'assets/Music/bgm.mp3');
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
        this.load.image('desc_button', gameStartPath + 'game_description_button.png');
        this.load.image('desc_button_click', gameStartPath + 'game_description_button_click.png');
        this.load.image('prev_button', gameStartPath + 'left_arrow_button.png');
        this.load.image('prev_button_click', gameStartPath + 'left_arrow_button_click.png');
        this.load.image('program_btn', gameStartPath + 'program_information_button.png');
        this.load.image('program_btn_click', gameStartPath + 'program_information_button_click.png');
        this.load.image('program_information_p1', gameStartPath + 'program_information_p1.png');
        this.load.image('program_information_p2', gameStartPath + 'program_information_p2.png');
        this.load.image('program_information_p3', gameStartPath + 'program_information_p3.png');
        this.load.image('program_information_p4', gameStartPath + 'program_information_p4.png');
        this.load.image('game_description_p1', gameStartPath + 'game_description_p1.png');
        this.load.image('game_description_p2', gameStartPath + 'game_description_p2.png');
        this.load.image('next_button', gameStartPath + 'right_arrow_button.png');
        this.load.image('next_button_click', gameStartPath + 'right_arrow_button_click.png');
        this.load.image('setting_btn', gameStartPath + 'setting_button.png');
        this.load.image('setting_btn_click', gameStartPath + 'setting_button_click.png');

        //settings page
        this.load.image('setting_bg', 'assets/images/Settings/setting_page_bg.png');

        this.load.image('vol_bg', 'assets/images/Settings/setting_page_volume_bg.png');
        this.load.image('vol_1', 'assets/images/Settings/setting_page_volume1.png');
        this.load.image('vol_2', 'assets/images/Settings/setting_page_volume2.png');
        this.load.image('vol_3', 'assets/images/Settings/setting_page_volume3.png');
        this.load.image('vol_4', 'assets/images/Settings/setting_page_volume4.png');
        this.load.image('vol_5', 'assets/images/Settings/setting_page_volume5.png');

        this.load.image('vol_left', 'assets/images/Settings/setting_page_left_arrow.png');
        this.load.image('vol_left_click', 'assets/images/Settings/setting_page_left_arrow_click.png');
        this.load.image('vol_right', 'assets/images/Settings/setting_page_right_arrow.png');
        this.load.image('vol_right_click', 'assets/images/Settings/setting_page_right_arrow_click.png');

        this.load.image('lang_mandarin', 'assets/images/Settings/setting_page_mandarin.png');
        this.load.image('lang_mandarin_click', 'assets/images/Settings/setting_page_mandarin_click.png');
        this.load.image('lang_cantonese', 'assets/images/Settings/setting_page_cantonese.png');
        this.load.image('lang_cantonese_click', 'assets/images/Settings/setting_page_cantonese_click.png');

        this.load.image('save_btn', 'assets/images/Settings/setting_page_save.png');
        this.load.image('save_btn_click', 'assets/images/Settings/setting_page_save_click.png');

    }

    create() {
        console.log('Global Assets Loaded');

        const savedData = localStorage.getItem('gameSettings');

        if (savedData) {
            const settings = JSON.parse(savedData);

            this.sound.volume = settings.volume * 0.2;

            this.registry.set('globalSettings', settings);
        }
        this.scene.start('MainStreetScene');
    }
}

