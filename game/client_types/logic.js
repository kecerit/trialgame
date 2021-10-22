/**
 * # Logic type implementation of the game stages
 * Copyright(c) 2021  <>
 * MIT Licensed
 *
 * http://www.nodegame.org
 * ---
 */

"use strict";

const ngc = require('nodegame-client');
const J = ngc.JSUS;

module.exports = function(treatmentName, settings, stager, setup, gameRoom) {

    let node = gameRoom.node;
    let channel = gameRoom.channel;
    let memory = node.game.memory;

    // Make the logic independent from players position in the game.
    stager.setDefaultStepRule(ngc.stepRules.SOLO);

    // Must implement the stages here.

    stager.setOnInit(function() {

        // Feedback.
        memory.view('feedback').save('feedback.csv', {
            header: [ 'time', 'timestamp', 'player', 'feedback' ],
            keepUpdated: true
        });

        // Email.
        memory.view('email').save('email.csv', {
            header: [ 'timestamp', 'player', 'email' ],
            keepUpdated: true
        });

        // Win.
        memory.view('win').save('guess.csv', {
            header: [
                'session', 'player', 'round', 'greater', 'number', 'win'
            ],
            adapter: { number: 'randomnumber' },
            keepUpdated: true
        });

        // Update player's guess with information if he or she won.
        memory.on('insert', (item) => {
            if (node.game.isStep('guess', item.stage)) {
                // Determine if player's guess is correct.
                let greater = item.greater;
                let r = J.randomInt(0, 10);
                let win = (r > 5 && greater) || (r <= 5 && !greater);
                item.randomnumber = r;
                item.win = win;
                // Update earnings if player won.
                if (win) gameRoom.updateWin(item.player, settings.COINS);
            }
        });

        node.on('get.result', function(msg) {
            let item = memory.player[msg.from].last();
            return {
                greater: item.greater,
                randomnumber: item.randomnumber,
                win: item.win
            };
        });

        node.on.data('done', function(msg) {

            let id = msg.from;
            let step = node.game.getStepId(msg.stage);

            if (step === 'results' &&
                msg.stage.round === settings.ROUNDS) {

                // Saves bonus file, and notifies player.
                gameRoom.computeBonus({
                    append: true,
                    clients: [ id ]
                });

                let db = memory.player[id];
                // Select all 'done' items and save its time.
                db.select('done').save('times.csv', {
                    header: [
                        'session', 'player', 'stage', 'step', 'round',
                        'time', 'timeup'
                    ],
                    append: true
                });
            }
        });
    });

    stager.setOnGameOver(function() {
        // Something to do.
    });
};
