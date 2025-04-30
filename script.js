const questions = [
  {
    question: "What is the capital of France?",
    options: ["Paris", "London", "Rome", "Berlin"],
    answer: "Paris"
  },
  {
    question: "Which planet is known as the Red Planet?",
    options: ["Earth", "Venus", "Mars", "Jupiter"],
    answer: "Mars"
  },
  {
    question: "Who wrote 'Hamlet'?",
    options: ["Charles Dickens", "William Shakespeare", "J.K. Rowling", "Mark Twain"],
    answer: "William Shakespeare"
  }
];

let currentQuestionIndex = 0;
let score = 0;
let timer;
let timeLeft = 10; // seconds

const questionEl = document.getElementById('question');
const optionsEl = document.getElementById('options');
const nextBtn = document.getElementById('next-btn');
const quizEl = document.getElementById('quiz');
const resultEl = document.getElementById('result');
const scoreEl = document.getElementById('score');
const timerEl = document.getElementById('timer');

function startTimer() {
  timeLeft = 10;
  timerEl.textContent = `Time left: ${timeLeft}s`;

  timer = setInterval(() => {
    timeLeft--;
    timerEl.textContent = `Time left: ${timeLeft}s`;

    if (timeLeft <= 0) {
      clearInterval(timer);
      moveToNextQuestion(); // Auto move if time is up
    }
  }, 1000);
}

function showQuestion() {
  clearInterval(timer);
  startTimer();

  const currentQuestion = questions[currentQuestionIndex];
  questionEl.textContent = currentQuestion.question;
  optionsEl.innerHTML = "";

  currentQuestion.options.forEach(option => {
    const button = document.createElement('button');
    button.textContent = option;
    button.classList.add('option-btn');
    button.onclick = selectOption;
    optionsEl.appendChild(button);
  });
}

function selectOption(e) {
  clearInterval(timer);
  const selectedOption = e.target.textContent;
  const correctAnswer = questions[currentQuestionIndex].answer;

  if (selectedOption === correctAnswer) {
    score++;
  }
  moveToNextQuestion();
}

function moveToNextQuestion() {
  currentQuestionIndex++;

  if (currentQuestionIndex < questions.length) {
    showQuestion();
  } else {
    showResult();
  }
}

function showResult() {
  clearInterval(timer);
  quizEl.classList.add('hide');
  resultEl.classList.remove('hide');
  scoreEl.textContent = `You scored ${score} out of ${questions.length}!`;

  saveScore(); // Save the score
  showLeaderboard(); // Display updated leaderboard
}

function restartQuiz() {
  currentQuestionIndex = 0;
  score = 0;
  resultEl.classList.add('hide');
  quizEl.classList.remove('hide');
  showQuestion();
}

function saveScore() {
  let leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
  leaderboard.push({ score: score, date: new Date().toLocaleString() });
  leaderboard.sort((a, b) => b.score - a.score);
  leaderboard = leaderboard.slice(0, 5); // Keep only top 5
  localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
}

function showLeaderboard() {
  const leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
  const leaderboardEl = document.getElementById('leaderboard');
  leaderboardEl.innerHTML = "";

  leaderboard.forEach((entry, index) => {
    const li = document.createElement('li');
    li.textContent = `${index + 1}. ${entry.score} points on ${entry.date}`;
    leaderboardEl.appendChild(li);
  });
}

nextBtn.addEventListener('click', () => {
  clearInterval(timer);
  moveToNextQuestion();
});

showQuestion();
