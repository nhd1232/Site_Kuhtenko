// Данные: массив вопросов, у каждого вопроса массив ответов
// correct: true  - правильный ответ, explain - пояснение к нему
const questions = [
    {
        text: 'А когда с человеком может произойти дрожемент?',
        answers: [
            { text: 'Когда он влюбляется' },
            { text: 'Когда он идет шопиться' },
            { text: 'Когда он слышит смешную шутку' },
            {
                text: 'Когда он боится, пугается',
                correct: true,
                explain: 'Лексема «дрожемент» имплицирует состояние крайнего напряжения и страха: «У меня всегда дрожемент в ногах, когда копы подходят».'
            }
        ]
    },
    {
        text: 'Говорят, Антон заовнил всех. Это еще как понимать?',
        answers: [
            { text: 'Как так, заовнил? Ну и хамло. Кто с ним теперь дружить-то будет?' },
            { text: 'Антон очень надоедливый и въедливый человек, всех задолбал' },
            {
                text: 'Молодец, Антон, всех победил!',
                correct: true,
                explain: 'Термин «заовнить» заимствован из английского языка, он происходит от слова own и переводится как «победить», «завладеть», «получить».'
            },
            { text: 'Нет ничего плохого в том, что Антон тщательно выбирает себе друзей' }
        ]
    },
    {
        text: 'А фразу «заскамить мамонта» как понимать?',
        answers: [
            { text: 'Разозлить кого-то из родителей' },
            { text: 'Увлекаться археологией' },
            {
                text: 'Развести недотепу на деньги',
                correct: true,
                explain: 'Заскамить мамонта — значит обмануть или развести на деньги. Почему мамонта? Потому что мошенники часто выбирают в жертвы пожилых людей (древних, как мамонты), которых легко обвести вокруг пальца.'
            },
            { text: 'Оскорбить пожилого человека' }
        ]
    },
    {
        text: 'Кто такие бефефе?',
        answers: [
            { text: 'Вши?' },
            { text: 'Милые котики, такие милые, что бефефе' },
            {
                text: 'Лучшие друзья',
                correct: true,
                explain: 'Бефефе — это лучшие друзья. Этакая аббревиатура от английского выражения best friends forever.'
            },
            { text: 'Люди, которые не держат слово' }
        ]
    },
    {
        text: 'Что из перечисленного можно назвать крашем, если ты чиллишь в компании и вдруг залипаешь на кого-то?',
        answers: [
            {
                text: 'Человек, который тебе очень нравится и вызывает симпатию.',
                correct: true,
                explain: '«Краш» — это объект симпатии; «чиллить» — расслабляться, отдыхать; «залипать» — засматриваться или задумываться.'
            },
            {
                text: 'Тот, на кого приятно смотреть и хочется общаться.',
                correct: true,
                explain: '«Краш» — это объект симпатии; «чиллить» — расслабляться, отдыхать; «залипать» — засматриваться или задумываться.'
            },
            { text: 'Твоя сильно накрашенная подруга, которая переоценила свой макияж.' },
            { text: 'Трэш в более мягкой интерпретации.' }
        ]
    }
];

// Настройки времени анимации (мс)
const WAIT_BEFORE_MOVE = 2000;   // пара секунд после выбора ответа
const STEP_DELAY = 350;          // задержка между уезжающими блоками (поочередно)
const SLIDE_TIME = 700;          // длительность уезда блока
const READ_TIME = 2500;          // сколько показывается правильный ответ с пояснением

// Элементы страницы
const btnQuestion = document.getElementById('dom-test-btn');
const area = document.getElementById('dom-test-area');
const endMessage = document.getElementById('dom-test-end');
const stats = document.getElementById('dom-test-stats');

// Состояние теста
const order = shuffle(questions.map((q, i) => i)); // случайный неповторяющийся порядок вопросов
let current = 0;      // сколько вопросов уже выдано
let rightCount = 0;   // сколько ответов дано правильно

// Перемешивание массива, возвращает новый массив
function shuffle(arr) {
    const result = arr.slice();
    for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
}

// Вывод очередного вопроса
btnQuestion.addEventListener('click', () => {
    if (current >= order.length) return;

    const qIndex = order[current];
    current++;
    btnQuestion.disabled = true; // пока не ответили - следующий вопрос взять нельзя

    renderQuestion(questions[qIndex], current);
});

