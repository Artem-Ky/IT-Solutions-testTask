
const phoneInput = document.getElementById('phone');
const nameInput = document.getElementById('name');
const questionArea = document.getElementById('question');
const form = document.querySelector('.contacts-form');

phoneInput.addEventListener('input', (e) => {
    let input = e.target.value.replace(/\D/g, ''); //если печатается не цифра удаляем
    let formattedInput = '';

    // елси печатается + заменяем на +7
    if (e.target.value.startsWith('+')) {
        input = '7' + input.substring(1);
    }

    // если начинаем с 7 меняем на +7
    if (input.startsWith('7')) {
        formattedInput = '+7 (' + input.substring(1, 4); // +7 (XXX
    } else if (!input.startsWith('0') && input.length > 0) {
        formattedInput = input.charAt(0) + ' (' + input.substring(1, 4); // X (XXX
    }

    if (input.length >= 4) {
        formattedInput += ') ' + input.substring(4, 7); // +7 (XXX) XXX
    }

    if (input.length >= 7) {
        formattedInput += '-' + input.substring(7, 9); // +7 (XXX) XXX-XX
    }

    if (input.length >= 9) {
        formattedInput += '-' + input.substring(9, 11); // +7 (XXX) XXX-XX-XX
    }

    e.target.value = formattedInput;

    // Восстанавливаем курсор
    e.target.selectionStart = e.target.selectionEnd = e.target.value.length;

    // Сохраняем номер без знаков в dataset у input
    e.target.dataset.cleanValue = input.substring(0, 11); // сохраняем чистый номер
    console.log(e.target.dataset.cleanValue);
});

// отслеживаем удаление
phoneInput.addEventListener('keydown', function (e) {
    if (e.key === 'Backspace') {
        const input = e.target.value;
        const cursorPos = e.target.selectionStart;

        // Удаляем символы перед курсором
        if (cursorPos === input.length && input.endsWith('-')) {
            e.target.value = input.slice(0, -1);
        } else if (cursorPos > 0 && input[cursorPos - 1] === ' ') {
            e.target.value = input.slice(0, cursorPos - 2);
        } else if (cursorPos > 0 && input[cursorPos - 1] === '(') {
            e.target.value = input.slice(0, cursorPos - 2);
        }

        // Помещаем курсор в конец строки
        e.target.selectionStart = e.target.selectionEnd = e.target.value.length;
    }
});

form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = nameInput.value.trim().replace(/\s+/g, '');
    const phone = phoneInput.dataset.cleanValue;
    const question = questionArea.value.trim();

    if (name.length === 0) {
        alert('Введите имя.');
        return;
    }

    if (question.length === 0) {
        alert('Задайте вопрос.');
        return;
    }

    if (phone.length !== 11) {
        alert('Введите полный номер телефона (11 цифр).');
        return;
    }

    alert(`Имя: ${name}\nТелефон: ${phone}\nСообщение: ${question}`);
});


const slider = document.querySelector('.feedback__slider');
const prevButton = document.querySelector('.feedback__slider-btn_prev');
const nextButton = document.querySelector('.feedback__slider-btn_next');

let cardElements = Array.from(document.querySelectorAll('.feedback-card')); // Массив всех карточек
const lastCardIndex = cardElements.length -1;
const cardWidth = cardElements[0].getBoundingClientRect().width; 
const gap = 12;
const slideStep = cardWidth + gap; // Смещение на одну карточку

// Изначальная установка позиции
slider.style.transform = 'translateX(0)';


const moveLeft = () => {
    
    const firstCardIndex = 0;
    const firstCard = cardElements.splice(firstCardIndex, 1)[0]; // Убираем первую карточку
    cardElements.push(firstCard); // Добавляем её в конец

    // Помещаем её в DOM в конец
    slider.appendChild(firstCard);

    // Обновляем смещение слайдера
    slider.style.transition = 'none'; // Отключаем анимацию перед перестановкой карточки
    slider.style.transform = `translateX(${-slideStep}px)`; // Смещаем слайдер влево
    requestAnimationFrame(() => {
        slider.style.transition = 'transform 0.5s ease'; // Возвращаем анимацию
        slider.style.transform = 'translateX(0)'; // Возвращаем слайдер в исходную позицию
    });
};


const moveRight = () => {
    const lastCard = cardElements.splice(lastCardIndex, 1)[0]; // Убираем последнюю карточку
    cardElements.unshift(lastCard); // Добавляем её в начало

    // Помещаем её в DOM в начало
    slider.insertBefore(lastCard, cardElements[1]);

    // Обновляем смещение слайдера
    slider.style.transition = 'none'; // Отключаем анимацию перед перестановкой карточки
    slider.style.transform = `translateX(${slideStep}px)`; // Смещаем слайдер вправо
    requestAnimationFrame(() => {
        slider.style.transition = 'transform 0.5s ease'; // Возвращаем анимацию
        slider.style.transform = 'translateX(0)'; // Возвращаем слайдер в исходную позицию
    });
};

nextButton.addEventListener('click', moveRight);
prevButton.addEventListener('click', moveLeft);
