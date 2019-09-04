"use strict";

// Multiplier applied to all normal dimensions, regardless of tier. This is cached using a Lazy
// and invalidated every update.
function normalDimensionCommonMultiplier() {
  let multiplier = new Decimal(1);

  multiplier = multiplier.times(Player.achievementPower);
  multiplier = multiplier.times(kongDimMult);
  multiplier = multiplier.times(kongAllDimMult);

  if (!EternityChallenge(9).isRunning) {
    multiplier = multiplier.times(player.infinityPower.pow(getInfinityConversionRate()).max(1));
  }
  multiplier = multiplier.timesEffectsOf(
    BreakInfinityUpgrade.totalAMMult,
    BreakInfinityUpgrade.currentAMMult,
    BreakInfinityUpgrade.achievementMult,
    BreakInfinityUpgrade.slowestChallengeMult,
    InfinityUpgrade.totalTimeMult,
    InfinityUpgrade.thisInfinityTimeMult,
    Achievement(48),
    Achievement(56),
    Achievement(65),
    Achievement(72),
    Achievement(73),
    Achievement(74),
    Achievement(76),
    Achievement(78),
    Achievement(84),
    Achievement(91),
    Achievement(92),
    TimeStudy(91),
    TimeStudy(101),
    TimeStudy(161),
    TimeStudy(193),
    InfinityChallenge(3),
    InfinityChallenge(3).reward,
    InfinityChallenge(8),
    EternityChallenge(10)
  );

  multiplier = multiplier.dividedByEffectOf(InfinityChallenge(6));
  multiplier = multiplier.times(getAdjustedGlyphEffect("powermult"));

  return multiplier;
}

function getDimensionFinalMultiplier(tier) {
  return GameCache.normalDimensionFinalMultipliers[tier].value;
}

function getDimensionFinalMultiplierUncached(tier) {
  if (tier < 1 || tier > 8) throw new Error(`Invalid Normal Dimension tier ${tier}`);
  if (NormalChallenge(10).isRunning && tier > 6) return new Decimal(1);

  let multiplier = new Decimal(NormalDimension(tier).power);

  if (EternityChallenge(11).isRunning) {
    return player.infinityPower.pow(getInfinityConversionRate())
      .max(1)
      .times(DimBoost.power.pow(DimBoost.totalBoosts - tier + 1).max(1));
  }
  if (NormalChallenge(12).isRunning) {
    if (tier === 4) multiplier = multiplier.pow(1.4);
    if (tier === 2) multiplier = multiplier.pow(1.7);
  }

  multiplier = applyNDMultipliers(multiplier, tier);
  multiplier = applyNDPowers(multiplier, tier);

  const glyphDilationPowMultiplier = getAdjustedGlyphEffect("dilationpow");
  if (player.dilation.active || TimeCompression.isActive) {
    multiplier = dilatedValueOf(multiplier.pow(glyphDilationPowMultiplier, 1));
  } else if (Enslaved.isRunning) {
    multiplier = dilatedValueOf(multiplier);
  }
  multiplier = multiplier.timesEffectOf(DilationUpgrade.ndMultDT);

  // The "unaffected by dilation" ND mult and ND dilation power effect only apply to the first layer of dilation
  if (TimeCompression.isActive) {
    multiplier = dilatedValueOf(multiplier, TimeCompression.compressionDepth - 1);
  }

  if (Effarig.isRunning) {
    multiplier = Effarig.multiplier(multiplier);
  } else if (V.isRunning) {
    multiplier = multiplier.pow(0.5);
  } else if (Laitela.isRunning) {
    multiplier = multiplier.pow(Laitela.dimMultNerf);
  }

  // This power effect goes intentionally after all the nerf effects and shouldn't be moved before them
  if (Ra.has(RA_UNLOCKS.GLYPH_ALCHEMY) && multiplier.gte(AlchemyResource.inflation.effectValue)) {
    multiplier = multiplier.pow(1.05);
  }

  return multiplier;
}

