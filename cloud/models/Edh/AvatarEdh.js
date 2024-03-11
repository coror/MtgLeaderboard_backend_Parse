'use stict';

const sharp = require('sharp');

class AvatarEdh extends Parse.Object {
  constructor() {
    super('AvatarEdh');
  }
  static async uploadEdhAvatar(req) {
    const { edhId, data } = req.params;

    const edhQuery = new Parse.Query('Edh');
    const edh = await edhQuery.get(edhId, { useMasterKey: true });

    if (!edh) {
      return;
    }

    const existingAvatar = edh.get('avatar');

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

    const avatar = new AvatarEdh();
    avatar.set('avatar', resizedFile);
    avatar.set('edh', edh); // check BlogPost.js comments
    // user.set("avatar", resizedFile);

    await avatar.save(null, { useMasterKey: true });
    edh.set('avatar', avatar);

    try {
      await edh.save(null, { useMasterKey: true });
    } catch (e) {
      throw new Error(e);
    }
  }

  static async deleteEdhAvatar(req) {
    const { avatarId } = req.params;

    const avatarQuery = new Parse.Query('AvatarEdh');
    const avatar = await avatarQuery.get(avatarId, { useMasterKey: true });

    const edhId = avatar.get('edh').id; // get the users objectId directly

    const edhQuery = new Parse.Query('Edh');
    const edh = await edhQuery.get(edhId, { useMasterKey: true });

    edh.unset('avatar'); // delete a certain property of the object

    await edh.save(null, { useMasterKey: true });

    try {
      await avatar.destroy({ useMasterKey: true });
    } catch (e) {
      throw new Error(e);
    }
  }

  static async registerClass() {
    Parse.Object.registerSubclass('AvatarEdh', AvatarEdh);
  }
}

module.exports = AvatarEdh;
