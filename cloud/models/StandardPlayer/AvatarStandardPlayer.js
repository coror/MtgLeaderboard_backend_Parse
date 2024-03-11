'use strict';

const sharp = require('sharp');

class AvatarStandardPlayer extends Parse.Object {
  constructor() {
    super('AvatarStandardPlayer');
  }

  static async uploadStandardPlayerAvatar(req) {
    const { standardPlayerId, data } = req.params;

    const standardPlayerQuery = new Parse.Query('StandardPlayer');
    const standardPlayer = await standardPlayerQuery.get(standardPlayerId, {
      useMasterKey: true,
    });

    if (!standardPlayer) {
      return;
    }

    const existingAvatar = standardPlayer.get('avatar');

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

    const avatar = new AvatarStandardPlayer();
    avatar.set('avatar', resizedFile);
    avatar.set('standardPlayer', standardPlayer); // check BlogPost.js comments
    // user.set("avatar", resizedFile);

    await avatar.save(null, { useMasterKey: true });
    standardPlayer.set('avatar', avatar);

    try {
      await standardPlayer.save(null, { useMasterKey: true });
    } catch (e) {
      throw new Error(e);
    }
  }

  static async deleteStandardPlayerAvatar(req) {
    const { avatarId } = req.params;

    const avatarQuery = new Parse.Query('AvatarStandardPlayer');
    const avatar = await avatarQuery.get(avatarId, { useMasterKey: true });

    const standardPlayerId = avatar.get('standardPlayer').id; // get the users objectId directly

    const standardPlayerQuery = new Parse.Query('StandardPlayer');
    const standardPlayer = await standardPlayerQuery.get(standardPlayerId, {
      useMasterKey: true,
    });

    standardPlayer.unset('avatar'); // delete a certain property of the object

    await standardPlayer.save(null, { useMasterKey: true });

    try {
      await avatar.destroy({ useMasterKey: true });
    } catch (e) {
      throw new Error(e);
    }
  }

  static async registerClass() {
    Parse.Object.registerSubclass('AvatarStandardPlayer', AvatarStandardPlayer);
  }
}

module.exports = AvatarStandardPlayer;
