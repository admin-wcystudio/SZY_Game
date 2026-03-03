import BaseGameScene from './BaseGameScene.js';
import { CustomButton } from '../../UI/Button.js';
import { CustomPanel, CustomFailPanel } from '../../UI/Panel.js';
import GameManager from '../GameManager.js';

export class GameScene_2 extends BaseGameScene {
    constructor() {
        super('GameScene_2');
    }
    preload() {
        const path = 'assets/images/Game_2/';

        this.width = this.cameras.main.width;
        this.height = this.cameras.main.height;
        this.centerX = this.width / 2;
        this.centerY = this.height / 2;

        this.load.image('game2_npc_box_intro', `${path}game2_npc_box3.png`);
        this.load.image('game2_npc_box_win', `${path}game2_npc_box4.png`);
        this.load.image('game2_npc_box_tryagain', `${path}game2_npc_box5.png`);
        this.load.image('game2_bg', `${path}game2_mazeobject1.png`);
        this.load.image('coin', `${path}game2_mazeobject2.png`);

        this.load.image('up_btn', `${path}game2_up_button.png`);
        this.load.image('up_btn_click', `${path}game2_up_button_click.png`);
        this.load.image('down_btn', `${path}game2_down_button.png`);
        this.load.image('down_btn_click', `${path}game2_down_button_click.png`);

        this.gender = 'M';
        if (localStorage.getItem('player')) {
            this.gender = JSON.parse(localStorage.getItem('player')).gender;
        }
        if (this.gender === 'M') {
            this.load.spritesheet('boy_backstop', path +
                'game2_boy_backstop.png', { frameWidth: 105, frameHeight: 105 });

            this.load.spritesheet('boy_backwalking', path +
                'game2_boy_backwalking.png', { frameWidth: 105, frameHeight: 105 });

            this.load.spritesheet('boy_frontstop', path +
                'game2_boy_frontstop.png', { frameWidth: 105, frameHeight: 105 });

            this.load.spritesheet('boy_frontwalking', path +
                'game2_boy_frontwalking.png', { frameWidth: 105, frameHeight: 105 });

            this.load.spritesheet('boy_leftstop', path +
                'game2_boy_leftstop.png', { frameWidth: 105, frameHeight: 105 });

            this.load.spritesheet('boy_leftwalking', path +
                'game2_boy_leftwalking.png', { frameWidth: 105, frameHeight: 105 });

            this.load.spritesheet('boy_rightstop', path +
                'game2_boy_rightstop.png', { frameWidth: 105, frameHeight: 105 });

            this.load.spritesheet('boy_rightwalking', path +
                'game2_boy_rightwalking.png', { frameWidth: 105, frameHeight: 105 });
        } else {
            this.load.spritesheet('girl_backstop', path +
                'game2_girl_backstop.png', { frameWidth: 105, frameHeight: 105 });

            this.load.spritesheet('girl_backwalking', path +
                'game2_girl_backwalking.png', { frameWidth: 105, frameHeight: 105 });

            this.load.spritesheet('girl_frontwalking', path +
                'game2_girl_frontwalking.png', { frameWidth: 105, frameHeight: 105 });

            this.load.spritesheet('girl_leftstop', path +
                'game2_girl_leftstop.png', { frameWidth: 105, frameHeight: 105 });

            this.load.spritesheet('girl_leftwalking', path +
                'game2_girl_leftwalking.png', { frameWidth: 105, frameHeight: 105 });

            this.load.spritesheet('girl_rightstop', path +
                'game2_girl_rightstop.png', { frameWidth: 105, frameHeight: 105 });

            this.load.spritesheet('girl_rightwalking', path +
                'game2_girl_rightwalking.png', { frameWidth: 105, frameHeight: 105 });
        }

    }

