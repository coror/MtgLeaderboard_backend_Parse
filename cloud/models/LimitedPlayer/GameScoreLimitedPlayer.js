'use strict';

const { updateLimitedPlayerRanks } = require('../../utils/rankCalculation');

class GameScoreLimitedPlayer extends Parse.Object {
  constructor() {
    super('GameScoreLimitedPlayer');
  }

  static async assignGameScore(dataName) {
    const gameScore = new GameScoreLimitedPlayer();

    gameScore.set('dataName', dataName);
    gameScore.set('gamesWon', 0);
    gameScore.set('gamesLost', 0);
    gameScore.set('gamesPlayed', 0);
    gameScore.set('winRate', 0);

    return gameScore;
  }

  static async limitedPlayerGameWonAddRemove(req) {
    const { limitedPlayerId, addRemove } = req.params;

    try {
      const limitedPlayerQuery = new Parse.Query('GameScoreLimitedPlayer');
      limitedPlayerQuery.equalTo('dataName', {
        __type: 'Pointer',
        className: 'LimitedPlayer',
        objectId: limitedPlayerId,
      });

      const limitedPlayerScore = await limitedPlayerQuery.first({ useMasterKey: true });

      if (!limitedPlayerScore) {
        console.error('Score not found');
        throw new Error('Score not found');
      }

      const dataNameGamesWon = limitedPlayerScore.get('gamesWon');
      const dataNameGamesPlayed = limitedPlayerScore.get('gamesPlayed');

      // Update gamesWon and gamesPlayed
      limitedPlayerScore.set('gamesWon', dataNameGamesWon + addRemove);
      limitedPlayerScore.set('gamesPlayed', dataNameGamesPlayed + addRemove);

      // Calculate and set winRate based on updated values
      const winRate = (
        ((dataNameGamesWon + addRemove) / (dataNameGamesPlayed + addRemove)) *
        100
      ).toFixed(2);
      limitedPlayerScore.set('winRate', +winRate);

      // Save the updated edhScore
      await limitedPlayerScore.save(null, { useMasterKey: true });

      console.log('Updated limitedPlayerScore:', limitedPlayerScore.toJSON());

      // Query the specified entity type
      const dataQuery = new Parse.Query('LimitedPlayer');
      const data = await dataQuery.get(limitedPlayerId, { useMasterKey: true });

      console.log('Retrieved LimitedPlayer:', data.toJSON());

      // Update gamesWon, gamesPlayed, and winRate on Edh
      data.set('gamesWon', dataNameGamesWon + addRemove);
      data.set('gamesPlayed', dataNameGamesPlayed + addRemove);
      data.set('winRate', +winRate);

      // Save the updated Edh

      await data.save(null, { useMasterKey: true });

      await updateLimitedPlayerRanks();

      console.log('Updated limitedPlayer:', data.toJSON());
    } catch (e) {
      console.error('Error in limitedPlayerGameWonAddRemove:', e);
      throw new Error(e);
    }
  }

  static async limitedPlayerGameLostAddRemove(req) {
    const { limitedPlayerId, addRemove } = req.params;

    try {
      const limitedPlayerQuery = new Parse.Query('GameScoreLimitedPlayer');
      limitedPlayerQuery.equalTo('dataName', {
        __type: 'Pointer',
        className: 'LimitedPlayer',
        objectId: limitedPlayerId,
      });

      const limitedPlayerScore = await limitedPlayerQuery.first({ useMasterKey: true });

      if (!limitedPlayerScore) {
        console.error('Score not found!');
        throw new Error('Score not found');
      }

      const dataNameGamesWon = limitedPlayerScore.get('gamesWon');
      const dataNameGamesLost = limitedPlayerScore.get('gamesLost');
      const dataNameGamesPlayed = limitedPlayerScore.get('gamesPlayed');

      limitedPlayerScore.set('gamesLost', dataNameGamesLost + addRemove);
      limitedPlayerScore.set('gamesPlayed', dataNameGamesPlayed + addRemove);

      const winRate = (
        (dataNameGamesWon / (dataNameGamesPlayed + addRemove)) *
        100
      ).toFixed(2);

      limitedPlayerScore.set('winRate', +winRate);

      await limitedPlayerScore.save(null, { useMasterKey: true });

      console.log('Updated limitedPlayerScore:', limitedPlayerScore.toJSON());

      const dataQuery = new Parse.Query('LimitedPlayer');
      const data = await dataQuery.get(limitedPlayerId, { useMasterKey: true });

      console.log('Retrieved LimitedPlayer:', data.toJSON());

      // Update gamesLost, gamesPlayed, and winRate on Edh

      data.set('gamesLost', dataNameGamesLost + addRemove);
      data.set('gamesPlayed', dataNameGamesPlayed + addRemove);
      data.set('winRate', +winRate);

      await data.save(null, { useMasterKey: true });

      await updateLimitedPlayerRanks();

      console.log('Updated LimitedPlayer:', data.toJSON());
    } catch (e) {
      console.error('Error in limitedPlayerGameLostAddRemove', e);
      throw new Error(e);
    }
  }

  // gameLost (add/subtract) update data's gamesLost, gamesPlayed, caluclate winRate, updateRanks
  static registerClass() {
    Parse.Object.registerSubclass('GameScoreLimitedPlayer', GameScoreLimitedPlayer);
  }
}

module.exports = GameScoreLimitedPlayer;
