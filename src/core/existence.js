import { DC } from "./constants";

export function existenceResetRequest() {
  if (player.options.confirmations.existence || !PlayerProgress.existenceUnlocked()) {
    Modal.existence.show();
  } else {
    existenceReset();
  }
}

export function existenceReset(isReset = false , reward = true) {

  player.isGameEnd = false;

  EventHub.dispatch(GAME_EVENT.REALITY_RESET_BEFORE);

  if (reward) existenceGiveRewards(isReset);

  //resetCelQuotes();// not sure what i will do with quotes
  resetCel1();
  resetCel2();
  resetCel3();
  resetCel4();
  resetCel5();
  resetCel6();
  resetCel7();
  resetLowerLayers();

  Tab.dimensions.antimatter.show(true);
  return;
}

function resetLowerLayers() {

  for (let i = 0; i < 120; i++) {
    if (Glyphs.inventory[i] != null && Glyphs.inventory[i].type != 'companion') {
      Glyphs.removeFromInventory(Glyphs.inventory[i])
    }
  }
  Glyphs.sortByLevel()
  for (let i = 0; i < Glyphs.activeSlotCount; i++) {
    Glyphs.unequip(i, Glyphs.protectedSlots + 1)
    if (Glyphs.inventory[Glyphs.protectedSlots + 1] != null && Glyphs.inventory[Glyphs.protectedSlots + 1].type != 'companion') {
      Glyphs.removeFromInventory(Glyphs.inventory[Glyphs.protectedSlots + 1])
    }
  }
  Glyphs.addToInventory(GlyphGenerator.customGlyph(3));

  //perks are be reset first cause of starting values and upgrades
  player.reality.perks.clear();
  //achivements are similar to perks
  lockAchievementsOnExistence();


  //reality upgrades
  for (let i = 0; i < 5; i++)   player.reality.rebuyables[i + 1] = 0
  for (let i = 0; i < 10; i++)  player.reality.imaginaryRebuyables[i + 1] = 0;
  player.reality.upgradeBits = 0;
  player.reality.upgReqs = 0;
  player.reality.imaginaryUpgradeBits = 0;
  player.reality.imaginaryUpgReqs = 0;
  player.reality.reqLock.reality = 0;
  player.reality.reqLock.imaginary = 0;
  // we have to reset eternities here (after RealityUpgrade(10) is reset) cause milestones 
  Currency.eternities.reset()
  //dilation upgrades
  player.dilation.upgrades.clear();
  for (let i = 0; i < 3; i++) player.dilation.rebuyables[i + 1] = 0
  for (let i = 0; i < 3; i++) player.dilation.rebuyables[i + 11] = 0
  //eternity upgrades
  player.eternityUpgrades.clear();
  EternityUpgrade.epMult.reset();
  //infinity upgrades
  player.break = false;
  playerInfinityUpgradesOnReset();
  player.IPMultPurchases = 0;
  Replicanti.reset(true);// also does curency


  //dimentions
  AntimatterDimensions.reset();
  InfinityDimensions.fullReset();
  fullResetTimeDimensions();


  //reality currencies
  Currency.realities.reset();           //add starting values 
  Currency.realityMachines.reset(true);
  Currency.imaginaryMachines.reset(true);
  Currency.perkPoints.reset();          //add starting values
  //eternity currencies
  Currency.eternityPoints.reset();
  Currency.timeShards.reset();
  Currency.timeTheorems.reset();
  Currency.tachyonParticles.reset();
  Currency.dilatedTime.reset();
  //infinity currencies
  Currency.infinities.reset();
  Currency.infinitiesBanked.reset();
  Currency.infinityPoints.reset();
  Currency.infinityPower.reset();
  //antimatter currencies
  Currency.antimatter.reset();
  player.sacrificed = DC.D0;
  player.galaxies = 0;
  player.dimensionBoosts = 0;
  resetTickspeed();


  //Challenge
  initializeChallengeCompletions();// C/IC
  resetChallengeStuff();
  player.eternityChalls = {};
  player.challenge.eternity.current = 0;
  player.challenge.eternity.unlocked = 0;
  player.challenge.eternity.requirementBits = 0;


  //misc
  if (player.options.automatorEvents.clearOnReality) AutomatorData.clearEventLog();
  if (player.reality.glyphs.filter.select > 4) player.reality.glyphs.filter.select = 0;
  player.reality.glyphs.sac = {
    power: 0,
    infinity: 0,
    time: 0,
    replication: 0,
    dilation: 0,
    effarig: 0,
    reality: 0,
    cursed: 0
  }
  player.partInfinityPoint = 0;
  player.partInfinitied = 0;
  player.dilation.studies = [];
  player.dilation.active = false;
  player.dilation.nextThreshold = DC.E3;
  player.dilation.baseTachyonGalaxies = 0;
  player.dilation.totalTachyonGalaxies = 0;
  player.dilation.lastEP = DC.DM1;
  player.totalTickGained = 0;
  player.respec = false;
  player.eterc8ids = 50;
  player.eterc8repl = 40;
  player.partSimulatedReality = 0;
  player.reality.glyphs.undo = [];
  player.reality.respec = false;
  player.reality.showGlyphSacrifice = false;
  player.reality.showSidebarPanel = 0;
  player.reality.unlockedEC = 0;
  player.reality.lastAutoEC = 0;
  player.reality.partEternitied = DC.D0;
  player.reality.gainedAutoAchievements = false;
  player.reality.hasCheckedFilter = false;
  player.reality.automator.state.forceRestart = false;
  player.reality.automator.state.repeat = false;
  player.reality.automator.state.mode = AUTOMATOR_MODE.PAUSE;


  // BlackHoles
  player.blackHolePause = false;
  player.blackHoleAutoPauseMode = 0;
  player.blackHolePauseTime = 0;
  player.blackHoleNegative = 1;
  for (let i = 0; i < 2; i++) {
    BlackHoles.list[i]._data.intervalUpgrades = 0;
    BlackHoles.list[i]._data.powerUpgrades = 0;
    BlackHoles.list[i]._data.durationUpgrades = 0;
    BlackHoles.list[i]._data.phase = 0;
    BlackHoles.list[i]._data.active = false;
    BlackHoles.list[i]._data.unlocked = false;
    BlackHoles.list[i]._data.activations = 0;
  }


  recalculateAllGlyphs();
  Player.resetRequirements("reality");
  existenceStartRewards()
  EventHub.dispatch(GAME_EVENT.EXISTENCE_RESET_AFTER);
  existenceRecords();
}