function applyNDMultipliers(mult, tier) {
  let multiplier = mult.times(GameCache.normalDimensionCommonMultiplier.value);

  let infinitiedMult = new Decimal(1).timesEffectsOf(
    NormalDimension(tier).infinityUpgrade,
    BreakInfinityUpgrade.infinitiedMult
  );
  infinitiedMult = infinitiedMult.pow(Effects.product(TimeStudy(31)));
  multiplier = multiplier.times(infinitiedMult);

  if (tier === 1) {
    multiplier = multiplier
      .timesEffectsOf(
        InfinityUpgrade.unspentIPMult,
        InfinityUpgrade.unspentIPMult.chargedEffect,
        Achievement(28),
        Achievement(31),
        Achievement(68),
        Achievement(71),
        TimeStudy(234)
      );
  }

  multiplier = multiplier.timesEffectsOf(
    tier === 8 ? Achievement(23) : null,
    tier < 8 ? Achievement(34) : null,
    tier <= 4 ? Achievement(43) : null,
    tier < 8 ? TimeStudy(71) : null,
    tier === 8 ? TimeStudy(214) : null,
    tier > 1 && tier < 8 ? InfinityChallenge(8).reward : null,
    AlchemyResource.dimensionality
  );
  if (Achievement(77).isEnabled) {
    // Welp, this effect is too complex for Effects system
    multiplier = multiplier.times(1 + tier / 100);
  }

  multiplier = multiplier.times(player.reality.realityMachines.powEffectOf(AlchemyResource.force));

  multiplier = multiplier.clampMin(1);

  return multiplier;
}

function applyNDPowers(mult, tier) {
  let multiplier = mult;
  const glyphPowMultiplier = getAdjustedGlyphEffect("powerpow");
  const glyphEffarigPowMultiplier = getAdjustedGlyphEffect("effarigdimensions");
  const laitelaPowMultiplier = Laitela.has(LAITELA_UNLOCKS.DIM_POW) ? Laitela.dimensionMultPowerEffect : 1;

  if (InfinityChallenge(4).isRunning && player.postC4Tier !== tier) {
    multiplier = multiplier.pow(InfinityChallenge(4).effectValue);
  }
  if (InfinityChallenge(4).isCompleted) {
    multiplier = multiplier.pow(InfinityChallenge(4).reward.effectValue);
  }

  multiplier = multiplier.pow(glyphPowMultiplier * glyphEffarigPowMultiplier * laitelaPowMultiplier);

  multiplier = multiplier
    .powEffectsOf(
      NormalDimension(tier).infinityUpgrade.chargedEffect,
      InfinityUpgrade.totalTimeMult.chargedEffect,
      InfinityUpgrade.thisInfinityTimeMult.chargedEffect,
      AlchemyResource.power
    );

  return multiplier;
}

function getBuyTenMultiplier() {
  let dimMult = 2;

  if (NormalChallenge(7).isRunning) dimMult = Math.pow(10 / 0.30, Math.random()) * 0.30;

  dimMult += Effects.sum(
    Achievement(141).secondaryEffect,
    EternityChallenge(3).reward
  );

  dimMult *= Effects.product(
    InfinityUpgrade.buy10Mult,
    Achievement(58)
  );

  dimMult *= getAdjustedGlyphEffect("powerbuy10");

  dimMult = Decimal.pow(dimMult, getAdjustedGlyphEffect("effarigforgotten"));

  dimMult = dimMult.powEffectsOf(InfinityUpgrade.buy10Mult.chargedEffect);

  return dimMult;
}

function clearDimensions(maxTier) {
  for (let i = 1; i <= maxTier; i++) {
    NormalDimension(i).amount = new Decimal(0);
  }
}

function onBuyDimension(tier) {
  Achievement(10 + tier).unlock();
  Achievement(23).tryUnlock();

  if (NormalChallenge(2).isRunning) player.chall2Pow = 0;
  if (NormalChallenge(4).isRunning) clearDimensions(tier - 1);

  player.postC4Tier = tier;
  player.thisInfinityLastBuyTime = player.thisInfinityTime;
  if (tier !== 8) player.onlyEighthDimensons = false;
  if (tier !== 1) player.onlyFirstDimensions = false;
  if (tier === 8) player.noEighthDimensions = false;
}

function getCostIncreaseThreshold() {
  return Decimal.MAX_NUMBER;
}

