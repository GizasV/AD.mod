import { PurchasableMilestonesMechanicState } from "./game-mechanics/purchasable-milestones";

export class ExistenceMilestoneState extends PurchasableMilestonesMechanicState {

  get currency() {//existences
    return Currency.existences;
  }

  get set() {
    return player.existence.existenceMilestones;
  }

  get family(){
    return this.config.family
  }

}

export const ExistenceMilestone = mapGameDataToObject(
  GameDatabase.existence.milestones,
  config => new ExistenceMilestoneState(config)
);

export const ExistenceMilestones = {
  all: ExistenceMilestone.all,
  /**
   * @param {number} id
   * @returns {ExistenceMilestoneState}
   */
  find(id) {
    return ExistenceMilestones.all.find(p => p.id === id);
  }
};

EventHub.logic.on(GAME_EVENT.EXISTENCE_RESET_AFTER, () => ExistenceMilestone.all.forEach( m => m.initializeRoot()));