function renderQuestion(q, number) {
    const wrap = document.createElement('div');
    wrap.className = 'question-wrap';

    // блок вопроса
    const questionEl = document.createElement('div');
    questionEl.className = 'question';

    const textEl = document.createElement('span');
    textEl.className = 'question__text';
    textEl.textContent = number + '. ' + q.text;

    const marker = document.createElement('span');
    marker.className = 'marker';

    questionEl.append(textEl, marker);

    // ряд с ответами в случайном порядке
    const answersEl = document.createElement('div');
    answersEl.className = 'answers';

    shuffle(q.answers).forEach(answer => {
        const answerEl = document.createElement('div');
        answerEl.className = 'answer';

        const answerText = document.createElement('div');
        answerText.textContent = answer.text;
        answerEl.append(answerText);

        if (answer.correct) {
            const explain = document.createElement('div');
            explain.className = 'answer__explain';
            explain.innerHTML = '<b>Правильно!</b> ' + answer.explain;
            answerEl.append(explain);
        }

        answerEl.addEventListener('click', () => chooseAnswer(answerEl, answer, answersEl, marker));
        answersEl.append(answerEl);
    });

    wrap.append(questionEl, answersEl);
    area.append(wrap);

    // данные вопроса понадобятся при просмотре правильных ответов в конце
    questionEl.addEventListener('click', () => showCorrect(wrap, q));
}

// Выбор ответа
// time - момент (в мс от выбора ответа), когда начнётся следующий шаг
function chooseAnswer(answerEl, answer, answersEl, marker) {
    if (answersEl.classList.contains('locked')) return;
    answersEl.classList.add('locked'); // второй ответ выбрать нельзя

    const blocks = Array.from(answersEl.children);
    let time = WAIT_BEFORE_MOVE; // пара секунд после выбора

    if (answer.correct) {
        rightCount++;
        answerEl.classList.add('correct'); // увеличивается + появляется пояснение

        // все неправильные (и невыбранные) ответы поочередно уезжают вправо
        const others = blocks.filter(b => b !== answerEl);
        time = slideAway(others, time);

        setTimeout(() => showMarker(marker, true), time);
        time += READ_TIME;

        // потом исчезает правильный ответ
        time = slideAway([answerEl], time);
    } else {
        answerEl.classList.add('wrong');

        // все ответы поочередно уезжают вправо
        time = slideAway(blocks, time);
        setTimeout(() => showMarker(marker, false), time);
    }

    setTimeout(() => {
        answersEl.remove(); // опустевший ряд ответов больше не нужен
        nextStep();
    }, time);
}

// Блоки по очереди получают класс .gone, начиная с момента start.
// Возвращает момент, когда последний блок уже уехал
function slideAway(blocks, start) {
    blocks.forEach((block, i) => {
        setTimeout(() => block.classList.add('gone'), start + i * STEP_DELAY);
    });
    return start + (blocks.length - 1) * STEP_DELAY + SLIDE_TIME;
}

function showMarker(marker, isRight) {
    marker.textContent = isRight ? '✔' : '✘';
    marker.classList.add(isRight ? 'good' : 'bad', 'show');
}

// После ответа: либо можно брать следующий вопрос, либо тест окончен
function nextStep() {
    if (current < order.length) {
        btnQuestion.disabled = false;
        return;
    }

    endMessage.classList.add('show');

    stats.innerHTML = 'Правильных ответов: <b>' + rightCount + '</b> из <b>' + order.length + '</b>';
    stats.classList.add('show');

    area.classList.add('finished');
}

// Просмотр правильного ответа после окончания теста
function showCorrect(wrap, q) {
    if (!area.classList.contains('finished')) return;

    const opened = wrap.querySelector('.review');

    // у остальных вопросов правильные ответы скрываем
    area.querySelectorAll('.review').forEach(r => r.remove());

    if (opened) return; // повторное нажатие просто закрывает блок

    const review = document.createElement('div');
    review.className = 'review';

    const correctAnswers = q.answers.filter(a => a.correct);

    const title = document.createElement('div');
    title.className = 'review__title';
    title.textContent = (correctAnswers.length > 1 ? 'Правильные ответы: ' : 'Правильный ответ: ') +
        correctAnswers.map(a => a.text).join(' / ');

    const explain = document.createElement('div');
    explain.className = 'review__explain';
    explain.textContent = correctAnswers[0].explain;

    review.append(title, explain);
    wrap.append(review);
}
