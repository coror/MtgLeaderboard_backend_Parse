'use strict';

const GameScoreEdhPlayer = require('./GameScoreEdhPlayer');

class EdhPlayer extends Parse.Object {
  constructor() {
    super('EdhPlayer');
  }

  static async createEdhPlayer(req) {
    const { edhPlayerName } = req.params;

    // get array of all decks
    const edhPlayersQuery = new Parse.Query('EdhPlayer');
    const edhPlayersCount = await edhPlayersQuery.count();

    const edhPlayer = new EdhPlayer();
    edhPlayer.set('edhPlayerName', edhPlayerName);

    edhPlayer.set('rank', edhPlayersCount + 1);

    try {
      const gameScore = await GameScoreEdhPlayer.assignGameScore(edhPlayer);

      edhPlayer.set('winRate', 0);
      edhPlayer.set('gamesWon', 0);
      edhPlayer.set('gamesLost', 0);
      edhPlayer.set('gamesPlayed', 0);

      await Parse.Object.saveAll([edhPlayer, gameScore], {
        useMasterKey: true,
      });

      edhPlayer.save(null, { useMasterKey: true });
    } catch (e) {
      if (edhPlayer && edhPlayer.id) {
        await edhPlayer.destroy({ useMasterKey: true });
      }
      throw new Error(e);
    }
  }

  static async deleteEdhPlayer(req) {
    const { edhPlayerId } = req.params;

    const edhPlayerQuery = new Parse.Query('EdhPlayer');
    const edhPlayer = await edhPlayerQuery.get(edhPlayerId, {
      useMasterKey: true,
    });

    if (!edhPlayer) {
      return 'Player was not found';
    }

    const edhPlayerRank = await edhPlayer.get('rank');

    const gamesQuery = new Parse.Query('GameScoreEdhPlayer');
    gamesQuery.equalTo('dataName', edhPlayer);
    const dataName = await gamesQuery.first({ useMasterKey: true });

    // Handle the case where dataName might be undefined
    if (dataName) {
      await dataName.destroy({ useMasterKey: true });
    }

    await edhPlayer.destroy({ useMasterKey: true });

    const avatarQuery = new Parse.Query('AvatarEdhPlayer');
    avatarQuery.equalTo('edhPlayer', edhPlayer);
    const avatar = await avatarQuery.first({ useMasterKey: true });

    // Handle the case where avatar might be undefined
    if (avatar) {
      await avatar.destroy({ useMasterKey: true });
    }

    try {
      const edhPlayersBelowQuery = new Parse.Query('EdhPlayer');
      edhPlayersBelowQuery.greaterThan('rank', edhPlayerRank);
      const edhPlayersBelow = await edhPlayersBelowQuery.find({
        useMasterKey: true,
      });

      // retrieve all decks that are ranked below deckRank, and update thier rank by - 1
      edhPlayersBelow.forEach(async (edhPlayerBelow) => {
        const edhPlayerBelowRank = await edhPlayerBelow.get('rank');
        edhPlayerBelow.set('rank', edhPlayerBelowRank - 1);
        await edhPlayerBelow.save(null, { useMasterKey: true });
      });
    } catch (e) {
      throw new Error(e);
    }

    return 'Deck was succesffuly deleted and ranks have been updated!';
  }
  // delete all of its score

  static registerClass() {
    Parse.Object.registerSubclass('EdhPlayer', EdhPlayer);
  }
}

module.exports = EdhPlayer;
