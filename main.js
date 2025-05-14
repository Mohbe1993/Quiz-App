let countSpan = document.querySelector(".count span");
let bulletsCont = document.querySelector(".spans");
let currentIndex = 0;
let rightAnswers = 0;
let quizArea = document.querySelector(".quiz-area");
let answerArea = document.querySelector(".answers-area");
let subBut = document.querySelector(".submit-button");
let bullets = document.querySelector(".bullets");
let resultsCot = document.querySelector(".results");
let countdownInt;

let countdownEl = document.querySelector(".countdown");

function getQuestions() {
  let myRequest = new XMLHttpRequest();

  myRequest.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      let qObj = JSON.parse(this.responseText);
      let qCount = qObj.length;
      createBullets(qCount);
      addQData(qObj[currentIndex], qCount);

      countdown(3, qCount);

      subBut.onclick = () => {
        let rightAnswer = qObj[currentIndex].correct_answer;
        currentIndex++;

        checkAnswer(rightAnswer, qCount);

        quizArea.innerHTML = "";
        answerArea.innerHTML = "";

        addQData(qObj[currentIndex], qCount);

        handleBul();

        clearInterval(countdownInt);

      countdown(3, qCount);


        showResult(qCount);
      };
    }
  };
  myRequest.open("GET", "html-q.json", true);
  myRequest.send();
}

getQuestions();

function createBullets(num) {
  countSpan.innerHTML = num;

  for (let i = 0; i < num; i++) {
    let theBullet = document.createElement("span");

    if (i === 0) {
      theBullet.className = "on";
    }
    bulletsCont.appendChild(theBullet);
  }
}

function addQData(obj, count) {
  if (currentIndex < count) {
    let qTitle = document.createElement("h2");
    let qText = document.createTextNode(obj.title);
    qTitle.appendChild(qText);
    quizArea.appendChild(qTitle);

    for (let i = 1; i <= 4; i++) {
      let mainDiv = document.createElement("div");
      mainDiv.className = "answer";
      let radioInput = document.createElement("input");
      radioInput.name = "question";
      radioInput.type = "radio";
      radioInput.id = `answer-${i}`;
      radioInput.dataset.answer = obj[`answer-${i}`];

      if (i === 1) {
        radioInput.checked = true;
      }
      let theLabel = document.createElement("label");
      theLabel.htmlFor = `answer-${i}`;
      let lableText = document.createTextNode(obj[`answer-${i}`]);
      theLabel.appendChild(lableText);

      mainDiv.appendChild(radioInput);
      mainDiv.appendChild(theLabel);
      answerArea.appendChild(mainDiv);
    }
  }
}

function checkAnswer(rAnswer, count) {
  let bulSpans = document.querySelectorAll(".spans span");
  let arrayOfSpans = Array.from(bulSpans);
  let answers = document.getElementsByName("question");
  let chosenAnswer;
  for (let i = 0; i < answers.length; i++) {
    if (answers[i].checked) {
      chosenAnswer = answers[i].dataset.answer;
    }
  }
  if (rAnswer === chosenAnswer) {
    rightAnswers++;
  }
}

function handleBul() {
  let bulSpans = document.querySelectorAll(".spans span");
  let arrayOfSpans = Array.from(bulSpans);

  arrayOfSpans.forEach((span, index) => {
    if (currentIndex === index) {
      span.className = "on";
    }
  });
}

function showResult(count) {
  let theResults;
  if (currentIndex === count) {
    quizArea.remove();
    answerArea.remove();
    subBut.remove();
    bullets.remove();

    if (rightAnswers > count / 2 && rightAnswers < count) {
      theResults = `<span class="good">Good</span>, ${rightAnswers} from ${count} Is Good`;
    } else if (rightAnswers === count) {
      theResults = `<span class="perfect">Perfect</span>, ${rightAnswers} from ${count} Is Perfect`;
    } else {
      theResults = `<span class="bad">Bad</span>, ${rightAnswers} from ${count} Is Bad`;
    }

    resultsCot.innerHTML = theResults;
    resultsCot.style.padding = "10px";
    resultsCot.style.background = "white";
    resultsCot.style.marginTop = "10px";
  }
}

function countdown(dur, count) {
  if (currentIndex < count) {
    let minutes, seconds;
    countdownInt = setInterval(() => {
      minutes = parseInt(dur / 60);
      seconds = parseInt(dur % 60);

      minutes = minutes < 10 ?   `0${minutes}`: minutes;
      seconds = seconds < 10 ?   `0${seconds}`: seconds;

      countdownEl.innerHTML = `${minutes} : ${seconds} `;

      if (--dur < 0) {
        clearInterval(countdownInt);
        subBut.click();
      }
    }, 1000);
  }
}
