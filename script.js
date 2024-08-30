// 화면 전환을 위한 함수들
function showCharacterSelection() {
  document.getElementById("main-menu").style.display = "none";
  document.getElementById("character-selection").style.display = "block";
}

function goToMainMenu() {
  document.getElementById("character-selection").style.display = "none";
  document.getElementById("game-screen").style.display = "none";
  document.getElementById("main-menu").style.display = "block";
}

function startGame() {
  document.getElementById("character-selection").style.display = "none";
  document.getElementById("game-screen").style.display = "block";
  updateStatus();
}

// 캐릭터 선택 및 관리
let selectedCharacter = null;

function selectCharacter(character) {
  selectedCharacter = character;
  document.getElementById("character-name").innerText = character;
  // 이미지가 없는 경우 텍스트로 상태를 표현
  // document.getElementById('character-image').src = `images/${character.toLowerCase()}_default.png`;
  document.getElementById(
    "character-image"
  ).innerText = `${character}의 상태가 여기에 표시됩니다.`;
  startGame();
}

// 캐릭터 상태 관리 변수들
let level = 1;
let experience = 0;
let experienceRequired = 100;
let happiness = 50;
let hunger = 50;
let cleanliness = 50;
let fatigue = 50;
let energy = 50;
let stress = 20;
let health = 80;
let gameComplete = false;

function updateStatus() {
  document.getElementById("level").innerText = level;
  document.getElementById("experience").innerText = experience;
  document.getElementById("experience-required").innerText = experienceRequired;

  // 프로그래스 바 값 설정
  setProgressBar("happiness", happiness);
  setProgressBar("hunger", hunger);
  setProgressBar("cleanliness", cleanliness);
  setProgressBar("fatigue", fatigue);
  setProgressBar("energy", energy);
  setProgressBar("stress", stress);

  checkNeeds(); // 상태를 텍스트로 업데이트
  updateEmotionText(); // 상태를 텍스트로 업데이트
  checkAchievements(); // 상태 업데이트 후 업적 체크
}

function setProgressBar(id, value) {
  const progressBar = document.getElementById(id);
  progressBar.value = value;

  // 프로그래스 바 색상 업데이트
  if (value > 75) {
    progressBar.className = "progress-green"; // 초록
  } else if (value > 50) {
    progressBar.className = "progress-yellow"; // 노랑
  } else if (value > 25) {
    progressBar.className = "progress-orange"; // 주황
  } else {
    progressBar.className = "progress-red"; // 빨강
  }
}

function checkNeeds() {
  const bubble = document.getElementById("bubble");
  let needsMessage = "";

  if (hunger > 70) {
    needsMessage += "치코가 배가 고파요. 먹이를 주세요! ";
  }
  if (cleanliness < 30) {
    needsMessage += "치코가 더러워요. 목욕을 시켜주세요! ";
  }
  if (fatigue > 70) {
    needsMessage += "치코가 피곤해요. 재워주세요! ";
  }
  if (stress > 70) {
    needsMessage +=
      "치코가 스트레스를 많이 받고 있어요. 스트레스를 줄여주세요! ";
  }

  // 알림 메시지가 있을 경우 말풍선 표시
  if (needsMessage !== "") {
    bubble.innerText = needsMessage;
    bubble.style.display = "block";
  } else {
    bubble.style.display = "none"; // 알림이 없으면 말풍선을 숨김
  }
}

function gainExperience(amount) {
  if (gameComplete) return;
  experience += amount;
  if (experience >= experienceRequired) {
    levelUp();
  }
  updateStatus();
}

function levelUp() {
  level++;
  experience = 0;
  experienceRequired += 50;
  alert(`축하합니다! ${selectedCharacter}가 레벨 ${level}로 성장했습니다!`);

  if (level === 5) {
    alert(
      `${selectedCharacter}가 최종 성장 단계에 도달했습니다! 모든 상태 변화가 멈춥니다.`
    );
    gameComplete = true;
  }

  updateStatus();
}

function feedCharacter() {
  if (gameComplete) return;

  hunger -= 10;
  happiness += 5;
  fatigue += 5;
  energy += 10;
  stress -= 5;
  if (hunger < 0) hunger = 0;
  if (happiness > 100) happiness = 100;
  if (fatigue > 100) fatigue = 100;
  if (energy > 100) energy = 100;
  if (stress < 0) stress = 0;
  gainExperience(5);
  updateStatus();
}

function playWithCharacter() {
  if (gameComplete) return;

  happiness += 10;
  hunger += 5;
  fatigue += 10;
  energy -= 15;
  if (hunger > 100) hunger = 100;
  if (happiness > 100) happiness = 100;
  if (fatigue > 100) fatigue = 100;
  if (energy < 0) energy = 0;
  gainExperience(8);
  updateStatus();
}

function cleanCharacter() {
  if (gameComplete) return;

  cleanliness += 20;
  happiness += 5;
  stress -= 10;
  health += 10;
  if (cleanliness > 100) cleanliness = 100;
  if (happiness > 100) happiness = 100;
  if (stress < 0) stress = 0;
  if (health > 100) health = 100;
  gainExperience(4);
  updateStatus();
}

function restCharacter() {
  if (gameComplete) return;

  fatigue -= 20;
  happiness += 5;
  energy += 20;
  health += 5;
  if (fatigue < 0) fatigue = 0;
  if (happiness > 100) happiness = 100;
  if (energy > 100) energy = 100;
  if (health > 100) health = 100;
  gainExperience(6);
  updateStatus();
}

function disciplineCharacter() {
  if (gameComplete) return;

  if (stress >= 100) {
    alert(`${selectedCharacter}가 너무 스트레스를 받아 죽었습니다. 게임 오버.`);
    resetGame();
    return;
  }

  stress += 30;
  happiness -= 10;
  if (stress > 100) stress = 100;
  if (happiness < 0) happiness = 0;

  gainExperience(10);
  updateStatus();
}

// 상태에 따라 텍스트 업데이트
function updateEmotionText() {
  const emotionText = document.getElementById("character-image");

  if (happiness > 70 && stress < 30) {
    emotionText.innerText = "치코는 행복해 보입니다!";
  } else if (hunger > 70 || cleanliness < 30) {
    emotionText.innerText = "치코는 슬퍼 보입니다.";
  } else if (fatigue > 70 || energy < 30) {
    emotionText.innerText = "치코는 피곤해 보입니다.";
  } else if (stress > 70) {
    emotionText.innerText = "치코는 화가 난 것 같습니다.";
  } else {
    emotionText.innerText = "치코는 평온해 보입니다.";
  }
}

setInterval(() => {
  if (gameComplete) return;

  hunger += 1;
  cleanliness -= 1;
  fatigue += 1;
  energy -= 1;
  stress += 1;

  if (hunger > 100) hunger = 100;
  if (cleanliness < 0) cleanliness = 0;
  if (fatigue > 100) fatigue = 100;
  if (energy < 0) energy = 0;
  if (stress > 100) stress = 100;

  if (hunger >= 100 || cleanliness <= 0 || fatigue >= 100 || stress >= 100) {
    health -= 5;
    if (health < 0) health = 0;
  }

  updateStatus();
}, 10000);

function resetGame() {
  level = 1;
  experience = 0;
  experienceRequired = 100;
  happiness = 50;
  hunger = 50;
  cleanliness = 50;
  fatigue = 50;
  energy = 50;
  stress = 20;
  health = 80;
  gameComplete = false;
  updateStatus();
}

// 초기 화면 설정
goToMainMenu();
