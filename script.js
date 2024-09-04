// 캐릭터 선택 및 관리
let selectedCharacter = null;

// 캐릭터별 능력치 초기 설정
const characters = {
  chiko: {
    happiness: 60,
    hunger: 40,
    cleanliness: 50,
    fatigue: 50,
    energy: 70,
    stress: 30,
  },
  kurimi: {
    happiness: 50,
    hunger: 50,
    cleanliness: 60,
    fatigue: 40,
    energy: 60,
    stress: 40,
  },
  peto: {
    happiness: 70,
    hunger: 60,
    cleanliness: 40,
    fatigue: 60,
    energy: 50,
    stress: 20,
  },
  inari: {
    happiness: 40,
    hunger: 50,
    cleanliness: 50,
    fatigue: 70,
    energy: 40,
    stress: 50,
  },
};

// 쿨다운 시간을 관리하는 객체
const cooldowns = {
  chiko: 0,
  kurimi: 0,
  peto: 0,
  inari: 0,
};

// 쿨다운 시간 (밀리초 단위)
const COOLDOWN_TIME = 30000; // 30초

// 화면 전환을 위한 함수들
function showCharacterSelection() {
  document.getElementById("main-menu").style.display = "none";
  document.getElementById("character-selection").style.display = "block";
}

function goToMainMenu() {
  document.getElementById("character-selection").style.display = "none";
  document.getElementById("game-screen").style.display = "none";
  document.getElementById("main-menu").style.display = "block";

  // 게임 상태 초기화
  resetGame();
}

function startGame() {
  document.getElementById("character-selection").style.display = "none";
  document.getElementById("game-screen").style.display = "block";
  updateStatus();
}

function updateSpecialActionButton() {
  const specialActionBtn = document.getElementById("special-action");
  const specialActionImg = document.getElementById("special-action-img");
  const specialActionText = document.getElementById("special-action-text");

  if (specialActionImg && specialActionText && specialActionBtn) {
    let actionText = "";
    let actionFunction = null;
    let imgSrc = "";

    if (selectedCharacter === "chiko") {
      actionText = "고속 질주";
      actionFunction = highSpeedRun;
      imgSrc = "src/highSpeedRun.png";
      specialActionBtn.disabled = Date.now() < cooldowns.chiko; // 버튼 비활성화 처리
      if (specialActionBtn.disabled) {
        specialActionText.innerText = `${actionText} (쿨다운 중)`;
      } else {
        specialActionText.innerText = actionText;
      }
    } else if (selectedCharacter === "kurimi") {
      actionText = "빠른 회복";
      actionFunction = quickRecovery;
      imgSrc = "src/quickRecovery.png";
      specialActionBtn.disabled = Date.now() < cooldowns.kurimi;
      if (specialActionBtn.disabled) {
        specialActionText.innerText = `${actionText} (쿨다운 중)`;
      } else {
        specialActionText.innerText = actionText;
      }
    } else if (selectedCharacter === "peto") {
      actionText = "건강한 식사";
      actionFunction = healthyMeal;
      imgSrc = "src/healthyMeal.png";
      specialActionBtn.disabled = Date.now() < cooldowns.peto;
      if (specialActionBtn.disabled) {
        specialActionText.innerText = `${actionText} (쿨다운 중)`;
      } else {
        specialActionText.innerText = actionText;
      }
    } else if (selectedCharacter === "inari") {
      actionText = "명상";
      actionFunction = meditate;
      imgSrc = "src/meditate.png";
      specialActionBtn.disabled = Date.now() < cooldowns.inari;
      if (specialActionBtn.disabled) {
        specialActionText.innerText = `${actionText} (쿨다운 중)`;
      } else {
        specialActionText.innerText = actionText;
      }
    }

    if (actionText && actionFunction && imgSrc) {
      specialActionBtn.onclick = actionFunction;
      specialActionImg.src = imgSrc;
      specialActionImg.alt = actionText;
      specialActionImg.style.display = "inline";
      specialActionBtn.style.display = "inline-block";
    } else {
      specialActionBtn.style.display = "none";
    }
  }
}

