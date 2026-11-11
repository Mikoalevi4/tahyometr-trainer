
// ============================================================
// ТРЕНАЖЕР «ЗНАЙДИ ДЕТАЛЬ» — SOKKIA SET 630 / CX-55
// ============================================================

const PARTS = [
  { id: 1,  name: "Ручка" },
  { id: 2,  name: "Гвинт фіксації ручки" },
  { id: 3,  name: "Мітка висоти інструменту" },
  { id: 4,  name: "Кришка акумуляторного відсіку" },
  { id: 5,  name: "Робоча панель" },
  { id: 6,  name: "Засувка трегера" },
  { id: 7,  name: "Основа трегера" },
  { id: 8,  name: "Підйомний гвинт" },
  { id: 9,  name: "Юстирувальні вікти круглого рівня" },
  { id: 10, name: "Круглий рівень" },
  { id: 11, name: "Дисплей" },
  { id: 12, name: "Об'єктив (з функцією лазерного вказівника)" },
  { id: 13, name: "Паз для установки бусолі" },
  { id: 14, name: "Приймальний датчик для зовнішньої клавіатури" },
  { id: 15, name: "Кільце, що фокусує, оптичного схилу" },
  { id: 16, name: "Кришка сітки ниток оптичного схилу" },
  { id: 17, name: "Окуляр оптичного схилу" },
  { id: 18, name: "Горизонтальний закріплювальний гвинт" },
  { id: 19, name: "Горизонтальний гвинт точного наведення" },
  { id: 20, name: "Роз'єм введення/виведення даних" },
  { id: 21, name: "Гніздо для зовнішнього джерела живлення" },
  { id: 22, name: "Циліндричний рівень" },
  { id: 23, name: "Котирувальні гвинти циліндричного рівня" },
  { id: 24, name: "Вертикальний закріплювальний гвинт" },
  { id: 25, name: "Вертикальний гвинт точного наведення" },
  { id: 26, name: "Окуляр зорової труби" },
  { id: 27, name: "Кільце фокусування зорової труби" },
  { id: 28, name: "Видошукач" },
  { id: 29, name: "Мітка центру інструменту" }
];

// Схеми: перша — номери 1-12, друга — 13-29
const SCHEMES = [
  { src: "images/scheme1.jpg", label: "Схема 1: загальний вигляд (1-12)", ids: [1,2,3,4,5,6,7,8,9,10,11,12] },
  { src: "images/scheme2.jpg", label: "Схема 2: детальний вигляд (13-29)", ids: [13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29] }
];

// ===================== Стан гри =====================
let currentMode = null;
let currentQuestion = 0;
let score = 0;
let questions = [];
let wrongAnswers = [];