function buyOneDimension(tier) {
  const dimension = NormalDimension(tier);
  if (!dimension.isAvailable || !dimension.isAffordable) return false;

  const cost = dimension.cost;

  if (tier === 8 && Enslaved.isRunning && NormalDimension(8).bought >= 1) return false;

  if (tier < 3 || !NormalChallenge(6).isRunning) {
    player.antimatter = player.antimatter.minus(cost);
  } else {
    NormalDimension(tier - 2).amount = NormalDimension(tier - 2).amount.minus(cost);
  }

  if (dimension.boughtBefore10 === 9) {
    if (InfinityChallenge(5).isRunning) dimension.multiplyIC5Costs();
    else if (NormalChallenge(9).isRunning) dimension.multiplySameCosts();
  }

  dimension.amount = dimension.amount.plus(1);
  dimension.bought++;

  if (dimension.boughtBefore10 === 0) {
    dimension.power = dimension.power.times(getBuyTenMultiplier());
    floatText(tier, `x${shortenMoney(getBuyTenMultiplier())}`);
  }

  onBuyDimension(tier);

  return true;
}

function buyManyDimension(tier) {
  const dimension = NormalDimension(tier);
  if (!dimension.isAvailable || !dimension.isAffordableUntil10) return false;
  const cost = dimension.costUntil10;

  if (tier === 8 && Enslaved.isRunning) return buyOneDimension(8);

  if (tier < 3 || !NormalChallenge(6).isRunning) {
    player.antimatter = player.antimatter.minus(cost);
  } else {
    NormalDimension(tier - 2).amount = NormalDimension(tier - 2).amount.minus(cost);
  }

  if (InfinityChallenge(5).isRunning) dimension.multiplyIC5Costs();
  else if (NormalChallenge(9).isRunning) dimension.multiplySameCosts();

  dimension.amount = dimension.amount.plus(dimension.remainingUntil10);
  dimension.bought += dimension.remainingUntil10;
  dimension.power = dimension.power.times(getBuyTenMultiplier());

  floatText(tier, `x${shortenMoney(getBuyTenMultiplier())}`);
  onBuyDimension(tier);

  return true;
}