// 캐릭터별 특수 행동
// 각 특수 행동 함수에서 updateSpecialActionButton 호출 추가
function highSpeedRun() {
  if (selectedCharacter !== "chiko" || gameComplete) return;

  if (Date.now() < cooldowns.chiko) {
    showPopup("아직 고속 질주를 사용할 수 없습니다. 쿨다운 시간이 필요합니다.");
    return;
  }

  energy -= 40;
  experience += 15;
  happiness += 10;
  stress -= 10;

  if (energy < 0) energy = 0;
  if (happiness > 100) happiness = 100;
  if (stress < 0) stress = 0;

  showPopup(
    "치코가 고속 질주를 했습니다! 많은 경험치를 얻었지만 에너지가 많이 소모되었습니다."
  );
  cooldowns.chiko = Date.now() + COOLDOWN_TIME;

  updateStatus();
  updateSpecialActionButton();
}

function quickRecovery() {
  if (selectedCharacter !== "kurimi" || gameComplete) return; // 쿠리미 전용 행동

  if (Date.now() < cooldowns.kurimi) {
    showPopup("아직 빠른 회복을 사용할 수 없습니다. 쿨다운 시간이 필요합니다.");
    return;
  }

  cleanliness += 30; // 청결도 크게 증가
  stress += 15; // 스트레스 증가 (조정됨)

  if (cleanliness > 100) cleanliness = 100;
  if (stress > 100) stress = 100;

  showPopup(
    "쿠리미가 빠른 회복을 했습니다! 청결도가 크게 증가했지만 스트레스가 약간 증가했습니다."
  );

  cooldowns.kurimi = Date.now() + COOLDOWN_TIME;
  updateStatus();
  updateSpecialActionButton();
}

function healthyMeal() {
  if (selectedCharacter !== "peto" || gameComplete) return; // 페토 전용 행동

  if (Date.now() < cooldowns.peto) {
    showPopup(
      "아직 건강한 식사를 사용할 수 없습니다. 쿨다운 시간이 필요합니다."
    );
    return;
  }

  health += 20; // 건강 회복
  hunger -= 20; // 배고픔 감소

  if (health > 100) health = 100;
  if (hunger < 0) hunger = 0;

  showPopup(
    "페토가 건강한 식사를 했습니다! 건강이 회복되고 배고픔이 줄어들었습니다."
  );

  cooldowns.peto = Date.now() + COOLDOWN_TIME;
  updateStatus();
  updateSpecialActionButton();
}

function meditate() {
  if (selectedCharacter !== "inari" || gameComplete) return; // 이나리 전용 행동

  if (Date.now() < cooldowns.inari) {
    showPopup("아직 명상을 사용할 수 없습니다. 쿨다운 시간이 필요합니다.");
    return;
  }

  stress -= 30; // 스트레스 크게 감소
  fatigue += 15; // 피로도 약간 증가 (조정됨)

  if (stress < 0) stress = 0;
  if (fatigue > 100) fatigue = 100;

  showPopup(
    "이나리가 명상을 했습니다! 스트레스가 크게 감소했지만 피로도가 조금 증가했습니다."
  );

  cooldowns.inari = Date.now() + COOLDOWN_TIME;
  updateStatus();
  updateSpecialActionButton();
}