function resetCel1() {
  //cel1 // unlocked at ach(147)
  const cel = player.celestials.teresa;
  cel.run = false;
  cel.bestRunAM = DC.D1;
  cel.lastRepeatedMachines = DC.D0;
  cel.bestAMSet = [];
  cel.pouredAmount = 0;
  for (let i = 0; i < 6; i++)  cel.perkShop[i] = 0;
  cel.unlockBits = 0; // 1 = teresa reality, 2 = pasive EP, 4 = perk shop, 8 = effarig, 16 = undo glyph, 32 = all EU on reality
}

function resetCel2() {
  //cel2 // unlocked at cel1
  const cel = player.celestials.effarig;
  cel.run = false;
  cel.autoAdjustGlyphWeights = false;
  cel.glyphWeights.dt = 25;
  cel.glyphWeights.ep = 25;
  cel.glyphWeights.repl = 25;
  cel.glyphWeights.eternities = 25;
  Currency.relicShards.reset();
  cel.unlockBits = 0;  // 1 = glyph lvl weights, 2 = glyph filtering, 4 = glyph presets, 8 = effarig reality, 16 = inf layer, 32 = eter layer, 64 = real layer
}

function resetCel3() {
  //cel3 // unlocked at cel2 eter layer
  const cel = player.celestials.enslaved;
  cel.run = false;
  cel.glyphHintsGiven = 3;    // glyph hints
  cel.progressBits = 255;     // found hints
  cel.hintBits = 255;         // given hints
  cel.hintUnlockProgress = 0; // hint timer
  cel.zeroHintTime = 0;       // price timer

  Enslaved.autoReleaseTick = 0;
  cel.hasSecretStudy = false;
  cel.feltEternity = false;
  cel.autoStoreReal = false;
  cel.completed = false;
  cel.isStoring = false;
  cel.stored = 0;
  cel.isStoringReal = false;
  cel.storedReal = 0;
  cel.tesseracts = 0;
  cel.isAutoReleasing = false; // pulse: off
  cel.unlocks = [];  // 0: time dim tickspeed softcap, 1: enslaved reality
}