// ===================== Навігація =====================
function showSection(id) {
  document.querySelectorAll('.section').forEach(s => s.classList.add('hidden'));
  document.getElementById(id).classList.remove('hidden');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ===================== Режим 1: Номер → Назва =====================
function startMode1() {
  currentMode = 1;
  currentQuestion = 0;
  score = 0;
  wrongAnswers = [];
  questions = shuffle([...PARTS]).slice(0, 15); // 15 випадкових
  showSection('game1');
  renderQuestion1();
}

function renderQuestion1() {
  const q = questions[currentQuestion];
  const container = document.getElementById('game1-container');
  const progress = ((currentQuestion) / questions.length * 100).toFixed(0);

  // 4 варіанти відповіді (1 правильний + 3 випадкових)
  const options = shuffle([
    q,
    ...shuffle(PARTS.filter(p => p.id !== q.id)).slice(0, 3)
  ]);

  container.innerHTML = `
    <div class="game-header">
      <span class="score-badge">Питання ${currentQuestion + 1} / ${questions.length}</span>
      <span class="score-badge">Рахунок: ${score}</span>
    </div>
    <div class="progress-bar"><div class="progress-fill" style="width:${progress}%"></div></div>

    <div class="question-box">
      <h3>Яка назва деталі з номером <strong>№${q.id}</strong>?</h3>
    </div>

    <div class="scheme-wrapper">
      <img src="${getSchemeForId(q.id)}" alt="Схема тахеометра" id="scheme-img">
      <p style="color:var(--muted);font-size:0.9rem;margin-top:0.5rem;">
        Знайдіть на схемі номер ${q.id} та оберіть правильну назву
      </p>
    </div>

    <div id="options1">
      ${options.map(opt => `
        <button class="btn btn-option" onclick="checkAnswer1(${opt.id}, this)">
          ${opt.name}
        </button>
      `).join('')}
    </div>
    <div id="feedback1"></div>
  `;
}

function checkAnswer1(selectedId, btn) {
  const q = questions[currentQuestion];
  const correct = selectedId === q.id;
  const feedback = document.getElementById('feedback1');
  const allBtns = document.querySelectorAll('#options1 .btn-option');

  allBtns.forEach(b => b.disabled = true);

  if (correct) {
    btn.classList.add('correct');
    score++;
    feedback.innerHTML = `<div class="feedback correct">✅ Правильно! ${q.name}</div>`;
  } else {
    btn.classList.add('wrong');
    // підсвітити правильну
    allBtns.forEach(b => {
      if (b.textContent.trim() === q.name) b.classList.add('correct');
    });
    wrongAnswers.push({ question: `Деталь №${q.id}`, correct: q.name, yourAnswer: btn.textContent.trim() });
    feedback.innerHTML = `<div class="feedback wrong">❌ Неправильно. Правильна відповідь: <strong>${q.name}</strong></div>`;
  }

  feedback.innerHTML += `
    <div class="text-center mt-1">
      <button class="btn btn-primary" onclick="nextQuestion1()">Далі →</button>
    </div>
  `;
}

function nextQuestion1() {
  currentQuestion++;
  if (currentQuestion >= questions.length) {
    showResults();
  } else {
    renderQuestion1();
  }
}

// ===================== Режим 2: Назва → Номер =====================
function startMode2() {
  currentMode = 2;
  currentQuestion = 0;
  score = 0;
  wrongAnswers = [];
  questions = shuffle([...PARTS]).slice(0, 15);
  showSection('game2');
  renderQuestion2();
}

function renderQuestion2() {
  const q = questions[currentQuestion];
  const container = document.getElementById('game2-container');
  const progress = ((currentQuestion) / questions.length * 100).toFixed(0);

  container.innerHTML = `
    <div class="game-header">
      <span class="score-badge">Питання ${currentQuestion + 1} / ${questions.length}</span>
      <span class="score-badge">Рахунок: ${score}</span>
    </div>
    <div class="progress-bar"><div class="progress-fill" style="width:${progress}%"></div></div>

    <div class="question-box">
      <h3>Знайдіть на схемі деталь: <strong>${q.name}</strong></h3>
    </div>

    <div class="scheme-wrapper">
      <img src="${getSchemeForId(q.id)}" alt="Схема тахеометра" id="scheme-img2">
      <p style="color:var(--muted);font-size:0.9rem;margin-top:0.5rem;">
        Клікніть на кнопку з номером, що відповідає цій деталі
      </p>
    </div>

    <div class="number-grid" id="num-grid">
      ${PARTS.map(p => `
        <button class="num-btn" data-id="${p.id}" onclick="checkAnswer2(${p.id}, this)">${p.id}</button>
      `).join('')}
    </div>
    <div id="feedback2"></div>
  `;
}

function checkAnswer2(selectedId, btn) {
  const q = questions[currentQuestion];
  const correct = selectedId === q.id;
  const feedback = document.getElementById('feedback2');
  const allBtns = document.querySelectorAll('#num-grid .num-btn');

  allBtns.forEach(b => b.disabled = true);

  if (correct) {
    btn.classList.add('correct');
    score++;
    feedback.innerHTML = `<div class="feedback correct">✅ Правильно! Деталь №${q.id} — ${q.name}</div>`;
  } else {
    btn.classList.add('wrong');
    // підсвітити правильну
    allBtns.forEach(b => {
      if (parseInt(b.dataset.id) === q.id) b.classList.add('correct');
    });
    wrongAnswers.push({ question: q.name, correct: `№${q.id}`, yourAnswer: `№${selectedId}` });
    feedback.innerHTML = `<div class="feedback wrong">❌ Неправильно. Правильна відповідь: <strong>№${q.id} — ${q.name}</strong></div>`;
  }

  feedback.innerHTML += `
    <div class="text-center mt-1">
      <button class="btn btn-primary" onclick="nextQuestion2()">Далі →</button>
    </div>
  `;
}

function nextQuestion2() {
  currentQuestion++;
  if (currentQuestion >= questions.length) {
    showResults();
  } else {
    renderQuestion2();
  }
}

// ===================== Режим 3: Змішаний =====================
function startMode3() {
  currentMode = 3;
  currentQuestion = 0;
  score = 0;
  wrongAnswers = [];
  // Чергуємо питання типу 1 і типу 2
  const shuffled = shuffle([...PARTS]);
  questions = shuffled.slice(0, 16).map((p, i) => ({ ...p, type: i % 2 === 0 ? 1 : 2 }));
  showSection('game3');
  renderQuestion3();
}

function renderQuestion3() {
  const q = questions[currentQuestion];
  if (q.type === 1) {
    renderMixedType1(q);
  } else {
    renderMixedType2(q);
  }
}

function renderMixedType1(q) {
  const container = document.getElementById('game3-container');
  const progress = ((currentQuestion) / questions.length * 100).toFixed(0);
  const options = shuffle([q, ...shuffle(PARTS.filter(p => p.id !== q.id)).slice(0, 3)]);

  container.innerHTML = `
    <div class="game-header">
      <span class="score-badge">Питання ${currentQuestion + 1} / ${questions.length} (Назва)</span>
      <span class="score-badge">Рахунок: ${score}</span>
    </div>
    <div class="progress-bar"><div class="progress-fill" style="width:${progress}%"></div></div>

    <div class="question-box">
      <h3>Яка назва деталі з номером <strong>№${q.id}</strong>?</h3>
    </div>

    <div class="scheme-wrapper">
      <img src="${getSchemeForId(q.id)}" alt="Схема тахеометра">
    </div>

    <div id="options3">
      ${options.map(opt => `
        <button class="btn btn-option" onclick="checkAnswer3(${opt.id}, 1, this)">${opt.name}</button>
      `).join('')}
    </div>
    <div id="feedback3"></div>
  `;
}

function renderMixedType2(q) {
  const container = document.getElementById('game3-container');
  const progress = ((currentQuestion) / questions.length * 100).toFixed(0);

  container.innerHTML = `
    <div class="game-header">
      <span class="score-badge">Питання ${currentQuestion + 1} / ${questions.length} (Номер)</span>
      <span class="score-badge">Рахунок: ${score}</span>
    </div>
    <div class="progress-bar"><div class="progress-fill" style="width:${progress}%"></div></div>

    <div class="question-box">
      <h3>Знайдіть на схемі деталь: <strong>${q.name}</strong></h3>
    </div>

    <div class="scheme-wrapper">
      <img src="${getSchemeForId(q.id)}" alt="Схема тахеометра">
    </div>

    <div class="number-grid" id="num-grid3">
      ${PARTS.map(p => `
        <button class="num-btn" data-id="${p.id}" onclick="checkAnswer3(${p.id}, 2, this)">${p.id}</button>
      `).join('')}
    </div>
    <div id="feedback3"></div>
  `;
}

function checkAnswer3(selectedId, type, btn) {
  const q = questions[currentQuestion];
  const correct = selectedId === q.id;
  const feedback = document.getElementById('feedback3');

  if (type === 1) {
    const allBtns = document.querySelectorAll('#options3 .btn-option');
    allBtns.forEach(b => b.disabled = true);
    if (correct) {
      btn.classList.add('correct'); score++;
      feedback.innerHTML = `<div class="feedback correct">✅ Правильно! ${q.name}</div>`;
    } else {
      btn.classList.add('wrong');
      allBtns.forEach(b => { if (b.textContent.trim() === q.name) b.classList.add('correct'); });
      wrongAnswers.push({ question: `Деталь №${q.id}`, correct: q.name, yourAnswer: btn.textContent.trim() });
      feedback.innerHTML = `<div class="feedback wrong">❌ Неправильно. Правильна відповідь: <strong>${q.name}</strong></div>`;
    }
  } else {
    const allBtns = document.querySelectorAll('#num-grid3 .num-btn');
    allBtns.forEach(b => b.disabled = true);
    if (correct) {
      btn.classList.add('correct'); score++;
      feedback.innerHTML = `<div class="feedback correct">✅ Правильно! Деталь №${q.id}</div>`;
    } else {
      btn.classList.add('wrong');
      allBtns.forEach(b => { if (parseInt(b.dataset.id) === q.id) b.classList.add('correct'); });
      wrongAnswers.push({ question: q.name, correct: `№${q.id}`, yourAnswer: `№${selectedId}` });
      feedback.innerHTML = `<div class="feedback wrong">❌ Неправильно. Правильна відповідь: <strong>№${q.id}</strong></div>`;
    }
  }

  feedback.innerHTML += `
    <div class="text-center mt-1">
      <button class="btn btn-primary" onclick="nextQuestion3()">Далі →</button>
    </div>
  `;
}

function nextQuestion3() {
  currentQuestion++;
  if (currentQuestion >= questions.length) {
    showResults();
  } else {
    renderQuestion3();
  }
}

// ===================== Режим 4: На час =====================
let timerInterval = null;
let timeLeft = 0;

function startMode4() {
  currentMode = 4;
  currentQuestion = 0;
  score = 0;
  wrongAnswers = [];
  questions = shuffle([...PARTS]).slice(0, 20);
  timeLeft = 120; // 2 хвилини
  showSection('game4');
  renderQuestion4();
  startTimer();
}

function startTimer() {
  const timerEl = document.getElementById('timer');
  timerInterval = setInterval(() => {
    timeLeft--;
    const m = Math.floor(timeLeft / 60);
    const s = timeLeft % 60;
    timerEl.textContent = `${m}:${s.toString().padStart(2, '0')}`;
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      showResults();
    }
  }, 1000);
}

