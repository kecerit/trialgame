/**
 * # Player type implementation of the game stages
 * Copyright(c) 2021  <>
 * MIT Licensed
 *
 * Each client type must extend / implement the stages defined in `game.stages`.
 * Upon connection each client is assigned a client type and it is automatically
 * setup with it.
 *
 * http://www.nodegame.org
 * ---
 */
 
"use strict";

const ngc = require('nodegame-client');

module.exports = function(treatmentName, settings, stager, setup, gameRoom) {

    // Make the player step through the steps without waiting for other players.
    stager.setDefaultStepRule(ngc.stepRules.SOLO);

    stager.setOnInit(function() {

        // Initialize the client.

        var header;

        // Setup page: header + frame.
        header = W.generateHeader();
        W.generateFrame();

        // Add widgets.
        this.visuaStage = node.widgets.append('VisualStage', header);
        this.visualRound = node.widgets.append('VisualRound', header);
        this.visualTimer = node.widgets.append('VisualTimer', header, {
            hidden: true // Initially hidden.
        });
        this.doneButton = node.widgets.append('DoneButton', header);

        // No need to show the wait for other players screen in single-player
        // games.
        W.init({ waitScreen: false });

        // Additional debug information while developing the game.
        // this.debugInfo = node.widgets.append('DebugInfo', header)
    });

    stager.extendStep('instructions', {
        frame: 'instructions.htm',
        cb: function() {
            var s;
            // Note: we need to specify node.game.settings,
            // and not simply settings, because this code is
            // executed on the client.
            s = node.game.settings;
            // Replace variables in the instructions.
            W.setInnerHTML('coins', s.COINS);
            W.setInnerHTML('rounds', s.ROUNDS);
            W.setInnerHTML('exchange-rate', (s.COINS * s.EXCHANGE_RATE));
        }
    });

    stager.extendStep('quiz', {
        cb: function() {
            // Modify CSS rules on the fly.
            W.cssRule('.choicetable-left, .choicetable-right ' +
                      '{ width: 200px !important; }');

            W.cssRule('table.choicetable td { text-align: left !important; ' +
                      'font-weight: normal; padding-left: 10px; }');

            W.cssRule('.panel-body { border: 0; }');
        },

        // Make a widget step.
        widget: {
            name: 'ChoiceManager',
            id: 'quiz',
            options: {
                mainText: 'Answer the following questions to check ' +
                          'your understanding of the game.',
                forms: [
                       {
                        name: 'ChoiceTable',
                        id: 'howmany',
                        mainText: 'How many players are there in this game? ',
                        choices: [ 1, 2, 3 ],
                        correctChoice: 0
                      },
                      {
                        name: 'ChoiceTable',
                        id: 'coins',
                        mainText: 'How many coins can you win in each round?',
                        choices: [
                            settings.COINS,
                            settings.COINS + 100,
                            settings.COINS + 25,
                            'Not known'
                        ],
                        correctChoice: 0
                    }
                ],
                // Settings here apply to all forms.
                formsOptions: {
                    shuffleChoices: true
                }
            }
        }
    });

    stager.extendStep('DD1', {
        cb: function() {


        },
        widget: {
            name: 'DropDown',
            id: 'State',
            options: {
                id: 'State',
                mainText: "Please fill in the sentence below.",
                labelText: 'I am currently living in:  ',
                choices: [ "Baden-Württemberg", "Bavaria", "Berlin",
                            "Hesse"],
                onChange: function () {
                var x = W.getElementById('State').value;
                W.setInnerHTML('Statep', "You are currtently living in " + x +".");
              },
              shuffleChoices: true
               },
               done: function(values) {
                   node.game.State = values.forms.State.value;
               },

            }
    });

    stager.extendStep('DD2', {
        cb: function() {


        },
        widget: {
            name: 'DropDown',
            id: 'City',
            options: {
                id: 'City',
                mainText: "Please fill in the sentence below.",
                labelText: 'I am currently living in:  ',
                choices: [ "Stuttgart ", "Frankfurt am Main", "Coburg",
                 "Erlangen", "Schweinfurt", "Mannheim", "Heidelberg"],
                onChange: function () {
                var x = W.getElementById('City').value;
                W.setInnerHTML('Cityp', "You are currtently living in " + x +".")
               },
               tag: "Select",
               shuffleChoices: true
               },
               done: function(values) {
                   node.game.City = values.forms.City.value;
               },

            }
    });

    stager.extendStep('DD3', {
        cb: function() {


        },
        widget: {
            name: 'DropDown',
            id: 'Travel',
            options: {
                id: 'Travel',
                labelText: 'I mostly travel with a : ',
                choices: [ "Train", "Bus", "Car","Plane","Other"],
                onChange: function () {
                var x = W.getElementById('Travel').value;
                W.setInnerHTML('Travelp', "The best way to travel is by a " + x);
                },
               tag: "Datalist"
               },
               done: function(values) {
                   node.game.Travel = values.forms.Travel.value;
               },

            }
    });

    stager.extendStep('guess', {
        init: function() {
            node.game.visualTimer.show();
        },
        widget: {
            name: 'ChoiceTable',
            ref: 'guess',
            options: {
                id: 'guess',
                mainText: 'The system will generate a random number between ' +
                          '1 and 10. Will the random number be larger than 5?',
                choices: [ 'Yes, larger than 5', 'Smaller than or equal to 5' ],
                hint: '(A random decision will be made if timer expires)',
                requiredChoice: true,
                shuffleChoices: true,
                panel: false,
                title: false
            }
        },
        done: function(values) {
            return {
                greater: values.value === 'Yes, larger than 5'
            };
        },
        timeup: function() {
            node.game.guess.setValues();
            node.done();
        }
    });

    stager.extendStep('results', {
        frame: 'game.htm',
        cb: function() {
            node.game.visualTimer.setToZero();
            // Ask for the outcome to server.
            node.get('result', function(data) {
                // Display information to screen.
                W.setInnerHTML('yourdecision', data.greater ?
                    'Greater than 5' : 'Smaller than or equal to 5');
                W.setInnerHTML('randomnumber', data.randomnumber);
                W.setInnerHTML('winlose', data.win ? 'You won!' : 'You lost!');
                // Leave the decision visible for up 5 seconds.
                // If user clicks Done, it can advance faster.
                node.game.visualTimer.restart(5000);
                node.timer.wait(5000).done();
            });
        }
    });

    stager.extendStep('end', {
        widget: 'EndScreen',
        init: function() {
            node.game.visualTimer.destroy();
            node.game.doneButton.destroy();
        }
    });
};