function buyAsManyAsYouCanBuy(tier) {
  const dimension = NormalDimension(tier);
  if (!dimension.isAvailable || !dimension.isAffordable) return false;
  const howMany = dimension.howManyCanBuy;
  const cost = dimension.cost.times(howMany);

  if (tier === 8 && Enslaved.isRunning && NormalDimension(8).bought >= 1) return buyOneDimension(8);

  if (tier < 3 || !NormalChallenge(6).isRunning) {
    player.antimatter = player.antimatter.minus(cost);
  } else {
    NormalDimension(tier - 2).amount = NormalDimension(tier - 2).amount.minus(cost);
  }

  if (dimension.boughtBefore10 === 9) {
    if (InfinityChallenge(5).isRunning) dimension.multiplyIC5Costs();
    else if (NormalChallenge(9).isRunning) dimension.multiplySameCosts();
  }

  dimension.amount = dimension.amount.plus(howMany);
  dimension.bought += howMany;

  if (dimension.boughtBefore10 === 0) {
    dimension.power = dimension.power.times(getBuyTenMultiplier());
    floatText(tier, `x${shortenMoney(getBuyTenMultiplier())}`);
  }

  onBuyDimension(tier);

  return true;
}
// 45 complexity before
// eslint-disable-next-line complexity
function buyManyDimensionAutobuyer(tier, bulk) {
  const dimension = NormalDimension(tier);
  if (!dimension.isAvailable) return false;
  let antimatter = new Decimal(player.antimatter);
  if (antimatter.eq(0)) return false;
  if (tier === 8 && Enslaved.isRunning) return buyOneDimension(8);
  const boughtBefore10 = dimension.boughtBefore10;
  const remainingUntil10 = 10 - boughtBefore10;
  const buyTenMultiplier = getBuyTenMultiplier();
  const costUntil10 = dimension.costUntil10;
  function flushValues() {
    player.antimatter.fromDecimal(antimatter);
    dimension.amount.fromDecimal(amount);
    dimension.bought = bought;
    dimension.power.fromDecimal(pow);
  }

  if (tier >= 3 && NormalChallenge(6).isRunning) {
    const lowerDimension = NormalDimension(tier - 2);
    if (lowerDimension.amount.lt(costUntil10)) return false;
    if (costUntil10.lt(lowerDimension.amount) && boughtBefore10 !== 0) {
      lowerDimension.amount = lowerDimension.amount.minus(costUntil10);
      dimension.amount = Decimal.round(dimension.amount.plus(remainingUntil10));
      dimension.bought += remainingUntil10;
      dimension.power = dimension.power.times(buyTenMultiplier);
    }
    let x = bulk;
    while (lowerDimension.amount.gt(dimension.costUntil10) && x > 0) {
      lowerDimension.amount = lowerDimension.amount.minus(dimension.costUntil10);
      dimension.amount = Decimal.round(dimension.amount.plus(10));
      dimension.bought += 10;
      dimension.power = dimension.power.times(buyTenMultiplier);
      x--;
    }
    onBuyDimension(tier);
    return true;
  }
  if (costUntil10.lt(player.antimatter) && boughtBefore10 !== 0) {
    player.antimatter = player.antimatter.minus(costUntil10);
    dimension.amount = Decimal.round(dimension.amount.plus(remainingUntil10));
    dimension.bought += remainingUntil10;
    dimension.power = dimension.power.times(buyTenMultiplier);
  }
  if (player.antimatter.lt(dimension.costUntil10)) return false;

  let x = bulk;
  const costScale = dimension.costScale;
  let amount = new Decimal(dimension.amount);
  let bought = dimension.bought;
  let pow = new Decimal(dimension.power);
  const purchaseBumps = dimension.purchaseBumps;
  if (InfinityChallenge(5).isRunning || NormalChallenge(9).isRunning) {
    while (player.antimatter.gte(dimension.costUntil10) && x > 0) {
      player.antimatter = player.antimatter.minus(dimension.costUntil10);
      if (InfinityChallenge(5).isRunning) dimension.multiplyIC5Costs();
      else if (NormalChallenge(9).isRunning) dimension.multiplySameCosts();
      dimension.amount = Decimal.round(dimension.amount.plus(10));
      dimension.bought += 10;
      dimension.power = dimension.power.times(buyTenMultiplier);
      if (NormalChallenge(4).isRunning) clearDimensions(tier - 1);
      x--;
    }
  } else {
    if (dimension.cost.lt(getCostIncreaseThreshold())) {
      while (
        antimatter.gte(costScale.calculateCost(Math.floor(bought / 10) + purchaseBumps).times(10)) &&
        x > 0 &&
        costScale.calculateCost(Math.floor(bought / 10) + purchaseBumps).times(10).lte(getCostIncreaseThreshold())) {

        antimatter = antimatter.minus(
          costScale.calculateCost(Math.floor(bought / 10) + purchaseBumps).times(10)
        );
        if (InfinityChallenge(5).isRunning) dimension.multiplyIC5Costs();
        else if (NormalChallenge(9).isRunning) dimension.multiplySameCosts();
        amount = amount.plus(10).round();
        bought += 10;
        pow.fromDecimal(pow.times(buyTenMultiplier));
        if (NormalChallenge(4).isRunning) clearDimensions(tier - 1);
        x--;

      }
    }
    // We only charge for the most expensive cost here
    // to reduce complexity, and because it's unneeded
    if (costScale.calculateCost(Math.floor(bought / 10) + purchaseBumps).times(10).gte(getCostIncreaseThreshold())) {
      const maxBought = costScale.getMaxBought(Math.floor(bought / 10) + purchaseBumps, antimatter);
      let buying = maxBought.quantity;
      if (buying <= 0) {
        flushValues();
        return false;
      }
      if (buying > bulk) buying = bulk;
      amount = amount.plus(10 * buying).round();
      bought += 10 * buying;
      pow = pow.times(Decimal.pow(buyTenMultiplier, buying));

      antimatter = antimatter.minus(Decimal.pow10(maxBought.logPrice)).max(0);
    }
    flushValues();
  }
  if ((NormalChallenge(11).isRunning || InfinityChallenge(6).isRunning) && player.matter.equals(0)) {
    player.matter = new Decimal(1);
  }
  if (InfinityChallenge(1).isRunning) clearDimensions(tier - 1);
  onBuyDimension(tier);
  return true;
}