function renderQuestion4() {
  const q = questions[currentQuestion];
  const container = document.getElementById('game4-container');
  const options = shuffle([q, ...shuffle(PARTS.filter(p => p.id !== q.id)).slice(0, 3)]);

  container.innerHTML = `
    <div class="game-header">
      <span class="score-badge">Питання ${currentQuestion + 1} / ${questions.length}</span>
      <span class="score-badge" id="timer" style="background:#fed7d7;color:#742a2a;">2:00</span>
      <span class="score-badge">Рахунок: ${score}</span>
    </div>

    <div class="question-box">
      <h3>Яка назва деталі з номером <strong>№${q.id}</strong>?</h3>
    </div>

    <div class="scheme-wrapper">
      <img src="${getSchemeForId(q.id)}" alt="Схема тахеометра">
    </div>

    <div id="options4">
      ${options.map(opt => `
        <button class="btn btn-option" onclick="checkAnswer4(${opt.id}, this)">${opt.name}</button>
      `).join('')}
    </div>
    <div id="feedback4"></div>
  `;
}

function checkAnswer4(selectedId, btn) {
  const q = questions[currentQuestion];
  const correct = selectedId === q.id;
  const feedback = document.getElementById('feedback4');
  const allBtns = document.querySelectorAll('#options4 .btn-option');

  allBtns.forEach(b => b.disabled = true);

  if (correct) {
    btn.classList.add('correct');
    score++;
    feedback.innerHTML = `<div class="feedback correct">✅ Правильно!</div>`;
  } else {
    btn.classList.add('wrong');
    allBtns.forEach(b => { if (b.textContent.trim() === q.name) b.classList.add('correct'); });
    wrongAnswers.push({ question: `Деталь №${q.id}`, correct: q.name, yourAnswer: btn.textContent.trim() });
    feedback.innerHTML = `<div class="feedback wrong">❌ Правильно: <strong>${q.name}</strong></div>`;
  }

  setTimeout(() => {
    currentQuestion++;
    if (currentQuestion >= questions.length || timeLeft <= 0) {
      clearInterval(timerInterval);
      showResults();
    } else {
      renderQuestion4();
    }
  }, 1200);
}

