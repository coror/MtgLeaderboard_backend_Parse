'use strict';

const sharp = require('sharp');

class AvatarModernPlayer extends Parse.Object {
  constructor() {
    super('AvatarModernPlayer');
  }

  static async uploadModernPlayerAvatar(req) {
    const { modernPlayerId, data } = req.params;

    const modernPlayerQuery = new Parse.Query('ModernPlayer');
    const modernPlayer = await modernPlayerQuery.get(modernPlayerId, { useMasterKey: true });

    if (!modernPlayer) {
      return;
    }

    const existingAvatar = modernPlayer.get('avatar');

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

    const avatar = new AvatarModernPlayer();
    avatar.set('avatar', resizedFile);
    avatar.set('modernPlayer', modernPlayer); // check BlogPost.js comments
    // user.set("avatar", resizedFile);

    await avatar.save(null, { useMasterKey: true });
    modernPlayer.set('avatar', avatar);

    try {
      await modernPlayer.save(null, { useMasterKey: true });
    } catch (e) {
      throw new Error(e);
    }
  }

  static async deleteModernPlayerAvatar(req) {
    const { avatarId } = req.params;

    const avatarQuery = new Parse.Query('AvatarModernPlayer');
    const avatar = await avatarQuery.get(avatarId, { useMasterKey: true });

    const modernPlayerId = avatar.get('modernPlayer').id; // get the users objectId directly

    const modernPlayerQuery = new Parse.Query('ModernPlayer');
    const modernPlayer = await modernPlayerQuery.get(modernPlayerId, { useMasterKey: true });

    modernPlayer.unset('avatar'); // delete a certain property of the object

    await modernPlayer.save(null, { useMasterKey: true });

    try {
      await avatar.destroy({ useMasterKey: true });
    } catch (e) {
      throw new Error(e);
    }
  }

  static async registerClass() {
    Parse.Object.registerSubclass('AvatarModernPlayer', AvatarModernPlayer);
  }
}

module.exports = AvatarModernPlayer;
