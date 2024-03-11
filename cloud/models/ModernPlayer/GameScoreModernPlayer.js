'use strict';

const { updateModernPlayerRanks } = require('../../utils/rankCalculation');

class GameScoreModernPlayer extends Parse.Object {
  constructor() {
    super('GameScoreModernPlayer');
  }

  static async assignGameScore(dataName) {
    const gameScore = new GameScoreModernPlayer();

    gameScore.set('dataName', dataName);
    gameScore.set('gamesWon', 0);
    gameScore.set('gamesLost', 0);
    gameScore.set('gamesPlayed', 0);
    gameScore.set('winRate', 0);

    return gameScore;
  }

  static async modernPlayerGameWonAddRemove(req) {
    const { modernPlayerId, addRemove } = req.params;

    try {
      const modernPlayerQuery = new Parse.Query('GameScoreModernPlayer');
      modernPlayerQuery.equalTo('dataName', {
        __type: 'Pointer',
        className: 'ModernPlayer',
        objectId: modernPlayerId,
      });

      const modernPlayerScore = await modernPlayerQuery.first({
        useMasterKey: true,
      });

      if (!modernPlayerScore) {
        console.error('Score not found');
        throw new Error('Score not found');
      }

      const dataNameGamesWon = modernPlayerScore.get('gamesWon');
      const dataNameGamesPlayed = modernPlayerScore.get('gamesPlayed');

      // Update gamesWon and gamesPlayed
      modernPlayerScore.set('gamesWon', dataNameGamesWon + addRemove);
      modernPlayerScore.set('gamesPlayed', dataNameGamesPlayed + addRemove);

      // Calculate and set winRate based on updated values
      const winRate = (
        ((dataNameGamesWon + addRemove) / (dataNameGamesPlayed + addRemove)) *
        100
      ).toFixed(2);
      modernPlayerScore.set('winRate', +winRate);

      // Save the updated edhScore
      await modernPlayerScore.save(null, { useMasterKey: true });

      console.log('Updated modernPlayerScore:', modernPlayerScore.toJSON());

      // Query the specified entity type
      const dataQuery = new Parse.Query('ModernPlayer');
      const data = await dataQuery.get(modernPlayerId, { useMasterKey: true });

      console.log('Retrieved ModernPlayer:', data.toJSON());

      // Update gamesWon, gamesPlayed, and winRate on Edh
      data.set('gamesWon', dataNameGamesWon + addRemove);
      data.set('gamesPlayed', dataNameGamesPlayed + addRemove);
      data.set('winRate', +winRate);

      // Save the updated Edh
      await data.save(null, { useMasterKey: true });

      await updateModernPlayerRanks();

      console.log('Updated modernPlayer:', data.toJSON());
    } catch (e) {
      console.error('Error in modernPlayerGameWonAddRemove:', e);
      throw new Error(e);
    }
  }

  static async modernPlayerGameLostAddRemove(req) {
    const { modernPlayerId, addRemove } = req.params;

    try {
      const modernPlayerQuery = new Parse.Query('GameScoreModernPlayer');
      modernPlayerQuery.equalTo('dataName', {
        __type: 'Pointer',
        className: 'ModernPlayer',
        objectId: modernPlayerId,
      });

      const modernPlayerScore = await modernPlayerQuery.first({
        useMasterKey: true,
      });

      if (!modernPlayerScore) {
        console.error('Score not found!');
        throw new Error('Score not found');
      }

      const dataNameGamesWon = modernPlayerScore.get('gamesWon');
      const dataNameGamesLost = modernPlayerScore.get('gamesLost');
      const dataNameGamesPlayed = modernPlayerScore.get('gamesPlayed');

      modernPlayerScore.set('gamesLost', dataNameGamesLost + addRemove);
      modernPlayerScore.set('gamesPlayed', dataNameGamesPlayed + addRemove);

      const winRate = (
        (dataNameGamesWon / (dataNameGamesPlayed + addRemove)) *
        100
      ).toFixed(2);

      modernPlayerScore.set('winRate', +winRate);

      await modernPlayerScore.save(null, { useMasterKey: true });

      console.log('Updated modernPlayerScore:', modernPlayerScore.toJSON());

      const dataQuery = new Parse.Query('ModernPlayer');
      const data = await dataQuery.get(modernPlayerId, { useMasterKey: true });

      console.log('Retrieved ModernPlayer:', data.toJSON());

      // Update gamesLost, gamesPlayed, and winRate on Edh
      data.set('gamesLost', dataNameGamesLost + addRemove);
      data.set('gamesPlayed', dataNameGamesPlayed + addRemove);
      data.set('winRate', +winRate);

      await data.save(null, { useMasterKey: true });

      await updateModernPlayerRanks();

      console.log('Updated ModernPlayer:', data.toJSON());
    } catch (e) {
      console.error('Error in modernPlayerGameLostAddRemove', e);
      throw new Error(e);
    }
  }

  // gameLost (add/subtract) update data's gamesLost, gamesPlayed, calculate winRate, updateRanks
  static registerClass() {
    Parse.Object.registerSubclass(
      'GameScoreModernPlayer',
      GameScoreModernPlayer
    );
  }
}

module.exports = GameScoreModernPlayer;
