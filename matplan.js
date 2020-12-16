"use strict";
const food = {
  "bolognese": {
    'ingredienser': ['kjøtt', 'tomat', 'paprika'],
    'koketid': [5]
  },
  "omelett": {
    'ingredienser': ['egg', 'tomat', 'bacon', 'sopp'],
    'koketid': [1]
  },
  "mosakka": {
    'ingredienser': ['kjøtt', 'aubergine', 'squash'],
    'koketid': [3]
  },
  "taco": {
    'ingredienser': ['kjøtt', 'tomat', 'ost', 'mais', 'agurk', 'avocado', 'løk'],
    'koketid': [3]
  },
  "fisketaco": {
    'ingredienser': ['fisk', 'tomat', 'ost', 'mais', 'agurk', 'avocado', 'løk'],
    'koketid': [3]  
  },
  "varmrøkt laks": {
    'ingredienser': ['varmrøkt laks', 'creme fraiche', 'rugbrød', 'smør'],
    'koketid': [1]
  },

}

function pickRandom(foodList) {
  return foodList[Math.floor(Math.random() * Object.keys(foodList).length)];
}

console.log(pickRandom(food))