'use strict';

const AppRole = require('./AppRole')

class AppUser extends Parse.User {
  constructor(att) {
    super(att);
  }

  static async createUser(req) {
    const { email, name, surname, password, roleName } = req.params;

    const userData = {
      email,
      username: email,
      password,
      name,
      surname,
      roleName,
    };

    let user;

    try {
      // validator for name
      // validaotr for surname
      // validator for password

      user = new AppUser(userData);
      await user.signUp();
      const role = await AppRole.assignUser(roleName, user);

      await Parse.Object.saveAll([user, role], { useMasterKey: true });

      return 'User was created successfully!';
    } catch (e) {
      if (user && user.id) {
        await user.destroy({ useMasterKey: true });
      }
      throw new Error(e);
    }
  }

  static async beforeSave(req) {
    const name = req.object.get('name');
    const surname = req.object.get('surname');
    const displayName = `${name} ${surname}`;

    req.object.set('displayName', displayName);
  }

  static async updatePassword(req) {
    const { userId, oldPassword, newPassword } = req.params;
    const userQuery = new Parse.Query('_User');
    const user = await userQuery.get(userId, { useMasterKey: true });

    if (user === undefined) {
      return 'User was not found';
    }

    const isOldPasswordValid = await Parse.User.logIn(
      user.get('username'),
      oldPassword
    );
    if (!isOldPasswordValid) {
      throw new Error('Invalid old password');
    }

    //validator for password

    user.set('password', newPassword);
    await user.save(null, { useMasterKey: true });

    return 'Password was successfully updated!';
  }

  static async deleteUser(req) {
    const { userId } = req.params;
    const userQuery = new Parse.Query('_User');
    const user = await userQuery.get(userId, { useMasterKey: true });

    if (user === undefined) {
      return 'User was not found';
    } 
    user.destroy({ useMasterKey: true });
  }

  static registerClass() {
    Parse.Object.registerSubclass('_User', AppUser);
  }
}

module.exports = AppUser;
