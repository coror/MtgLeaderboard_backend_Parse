'use strict';

const sharp = require('sharp');

class AvatarLimitedPlayer extends Parse.Object {
  constructor() {
    super('AvatarLimitedPlayer');
  }

  static async uploadLimitedPlayerAvatar(req) {
    const { limitedPlayerId, data } = req.params;

    const limitedPlayerQuery = new Parse.Query('LimitedPlayer');
    const limitedPlayer = await limitedPlayerQuery.get(limitedPlayerId, { useMasterKey: true });

    if (!limitedPlayer) {
      return;
    }

    const existingAvatar = limitedPlayer.get('avatar');

    if (existingAvatar) {
      try {
        await existingAvatar.destroy({ useMasterKey: true });
      } catch (e) {
        throw new Error(e);
      }
    }

    const resizedAvatar = await sharp(Buffer.from(data, 'base64'))
      .resize(320, 420)
      .toBuffer();
    const resizedFile = new Parse.File('resized-photo.jpg', {
      base64: resizedAvatar.toString('base64'),
    });

    const avatar = new AvatarLimitedPlayer();
    avatar.set('avatar', resizedFile);
    avatar.set('limitedPlayer', limitedPlayer); // check BlogPost.js comments
    // user.set("avatar", resizedFile);

    await avatar.save(null, { useMasterKey: true });
    limitedPlayer.set('avatar', avatar);

    try {
      await limitedPlayer.save(null, { useMasterKey: true });
    } catch (e) {
      throw new Error(e);
    }
  }

  static async deleteLimitedPlayerAvatar(req) {
    const { avatarId } = req.params;

    const avatarQuery = new Parse.Query('AvatarLimitedPlayer');
    const avatar = await avatarQuery.get(avatarId, { useMasterKey: true });

    const limitedPlayerId = avatar.get('limitedPlayer').id; // get the users objectId directly

    const limitedPlayerQuery = new Parse.Query('LimitedPlayer');
    const limitedPlayer = await limitedPlayerQuery.get(limitedPlayerId, { useMasterKey: true });

    limitedPlayer.unset('avatar'); // delete a certain property of the object

    await limitedPlayer.save(null, { useMasterKey: true });

    try {
      await avatar.destroy({ useMasterKey: true });
    } catch (e) {
      throw new Error(e);
    }
  }

  static async registerClass() {
    Parse.Object.registerSubclass('AvatarLimitedPlayer', AvatarLimitedPlayer);
  }
}

module.exports = AvatarLimitedPlayer;
