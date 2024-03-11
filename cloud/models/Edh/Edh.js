'use strict';

const GameScore = require('./GameScoreEdh');

class Edh extends Parse.Object {
  constructor() {
    super('Edh');
  }

  static async createEdh(req) {
    const { deckName } = req.params;

    // get array of all decks
    const decksQuery = new Parse.Query('Edh');
    const decksCount = await decksQuery.count();

    const edh = new Edh();
    edh.set('deckName', deckName);

    edh.set('rank', decksCount + 1);

    try {
      const gameScore = await GameScore.assignGameScore(edh);

      edh.set('winRate', 0);
      edh.set('gamesWon', 0);
      edh.set('gamesLost', 0);
      edh.set('gamesPlayed', 0);

      await Parse.Object.saveAll([edh, gameScore], { useMasterKey: true });

      edh.save(null, { useMasterKey: true });
    } catch (e) {
      if (edh && edh.id) {
        await edh.destroy({ useMasterKey: true });
      }
      throw new Error(e);
    }
  }

  static async deleteEdh(req) {
    const { deckId } = req.params;

    const deckQuery = new Parse.Query('Edh');
    const deck = await deckQuery.get(deckId, { useMasterKey: true });

    if (!deck) {
      return 'Deck was not found';
    }

    const deckRank = await deck.get('rank');

    const gamesQuery = new Parse.Query('GameScoreEdh');
    gamesQuery.equalTo('dataName', deck);
    const dataName = await gamesQuery.first({ useMasterKey: true });

    // Handle the case where dataName might be undefined
    if (dataName) {
      await dataName.destroy({ useMasterKey: true });
    }

    await deck.destroy({ useMasterKey: true });

    const avatarQuery = new Parse.Query('AvatarEdh');
    avatarQuery.equalTo('edh', deck);
    const avatar = await avatarQuery.first({ useMasterKey: true });

    // Handle the case where avatar might be undefined
    if (avatar) {
      await avatar.destroy({ useMasterKey: true });
    }

    try {
      const decksBelowQuery = new Parse.Query('Edh');
      decksBelowQuery.greaterThan('rank', deckRank);
      const decksBelow = await decksBelowQuery.find({ useMasterKey: true });

      // retrieve all decks that are ranked below deckRank, and update their rank by - 1
      decksBelow.forEach(async (deckBelow) => {
        const deckBelowRank = await deckBelow.get('rank');
        deckBelow.set('rank', deckBelowRank - 1);
        await deckBelow.save(null, { useMasterKey: true });
      });
    } catch (e) {
      throw new Error(e);
    }

    return 'Deck was successfully deleted and ranks have been updated!';
  }

  static registerClass() {
    Parse.Object.registerSubclass('Edh', Edh);
  }
}

module.exports = Edh;
