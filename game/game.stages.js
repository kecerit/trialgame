/**
 * # Game stages definition file
 * Copyright(c) 2021  <>
 * MIT Licensed
 *
 * Stages are defined using the stager API
 *
 * http://www.nodegame.org
 * ---
 */

module.exports = function(treatmentName, settings, stager, setup, gameRoom) {

     stager
        .stage('instructions')

        .stage('quiz')

        .stage('DD1')

        .stage('DD2')

        .stage('DD3')

        .repeatStage('game', settings.ROUNDS)
            .step('guess')
            .step('results')

        .stage('end')

        .gameover();

    // Notice: here all stages but 'game' have
    // one step named after the stage.

    // Skip one stage.
    // stager.skip('instructions');

    // Skip multiple stages:
    // stager.skip([ 'instructions', 'quiz' ])

    // Skip a step within a stage:
    // stager.skip('game', 'results');
};