function selectCharacter(character) {
  selectedCharacter = character;
  const stats = characters[character];

  // 캐릭터 이름을 한국어로 매핑
  const characterNames = {
    chiko: "치코",
    kurimi: "쿠리미",
    peto: "페토",
    inari: "이나리",
  };

  // 선택된 캐릭터의 한국어 이름 가져오기
  const characterDisplayName = characterNames[character] || "캐릭터";
  document.getElementById("character-name").innerText = characterDisplayName;

  // 캐릭터별 초기 상태 설정
  happiness = stats.happiness;
  hunger = stats.hunger;
  cleanliness = stats.cleanliness;
  fatigue = stats.fatigue;
  energy = stats.energy;
  stress = stats.stress;

  // 초기 레벨에 따른 이미지 설정
  const characterImage = document.getElementById("character-image");
  characterImage.src = `src/${character}/1.png`; // 1레벨 초기 이미지 설정
  characterImage.alt = `${characterDisplayName}의 이미지`;

  // 특별 행동 버튼 설정
  const specialActionBtn = document.getElementById("special-action");
  const specialActionImg = document.getElementById("special-action-img");
  const specialActionText = document.getElementById("special-action-text");

  if (specialActionImg && specialActionText && specialActionBtn) {
    let actionText = "";
    let actionFunction = null;
    let imgSrc = "";

    if (character === "chiko") {
      actionText = "고속 질주";
      actionFunction = highSpeedRun;
      imgSrc = "src/highSpeedRun.png";
    } else if (character === "kurimi") {
      actionText = "빠른 회복";
      actionFunction = quickRecovery;
      imgSrc = "src/quickRecovery.png";
    } else if (character === "peto") {
      actionText = "건강한 식사";
      actionFunction = healthyMeal;
      imgSrc = "src/healthyMeal.png";
    } else if (character === "inari") {
      actionText = "명상";
      actionFunction = meditate;
      imgSrc = "src/meditate.png";
    }

    if (actionText && actionFunction && imgSrc) {
      specialActionText.innerText = actionText;
      specialActionBtn.onclick = actionFunction;
      specialActionImg.src = imgSrc; // 이미지 경로 설정
      specialActionImg.alt = actionText;
      specialActionImg.style.display = "inline"; // 이미지를 보이도록 설정
      specialActionBtn.style.display = "inline-block";
    } else {
      specialActionBtn.style.display = "none"; // 조건에 맞지 않으면 숨기기
    }
  }

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

function checkAchievements() {
  // 업적 확인 로직을 여기에 추가하세요.
  // 예를 들어, 특정 레벨에 도달했거나 특정 상태를 달성했을 때 업적을 추가합니다.
  console.log("업적을 확인하는 중...");
}

function setProgressBar(id, value) {
  const progressBar = document.getElementById(id);
  progressBar.value = value;
  progressBar.classList.add("stat-change");

  // 스트레스와 피로도의 경우 색상 반대로 설정
  if (id === "stress" || id === "fatigue") {
    if (value > 75) {
      progressBar.className = "progress-green-reverse";
    } else if (value > 50) {
      progressBar.className = "progress-yellow-reverse";
    } else if (value > 25) {
      progressBar.className = "progress-orange-reverse";
    } else {
      progressBar.className = "progress-red-reverse";
    }
  } else {
    if (value > 75) {
      progressBar.className = "progress-green";
    } else if (value > 50) {
      progressBar.className = "progress-yellow";
    } else if (value > 25) {
      progressBar.className = "progress-orange";
    } else {
      progressBar.className = "progress-red";
    }
  }

  setTimeout(() => progressBar.classList.remove("stat-change"), 500);
}

function checkNeeds() {
  const bubble = document.getElementById("bubble");
  let needsMessage = "";

  // 캐릭터 이름을 한국어로 매핑
  const characterNames = {
    chiko: "치코",
    kurimi: "쿠리미",
    peto: "페토",
    inari: "이나리",
  };

  // 선택된 캐릭터의 한국어 이름 가져오기
  const characterName = characterNames[selectedCharacter] || "캐릭터";

  if (hunger > 70) {
    needsMessage += `${characterName}가 배가 고파요. 먹이를 주세요! `;
  }
  if (cleanliness < 30) {
    needsMessage += `${characterName}가 더러워요. 목욕을 시켜주세요! `;
  }
  if (fatigue > 70) {
    needsMessage += `${characterName}가 피곤해요. 재워주세요! `;
  }
  if (stress > 70) {
    needsMessage += `${characterName}가 스트레스를 많이 받고 있어요. 스트레스를 줄여주세요! `;
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

  // 캐릭터 이름을 한국어로 매핑
  const characterNames = {
    chiko: "치코",
    kurimi: "쿠리미",
    peto: "페토",
    inari: "이나리",
  };

  // 선택된 캐릭터의 한국어 이름 가져오기
  const characterName = characterNames[selectedCharacter] || "캐릭터";

  showPopup(`축하합니다! ${characterName}가 레벨 ${level}로 성장했습니다!`);

  // 레벨 업 보상
  if (level % 2 === 0) {
    // 2 레벨마다 보상
    happiness += 10;
    health += 10;
    if (happiness > 100) happiness = 100;
    if (health > 100) health = 100;
    showPopup(`${characterName}가 레벨업으로 인해 행복과 건강이 증가했습니다!`);
  }

  const characterImage = document.getElementById("character-image");
  if (level <= 5) {
    characterImage.src = `src/${selectedCharacter}/${level}.png`;
  }

  if (level === 5) {
    showPopup(
      `${characterName}가 최종 성장 단계에 도달했습니다! 모든 상태 변화가 멈춥니다.`
    );
    gameComplete = true;
  }

  specialActionUsed[selectedCharacter] = false;

  updateStatus();
}

function feedCharacter() {
  if (gameComplete) return;

  if (hunger <= 0) {
    showPopup("더 이상 배고픔을 줄일 수 없습니다. 스트레스가 증가합니다.");
    stress += 10;
    if (stress > 100) stress = 100;
  } else {
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
  }

  gainExperience(5);
  updateStatus();
}

function playWithCharacter() {
  if (gameComplete) return;

  if (energy <= 0) {
    showPopup("에너지가 부족하여 놀아줄 수 없습니다. 스트레스가 증가합니다.");
    stress += 10;
    if (stress > 100) stress = 100;
  } else {
    happiness += 10;
    hunger += 5;
    fatigue += 10;
    energy -= 15;

    if (hunger > 100) hunger = 100;
    if (happiness > 100) happiness = 100;
    if (fatigue > 100) fatigue = 100;
    if (energy < 0) energy = 0;
  }

  gainExperience(8);
  updateStatus();
}

function cleanCharacter() {
  if (gameComplete) return;

  if (cleanliness >= 100) {
    showPopup("캐릭터가 이미 충분히 깨끗합니다. 스트레스가 증가합니다.");
    stress += 10;
    if (stress > 100) stress = 100;
  } else {
    cleanliness += 20;
    happiness += 5;
    stress -= 10;
    health += 10;

    if (cleanliness > 100) cleanliness = 100;
    if (happiness > 100) happiness = 100;
    if (stress < 0) stress = 0;
    if (health > 100) health = 100;
  }

  gainExperience(4);
  updateStatus();
}

function restCharacter() {
  if (gameComplete) return;

  if (fatigue <= 0) {
    showPopup("캐릭터가 이미 충분히 쉬었습니다. 스트레스가 증가합니다.");
    stress += 10;
    if (stress > 100) stress = 100;
  } else {
    fatigue -= 20;
    happiness += 5;
    energy += 20;
    health += 5;

    if (fatigue < 0) fatigue = 0;
    if (happiness > 100) happiness = 100;
    if (energy > 100) energy = 100;
    if (health > 100) health = 100;
  }

  gainExperience(6);
  updateStatus();
}

function disciplineCharacter() {
  if (gameComplete) return;

  if (stress >= 100) {
    showPopup("캐릭터가 너무 스트레스를 받아 게임이 종료됩니다.");
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

  // 선택된 캐릭터의 이름 가져오기
  const characterName = selectedCharacter ? selectedCharacter : "캐릭터";

  if (happiness > 70 && stress < 30) {
    emotionText.innerText = `${characterName}는 행복해 보입니다!`;
  } else if (hunger > 70 || cleanliness < 30) {
    emotionText.innerText = `${characterName}는 슬퍼 보입니다.`;
  } else if (fatigue > 70 || energy < 30) {
    emotionText.innerText = `${characterName}는 피곤해 보입니다.`;
  } else if (stress > 70) {
    emotionText.innerText = `${characterName}는 화가 난 것 같습니다.`;
  } else {
    emotionText.innerText = `${characterName}는 평온해 보입니다.`;
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
  selectedCharacter = null; // 선택된 캐릭터 초기화
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

  // 초기화 시 UI 업데이트
  document.getElementById("character-name").innerText = "캐릭터 이름";
  document.getElementById("character-image").innerText =
    "캐릭터의 상태가 여기에 표시됩니다.";
  document.getElementById("special-action").style.display = "none"; // 특별 행동 버튼 숨기기
  updateStatus();
}

function walkCharacter() {
  if (gameComplete) return;

  if (energy <= 0) {
    showPopup("에너지가 부족하여 산책할 수 없습니다. 스트레스가 증가합니다.");
    stress += 10;
    if (stress > 100) stress = 100;
  } else {
    happiness += 15;
    hunger += 10;
    cleanliness -= 15;
    fatigue += 10;
    energy -= 10;
    stress -= 20;

    if (happiness > 100) happiness = 100;
    if (hunger > 100) hunger = 100;
    if (cleanliness < 0) cleanliness = 0;
    if (fatigue > 100) fatigue = 100;
    if (energy < 0) energy = 0;
    if (stress < 0) stress = 0;
  }

  gainExperience(7);
  updateStatus();
}

// 커스텀 팝업을 표시하는 함수
function showPopup(message) {
  const popup = document.getElementById("custom-popup");
  const popupMessage = document.getElementById("popup-message");

  popupMessage.innerText = message;
  popup.style.display = "flex";
}

// 커스텀 팝업을 닫는 함수
function closePopup() {
  const popup = document.getElementById("custom-popup");
  popup.style.display = "none";
}

// 초기 화면 설정
goToMainMenu();
