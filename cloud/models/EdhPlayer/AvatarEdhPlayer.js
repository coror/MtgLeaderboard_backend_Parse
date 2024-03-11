'use stict';

const sharp = require('sharp');

class AvatarEdhPlayer extends Parse.Object {
  constructor() {
    super('AvatarEdhPlayer');
  }
  static async uploadEdhPlayerAvatar(req) {
    const { edhPlayerId, data } = req.params;

    const edhPlayerQuery = new Parse.Query('EdhPlayer');
    const edhPlayer = await edhPlayerQuery.get(edhPlayerId, { useMasterKey: true });

    if (!edhPlayer) {
      return;
    }

    const existingAvatar = edhPlayer.get('avatar');

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

    const avatar = new AvatarEdhPlayer();
    avatar.set('avatar', resizedFile);
    avatar.set('edhPlayer', edhPlayer); // check BlogPost.js comments
    // user.set("avatar", resizedFile);

    await avatar.save(null, { useMasterKey: true });
    edhPlayer.set('avatar', avatar);

    try {
      await edhPlayer.save(null, { useMasterKey: true });
    } catch (e) {
      throw new Error(e);
    }
  }

  static async deleteEdhPlayerAvatar(req) {
    const { avatarId } = req.params;

    const avatarQuery = new Parse.Query('AvatarEdhPlayer');
    const avatar = await avatarQuery.get(avatarId, { useMasterKey: true });

    const edhPlayerId = avatar.get('edhPlayer').id; // get the users objectId directly

    const edhPlayerQuery = new Parse.Query('EdhPlayer');
    const edhPlayer = await edhPlayerQuery.get(edhPlayerId, { useMasterKey: true });

    edhPlayer.unset('avatar'); // delete a certain property of the object

    await edhPlayer.save(null, { useMasterKey: true });

    try {
      await avatar.destroy({ useMasterKey: true });
    } catch (e) {
      throw new Error(e);
    }
  }

  static async registerClass() {
    Parse.Object.registerSubclass('AvatarEdhPlayer', AvatarEdhPlayer);
  }
}

module.exports = AvatarEdhPlayer;
