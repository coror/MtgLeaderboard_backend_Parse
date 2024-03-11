'use strict';

const GameScoreStandardPlayer = require('./GameScoreStandardPlayer');

class StandardPlayer extends Parse.Object {
  constructor() {
    super('StandardPlayer');
  }

  static async createStandardPlayer(req) {
    const { standardPlayerName } = req.params;

    // get array of all decks
    const standardPlayersQuery = new Parse.Query('StandardPlayer');
    const standardPlayersCount = await standardPlayersQuery.count();

    const standardPlayer = new StandardPlayer();
    standardPlayer.set('standardPlayerName', standardPlayerName);

    standardPlayer.set('rank', standardPlayersCount + 1);

    try {
      const gameScore = await GameScoreStandardPlayer.assignGameScore(standardPlayer);

      standardPlayer.set('winRate', 0);
      standardPlayer.set('gamesWon', 0);
      standardPlayer.set('gamesLost', 0);
      standardPlayer.set('gamesPlayed', 0);

      await Parse.Object.saveAll([standardPlayer, gameScore], {
        useMasterKey: true,
      });

      standardPlayer.save(null, { useMasterKey: true });
    } catch (e) {
      if (standardPlayer && standardPlayer.id) {
        await standardPlayer.destroy({ useMasterKey: true });
      }
      throw new Error(e);
    }
  }

  static async deleteStandardPlayer(req) {
    const { standardPlayerId } = req.params;

    const standardPlayerQuery = new Parse.Query('StandardPlayer');

    const standardPlayer = await standardPlayerQuery.get(standardPlayerId, {
      useMasterKey: true,
    });
    const standardPlayerRank = await standardPlayer.get('rank');

    if (standardPlayer === undefined) {
      return 'Player was not found';
    }

    const gamesQuery = new Parse.Query('GameScoreStandardPlayer');
    gamesQuery.equalTo('dataName', standardPlayer);
    const dataName = await gamesQuery.first({ useMasterKey: true });
    await dataName.destroy({ useMasterKey: true });

    await standardPlayer.destroy({ useMasterKey: true });

    const avatarQuery = new Parse.Query('AvatarStandardPlayer');
    avatarQuery.equalTo('standardPlayer', standardPlayer);
    const avatar = await avatarQuery.first({ useMasterKey: true });
    await avatar.destroy({ useMasterKey: true });

    try {
      const standardPlayersBelowQuery = new Parse.Query('StandardPlayer');

      standardPlayersBelowQuery.greaterThan('rank', standardPlayerRank);
      const standardPlayersBelow = await standardPlayersBelowQuery.find({
        useMasterKey: true,
      });

      // retrieve all decks that are ranked below deckRank, and update thier rank by - 1
      standardPlayersBelow.forEach(async (standardPlayerBelow) => {
        const standardPlayerBelowRank = await standardPlayerBelow.get('rank');
        standardPlayerBelow.set('rank', standardPlayerBelowRank - 1);

        await standardPlayerBelow.save(null, { useMasterKey: true });
      });
    } catch (e) {
      throw new Error(e);
    }

    return 'Deck was succesffuly deleted and ranks have been updated!';
  }
  // delete all of its score

  static registerClass() {
    Parse.Object.registerSubclass('StandardPlayer', StandardPlayer);
  }
}

module.exports = StandardPlayer;
