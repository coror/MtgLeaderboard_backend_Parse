async function updateEdhRanks() {
  try {
    // Query all GameScores ordered by winRate descending
    const query = new Parse.Query('Edh');
    query.descending('winRate');
    const allScores = await query.find({ useMasterKey: true });

    // Update ranks based on the sorted order
    for (let i = 0; i < allScores.length; i++) {
      const score = allScores[i];
      score.set('rank', i + 1); // Set the rank starting from 1
      await score.save(null, { useMasterKey: true });
    }

    console.log('Ranks updated successfully.');
  } catch (error) {
    console.error('Error updating ranks:', error);
    throw new Error(error);
  }
}

async function updateEdhPlayerRanks() {
  try {
    // Query all GameScores ordered by winRate descending
    const query = new Parse.Query('EdhPlayer');
    query.descending('winRate');
    const allScores = await query.find({ useMasterKey: true });

    // Update ranks based on the sorted order
    for (let i = 0; i < allScores.length; i++) {
      const score = allScores[i];
      score.set('rank', i + 1); // Set the rank starting from 1
      await score.save(null, { useMasterKey: true });
    }

    console.log('Ranks updated successfully.');
  } catch (error) {
    console.error('Error updating ranks:', error);
    throw new Error(error);
  }
}

async function updateLimitedPlayerRanks() {
  try {
    // Query all GameScores ordered by winRate descending
    const query = new Parse.Query('LimitedPlayer');
    query.descending('winRate');
    const allScores = await query.find({ useMasterKey: true });

    // Update ranks based on the sorted order
    for (let i = 0; i < allScores.length; i++) {
      const score = allScores[i];
      score.set('rank', i + 1); // Set the rank starting from 1
      await score.save(null, { useMasterKey: true });
    }

    console.log('Ranks updated successfully.');
  } catch (error) {
    console.error('Error updating ranks:', error);
    throw new Error(error);
  }
}

async function updateModernPlayerRanks() {
  try {
    // Query all GameScores ordered by winRate descending
    const query = new Parse.Query('ModernPlayer');
    query.descending('winRate');
    const allScores = await query.find({ useMasterKey: true });

    // Update ranks based on the sorted order
    for (let i = 0; i < allScores.length; i++) {
      const score = allScores[i];
      score.set('rank', i + 1); // Set the rank starting from 1
      await score.save(null, { useMasterKey: true });
    }

    console.log('Ranks updated successfully.');
  } catch (error) {
    console.error('Error updating ranks:', error);
    throw new Error(error);
  }
}

async function updateStandardPlayerRanks() {
  try {
    // Query all GameScores ordered by winRate descending
    const query = new Parse.Query('StandardPlayer');
    query.descending('winRate');
    const allScores = await query.find({ useMasterKey: true });

    // Update ranks based on the sorted order
    for (let i = 0; i < allScores.length; i++) {
      const score = allScores[i];
      score.set('rank', i + 1); // Set the rank starting from 1
      await score.save(null, { useMasterKey: true });
    }

    console.log('Ranks updated successfully.');
  } catch (error) {
    console.error('Error updating ranks:', error);
    throw new Error(error);
  }
}

module.exports = {
  updateEdhRanks,
  updateEdhPlayerRanks,
  updateLimitedPlayerRanks,
  updateModernPlayerRanks,
  updateStandardPlayerRanks,
};
