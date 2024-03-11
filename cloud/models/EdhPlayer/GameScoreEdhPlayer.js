'use strict';

const { updateEdhPlayerRanks } = require('../../utils/rankCalculation');

class GameScoreEdhPlayer extends Parse.Object {
  constructor() {
    super('GameScoreEdhPlayer');
  }

  static async assignGameScore(dataName) {
    const gameScore = new GameScoreEdhPlayer();

    gameScore.set('dataName', dataName);
    gameScore.set('gamesWon', 0);
    gameScore.set('gamesLost', 0);
    gameScore.set('gamesPlayed', 0);
    gameScore.set('winRate', 0);

    return gameScore;
  }

  static async edhPlayerGameWonAddRemove(req) {
    const { edhPlayerId, addRemove } = req.params;

    try {
      const edhPlayerQuery = new Parse.Query('GameScoreEdhPlayer');
      edhPlayerQuery.equalTo('dataName', {
        __type: 'Pointer',
        className: 'EdhPlayer',
        objectId: edhPlayerId,
      });

      const edhPlayerScore = await edhPlayerQuery.first({ useMasterKey: true });

      if (!edhPlayerScore) {
        console.error('Score not found');
        throw new Error('Score not found');
      }

      const dataNameGamesWon = edhPlayerScore.get('gamesWon');
      const dataNameGamesPlayed = edhPlayerScore.get('gamesPlayed');

      // Update gamesWon and gamesPlayed
      edhPlayerScore.set('gamesWon', dataNameGamesWon + addRemove);
      edhPlayerScore.set('gamesPlayed', dataNameGamesPlayed + addRemove);

      // Calculate and set winRate based on updated values
      const winRate = (
        ((dataNameGamesWon + addRemove) / (dataNameGamesPlayed + addRemove)) *
        100
      ).toFixed(2);
      edhPlayerScore.set('winRate', +winRate);

      // Save the updated edhScore
      await edhPlayerScore.save(null, { useMasterKey: true });

      console.log('Updated edhPlayerScore:', edhPlayerScore.toJSON());

      // Query the specified entity type
      const dataQuery = new Parse.Query('EdhPlayer');
      const data = await dataQuery.get(edhPlayerId, { useMasterKey: true });

      console.log('Retrieved EdhPlayer:', data.toJSON());

      // Update gamesWon, gamesPlayed, and winRate on Edh
      data.set('gamesWon', dataNameGamesWon + addRemove);
      data.set('gamesPlayed', dataNameGamesPlayed + addRemove);
      data.set('winRate', +winRate);

      // Save the updated Edh

      await data.save(null, { useMasterKey: true });

      await updateEdhPlayerRanks();

      console.log('Updated EdhPlayer:', data.toJSON());
    } catch (e) {
      console.error('Error in edhPlayerGameWonAddRemove:', e);
      throw new Error(e);
    }
  }

  static async edhPlayerGameLostAddRemove(req) {
    const { edhPlayerId, addRemove } = req.params;

    try {
      const edhPlayerQuery = new Parse.Query('GameScoreEdhPlayer');
      edhPlayerQuery.equalTo('dataName', {
        __type: 'Pointer',
        className: 'EdhPlayer',
        objectId: edhPlayerId,
      });

      const edhPlayerScore = await edhPlayerQuery.first({ useMasterKey: true });

      if (!edhPlayerScore) {
        console.error('Score not found!');
        throw new Error('Score not found');
      }

      const dataNameGamesWon = edhPlayerScore.get('gamesWon');
      const dataNameGamesLost = edhPlayerScore.get('gamesLost');
      const dataNameGamesPlayed = edhPlayerScore.get('gamesPlayed');

      edhPlayerScore.set('gamesLost', dataNameGamesLost + addRemove);
      edhPlayerScore.set('gamesPlayed', dataNameGamesPlayed + addRemove);

      const winRate = (
        (dataNameGamesWon / (dataNameGamesPlayed + addRemove)) *
        100
      ).toFixed(2);

      edhPlayerScore.set('winRate', +winRate);

      await edhPlayerScore.save(null, { useMasterKey: true });

      console.log('Updated edhPlayerScore:', edhPlayerScore.toJSON());

      const dataQuery = new Parse.Query('EdhPlayer');
      const data = await dataQuery.get(edhPlayerId, { useMasterKey: true });

      console.log('Retrieved EdhPlayer:', data.toJSON());

      // Update gamesLost, gamesPlayed, and winRate on Edh

      data.set('gamesLost', dataNameGamesLost + addRemove);
      data.set('gamesPlayed', dataNameGamesPlayed + addRemove);
      data.set('winRate', +winRate);

      await data.save(null, { useMasterKey: true });

      await updateEdhPlayerRanks();

      console.log('Updated EdhPlayer:', data.toJSON());
    } catch (e) {
      console.error('Error in edhPlayerGameLostAddRemove', e);
      throw new Error(e);
    }
  }

  // gameLost (add/subtract) update data's gamesLost, gamesPlayed, caluclate winRate, updateRanks
  static registerClass() {
    Parse.Object.registerSubclass('GameScoreEdhPlayer', GameScoreEdhPlayer);
  }
}

module.exports = GameScoreEdhPlayer;
