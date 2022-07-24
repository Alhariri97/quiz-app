// Select Elements
let bullests = document.querySelector(".bullets");
let bullitSpanContainer = document.querySelector(".bullets .spans");
let quizArea = document.querySelector(".quiz-area");
let answersArea = document.querySelector(".answers-area");
// let sumbitButton = document.querySelector(".submit-button");
let resultsContainer = document.querySelector(".results");
let countdownElement = document.querySelector(".countdown");
let getHtml = document.querySelectorAll(".choice");
let quizInfo = document.querySelector(".quiz-info");
let choices = document.querySelector(".choices");

// hide the elments when the app started
answersArea.style.display = "none";
quizArea.style.display = "none";
quizInfo.style.display = "none";
bullests.style.display = "none";

getHtml.forEach((ele) =>
  ele.addEventListener("click", (e) => {
    // show the elments when a choise
    answersArea.style.display = "block";
    quizArea.style.display = "block";
    quizInfo.style.display = "block";
    bullests.style.display = "flex";
    let choosen = e.target.dataset.set;
    getAllQuestions(choosen);
    choices.remove();
  })
);

// hide all elements when it first render
function hideAllElements() {
  console.log(3);
}

let currentIndex = 0;
let rightAnswers = 0;
let countdownInterval;

let getAllQuestions = (choosenLanguage) => {
  let myRequest = new XMLHttpRequest();
  myRequest.open("GET", `${choosenLanguage}-questions.json`, true);
  myRequest.send();
  myRequest.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      let questionsObject = JSON.parse(this.responseText);
      let questionCount = questionsObject.length;
      console.log(questionCount);
      //   Create bulletes and Set the number of questions
      createBullets(questionCount);
      //   Render questions on the screen
      addQuestionData(questionsObject[currentIndex], questionCount);
      // create the quiz ifo
      createInfo(choosenLanguage, questionCount);

      // Start Count Down
      countdown(19, questionCount, questionCount);

      //   Click on submit
      // create a button
      let submitButton = document.createElement("button");
      submitButton.innerText = "Submit answer";
      submitButton.className = "submit-button";
      bullests.parentElement.insertBefore(submitButton, bullests);
      console.log(submitButton);

      submitButton.onclick = () => {
        // Get correct answer
        let correct_answer = questionsObject[currentIndex].correct_answer;
        currentIndex++;
        checkAnswer(correct_answer, questionCount);
        // Remove previous Question
        quizArea.innerHTML = "";
        answersArea.innerHTML = "";
        //   Render the next questions on the screen
        addQuestionData(questionsObject[currentIndex], questionCount);
        // Handle bullests class
        handleBullets();
        // Start Count Down
        clearInterval(countdownInterval);
        countdown(19, questionCount);
        // show results
        showResults(questionCount);
      };
    }
  };
};

function createBullets(num) {
  for (let i = 0; i < num; i++) {
    // create bullet
    let theBullet = document.createElement("span");
    //
    if (i === 0) {
      theBullet.className = "on";
    }
    // append bullet
    bullitSpanContainer.appendChild(theBullet);
  }
}

function addQuestionData(obj, count) {
  if (currentIndex < count) {
    //   create  the question title
    let questionTitle = document.createElement("h2");
    let questionText = document.createTextNode(obj["title"]);
    questionTitle.appendChild(questionText);
    quizArea.appendChild(questionTitle);
    // create the answers
    for (i = 1; i <= 4; i++) {
      let mainDiv = document.createElement("div");
      mainDiv.className = "answer";
      let radionInput = document.createElement("input");
      radionInput.type = "radio";
      radionInput.name = "question";
      radionInput.id = `answer_${i}`;
      radionInput.dataset.answer = obj[`answer_${i}`];
      // Select the first option by default
      if (i === 1) {
        radionInput.checked = true;
      }

      // create lable for the options
      let theLable = document.createElement("label");
      theLable.htmlFor = `answer_${i}`;
      // create label text
      let theLabelText = document.createTextNode(obj[`answer_${i}`]);
      theLable.appendChild(theLabelText);
      mainDiv.appendChild(radionInput);
      mainDiv.appendChild(theLable);
      answersArea.appendChild(mainDiv);
    }
  }
}

function checkAnswer(right, qcount) {
  let answers = document.getElementsByName("question");
  let theCosenAnser;
  for (let i = 0; i < answers.length; i++) {
    if (answers[i].checked) {
      theCosenAnser = answers[i].dataset.answer;
    }
  }
  if (theCosenAnser === right) {
    rightAnswers++;
    console.log(`all's good`);
  }
}

function handleBullets() {
  let bullestsSpans = document.querySelectorAll(".bullets .spans span");
  let arrayOfSpans = Array.from(bullestsSpans);
  arrayOfSpans.forEach((span, index) => {
    if (currentIndex === index) {
      span.className = "on";
    }
  });
}

function showResults(count) {
  let theResults;
  let back = document.createElement("button");
  back.className = "back-button";
  back.onclick = () => {
    document.location.reload();
  };
  back.innerText = "Back";
  if (currentIndex === count) {
    quizArea.remove();
    answersArea.remove();
    document.querySelector(".submit-button").remove();
    bullests.remove();
    if (rightAnswers > count / 2 && rightAnswers < count) {
      theResults = `<span class="good"> Good</span>, ${rightAnswers} out of ${count}.`;
    } else if (rightAnswers === count) {
      theResults = `<span class="perfect"> Perfect</span>, ${rightAnswers} out of ${count}.`;
    } else {
      theResults = `<span class="bad"> Bad</span>, ${rightAnswers} out of ${count}.`;
    }
    let resultInnerCont = document.createElement("div");
    resultInnerCont.className = "result";
    resultInnerCont.innerHTML = theResults;
    resultsContainer.appendChild(resultInnerCont);
    document.querySelector(".quiz-app").appendChild(back);
  }
}

function countdown(duration, count) {
  countdownElement.innerHTML = `00:20`;

  if (currentIndex < count) {
    let minutes, seconds;
    countdownInterval = setInterval(function () {
      minutes = parseInt(duration / 60);
      seconds = parseInt(duration % 60);

      minutes = minutes < 10 ? `0${minutes}` : minutes;
      seconds = seconds < 10 ? `0${seconds}` : seconds;

      countdownElement.innerHTML = `${minutes}:${seconds}`;
      if (--duration < 0) {
        clearInterval(countdownInterval);
        document.querySelector(".submit-button").click();
      }
    }, 1000);
  }
}

function createInfo(cat, count) {
  console.log(count);
  quizInfo.innerHTML = ` <div class="category">Category: <span>${cat}</span></div>
  <div class="count">Questions Count: <span>${count}</span></div>`;
}
