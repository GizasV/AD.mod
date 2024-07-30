export const existenceUpgrades = {
  testing1: {
    name: "testing 1",
    id: 1,
    cost: 0,
    description: "testing",

    //requirement: "for simple text",
    requirement: () => `for nums ${format("1e4000")}.`,
    checkRequirement: () => !false,

    effect: () => 1,
    formatEffect: value => formatX(value, 2, 1), // for decimal
    onPurchased: () => true,
  },
  testing2: {
    name: "testing 1",
    id: 1,
    cost: 0,
    description: "testing",

    requirement: "for simple text",
    //requirement: () => `for nums ${format("1e4000")}.`,
    checkRequirement: () => !false,
    
    effect: () => 1,
    formatEffect: value => formatX(value, 2, 1), // for decimal
    onPurchased: () => true,
  },
  testing3: {
    name: "testing 1",
    id: 1,
    cost: 0,
    description: "testing",

    //requirement: "for simple text",
    //requirement: () => `for nums ${format("1e4000")}.`,
    //checkRequirement: () => !false,
    
    effect: () => 1,
    formatEffect: value => formatX(value, 2, 1), // for decimal
    onPurchased: () => true,
  },

}