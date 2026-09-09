import GameManager from '../scenes/GameManager.js';
import { gameConfig } from '../config.js';

export default class VoiceOverHelper {
    static FADE_MS = 200;
    static BGM_VOLUME = 0.18;
    static BGM_DUCKED_VOLUME = 0.05;
    static IMAGE_BASE = 'assets/images';
    static AUDIO_BASE = 'assets/VO';

    static GAME_DIALOGUE = {
        1: {
            street: ['game1_npc_box1', 'game1_npc_box2'],
            intro: ['game1_npc_box3'],
            win: ['game1_npc_box4', 'game1_npc_box5', 'game1_npc_box6'],
            fail: 'game1_npc_box7'
        },
        2: {
            street: ['game2_npc_box1', 'game2_npc_box2'],
            intro: ['game2_npc_box3'],
            win: 'game2_npc_box4',
            fail: 'game2_npc_box5'
        },
        3: {
            street: ['game3_npc_box1', 'game3_npc_box2'],
            intro: ['game3_npc_box3'],
            win: 'game3_npc_box4',
            fail: 'game3_npc_box5'
        },
        4: {
            street: ['game4_npc_box1', 'game4_npc_box2'],
            intro: [],
            win: 'game4_npc_box3',
            fail: 'game4_npc_box4'
        },
        5: {
            streetLock: ['game5_npc_box12'],
            street: ['game5_npc_box1', 'game5_npc_box2'],
            intro: ['game5_npc_box1'],
            win: 'game5_npc_box10',
            fail: 'game5_npc_box11'
        },
        6: {
            streetLock: ['game6_npc_box6'],
            street: ['game6_npc_box1', 'game6_npc_box2'],
            intro: ['game6_npc_box3'],
            win: ['game6_npc_box4', 'game6_npc_box5'],
            fail: 'game6_npc_box7'
        },
        7: {
            streetLock: ['game7_npc_box7'],
            street: ['game7_npc_box3', 'game7_npc_box4'],
            intro: ['game7_npc_box5'],
            win: [],
            fail: 'game7_npc_box8'
        }
    };

    static STEMS = [
        'Game_1/game1_npc_box1',
        'Game_1/game1_npc_box2',
        'Game_1/game1_npc_boy_box2',
        'Game_1/game1_npc_girl_box2',
        'Game_1/game1_npc_box3',
        'Game_1/game1_npc_box4',
        'Game_1/game1_npc_boy_box4',
        'Game_1/game1_npc_girl_box4',
        'Game_1/game1_npc_box5',
        'Game_1/game1_npc_box6',
        'Game_1/game1_npc_boy_box6',
        'Game_1/game1_npc_girl_box6',
        'Game_1/game1_npc_box7',
        'Game_2/game2_npc_box1',
        'Game_2/game2_npc_box2',
        'Game_2/game2_npc_girl_box2',
        'Game_2/game2_npc_box3',
        'Game_2/game2_npc_box4',
        'Game_2/game2_npc_box5',
        'Game_3/game3_npc_box1',
        'Game_3/game3_npc_box2',
        'Game_3/game3_npc_boy_box2',
        'Game_3/game3_npc_girl_box2',
        'Game_3/game3_npc_box3',
        'Game_3/game3_npc_box4',
        'Game_3/game3_npc_box5',
        'Game_4/game4_npc_box1',
        'Game_4/game4_npc_box2',
        'Game_4/game4_npc_boy_box2',
        'Game_4/game4_npc_girl_box2',
        'Game_4/game4_npc_box3',
        'Game_4/game4_npc_box4',
        'Game_5/game5_npc_box1',
        'Game_5/game5_npc_boy_box2',
        'Game_5/game5_npc_girl_box2',
        'Game_5/game5_npc_boy_box12',
        'Game_5/game5_npc_girl_box12',
        'Game_5/game5_npc_box4',
        'Game_5/game5_npc_boy_box5',
        'Game_5/game5_npc_girl_box5',
        'Game_5/game5_npc_box6',
        'Game_5/game5_npc_boy_box7',
        'Game_5/game5_npc_girl_box7',
        'Game_5/game5_npc_box8',
        'Game_5/game5_npc_boy_box9',
        'Game_5/game5_npc_girl_box9',
        'Game_5/game5_npc_box10',
        'Game_5/game5_npc_box11',
        'Game_6/game6_npc_box1',
        'Game_6/game6_npc_box2',
        'Game_6/game6_npc_boy_box2',
        'Game_6/game6_npc_girl_box2',
        'Game_6/game6_npc_boy_box3',
        'Game_6/game6_npc_girl_box3',
        'Game_6/game6_npc_box4',
        'Game_6/game6_npc_boy_box5',
        'Game_6/game6_npc_girl_box5',
        'Game_6/game6_npc_boy_box6',
        'Game_6/game6_npc_girl_box6',
        'Game_6/game6_npc_box7',
        'Game_7/game7_npc_box1',
        'Game_7/game7_npc_box2',
        'Game_7/game7_npc_box3',
        'Game_7/game7_npc_boy_box4',
        'Game_7/game7_npc_girl_box4',
        'Game_7/game7_npc_box5',
        'Game_7/game7_npc_boy_box6',
        'Game_7/game7_npc_girl_box6',
        'Game_7/game7_npc_box7',
        'Game_7/game7_npc_boy_box7',
        'Game_7/game7_npc_girl_box7',
        'Game_7/game7_npc_box8'
    ];

