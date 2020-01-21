//переменные
// блоки с текстом
const text_to_translate_elem = document.querySelector('#js-text-to-translate');
const translated_text_elem = document.querySelector('#js-translated-text');
const translate_btn_elem = document.querySelector('#js-translate-btn');

// всплывающее окно с ошибкой
const error_msg_elem = document.querySelector('#js-error-msg');
const error_confirm_btn = document.querySelector('#js-error-confirm-btn');

// селекторы с языками
const language_selector_elem = document.querySelectorAll('.js-language-selector');

//API-KEY
const API_KEY = '';

//инициализация данных при загрузке страницы
//получить все доступные языки перевода
window.addEventListener('load', async function (event) {
    event.preventDefault();

    //формируем url для запроса языков доступных для перевода
    let url = 'https://translate.yandex.net/api/v1.5/tr.json/getLangs';

    url += '?key='+API_KEY;   //api_key
    url += '&ui=ru';          //язык на котором прислать ответ

    //c помощью await ------
    let response = await fetch(url);        //отправляем запрос - ждем ответ
    let answer = await response.json();     //получаем ответ - JSON для получения объекта

    let available_languages = Object.keys(answer.langs);  //получаем ключи объекта - для заполнения селекторов выбора для перевода слов

    //заполняем селекторы выбора доступными языками для перевода
    for (let lang of available_languages) {
        language_selector_elem.forEach(function (item) {
            item.insertAdjacentHTML('beforeend', `<option>${lang}</option>`)
        })
    }

    //с помощью promise -----
    // fetch(url)
    //     .then(function (response) {
    //         console.log(response);
    //         return response.json();
    //     })
    //     .then(function (response) {
    //         let available_languages = Object.keys(response.langs);
    //
    //         for (let lang of available_languages){
    //             language_selector_elem.forEach(function (item) {
    //                 item.insertAdjacentHTML('beforeend', `<option>${lang}</option>`)
    //             })
    //         }
    //
    //         window.a = response.langs;
    //         console.log(response);
    //         console.log(response.langs);
    //     })
});

//при нажатии на кнопку перевод - клик
//запросить перевод слова через yandex-translate-api
translate_btn_elem.addEventListener('click', async function f(event) {
    event.preventDefault();

    //получаем языки для запроса
    let languages = [];

    //считываем языки для формирования запроса из селекторов
    language_selector_elem.forEach(function (elem) {
        languages.push(elem.item(elem.selectedIndex).text)
    });

    //получаем текст для перевода из text-area
    const text_to_translate = text_to_translate_elem.value;

    //формируем запрос для перевода текста
    let url = 'https://translate.yandex.net/api/v1.5/tr.json/translate';

    url += '?key=' + API_KEY;                               // API ключ
    url += '&lang=' + languages[0] + '-' + languages[1];    // языки с-на  "ru-en"

    //проверка на ввод
    if (text_to_translate_elem.value.length === 0){
        alert('Вы не ввели текст для перевода');
        return
    }

    url += '&text=' + text_to_translate;                    // текст для перевода

    //посылаем запрос - получаем ответ
    let response = await fetch(url);
    let answer = await response.json();

    // Проверяем статус-код, который прислал сервер
    // 200 — это ОК, остальные — ошибка или что-то другое
    if (answer.code !== 200) {
        //при ошибке вызываем всплывающее окно с текстом ошибки
        error_msg_elem.innerHTML = 'Произошла ошибка при получении ответа от сервера:\n\n' + answer.message;

        //раскрыть окно
        error_msg_elem.closest('.js-error-msg-block').classList.remove('hide');
    }

    // Проверяем, найден ли перевод для данного слова
    else if (answer.text.length === 0) {
        //при ошибке вызываем всплывающее окно с текстом ошибки
        error_msg_elem.innerHTML = 'К сожалению, перевод для данного слова не найден';

        //раскрыть окно
        error_msg_elem.closest('.js-error-msg-block').classList.remove('hide');
    }
    //если все ОК - выводим текст-перевода в text-area
    else {
        translated_text_elem.value = answer.text;
    }

    //обработчик кноки OK во всплывающем окне с ошибкой
    error_confirm_btn.addEventListener('click', function (event) {
        event.preventDefault();

        error_msg_elem.closest('.js-error-msg-block').classList.add('hide');    //скрыть окно
    })
});
