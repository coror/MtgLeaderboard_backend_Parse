'use strict';

const AppUser = require('./models/AppUser');
const AppRole = require('./models/AppRole');
const Edh = require('./models/Edh/Edh');
const GameScoreEdhPlayer = require('./models/EdhPlayer/GameScoreEdhPlayer');
const GameScoreEdh = require('./models/Edh/GameScoreEdh');
const EdhPlayer = require('./models/EdhPlayer/EdhPlayer');
const GameScoreLimitedPlayer = require('./models/LimitedPlayer/GameScoreLimitedPlayer');
const LimitedPlayer = require('./models/LimitedPlayer/LimitedPlayer');
const StandardPlayer = require('./models/StandardPlayer/StandardPlayer');
const GameScoreStandardPlayer = require('./models/StandardPlayer/GameScoreStandardPlayer');
const ModernPlayer = require('./models/ModernPlayer/ModernPlayer');
const GameScoreModernPlayer = require('./models/ModernPlayer/GameScoreModernPlayer');
const AvatarEdh = require('./models/Edh/AvatarEdh');
const AvatarEdhPlayer = require('./models/EdhPlayer/AvatarEdhPlayer');
const AvatarLimitedPlayer = require('./models/LimitedPlayer/AvatarLimitedPlayer');
const AvatarModernPlayer = require('./models/ModernPlayer/AvatarModernPlayer');
const AvatarStandardPlayer = require('./models/StandardPlayer/AvatarStandardPlayer');

// AppUser
Parse.Cloud.define('createUser', AppUser.createUser);

Parse.Cloud.beforeSave(Parse.User, AppUser.beforeSave);

Parse.Cloud.define('updatePassword', AppUser.updatePassword);

Parse.Cloud.define('deleteUser', AppUser.deleteUser);

// AppRole
Parse.Cloud.define('devCreateRole', AppRole.devCreateRole);

// Edh
Parse.Cloud.define('createEdh', Edh.createEdh);

Parse.Cloud.define('deleteEdh', Edh.deleteEdh);

// EdhPlayer
Parse.Cloud.define('createEdhPlayer', EdhPlayer.createEdhPlayer);

Parse.Cloud.define('deleteEdhPlayer', EdhPlayer.deleteEdhPlayer);

// LimitedPlayer
Parse.Cloud.define('createLimitedPlayer', LimitedPlayer.createLimitedPlayer);

Parse.Cloud.define('deleteLimitedPlayer', LimitedPlayer.deleteLimitedPlayer);

// StandardPlayer
Parse.Cloud.define('createStandardPlayer', StandardPlayer.createStandardPlayer);

Parse.Cloud.define('deleteStandardPlayer', StandardPlayer.deleteStandardPlayer);

// ModernPlayer
Parse.Cloud.define('createModernPlayer', ModernPlayer.createModernPlayer);

Parse.Cloud.define('deleteModernPlayer', ModernPlayer.deleteModernPlayer);

// GameScore LimitedPlayer
Parse.Cloud.define(
  'limitedPlayerGameWonAddRemove',
  GameScoreLimitedPlayer.limitedPlayerGameWonAddRemove
);

Parse.Cloud.define(
  'limitedPlayerGameLostAddRemove',
  GameScoreLimitedPlayer.limitedPlayerGameLostAddRemove
);

// GameScore EdhPlayer
Parse.Cloud.define(
  'edhPlayerGameWonAddRemove',
  GameScoreEdhPlayer.edhPlayerGameWonAddRemove
);

Parse.Cloud.define(
  'edhPlayerGameLostAddRemove',
  GameScoreEdhPlayer.edhPlayerGameLostAddRemove
);

// GameScore Edh
Parse.Cloud.define('edhGameWonAddRemove', GameScoreEdh.edhGameWonAddRemove);

Parse.Cloud.define('edhGameLostAddRemove', GameScoreEdh.edhGameLostAddRemove);

// GameScore StandardPlayer
Parse.Cloud.define(
  'standardPlayerGameWonAddRemove',
  GameScoreStandardPlayer.standardPlayerGameWonAddRemove
);

Parse.Cloud.define(
  'standardPlayerGameLostAddRemove',
  GameScoreStandardPlayer.standardPlayerGameLostAddRemove
);

// GameScore ModernPlayer
Parse.Cloud.define(
  'modernPlayerGameWonAddRemove',
  GameScoreModernPlayer.modernPlayerGameWonAddRemove
);

Parse.Cloud.define(
  'modernPlayerGameLostAddRemove',
  GameScoreModernPlayer.modernPlayerGameLostAddRemove
);

// AvatarEdh
Parse.Cloud.define('uploadEdhAvatar', AvatarEdh.uploadEdhAvatar);

Parse.Cloud.define('deleteEdhAvatar', AvatarEdh.deleteEdhAvatar);

// AvatarEdhPlayer
Parse.Cloud.define(
  'uploadEdhPlayerAvatar',
  AvatarEdhPlayer.uploadEdhPlayerAvatar
);

Parse.Cloud.define(
  'deleteEdhPlayerAvatar',
  AvatarEdhPlayer.deleteEdhPlayerAvatar
);

// AvatarLimitedPlayer
Parse.Cloud.define(
  'uploadLimitedPlayerAvatar',
  AvatarLimitedPlayer.uploadLimitedPlayerAvatar
);

Parse.Cloud.define(
  'deleteLimitedPlayerAvatar',
  AvatarLimitedPlayer.deleteLimitedPlayerAvatar
);

// AvatarModernPlayer
Parse.Cloud.define(
  'uploadModernPlayerAvatar',
  AvatarModernPlayer.uploadModernPlayerAvatar
);

Parse.Cloud.define(
  'deleteModernPlayerAvatar',
  AvatarModernPlayer.deleteModernPlayerAvatar
);

// AvatarStandardPlayer
Parse.Cloud.define(
  'uploadStandardPlayerAvatar',
  AvatarStandardPlayer.uploadStandardPlayerAvatar
);

Parse.Cloud.define(
  'deleteStandardPlayerAvatar',
  AvatarStandardPlayer.deleteStandardPlayerAvatar
);