    static AUDIO_STEMS = [
        'Game_1/game1_npc_box1',
        'Game_1/game1_npc_boy_box2',
        'Game_1/game1_npc_girl_box2',
        'Game_1/game1_npc_box3',
        'Game_1/game1_npc_boy_box4',
        'Game_1/game1_npc_girl_box4',
        'Game_1/game1_npc_box5',
        'Game_1/game1_npc_boy_box6',
        'Game_1/game1_npc_girl_box6',
        'Game_1/game1_npc_box7',
        'Game_2/game2_npc_box1',
        'Game_2/game2_npc_box2',
        'Game_2/game2_npc_girl_box2',
        'Game_2/game2_npc_box3',
        'Game_2/game2_npc_box4',
        'Game_2/game2_npc_box5',
        'Game_3/game3_npc_box1',
        'Game_3/game3_npc_boy_box2',
        'Game_3/game3_npc_girl_box2',
        'Game_3/game3_npc_box3',
        'Game_3/game3_npc_box4',
        'Game_3/game3_npc_box5',
        'Game_4/game4_npc_box1',
        'Game_4/game4_npc_boy_box2',
        'Game_4/game4_npc_girl_box2',
        'Game_4/game4_npc_box3',
        'Game_4/game4_npc_box4',
        'Game_5/game5_npc_box1',
        'Game_5/game5_npc_boy_box2',
        'Game_5/game5_npc_girl_box2',
        'Game_5/game5_npc_boy_box12',
        'Game_5/game5_npc_girl_box12',
        'Game_5/game5_npc_box4',
        'Game_5/game5_npc_boy_box5',
        'Game_5/game5_npc_girl_box5',
        'Game_5/game5_npc_box6',
        'Game_5/game5_npc_boy_box7',
        'Game_5/game5_npc_girl_box7',
        'Game_5/game5_npc_box8',
        'Game_5/game5_npc_boy_box9',
        'Game_5/game5_npc_girl_box9',
        'Game_5/game5_npc_box10',
        'Game_5/game5_npc_box11',
        'Game_6/game6_npc_box1',
        'Game_6/game6_npc_boy_box2',
        'Game_6/game6_npc_girl_box2',
        'Game_6/game6_npc_boy_box3',
        'Game_6/game6_npc_girl_box3',
        'Game_6/game6_npc_box4',
        'Game_6/game6_npc_boy_box5',
        'Game_6/game6_npc_girl_box5',
        'Game_6/game6_npc_boy_box6',
        'Game_6/game6_npc_girl_box6',
        'Game_6/game6_npc_box7',
        'Game_7/game7_npc_box1',
        'Game_7/game7_npc_box2',
        'Game_7/game7_npc_box3',
        'Game_7/game7_npc_boy_box4',
        'Game_7/game7_npc_girl_box4',
        'Game_7/game7_npc_box5',
        'Game_7/game7_npc_boy_box6',
        'Game_7/game7_npc_girl_box6',
        'Game_7/game7_npc_box7',
        'Game_7/game7_npc_boy_box7',
        'Game_7/game7_npc_girl_box7',
        'Game_7/game7_npc_box8'
    ];

