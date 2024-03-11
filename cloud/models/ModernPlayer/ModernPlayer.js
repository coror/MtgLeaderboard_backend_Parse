'use strict';

const GameScoreModernPlayer = require('./GameScoreModernPlayer');

class ModernPlayer extends Parse.Object {
  constructor() {
    super('ModernPlayer');
  }

  static async createModernPlayer(req) {
    const { modernPlayerName } = req.params;

    // get array of all decks
    const modernPlayersQuery = new Parse.Query('ModernPlayer');
    const modernPlayersCount = await modernPlayersQuery.count();

    const modernPlayer = new ModernPlayer();
    modernPlayer.set('modernPlayerName', modernPlayerName);

    modernPlayer.set('rank', modernPlayersCount + 1);

    try {
      const gameScore = await GameScoreModernPlayer.assignGameScore(
        modernPlayer
      );

      modernPlayer.set('winRate', 0);
      modernPlayer.set('gamesWon', 0);
      modernPlayer.set('gamesLost', 0);
      modernPlayer.set('gamesPlayed', 0);

      await Parse.Object.saveAll([modernPlayer, gameScore], {
        useMasterKey: true,
      });

      modernPlayer.save(null, { useMasterKey: true });
    } catch (e) {
      if (modernPlayer && modernPlayer.id) {
        await modernPlayer.destroy({ useMasterKey: true });
      }
      throw new Error(e);
    }
  }

  static async deleteModernPlayer(req) {
    const { modernPlayerId } = req.params;

    const modernPlayerQuery = new Parse.Query('ModernPlayer');

    const modernPlayer = await modernPlayerQuery.get(modernPlayerId, {
      useMasterKey: true,
    });
    const modernPlayerRank = await modernPlayer.get('rank');

    if (modernPlayer === undefined) {
      return 'Player was not found';
    }

    const gamesQuery = new Parse.Query('GameScoreModernPlayer');
    gamesQuery.equalTo('dataName', modernPlayer);
    const dataName = await gamesQuery.first({ useMasterKey: true });
    await dataName.destroy({ useMasterKey: true });

    await modernPlayer.destroy({ useMasterKey: true });

    const avatarQuery = new Parse.Query('AvatarModernPlayer');
    avatarQuery.equalTo('modernPlayer', modernPlayer);
    const avatar = await avatarQuery.first({ useMasterKey: true });
    await avatar.destroy({ useMasterKey: true });

    try {
      const modernPlayersBelowQuery = new Parse.Query('ModernPlayer');

      modernPlayersBelowQuery.greaterThan('rank', modernPlayerRank);
      const modernPlayersBelow = await modernPlayersBelowQuery.find({
        useMasterKey: true,
      });

      // retrieve all decks that are ranked below deckRank, and update their rank by - 1
      modernPlayersBelow.forEach(async (modernPlayerBelow) => {
        const modernPlayerBelowRank = await modernPlayerBelow.get('rank');
        modernPlayerBelow.set('rank', modernPlayerBelowRank - 1);

        await modernPlayerBelow.save(null, { useMasterKey: true });
      });
    } catch (e) {
      throw new Error(e);
    }

    return 'Deck was successfully deleted, and ranks have been updated!';
  }

  static registerClass() {
    Parse.Object.registerSubclass('ModernPlayer', ModernPlayer);
  }
}

module.exports = ModernPlayer;