// ===================== Результати =====================
function showResults() {
  if (timerInterval) clearInterval(timerInterval);
  showSection('results');
  const pct = Math.round((score / questions.length) * 100);
  let message = '', color = '';

  if (pct >= 90) { message = 'Відмінно! 🎉'; color = 'var(--success)'; }
  else if (pct >= 75) { message = 'Добре! 👍'; color = 'var(--accent)'; }
  else if (pct >= 60) { message = 'Задовільно. Можна ще потренуватися.'; color = 'var(--warning)'; }
  else { message = 'Потрібно ще попрацювати! 📚'; color = 'var(--danger)'; }

  const mistakesHtml = wrongAnswers.length
    ? `<div class="card" style="margin-top:1.5rem;text-align:left;">
        <h2>Помилки (${wrongAnswers.length})</h2>
        <table style="width:100%;border-collapse:collapse;">
          <tr style="border-bottom:2px solid #e2e8f0;">
            <th style="text-align:left;padding:0.5rem;">Питання</th>
            <th style="text-align:left;padding:0.5rem;">Ваша відповідь</th>
            <th style="text-align:left;padding:0.5rem;">Правильно</th>
          </tr>
          ${wrongAnswers.map(w => `
            <tr style="border-bottom:1px solid #e2e8f0;">
              <td style="padding:0.5rem;">${w.question}</td>
              <td style="padding:0.5rem;color:var(--danger);">${w.yourAnswer}</td>
              <td style="padding:0.5rem;color:var(--success);">${w.correct}</td>
            </tr>
          `).join('')}
        </table>
       </div>`
    : '';

  document.getElementById('results-container').innerHTML = `
    <div class="results">
      <div class="big-score" style="color:${color}">${score} / ${questions.length}</div>
      <p style="font-size:1.2rem;margin:1rem 0;">${message}</p>
      <p style="color:var(--muted);margin-bottom:1.5rem;">Результат: ${pct}%</p>
      <button class="btn btn-primary" onclick="showSection('menu')">← До мен</button>
    </div>
    ${mistakesHtml}
  `;
}

// ===================== Довідник =====================
function renderReference() {
  const container = document.getElementById('ref-parts');
  container.innerHTML = PARTS.map(p => `
    <div class="part-item">
      <strong>№${p.id}</strong> — ${p.name}
    </div>
  `).join('');
}

// ===================== Допоміжні функції =====================
function getSchemeForId(id) {
  return id <= 12 ? 'images/scheme1.jpg' : 'images/scheme2.jpg';
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ===================== Ініціалізація =====================
document.addEventListener('DOMContentLoaded', () => {
  renderReference();
});
