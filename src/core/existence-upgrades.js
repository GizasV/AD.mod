import { SetPurchasableMechanicState } from "./game-mechanics/set-purchasable";

export class ExistenceUpgradeState extends SetPurchasableMechanicState {

  get currency() {
    return Currency.existencePoints;
  }

  get set() {
    return player.existence.existenceUpgrades;
  }

  get isAvailableForPurchase() {
    return this.checkRequirement;
  }

  onPurchased() {
    this.config.onPurchased?.();
  }

  get checkRequirement() { // returns checkRequirement if property exists, else returns true (must be a function)
    const req = this.config.checkRequirement?.();
    return (req || (req === undefined))
  }

  get requirement() {
    return (this.config.requirement === undefined ? "" : (typeof this.config.requirement === "function" ? this.config.requirement() : this.config.requirement));
  }

}

export const ExistenceUpgrade = mapGameDataToObject(
  GameDatabase.existence.upgrades,
  config => new ExistenceUpgradeState(config)
);

export const ExistenceUpgrades = {
  all: ExistenceUpgrade.all,
  /**
   * @param {number} id
   * @returns {ExistenceUpgradeState}
   */
  find(id) {
    return ExistenceUpgrades.all.find(p => p.id === id);
  }
};

//EventHub.logic.on(GAME_EVENT.EXISTENCE_RESET_AFTER, () => true);