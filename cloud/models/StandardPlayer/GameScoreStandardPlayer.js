'use strict';

const { updateStandardPlayerRanks } = require('../../utils/rankCalculation');

class GameScoreStandardPlayer extends Parse.Object {
  constructor() {
    super('GameScoreStandardPlayer');
  }

  static async assignGameScore(dataName) {
    const gameScore = new GameScoreStandardPlayer();

    gameScore.set('dataName', dataName);
    gameScore.set('gamesWon', 0);
    gameScore.set('gamesLost', 0);
    gameScore.set('gamesPlayed', 0);
    gameScore.set('winRate', 0);

    return gameScore;
  }

  static async standardPlayerGameWonAddRemove(req) {
    const { standardPlayerId, addRemove } = req.params;

    try {
      const standardPlayerQuery = new Parse.Query('GameScoreStandardPlayer');
      standardPlayerQuery.equalTo('dataName', {
        __type: 'Pointer',
        className: 'StandardPlayer',
        objectId: standardPlayerId,
      });

      const standardPlayerScore = await standardPlayerQuery.first({ useMasterKey: true });

      if (!standardPlayerScore) {
        console.error('Score not found');
        throw new Error('Score not found');
      }

      const dataNameGamesWon = standardPlayerScore.get('gamesWon');
      const dataNameGamesPlayed = standardPlayerScore.get('gamesPlayed');

      // Update gamesWon and gamesPlayed
      standardPlayerScore.set('gamesWon', dataNameGamesWon + addRemove);
      standardPlayerScore.set('gamesPlayed', dataNameGamesPlayed + addRemove);

      // Calculate and set winRate based on updated values
      const winRate = (
        ((dataNameGamesWon + addRemove) / (dataNameGamesPlayed + addRemove)) *
        100
      ).toFixed(2);
      standardPlayerScore.set('winRate', +winRate);

      // Save the updated edhScore
      await standardPlayerScore.save(null, { useMasterKey: true });

      console.log('Updated standardPlayerScore:', standardPlayerScore.toJSON());

      // Query the specified entity type
      const dataQuery = new Parse.Query('StandardPlayer');
      const data = await dataQuery.get(standardPlayerId, { useMasterKey: true });

      console.log('Retrieved StandardPlayer:', data.toJSON());

      // Update gamesWon, gamesPlayed, and winRate on Edh
      data.set('gamesWon', dataNameGamesWon + addRemove);
      data.set('gamesPlayed', dataNameGamesPlayed + addRemove);
      data.set('winRate', +winRate);

      // Save the updated Edh

      await data.save(null, { useMasterKey: true });

      await updateStandardPlayerRanks();

      console.log('Updated standardPlayer:', data.toJSON());
    } catch (e) {
      console.error('Error in standardPlayerGameWonAddRemove:', e);
      throw new Error(e);
    }
  }

  static async standardPlayerGameLostAddRemove(req) {
    const { standardPlayerId, addRemove } = req.params;

    try {
      const standardPlayerQuery = new Parse.Query('GameScoreStandardPlayer');
      standardPlayerQuery.equalTo('dataName', {
        __type: 'Pointer',
        className: 'StandardPlayer',
        objectId: standardPlayerId,
      });

      const standardPlayerScore = await standardPlayerQuery.first({ useMasterKey: true });

      if (!standardPlayerScore) {
        console.error('Score not found!');
        throw new Error('Score not found');
      }

      const dataNameGamesWon = standardPlayerScore.get('gamesWon');
      const dataNameGamesLost = standardPlayerScore.get('gamesLost');
      const dataNameGamesPlayed = standardPlayerScore.get('gamesPlayed');

      standardPlayerScore.set('gamesLost', dataNameGamesLost + addRemove);
      standardPlayerScore.set('gamesPlayed', dataNameGamesPlayed + addRemove);

      const winRate = (
        (dataNameGamesWon / (dataNameGamesPlayed + addRemove)) *
        100
      ).toFixed(2);

      standardPlayerScore.set('winRate', +winRate);

      await standardPlayerScore.save(null, { useMasterKey: true });

      console.log('Updated standardPlayerScore:', standardPlayerScore.toJSON());

      const dataQuery = new Parse.Query('StandardPlayer');
      const data = await dataQuery.get(standardPlayerId, { useMasterKey: true });

      console.log('Retrieved StandardPlayer:', data.toJSON());

      // Update gamesLost, gamesPlayed, and winRate on Edh

      data.set('gamesLost', dataNameGamesLost + addRemove);
      data.set('gamesPlayed', dataNameGamesPlayed + addRemove);
      data.set('winRate', +winRate);

      await data.save(null, { useMasterKey: true });

      await updateStandardPlayerRanks();

      console.log('Updated StandardPlayer:', data.toJSON());
    } catch (e) {
      console.error('Error in standardPlayerGameLostAddRemove', e);
      throw new Error(e);
    }
  }

  // gameLost (add/subtract) update data's gamesLost, gamesPlayed, caluclate winRate, updateRanks
  static registerClass() {
    Parse.Object.registerSubclass('GameScoreStandardPlayer', GameScoreStandardPlayer);
  }
}

module.exports = GameScoreStandardPlayer;
