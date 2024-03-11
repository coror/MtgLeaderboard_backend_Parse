'use strict';

const GameScoreLimitedPlayer = require('./GameScoreLimitedPlayer');

class LimitedPlayer extends Parse.Object {
  constructor() {
    super('LimitedPlayer');
  }

  static async createLimitedPlayer(req) {
    const { limitedPlayerName } = req.params;

    // get array of all decks
    const limitedPlayersQuery = new Parse.Query('LimitedPlayer');
    const limitedPlayersCount = await limitedPlayersQuery.count();

    const limitedPlayer = new LimitedPlayer();
    limitedPlayer.set('limitedPlayerName', limitedPlayerName);

    limitedPlayer.set('rank', limitedPlayersCount + 1);

    try {
      const gameScore = await GameScoreLimitedPlayer.assignGameScore(limitedPlayer);

      limitedPlayer.set('winRate', 0);
      limitedPlayer.set('gamesWon', 0);
      limitedPlayer.set('gamesLost', 0);
      limitedPlayer.set('gamesPlayed', 0);

      await Parse.Object.saveAll([limitedPlayer, gameScore], {
        useMasterKey: true,
      });

      limitedPlayer.save(null, { useMasterKey: true });
    } catch (e) {
      if (limitedPlayer && limitedPlayer.id) {
        await limitedPlayer.destroy({ useMasterKey: true });
      }
      throw new Error(e);
    }
  }

  static async deleteLimitedPlayer(req) {
    const { limitedPlayerId } = req.params;

    const limitedPlayerQuery = new Parse.Query('LimitedPlayer');

    const limitedPlayer = await limitedPlayerQuery.get(limitedPlayerId, {
      useMasterKey: true,
    });
    const limitedPlayerRank = await limitedPlayer.get('rank');

    if (limitedPlayer === undefined) {
      return 'Player was not found';
    }

    const gamesQuery = new Parse.Query('GameScoreLimitedPlayer');
    gamesQuery.equalTo('dataName', limitedPlayer);
    const dataName = await gamesQuery.first({ useMasterKey: true });
    await dataName.destroy({ useMasterKey: true });

    await limitedPlayer.destroy({ useMasterKey: true });

    const avatarQuery = new Parse.Query('AvatarLimitedPlayer');
    avatarQuery.equalTo('limitedPlayer', limitedPlayer);
    const avatar = await avatarQuery.first({ useMasterKey: true });
    await avatar.destroy({ useMasterKey: true });

    try {
      const limitedPlayersBelowQuery = new Parse.Query('LimitedPlayer');

      limitedPlayersBelowQuery.greaterThan('rank', limitedPlayerRank);
      const limitedPlayersBelow = await limitedPlayersBelowQuery.find({
        useMasterKey: true,
      });

      // retrieve all decks that are ranked below deckRank, and update thier rank by - 1
      limitedPlayersBelow.forEach(async (limitedPlayerBelow) => {
        const limitedPlayerBelowRank = await limitedPlayerBelow.get('rank');
        limitedPlayerBelow.set('rank', limitedPlayerBelowRank - 1);

        await limitedPlayerBelow.save(null, { useMasterKey: true });
      });
    } catch (e) {
      throw new Error(e);
    }

    return 'Deck was succesffuly deleted and ranks have been updated!';
  }
  // delete all of its score

  static registerClass() {
    Parse.Object.registerSubclass('LimitedPlayer', LimitedPlayer);
  }
}

module.exports = LimitedPlayer;
