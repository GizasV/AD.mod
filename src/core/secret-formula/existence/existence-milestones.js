export const MILESTONE_TREE = {
  BASIC: "BASIC", //PROGRESSION ??
  AUTOMATION: "AUTOMATION",
  UPGRADES: "UPGRADES",
  BLACK_HOLE: "BLACK HOLE",
  PERKS: "PERKS",
  GLYPHS: "GLYPHS",
  ACHIEVEMENTS: "ACHIEVEMENTS",
  CELESTIAL: "CELESTIAL" // not full tree, for other stuff (like lai upgrades)
};

export const existenceMilestones = {
  testing1: {
    id: 0,
    currencyRequirement: 0,
    cost: 0,
    prerequisites: [],
    needsAllPrerequisites: false,
    family: MILESTONE_TREE.PERKS,
    description: "testing",
    effect: () => 1,
    onPurchased: () => true,
    nonMilestonePrerequisites: () =>  false,
  },
  testing2: {
    id: 1,
    currencyRequirement: 1,
    cost: 0,
    prerequisites: [0],
    needsAllPrerequisites: true,
    family: MILESTONE_TREE.TEST,
    description: "testing",
    effect: () => 1,
    onPurchased: () => true,
  },
  testing3: {
    id: 1,
    currencyRequirement: 1,
    cost: 0,
    prerequisites: [0],
    needsAllPrerequisites: true,
    family: MILESTONE_TREE.TEST,
    description: "testing",
    effect: () => 1,
    onPurchased: () => true,
    nonMilestonePrerequisites: () => true,
  }

}
