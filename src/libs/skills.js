const startingExpNeeded = 5;

export const createEmptySkill = () => {
  return {
    name: "",
    level: 1,
    exp: 0,
    expTillNextLevel: startingExpNeeded,
    timer: {}
  };
}

const expToLevelUp = (level) => {
  if(level <= 1){
    return 5;
  }
  return Math.floor(4 + (level - 1) * (Math.log10(level - 1) + 1));
}

export const addExperience = (exp, skill) => {
  if(!exp){
    return;
  }
  skill.exp += parseInt(exp, 10);
  while (skill.exp >= skill.expTillNextLevel) {
    skill.exp -= skill.expTillNextLevel;
    skill.level++;
    skill.expTillNextLevel = expToLevelUp(skill.level);
  }
  while (skill.exp < 0) {
    skill.level--;
    skill.expTillNextLevel = expToLevelUp(skill.level);
    skill.exp += skill.expTillNextLevel;
  }
}