function canAfford(cost) {
  return (player.break || cost.lt(new Decimal("1.79e308"))) && cost.lte(player.antimatter);
}

function buyOneDimensionBtnClick(tier) {
  resetMatterOnBuy(tier);
  if (tier === 1) {
    if (buyOneDimension(1)) {
      // This achievement is granted only if the buy one button is pressed
      Achievement(28).tryUnlock();
    }
    return;
  }
  buyOneDimension(tier);
}

function buyManyDimensionsBtnClick(tier) {
  resetMatterOnBuy(tier);
  buyManyDimension(tier);
}

function buyAsManyAsYouCanBuyBtnClick(tier) {
  resetMatterOnBuy(tier);
  buyAsManyAsYouCanBuy(tier);
}

function resetMatterOnBuy(tier) {
  if (tier < 5 && Player.isInMatterChallenge && player.matter.equals(0)) {
    player.matter = new Decimal(1);
  }
}

function getDimensionProductionPerSecond(tier) {
  const multiplier = getDimensionFinalMultiplier(tier);
  const dimension = NormalDimension(tier);
  let amount = dimension.amount.floor();
  if (NormalChallenge(12).isRunning) {
    if (tier === 2) amount = amount.pow(1.5);
    if (tier === 4) amount = amount.pow(1.3);
  }
  let production = amount.times(multiplier).dividedBy(Tickspeed.current.dividedBy(1000));
  if (NormalChallenge(2).isRunning) {
    production = production.times(player.chall2Pow);
  }
  const postBreak = (player.break && !InfinityChallenge.isRunning && !NormalChallenge.isRunning) ||
    InfinityChallenge.isRunning || Enslaved.isRunning;
  if (!postBreak && production.gte(Decimal.MAX_NUMBER)) {
    production = production.min("1e315");
  }
  if (tier === 1 && production.gt(10)) {
    const log10 = production.log10();
    production = Decimal.pow10(Math.pow(log10, getAdjustedGlyphEffect("effarigantimatter")));
  }
  return production;
}

class NormalDimensionState extends DimensionState {
  constructor(tier) {
    super(() => player.dimensions.normal, tier);
    const BASE_COSTS = [null, 10, 100, 1e4, 1e6, 1e9, 1e13, 1e18, 1e24];
    this._baseCost = BASE_COSTS[tier];
    const BASE_COST_MULTIPLIERS = [null, 1e3, 1e4, 1e5, 1e6, 1e8, 1e10, 1e12, 1e15];
    this._baseCostMultiplier = BASE_COST_MULTIPLIERS[tier];
    const C6_BASE_COSTS = [null, 10, 100, 100, 500, 2500, 2e4, 2e5, 4e6];
    this._c6BaseCost = C6_BASE_COSTS[tier];
    const C6_BASE_COST_MULTIPLIERS = [null, 1e3, 5e3, 1e4, 1.2e4, 1.8e4, 2.6e4, 3.2e4, 4.2e4];
    this._c6BaseCostMultiplier = C6_BASE_COST_MULTIPLIERS[tier];
  }

  /**
   * @returns {Decimal}
   */
  get costScale() {
    return new ExponentialCostScaling({
      baseCost: NormalChallenge(6).isRunning ? this._c6BaseCost : this._baseCost,
      baseIncrease: NormalChallenge(6).isRunning ? this._c6BaseCostMultiplier : this._baseCostMultiplier,
      costScale: Player.dimensionMultDecrease,
      scalingCostThreshold: Number.MAX_VALUE
    });
  }

  /**
   * @returns {Decimal}
   */
  get cost() {
    return this.costScale.calculateCost(Math.floor(this.bought / 10) + this.purchaseBumps);
  }

  /** @returns {number} */
  get purchaseBumps() { return this.data.purchaseBumps; }
  /** @param {number} value */
  set purchaseBumps(value) { this.data.purchaseBumps = value; }

  /**
   * @returns {number}
   */
  get boughtBefore10() {
    return this.bought % 10;
  }

  /**
   * @returns {number}
   */
  get remainingUntil10() {
    return 10 - this.boughtBefore10;
  }

  /**
   * @returns {Decimal}
   */
  get costUntil10() {
    return this.cost.times(this.remainingUntil10);
  }

