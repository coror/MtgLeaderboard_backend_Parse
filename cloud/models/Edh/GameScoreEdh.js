'use strict';

const { updateEdhRanks } = require('../../utils/rankCalculation');

class GameScoreEdh extends Parse.Object {
  constructor() {
    super('GameScoreEdh');
  }

  static async assignGameScore(dataName) {
    const gameScore = new GameScoreEdh();

    gameScore.set('dataName', dataName);
    gameScore.set('gamesWon', 0);
    gameScore.set('gamesLost', 0);
    gameScore.set('gamesPlayed', 0);
    gameScore.set('winRate', 0);

    return gameScore;
  }

  static async edhGameWonAddRemove(req) {
    const { edhId, addRemove } = req.params;

    try {
      const edhQuery = new Parse.Query('GameScoreEdh');
      edhQuery.equalTo('dataName', {
        __type: 'Pointer',
        className: 'Edh',
        objectId: edhId,
      });

      const edhScore = await edhQuery.first({ useMasterKey: true });

      if (!edhScore) {
        console.error('Score not found');
        throw new Error('Score not found');
      }

      const dataNameGamesWon = edhScore.get('gamesWon');
      const dataNameGamesPlayed = edhScore.get('gamesPlayed');

      // Update gamesWon and gamesPlayed
      edhScore.set('gamesWon', dataNameGamesWon + addRemove);
      edhScore.set('gamesPlayed', dataNameGamesPlayed + addRemove);

      // Calculate and set winRate based on updated values
      const winRate = (
        ((dataNameGamesWon + addRemove) / (dataNameGamesPlayed + addRemove)) *
        100
      ).toFixed(2);
      edhScore.set('winRate', +winRate);

      // Save the updated edhScore
      await edhScore.save(null, { useMasterKey: true });

      console.log('Updated edhScore:', edhScore.toJSON());

      // Query the specified entity type
      const dataQuery = new Parse.Query('Edh');
      const data = await dataQuery.get(edhId, { useMasterKey: true });

      console.log('Retrieved Edh:', data.toJSON());

      // Update gamesWon, gamesPlayed, and winRate on Edh
      data.set('gamesWon', dataNameGamesWon + addRemove);
      data.set('gamesPlayed', dataNameGamesPlayed + addRemove);
      data.set('winRate', +winRate);

      // Save the updated Edh

      await data.save(null, { useMasterKey: true });

      await updateEdhRanks();

      console.log('Updated Edh:', data.toJSON());
    } catch (e) {
      console.error('Error in edhGameWonAddRemove:', e);
      throw new Error(e);
    }
  }

  static async edhGameLostAddRemove(req) {
    const { edhId, addRemove } = req.params;

    try {
      const edhQuery = new Parse.Query('GameScoreEdh');
      edhQuery.equalTo('dataName', {
        __type: 'Pointer',
        className: 'Edh',
        objectId: edhId,
      });

      const edhScore = await edhQuery.first({ useMasterKey: true });

      if (!edhScore) {
        console.error('Score not found!');
        throw new Error('Score not found');
      }

      const dataNameGamesWon = edhScore.get('gamesWon');
      const dataNameGamesLost = edhScore.get('gamesLost');
      const dataNameGamesPlayed = edhScore.get('gamesPlayed');

      edhScore.set('gamesLost', dataNameGamesLost + addRemove);
      edhScore.set('gamesPlayed', dataNameGamesPlayed + addRemove);

      const winRate = (
        (dataNameGamesWon / (dataNameGamesPlayed + addRemove)) *
        100
      ).toFixed(2);

      edhScore.set('winRate', +winRate);

      await edhScore.save(null, { useMasterKey: true });

      console.log('Updated edhScore:', edhScore.toJSON());

      const dataQuery = new Parse.Query('Edh');
      const data = await dataQuery.get(edhId, { useMasterKey: true });

      console.log('Retrieved Edh:', data.toJSON());

      // Update gamesLost, gamesPlayed, and winRate on Edh

      data.set('gamesLost', dataNameGamesLost + addRemove);
      data.set('gamesPlayed', dataNameGamesPlayed + addRemove);
      data.set('winRate', +winRate);

      await data.save(null, { useMasterKey: true });

      await updateEdhRanks();

      console.log('Updated Edh:', data.toJSON());
    } catch (e) {
      console.error('Error in edhGameLostAddRemove', e);
      throw new Error(e);
    }
  }

  // gameLost (add/subtract) update data's gamesLost, gamesPlayed, caluclate winRate, updateRanks
  static registerClass() {
    Parse.Object.registerSubclass('GameScoreEdh', GameScoreEdh);
  }
}

module.exports = GameScoreEdh;