    static toArray(value) {
        if (!value) return [];
        return Array.isArray(value) ? value : [value];
    }

    static preload(scene) {
        if (!scene._voLoadErrorBound) {
            scene._voLoadErrorBound = true;
            scene.load.on('loaderror', (file) => {
                if (file && file.type === 'audio' && file.key !== 'bgm') {
                    console.warn('[VO] skipped missing audio', file.key);
                }
            });
        }

        VoiceOverHelper.AUDIO_STEMS.forEach((stem) => {
            const [folder, fileBase] = stem.split('/');
            ['Mandarin', 'Cantonese'].forEach((lang) => {
                const key = `${fileBase}_${lang}`;
                if (!scene.cache.audio.exists(key)) {
                    scene.load.audio(key, `${VoiceOverHelper.AUDIO_BASE}/${folder}/${fileBase}_${lang}.mp3`);
                }
            });
        });
    }

    static preloadImages(scene, keys) {
        keys.forEach((key) => {
            const match = /^game(\d+)_/.exec(key);
            if (!match || scene.textures.exists(key)) return;
            scene.load.image(key, `${VoiceOverHelper.IMAGE_BASE}/Game_${match[1]}/${key}.png`);
        });
    }

    static streetImageKeys(gameId) {
        const config = VoiceOverHelper.GAME_DIALOGUE[gameId];
        if (!config) return [];
        const bases = [...(config.streetLock || []), ...(config.street || [])];
        return VoiceOverHelper.imageKeysForBases(gameId, bases);
    }

    static inGameImageKeys(gameId) {
        const config = VoiceOverHelper.GAME_DIALOGUE[gameId];
        if (!config) return [];
        const bases = [
            ...(config.intro || []),
            ...VoiceOverHelper.toArray(config.win),
            config.fail,
            ...(config.winFinal || []),
            config.afterQuestions
        ].filter(Boolean);
        return VoiceOverHelper.imageKeysForBases(gameId, bases);
    }

    static imageKeysForBases(gameId, bases) {
        return VoiceOverHelper.STEMS
            .filter((stem) => stem.startsWith(`Game_${gameId}/`))
            .map((stem) => stem.split('/')[1])
            .filter((file) => bases.some((base) => VoiceOverHelper.fileMatchesBase(file, base)));
    }

    static fileMatchesBase(file, base) {
        if (file === base || file.startsWith(`${base}_`)) return true;
        const gendered = /^(game\d+_npc)_(?:boy|girl)_(box\d+)$/.exec(file);
        if (gendered && `${gendered[1]}_${gendered[2]}` === base) return true;
        return false;
    }

    static getStreetLines(gameId, locked = false) {
        const config = VoiceOverHelper.GAME_DIALOGUE[gameId];
        if (!config) return [];
        if (locked && config.streetLock) return config.streetLock;
        return config.street || [];
    }

    static arePrereqsMet(gameId) {
        if (gameConfig.isTesting) return true;
        const results = GameManager.loadGameResult();
        const needed = gameId === 5 ? [4]
            : gameId === 6 ? [1]
                : gameId === 7 ? [2, 3, 6]
                    : [];
        return needed.every((n) => {
            const res = results.find((r) => r.game === n);
            return res && res.isFinished;
        });
    }

    static getLanguageSuffix() {
        let language = 'HK';
        try {
            const saved = localStorage.getItem('gameSettings');
            if (saved) {
                language = JSON.parse(saved).language || 'HK';
            }
        } catch (e) {
            language = 'HK';
        }
        return language === 'CN' ? 'Mandarin' : 'Cantonese';
    }

    static getGenderTag() {
        try {
            const player = JSON.parse(localStorage.getItem('player') || '{}');
            return player.gender === 'F' ? 'girl' : 'boy';
        } catch (e) {
            return 'boy';
        }
    }

