var skillsArrayId = "skillsArrayId";
var allSkills = [];

function updateExp(addedExp, skillNr, callback){
  /* Increases skill's exp by a certain amount.
   */
  var skillName = allSkills[skillNr];
  var updateStorage = function (result) {
    var overallExp;
    if (skillName in result) {
      overallExp = result[skillName] + addedExp;
    }
    else {
      overallExp = addedExp;
    }
    var object = {}
    object[skillName] = overallExp;
    chrome.storage.sync.set(object);
    callback(skillNr);
  }
  chrome.storage.sync.get([skillName], updateStorage);
}

function getExp(skillName, callback){
  /* Gets exp of a skill from storage.
   */
  chrome.storage.sync.get([skillName], function (result) {
    var overallExp;
    if (skillName in result) {
      overallExp = result[skillName];
    }
    else{
      overallExp = 0;
    }
    callback(overallExp);
  });
}

function displayExp(skillNr) {
  /* Sets display of a skill with certain number.
   */
  getExp(allSkills[skillNr], function (exp) {
    $(".exp" + skillNr).html(exp);
  });
}

function increaseValue(skillNr){
  var addedExp = $("#add_value_num" + skillNr).val();
  updateExp(parseInt(addedExp), skillNr, displayExp);
}

function extension_log (message) {
  /* Writes to console argument.
   */
  var script = 'console.log(`' + message + '`);';
  chrome.tabs.executeScript({
    code: script
  });
}

function createRowTable(skill) {
  /* Receiving parameters of a skill, creates table row.
   */
  var htmlCode = (`
    <h4 class="skill_name"> ` + skill.skillName + `: </h4>
    <a class="exp` + skill.skillNr + `"> ` + skill.expValue + ` </a>
      <div>
      <input id="add_value_num` + skill.skillNr + `" class="add_value_nums" type="number" name="addValue" value ="">
      <button id="add_value_button` + skill.skillNr + `" class="add_value_buttons" type="button">Dodaj</button>
    </div>
  `);
  $('#skills').append(htmlCode);
  // extension_log(htmlCode);
}

function displayTable (callback) {
  /* Creates table of skills by adding every skill row by row
   * and sets display of this skill.
   */
  for(i = 0; i < allSkills.length; i++){
    var skill = {
      skillName: allSkills[i],
      expValue: -1, // This value will be updated in the display function.
      skillNr: i,
    };
    createRowTable(skill);
    displayExp(i);
  }
  callback();
}

function newSkillToTable (nr) {
  /* Inserts new skill to HTML table of skills.
   */
  var skill = {
    skillName: allSkills[nr],
    expValue: 0,
    skillNr: nr,
  };
  displayExp(nr);
  createRowTable(skill);
}

function addSkill () {
  /* Adds skill to storage and to current table.
   */
  var skillName = $('#skill_name').val();
  var object = {}
  object[skillName] = 0;
  allSkills.push(skillName);
  chrome.storage.sync.set({skillsArrayId: allSkills});
  chrome.storage.sync.set(object);

  var logResult = function (result) {
    extension_log("The array of skills' names: ");
    extension_log(JSON.stringify(result));
  }
  var logValueResult = function (result) {
    if (skillName in result) {
      extension_log("Skill " + skillName + " experience value is ");
      extension_log(result[skillName]);
    }
    else {
      extension_log('Skill ' + skillName + ' is not in the base.');
    }
  }
  chrome.storage.sync.get([skillsArrayId], logResult);
  chrome.storage.sync.get([skillName], logValueResult);
  newSkillToTable(allSkills.length - 1);
}

function clearSkills () {
  /* Erases all skills.
   */
  var emptyArray = [];
  chrome.storage.sync.set({skillsArrayId: emptyArray});
}

function debugSkillsExp(index) {
  /* Writes to consol all skills and it's exp.
   */
  var skillName = allSkills[index];
  chrome.storage.sync.get([skillName], function (result) {
    extension_log(skillName + ": " + result[skillName]);
  });
  if (index + 1 < allSkills.length) {
    debugSkillsExp(index + 1);
  }
}

function getSkillsFromStorage (callbackDisplay) {
  /* Creates local table by taking skills from chrome storage.
   */
   var logResult = function (result) {
    if (skillsArrayId in result) {
      allSkills = result[skillsArrayId];
      callbackDisplay(handleButtons);
    }
    else{
      extension_log("Can't load the array of skills' names.");
    }
  }
  chrome.storage.sync.get([skillsArrayId], logResult);
}

function handleButtons () {
  $('.add_value_buttons').click(function () {
    increaseValue(this.id.replace('add_value_button', ''));
  });
}

document.addEventListener('DOMContentLoaded', function () {
  $('#add_skill').click(addSkill);
  extension_log("Application begins.");
  getSkillsFromStorage(displayTable);
});