  get howManyCanBuy() {
    const ratio = this.currencyAmount.dividedBy(this.cost);
    return Decimal.floor(Decimal.max(Decimal.min(ratio, 10 - this.boughtBefore10), 0)).toNumber();
  }

  /**
   * @returns {InfinityUpgrade}
   */
  get infinityUpgrade() {
    switch (this.tier) {
      case 1:
      case 8:
        return InfinityUpgrade.dim18mult;
      case 2:
      case 7:
        return InfinityUpgrade.dim27mult;
      case 3:
      case 6:
        return InfinityUpgrade.dim36mult;
      case 4:
      case 5:
        return InfinityUpgrade.dim45mult;
    }
    return false;
  }

  /**
   * @returns {Decimal}
   */
  get rateOfChange() {
    const tier = this.tier;
    if (tier === 8 ||
      (tier > 3 && EternityChallenge(3).isRunning) ||
      (tier > 6 && NormalChallenge(12).isRunning)) {
      return new Decimal(0);
    }

    let toGain;
    if (tier === 7 && EternityChallenge(7).isRunning) {
      toGain = InfinityDimension(1).productionPerSecond.times(10);
    } else if (NormalChallenge(12).isRunning) {
      toGain = getDimensionProductionPerSecond(tier + 2);
    } else {
      toGain = getDimensionProductionPerSecond(tier + 1);
    }
    return toGain.times(10).dividedBy(this.amount.max(1)).times(getGameSpeedupForDisplay());
  }

  /**
   * @returns {Decimal}
   */

  get currencyAmount() {
    return this.tier >= 3 && NormalChallenge(6).isRunning
      ? NormalDimension(this.tier - 2).amount
      : player.antimatter;
  }

   /**
   * @returns {boolean}
   */
  get isAffordable() {
    if (!player.break && this.cost.gt(Decimal.MAX_NUMBER)) return false;
    return this.cost.lte(this.currencyAmount);
  }

  /**
   * @returns {boolean}
   */
  get isAffordableUntil10() {
    if (!player.break && this.cost.gt(Decimal.MAX_NUMBER)) return false;
    return this.costUntil10.lte(this.currencyAmount);
  }

  get isAvailable() {
    if (!player.break && player.antimatter.gt(Decimal.MAX_NUMBER)) return false;
    if (this.tier > DimBoost.totalBoosts + 4) return false;
    if (this.tier > 1 &&
      NormalDimension(this.tier - 1).amount.eq(0) &&
      !EternityMilestone.unlockAllND.isReached) return false;
    return this.tier < 7 || !NormalChallenge(10).isRunning;
  }

  reset() {
    this.amount = new Decimal(0);
    this.power = new Decimal(1);
    this.bought = 0;
    this.purchaseBumps = 0;
  }

  multiplySameCosts() {
    for (const dimension of NormalDimensions.all) {
      if (dimension.cost.e === this.cost.e && dimension.tier !== this.tier) {
        dimension.purchaseBumps++;
      }
    }
    if (Tickspeed.cost.e === this.cost.e) player.chall9TickspeedPurchaseBumps++;
  }

  multiplyIC5Costs() {
    for (const dimension of NormalDimensions.all) {
      if (this.tier <= 4 && dimension.cost.e <= this.cost.e && dimension.tier !== this.tier) {
        dimension.purchaseBumps++;
      } else if (this.tier >= 5 && dimension.cost.e >= this.cost.e && dimension.tier !== this.tier) {
        dimension.purchaseBumps++;
      }
    }
  }

  get multiplier() {
    return getDimensionFinalMultiplier(this.tier);
  }
}

NormalDimensionState.createIndex();

/**
 * @param {number} tier
 * @return {NormalDimensionState}
 */
const NormalDimension = tier => NormalDimensionState.index[tier];

const NormalDimensions = {
  /**
   * @type {NormalDimensionState[]}
   */
  all: NormalDimensionState.index.compact(),
  reset() {
    for (const dimension of NormalDimensions.all) {
      dimension.reset();
    }
    NormalDimension(8).power = new Decimal(player.chall11Pow);
    GameCache.dimensionMultDecrease.invalidate();
  }
};