    static boxBaseFromBubbleKey(bubbleKey) {
        if (!bubbleKey) return null;

        const szyGendered = /^(game\d+_npc)_(?:boy|girl)_(box\d+)$/.exec(bubbleKey);
        if (szyGendered) return `${szyGendered[1]}_${szyGendered[2]}`;

        const mywGendered = /^(game\d+_npc_box\d+)_(?:boy|girl)$/.exec(bubbleKey);
        if (mywGendered) return mywGendered[1];

        if (/^game\d+_npc_box\d+$/.test(bubbleKey)) return bubbleKey;

        const npcBubble = /^npc(\d+)_bubble_(\d+)$/.exec(bubbleKey);
        if (npcBubble) {
            const npcToGame = { 1: 4, 2: 3, 3: 2, 4: 1, 5: 5, 6: 6, 7: 7 };
            const gameId = npcToGame[Number(npcBubble[1])];
            return gameId ? `game${gameId}_npc_box${npcBubble[2]}` : null;
        }

        const playerBubble = /^game(\d+)_(?:boy|girl)_bubble$/.exec(bubbleKey);
        if (playerBubble) return `game${playerBubble[1]}_npc_box2`;

        const semantic = VoiceOverHelper.semanticToBoxBase(bubbleKey);
        if (semantic) return semantic;

        return bubbleKey;
    }

    static semanticToBoxBase(key) {
        const map = {
            game1_npc_box_intro: 'game1_npc_box3',
            game1_npc_box_boy_win: 'game1_npc_box4',
            game1_npc_box_girl_win: 'game1_npc_box4',
            game1_npc_box_win: 'game1_npc_box5',
            game1_npc_box_boy_win3: 'game1_npc_box6',
            game1_npc_box_girl_win3: 'game1_npc_box6',
            game1_npc_box_tryagain: 'game1_npc_box7',
            game2_npc_box_intro: 'game2_npc_box3',
            game2_npc_box_win: 'game2_npc_box4',
            game2_npc_box_tryagain: 'game2_npc_box5',
            game3_npc_box_intro: 'game3_npc_box3',
            game3_npc_box_win: 'game3_npc_box4',
            game3_npc_box_tryagain: 'game3_npc_box5',
            game4_npc_box_intro: 'game4_npc_box5',
            game4_npc_box_win: 'game4_npc_box3',
            game4_npc_box_tryagain: 'game4_npc_box4',
            game5_npc_box_intro: 'game5_npc_box1',
            game5_npc_box_win: 'game5_npc_box10',
            game5_npc_box_tryagain: 'game5_npc_box11',
            game6_npc_box_intro: 'game6_npc_box3',
            game6_npc_box_win: 'game6_npc_box4',
            game6_npc_box_tryagain: 'game6_npc_box7',
            game7_npc_box_intro: 'game7_npc_box5',
            game7_npc_box_tryagain: 'game7_npc_box8',
            game7_npc_box_win1: 'game7_npc_box1',
            game7_npc_box_win2: 'game7_npc_box2',
            game7_npc_box_feedback: 'game7_npc_box7',
            game7_boy_feedback: 'game7_npc_box6',
            game7_girl_feedback: 'game7_npc_box6'
        };
        return map[key] || null;
    }

    static szyGenderedKey(boxBase, genderTag) {
        return boxBase.replace(/^(game\d+_npc_)(box\d+)$/, `$1${genderTag}_$2`);
    }

    static resolveTexture(scene, key) {
        if (!key) return null;
        const genderTag = VoiceOverHelper.getGenderTag();
        const boxBase = VoiceOverHelper.boxBaseFromBubbleKey(key) || key;
        const szyGendered = VoiceOverHelper.szyGenderedKey(boxBase, genderTag);
        const mywGendered = `${boxBase}_${genderTag}`;

        const candidates = [szyGendered, mywGendered, boxBase, key];
        for (const candidate of candidates) {
            if (candidate && scene.textures.exists(candidate)) return candidate;
        }
        return null;
    }

    static audioCandidates(boxBase, isPlayer) {
        const lang = VoiceOverHelper.getLanguageSuffix();
        const genderTag = VoiceOverHelper.getGenderTag();
        const szyGendered = VoiceOverHelper.szyGenderedKey(boxBase, genderTag);
        const keys = [];

        if (szyGendered !== boxBase) keys.push(`${szyGendered}_${lang}`);
        keys.push(`${boxBase}_${genderTag}_${lang}`);
        keys.push(`${boxBase}_${lang}`);

        const unique = [...new Set(keys)];
        if (isPlayer) return unique;

        const plain = unique.filter((k) => (
            !k.includes(`_npc_${genderTag}_`) && !k.includes(`_${genderTag}_`)
        ));
        return [...plain, ...unique.filter((k) => !plain.includes(k))];
    }