function resetCel4() {
  //cel4 // unlocked at ach(151)
  const cel = player.celestials.v;
  cel.run = false;
  cel.wantsFlipped = false;
  cel.STSpent = 0;
  Celestials.v.spaceTheorems = 0;
  cel.runUnlocks = [0, 0, 0, 0, 0, 0, 0, 0, 0];
  cel.goalReductionSteps = [0, 0, 0, 0, 0, 0, 0, 0, 0];
  cel.runGlyphs = [[], [], [], [], [], [], [], [], []];
  cel.runRecords = [-10, 0, 0, 0, 0, 0, 0, 0, 0];
  cel.unlockBits = 0; // 1 = unlock, 2 = 2V ach,  4 = 5V ach, 8 = 10V ach, 16 = 16V ach, 32 = 30V ach, 64 = 36V ach
}

function resetCel5() {
  //cel5 // unlocked at 36V ach
  const cel = player.celestials.ra;
  cel.run = false;
  cel.charged.clear();
  cel.disCharge = false; // respec charged
  cel.momentumTime = 0;
  cel.petWithRemembrance = '';
  cel.peakGamespeed = 1;
  cel.highestRefinementValue = { power: 0, infinity: 0, time: 0, replication: 0, dilation: 0, effarig: 0 };
  for (let i = 0; i < cel.alchemy.length; i++) cel.alchemy[i].amount = 0;
  resetCel5Pet(cel.pets.teresa);
  resetCel5Pet(cel.pets.effarig);
  resetCel5Pet(cel.pets.enslaved);
  resetCel5Pet(cel.pets.v);
  cel.unlockBits = 0; // 268435455 // cel1: 1,2,3,5,4,6,7, cel2: 1,2,3,5,4,6,7, cel3: 1,2,3,5,4,6,7, cel4: 1,2,3,4,5,6,7

}

function resetCel5Pet(pet) {
  pet.level = 1;
  pet.memories = 0;
  pet.memoryChunks = 0;
  pet.memoryUpgrades = 0;
  pet.chunkUpgrades = 0;
}

function resetCel6() {
  //cel7 // unlocked at IU 15
  const cel = player.celestials.laitela;
  cel.run = false;
  cel.singularityCapIncreases = 0;
  cel.lastCheckedMilestones = 0;
  cel.thisCompletion = 3600;
  cel.fastestCompletion = 3600;
  cel.difficultyTier = 0;
  cel.entropy = 0;
  cel.darkMatterMult = 1;
  DarkMatterDimensions.reset();
  Currency.darkMatter.reset(true);
  Currency.darkEnergy.reset();
  Currency.singularities.reset();
}

function resetCel7() {
  //cel7 // unlocked at IU 25
  const cel = player.celestials.pelle;
  cel.doomed = false;
  cel.upgrades.clear();
  Currency.remnants.reset()
  Currency.realityShards.reset()
  for (let i = 0; i < 5; i++) PelleUpgrade.all[i].boughtAmount = 0
  for (let i = 0; i < 5; i++) GalaxyGeneratorUpgrades.all[i].boughtAmount = 0
  cel.galaxyGenerator.generatedGalaxies = 0;
  cel.galaxyGenerator.spentGalaxies = 0;
  cel.galaxyGenerator.phase = 0;
  cel.galaxyGenerator.unlocked = false;
  cel.galaxyGenerator.sacrificeActive = false;
  cel.collapsed.galaxies = false; // not 100% necessary
  cel.collapsed.rifts = false;    // not 100% necessary
  cel.collapsed.upgrades = false; // not 100% necessary
  cel.showBought = false;         // not 100% necessary
  cel.records.totalAntimatter = DC.D0;
  cel.records.totalEternityPoints = DC.D0;
  cel.records.totalInfinityPoints = DC.D0;
  for (let i = 0; i < 5; i++) PelleRifts.all[i].rift.active = false;
  for (let i = 0; i < 5; i++) PelleRifts.all[i].rift.reducedTo = 1;
  PelleRifts.all[1].rift.percentageSpent = 0;
  for (let i = 0; i < 5; i++) PelleRifts.all[i].rift.fill = (i === 2) ? 0 : DC.D0;
  cel.progressBits = 0; // 1 = not used, 2,4,8,16,32 = rifts
}

