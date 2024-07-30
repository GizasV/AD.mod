import { SetPurchasableMechanicState } from "./set-purchasable";

/**
 * @abstract
 */
export class PurchasableMilestonesMechanicState extends SetPurchasableMechanicState {

  get currencyRequirement() {
    return this.config.currencyRequirement;
  }

  get isReached() {
    return this.currency.gte(this.requirement);
  }

  get isEffectActive() {
    return this.isBought && this.isReached;
  }

  get prerequisites() {
    return this.config.prerequisites;
  }

  get isRoot() {
    return this.prerequisites.length === 0
  }

  get needsAllPrerequisites() {
    return this.config.needsAllPrerequisites;
  }

  get nonMilestonePrerequisites() { // returns nonMilestonePrerequisites if property exists, else returns true (must be a function)
    const other = this.config.nonMilestonePrerequisites?.();
    return (other || (other === undefined))
  }
  
  get isAvailableForPurchase() { // nonMilestonePrerequisites are needed regardles of needsAllPrerequisites
    if (this.isRoot) return true;
    const prereq = this.prerequisites;
    const ExM = ExistenceMilestones;
    return ((this.needsAllPrerequisites ? prereq.every(id => ExM.find(id).isBought) : prereq.some(id => ExM.find(id).isBought)) && this.nonMilestonePrerequisites())
  }

  onPurchased() {
    this.config.onPurchased?.();
  }

  initializeRoot() {
    if (this.isRoot) this.purchase()
  }

}