    static resolveKey(scene, boxBase, isPlayer) {
        if (!boxBase) return null;
        const candidates = VoiceOverHelper.audioCandidates(boxBase, isPlayer);
        return candidates.find((key) => scene.cache.audio.exists(key)) || null;
    }

    static hasGenderedAudio(scene, boxBase) {
        const lang = VoiceOverHelper.getLanguageSuffix();
        const genderTag = VoiceOverHelper.getGenderTag();
        const szy = `${VoiceOverHelper.szyGenderedKey(boxBase, genderTag)}_${lang}`;
        const myw = `${boxBase}_${genderTag}_${lang}`;
        return scene.cache.audio.exists(szy) || scene.cache.audio.exists(myw);
    }

    static getBgm(scene) {
        return scene.sound.get('bgm');
    }

    static ensureBgm(scene) {
        if (!scene?.sound || !scene.cache.audio.exists('bgm')) return;

        if (scene.sound.locked) {
            scene.sound.once('unlocked', () => VoiceOverHelper.ensureBgm(scene));
            return;
        }

        let bgm = VoiceOverHelper.getBgm(scene);
        if (!bgm) {
            bgm = scene.sound.add('bgm', {
                loop: true,
                volume: VoiceOverHelper.BGM_VOLUME
            });
        }

        bgm.setLoop(true);
        const volume = scene.currentVo
            ? VoiceOverHelper.BGM_DUCKED_VOLUME
            : VoiceOverHelper.BGM_VOLUME;

        if (bgm.isPaused) {
            bgm.resume();
        }
        if (!bgm.isPlaying) {
            bgm.play({ loop: true, volume });
        } else {
            bgm.setVolume(volume);
        }
    }

    static fadeBgm(scene, volume) {
        const bgm = VoiceOverHelper.getBgm(scene);
        if (!bgm) return;
        if (scene.currentBgmTween) {
            scene.currentBgmTween.stop();
            scene.currentBgmTween = null;
        }
        if (!scene.sys?.isActive() || !scene.tweens) {
            bgm.setVolume(volume);
            return;
        }
        scene.currentBgmTween = scene.tweens.add({
            targets: bgm,
            volume,
            duration: VoiceOverHelper.FADE_MS
        });
    }

    static duckBgm(scene) {
        VoiceOverHelper.fadeBgm(scene, VoiceOverHelper.BGM_DUCKED_VOLUME);
    }

    static restoreBgm(scene) {
        const bgm = VoiceOverHelper.getBgm(scene);
        if (!bgm || !bgm.isPlaying) {
            VoiceOverHelper.ensureBgm(scene);
            return;
        }
        VoiceOverHelper.fadeBgm(scene, VoiceOverHelper.BGM_VOLUME);
    }

    static stop(scene, options = {}) {
        const restoreBgm = options.restoreBgm !== false;
        if (scene.currentVoTween) {
            scene.currentVoTween.stop();
            scene.currentVoTween = null;
        }
        if (scene.currentVo) {
            scene.currentVo.stop();
            scene.currentVo.destroy();
            scene.currentVo = null;
        }
        if (restoreBgm) VoiceOverHelper.restoreBgm(scene);
    }

    static playBubbleVo(scene, bubbleKey, isPlayer = null) {
        VoiceOverHelper.stop(scene, { restoreBgm: false });
        const boxBase = VoiceOverHelper.boxBaseFromBubbleKey(bubbleKey);
        if (!boxBase) {
            VoiceOverHelper.restoreBgm(scene);
            return;
        }

        if (isPlayer === null) {
            isPlayer = VoiceOverHelper.hasGenderedAudio(scene, boxBase);
        }

        const voKey = VoiceOverHelper.resolveKey(scene, boxBase, isPlayer);
        if (!voKey) {
            VoiceOverHelper.restoreBgm(scene);
            return;
        }

        const sound = scene.sound.add(voKey);
        sound.setVolume(0);
        sound.play();
        scene.currentVo = sound;
        VoiceOverHelper.duckBgm(scene);
        scene.currentVoTween = scene.tweens.add({
            targets: sound,
            volume: 1,
            duration: VoiceOverHelper.FADE_MS
        });
        sound.once('complete', () => {
            if (scene.currentVo === sound) {
                scene.currentVo = null;
                VoiceOverHelper.restoreBgm(scene);
            }
        });
    }
}