function resetCelQuotes() {
  const cel = player.celestials;
  cel.teresa.quoteBits = 0;   // 15 = all
  cel.effarig.quoteBits = 0;  // 255 = all
  cel.enslaved.quoteBits = 0; // 63 = all
  cel.v.quoteBits = 0;        // 2047 = all
  cel.ra.quoteBits = 0;       // 16383 = all
  cel.laitela.quoteBits = 0;  // 1023 = all
  cel.pelle.quoteBits = 0;    // 4095 = all
}

function lockAchievementsOnExistence() {

  for (const achievement of Achievements.row(18)) achievement.lock();
  for (const achievement of Achievements.realityLayer) {
    achievement.lock();
  }

  if (!Perk.achievementGroup5.isBought) {
    for (const achievement of Achievements.preReality) {
      achievement.lock();
    }
    player.reality.achTimer = 0;
  }
}

function existenceStartRewards() {

  player.reality.perks.add(0);
  if (RealityUpgrade(10).isBought) applyRUPG10();
  if (TeresaUnlocks.startEU.canBeApplied) for (const id of [1, 2, 3, 4, 5, 6]) player.eternityUpgrades.add(id);
  else if (RealityUpgrade(14).isBought) applyEU1();
  Achievement(141).unlock();

}

function existenceGiveRewards(isReset) {
  if (!isReset) {
    GlyphAppearanceHandler.unlockSet();
    player.existence.totalExistences += 1
    Currency.existences.add(1);
    Currency.existencePoints.add(1);
  }
}

function existenceRecords() {

  //requirement for RU20. it is not handled by resetRequirements();
  player.records.timePlayedAtBHUnlock = Number.MAX_VALUE;

  player.records.thisInfinity = {
    time: 0,
    realTime: 0,
    lastBuyTime: 0,
    maxAM: DC.D0,
    bestIPmin: DC.D0,
    bestIPminVal: DC.D0,
  }
  player.records.bestInfinity = {
    time: Number.MAX_VALUE,
    realTime: Number.MAX_VALUE,
    bestIPminEternity: DC.D0,
    bestIPminReality: DC.D0,
  }
  player.records.thisEternity = {
    time: 0,
    realTime: 0,
    maxAM: DC.D0,
    maxIP: DC.D0,
    bestIPMsWithoutMaxAll: DC.D0,
    bestEPmin: DC.D0,
    bestEPminVal: DC.D0,
    bestInfinitiesPerMs: DC.D0,
  }
  player.records.bestEternity = {
    time: Number.MAX_VALUE,
    realTime: Number.MAX_VALUE,
    bestEPminReality: DC.D0,
  }
  player.records.thisReality = {
    time: 0,
    realTime: 0,
    maxAM: DC.D0,
    maxIP: DC.D0,
    maxEP: DC.D0,
    bestEternitiesPerMs: DC.D0,
    maxReplicanti: DC.D0,
    maxDT: DC.D0,
    bestRSmin: 0,
    bestRSminVal: 0,
  }
  player.records.bestReality = {
    time: Number.MAX_VALUE,
    realTime: Number.MAX_VALUE,
    glyphStrength: 0,
    RM: DC.D0,
    RMSet: [],
    RMmin: DC.D0,
    RMminSet: [],
    glyphLevel: 0,
    glyphLevelSet: [],
    bestEP: DC.D0,
    bestEPSet: [],
    speedSet: [],
    iMCapSet: [],
    laitelaSet: [],
  }

  resetInfinityRuns();
  resetEternityRuns();
  resetRealityRuns();
}