    create() {
        this.createAnimations();

        // --- Maze Grid Configuration ---
        // Adjust originX, originY, cellSize to align with your maze background image
        this.MAZE = {
            originX: 85,     // Left edge of maze area (px)
            originY: 110,     // Top edge of maze area (px)
            cellWidth: 82,   // Width of each cell (px)
            cellHeight: 85,  // Height of each cell (px)
            cols: 22,
            rows: 10,
        };

        // Maze grid: 0 = walkable path, 1 = wall (22 cols x 10 rows)
        this.mazeGrid = [
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],  // Row 0
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],  // Row 1
            [1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],  // Row 2
            [1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],  // Row 3
            [0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1],  // Row 4
            [0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 0, 0, 1, 1, 0, 1, 1, 1, 0, 1],  // Row 5
            [0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 0, 1],  // Row 6
            [0, 1, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 1, 1, 1],  // Row 7
            [1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1],  // Row 8
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],  // Row 9
        ];

        // Player grid position (start just inside the bottom opening)
        this.playerGridRow = 8;
        this.playerGridCol = 10;

        // Goal position (NPC at top, just inside top opening)
        this.goalGridRow = 1;
        this.goalGridCol = 10;

        // Movement lock to prevent overlapping moves
        this.isMoving = false;

        // Coin tracking
        this.coins = [];
        this.collectedCoins = 0;

        this.initGame('game2_bg', 'game2_description', false, false, {
            targetRounds: 1,
            roundPerSeconds: 6000,
            isAllowRoundFail: false,
            isContinuousTimer: true,
            sceneIndex: 2
        });

        // Direction buttons
        this.leftBtn = new CustomButton(this, 1550, 900, 'left_btn', 'left_btn_click', () => {
            this.moveDirection('left');
        }, () => { }).setDepth(2);

        this.rightBtn = new CustomButton(this, 1750, 900, 'right_btn', 'right_btn_click', () => {
            this.moveDirection('right');
        }, () => { }).setDepth(2);

        this.upBtn = new CustomButton(this, 1650, 800, 'up_btn', 'up_btn_click', () => {
            this.moveDirection('up');
        }, () => { }).setDepth(2);

        this.downBtn = new CustomButton(this, 1650, 1000, 'down_btn', 'down_btn_click', () => {
            this.moveDirection('down');
        }, () => { }).setDepth(2);

        // Character setup
        this.genderKey = this.gender === 'M' ? 'boy' : 'girl';
        console.log('genderKey:', this.genderKey);

        // Use frontstop for boy, frontwalking for girl (girl_frontstop doesn't exist)
        const idleKey = this.gender === 'M' ? 'frontstop' : 'frontwalking';
        this.idleAnimKey = `${this.genderKey}_${idleKey}_anim`;
        this.lastDirection = 'down';

        // Create player at starting grid position
        const startPos = this.gridToPixel(this.playerGridRow, this.playerGridCol);
        this.player = this.add.sprite(this.centerX + 60, 1000, `${this.genderKey}_${idleKey}`)
            .setOrigin(0.5, 0.5).setDepth(2).setScale(2);

        // Place coins on the maze (optional collectibles)
        this.placeCoins();

        // Draw debug grid overlay
        this.drawDebugGrid();
    }

    // --- Debug Grid ---

    /** Draw a colored overlay on each cell: green = walkable, red = wall */
    drawDebugGrid() {
        const graphics = this.add.graphics();
        graphics.setDepth(1); // above BG, below player/coins

        for (let row = 0; row < this.MAZE.rows; row++) {
            for (let col = 0; col < this.MAZE.cols; col++) {
                const x = this.MAZE.originX + col * this.MAZE.cellWidth;
                const y = this.MAZE.originY + row * this.MAZE.cellHeight;
                const isWall = this.mazeGrid[row][col] === 1;

                // Fill: green (walkable) or red (wall), semi-transparent
                graphics.fillStyle(isWall ? 0xff0000 : 0x00ff00, 0.25);
                graphics.fillRect(x, y, this.MAZE.cellWidth, this.MAZE.cellHeight);

                // Border
                graphics.lineStyle(1, 0xffffff, 0.4);
                graphics.strokeRect(x, y, this.MAZE.cellWidth, this.MAZE.cellHeight);
            }
        }

        // Label each cell with row,col
        for (let row = 0; row < this.MAZE.rows; row++) {
            for (let col = 0; col < this.MAZE.cols; col++) {
                const cx = this.MAZE.originX + col * this.MAZE.cellWidth + this.MAZE.cellWidth / 2;
                const cy = this.MAZE.originY + row * this.MAZE.cellHeight + this.MAZE.cellHeight / 2;
                this.add.text(cx, cy, `${row},${col}`, {
                    fontSize: '10px', color: '#ffffff', fontStyle: 'bold'
                }).setOrigin(0.5).setDepth(1);
            }
        }
    }

    // --- Grid / Pixel Conversion Helpers ---

    /** Convert grid (row, col) to pixel center of that cell */
    gridToPixel(row, col) {
        return {
            x: this.MAZE.originX + col * this.MAZE.cellWidth + this.MAZE.cellWidth / 2,
            y: this.MAZE.originY + row * this.MAZE.cellHeight + this.MAZE.cellHeight / 2
        };
    }

    /** Convert pixel (x, y) to grid (row, col) */
    pixelToGrid(x, y) {
        return {
            col: Math.floor((x - this.MAZE.originX) / this.MAZE.cellWidth),
            row: Math.floor((y - this.MAZE.originY) / this.MAZE.cellHeight)
        };
    }

    /** Check whether a grid cell is walkable (0 = path) */
    isWalkable(row, col) {
        if (row < 0 || row >= this.MAZE.rows || col < 0 || col >= this.MAZE.cols) {
            return false;
        }
        return this.mazeGrid[row][col] === 0;
    }

    // --- Movement ---

    moveDirection(direction) {
        if (this.isMoving || !this.isGameActive) return;

        let targetRow = this.playerGridRow;
        let targetCol = this.playerGridCol;
        let walkAnimKey, stopAnimKey;

        switch (direction) {
            case 'left':
                targetCol -= 1;
                walkAnimKey = `${this.genderKey}_leftwalking_anim`;
                stopAnimKey = `${this.genderKey}_leftstop_anim`;
                break;
            case 'right':
                targetCol += 1;
                walkAnimKey = `${this.genderKey}_rightwalking_anim`;
                stopAnimKey = `${this.genderKey}_rightstop_anim`;
                break;
            case 'up':
                targetRow -= 1;
                walkAnimKey = `${this.genderKey}_backwalking_anim`;
                stopAnimKey = `${this.genderKey}_backstop_anim`;
                break;
            case 'down':
                targetRow += 1;
                walkAnimKey = `${this.genderKey}_frontwalking_anim`;
                // girl has no frontstop, fall back to frontwalking
                stopAnimKey = this.gender === 'M'
                    ? `${this.genderKey}_frontstop_anim`
                    : `${this.genderKey}_frontwalking_anim`;
                break;
        }

        this.lastDirection = direction;

        // --- Wall collision check ---
        if (!this.isWalkable(targetRow, targetCol)) {
            // Blocked: briefly show walk anim, then revert to stop
            this.player.anims.play(walkAnimKey, true);
            this.time.delayedCall(200, () => {
                this.player.anims.play(stopAnimKey, true);
            });
            return;
        }

        // --- Move player to the target cell ---
        this.isMoving = true;
        const targetPos = this.gridToPixel(targetRow, targetCol);

        this.player.anims.play(walkAnimKey, true);

        this.tweens.add({
            targets: this.player,
            x: targetPos.x,
            y: targetPos.y,
            duration: 250,
            ease: 'Linear',
            onComplete: () => {
                this.playerGridRow = targetRow;
                this.playerGridCol = targetCol;
                this.isMoving = false;

                // Switch to idle / stop animation
                this.player.anims.play(stopAnimKey, true);

                // Pick up any coin on this cell
                this.tryCollectCoin(targetRow, targetCol);

                // Check if player reached the goal (NPC)
                this.checkGoal();
            }
        });
    }

    // --- Coins ---

    /** Place coin sprites on specific walkable cells */
    placeCoins() {
        // Define coin positions (row, col) – adjust to taste
        const coinPositions = [
            { row: 3, col: 5 },
            { row: 5, col: 3 },
            { row: 7, col: 7 },
            { row: 5, col: 9 },
        ];

        coinPositions.forEach(pos => {
            if (!this.isWalkable(pos.row, pos.col)) return; // safety check
            const px = this.gridToPixel(pos.row, pos.col);
            const coinSprite = this.add.image(px.x, px.y, 'coin')
                .setDepth(2);
            coinSprite.gridRow = pos.row;
            coinSprite.gridCol = pos.col;
            this.coins.push(coinSprite);
        });
    }

    /** Collect coin if one exists on the given cell */
    tryCollectCoin(row, col) {
        const coin = this.coins.find(c => c.gridRow === row && c.gridCol === col && c.visible);
        if (coin) {
            coin.setVisible(false);
            this.collectedCoins++;
            console.log(`[GameScene_2] Coin collected! (${this.collectedCoins}/${this.coins.length})`);
        }
    }

    // --- Goal Check ---

    checkGoal() {
        if (this.playerGridRow === this.goalGridRow &&
            this.playerGridCol === this.goalGridCol) {
            console.log('[GameScene_2] Player reached the goal!');
            this.onRoundWin();
        }
    }

    enableGameInteraction(enabled) {
        this.canSpawn = enabled;
        this.leftBtn.setVisible(enabled);
        this.rightBtn.setVisible(enabled);
        this.upBtn.setVisible(enabled);
        this.downBtn.setVisible(enabled);

        if (enabled) {
            this.leftBtn.setInteractive();
            this.rightBtn.setInteractive();
            this.upBtn.setInteractive();
            this.downBtn.setInteractive();
        } else {
            this.leftBtn.disableInteractive();
            this.rightBtn.disableInteractive();
            this.upBtn.disableInteractive();
            this.downBtn.disableInteractive();
        }
    }

    resetForNewRound() {
        // Reset player to start grid position
        this.playerGridRow = 8;
        this.playerGridCol = 10;
        this.isMoving = false;

        if (this.player) {
            const startPos = this.gridToPixel(this.playerGridRow, this.playerGridCol);
            this.player.x = startPos.x;
            this.player.y = startPos.y;
            this.player.anims.play(this.idleAnimKey, true);
        }

        // Reset coins
        if (this.coins) {
            this.coins.forEach(c => c.setVisible(true));
            this.collectedCoins = 0;
        }

        this.successCount = 0;
        console.log('[GameScene_2] Reset for new round');
    }

    handleLose() {
        if (this.gameState === 'gameLose' || this.gameState === 'gameWin') return;

        this.currentFailCount = (this.currentFailCount || 0) + 1;
        this.isGameActive = false;
        this.gameState = 'gameLose';
        this.label = this.add.image(1650, 350, 'game_fail_label').setDepth(555);
        if (this.gameTimer) this.gameTimer.stop();
        this.enableGameInteraction(false);
        this.updateRoundUI(false);

        this.showBubble('tryagain');
    }

    showWin() {
        this.showObjectPanel();
    }

    showObjectPanel() {
        const objectPanel = new CustomPanel(this, 960, 600, [{
            content: 'game2_object_description',
            closeBtn: 'close_btn',
            closeBtnClick: 'close_btn_click'
        }]);
        objectPanel.setDepth(1000);
        objectPanel.show();
        objectPanel.setCloseCallBack(() => GameManager.backToMainStreet(this));
    }

    createAnimations() {
        // Boy animations
        this.anims.create({
            key: 'boy_backstop_anim',
            frames: this.anims.generateFrameNumbers('boy_backstop', { start: 0, end: 66 }),
            frameRate: 30,
            repeat: -1
        });
        this.anims.create({
            key: 'boy_backwalking_anim',
            frames: this.anims.generateFrameNumbers('boy_backwalking', { start: 0, end: 66 }),
            frameRate: 30,
            repeat: -1
        });
        this.anims.create({
            key: 'boy_frontstop_anim',
            frames: this.anims.generateFrameNumbers('boy_frontstop', { start: 0, end: 66 }),
            frameRate: 30,
            repeat: -1
        });
        this.anims.create({
            key: 'boy_frontwalking_anim',
            frames: this.anims.generateFrameNumbers('boy_frontwalking', { start: 0, end: 66 }),
            frameRate: 30,
            repeat: -1
        });
        this.anims.create({
            key: 'boy_leftstop_anim',
            frames: this.anims.generateFrameNumbers('boy_leftstop', { start: 0, end: 66 }),
            frameRate: 30,
            repeat: -1
        });
        this.anims.create({
            key: 'boy_leftwalking_anim',
            frames: this.anims.generateFrameNumbers('boy_leftwalking', { start: 0, end: 66 }),
            frameRate: 30,
            repeat: -1
        });
        this.anims.create({
            key: 'boy_rightstop_anim',
            frames: this.anims.generateFrameNumbers('boy_rightstop', { start: 0, end: 66 }),
            frameRate: 30,
            repeat: -1
        });
        this.anims.create({
            key: 'boy_rightwalking_anim',
            frames: this.anims.generateFrameNumbers('boy_rightwalking', { start: 0, end: 66 }),
            frameRate: 30,
            repeat: -1
        });

        // Girl animations
        this.anims.create({
            key: 'girl_backstop_anim',
            frames: this.anims.generateFrameNumbers('girl_backstop', { start: 0, end: 66 }),
            frameRate: 30,
            repeat: -1
        });
        this.anims.create({
            key: 'girl_backwalking_anim',
            frames: this.anims.generateFrameNumbers('girl_backwalking', { start: 0, end: 66 }),
            frameRate: 30,
            repeat: -1
        });
        this.anims.create({
            key: 'girl_frontwalking_anim',
            frames: this.anims.generateFrameNumbers('girl_frontwalking', { start: 0, end: 66 }),
            frameRate: 30,
            repeat: -1
        });
        this.anims.create({
            key: 'girl_leftstop_anim',
            frames: this.anims.generateFrameNumbers('girl_leftstop', { start: 0, end: 66 }),
            frameRate: 30,
            repeat: -1
        });
        this.anims.create({
            key: 'girl_leftwalking_anim',
            frames: this.anims.generateFrameNumbers('girl_leftwalking', { start: 0, end: 66 }),
            frameRate: 30,
            repeat: -1
        });
        this.anims.create({
            key: 'girl_rightstop_anim',
            frames: this.anims.generateFrameNumbers('girl_rightstop', { start: 0, end: 66 }),
            frameRate: 30,
            repeat: -1
        });
        this.anims.create({
            key: 'girl_rightwalking_anim',
            frames: this.anims.generateFrameNumbers('girl_rightwalking', { start: 0, end: 66 }),
            frameRate: 30,
            repeat: -1
        });
    }
}