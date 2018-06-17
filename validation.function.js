;(function () {
        'use strict';

        let form = document.getElementById('feedback');
        if (!form) return;
//  Добавил свои паттерны на email,password,spam и добавил текс ошибок.Review_branch
        let elements = form.querySelectorAll('.form-control'),
            btn = document.getElementById('send_mess'),
            patternName = /^[а-яёА-ЯЁ\s]+$/,
            patternMail = /^[A-Za-z0-9](([_\.\-]?[a-zA-Z0-9]+)*)@([A-Za-z0-9]+)(([\.\-]?[a-zA-Z0-9]+)*)\.([A-Za-z])+$/,
            patternSpam = /[^\<\>\[\]%\&'`]+$/,
            patternPassword = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\s).+$/,
            errorMess = [
                'Незаполненное поле ввода', // 0
                'Введите Ваше реальное имя', // 1
                'Укажите Вашу электронную почту', // 2
                'Неверный формат электронной почты', // 3
                'Укажите тему сообщения', // 4
                'Напишите текст сообщения', // 5
                'Ваше сообщение похоже на спам, уберите специальные символы.', // 6
                'Укажите пароль', //7
                'Введите пароль повторно', //8
                'Минимальная длина пароля 8 символов', //9
                'Максимум 30 символов', //10
                'Неверный формат. Пароль должен иметь одну заглавную букву и хотя бы одну цифру', //11
                'Пароли не совпадают', //12
                'Пароли совпадают' //13
            ],
            iserror = false;

        btn.addEventListener('click', validForm);
        form.addEventListener('focus', function () {
            let el = document.activeElement;
            if (el !== btn) cleanError(el);
        }, true);

        function validForm(e) {
            e.preventDefault();
            let formVal = getFormData(form),
                error;

            for (let property in formVal) {
                error = getError(formVal, property);
                if (error.length != 0) {
                    iserror = true;
                    showError(property, error);
                }
            }

            if (!iserror) {
                sendFormData(formVal);
            }
            return false;
        }
//добавил функции на email,textarea,password а так же функцию на сравнение паролей.
        function getError(formVal, property) {
            let error = '',
                validate = {
                    'username': function () {
                        if (formVal.username.length == 0 || patternName.test(formVal.username) == false) {
                            error = errorMess[1];
                        }
                        if (formVal.username.length >= 30) {
                            error = errorMess[10];
                        }
                    },
                    'usermail': function () {
                        if (formVal.usermail.length == 0) {
                            error = errorMess[2];
                        } else if (patternMail.test(formVal.usermail) == false) {
                            error = errorMess[3];
                        }
                    },
                    'subject': function () {
                        if (formVal.subject.length == 0) {
                            error = errorMess[4];
                        } else if (patternSpam.test(formVal.subject) == false) {
                            error = errorMess[6];
                        }
                    },
                    'textmess': function () {
                        if (formVal.textmess.length == 0) {
                            error = errorMess[5];
                        } else if (patternSpam.test(formVal.textmess) == false) {
                            error = errorMess[6];
                        }
                    },
                    'password1': function () {
                        if (formVal.password1.length == 0) {
                            error = errorMess[7];
                            return;
                        }
                        if (formVal.password1.length < 8) {
                            error = errorMess[9];
                        }

                        else if (patternPassword.test(formVal.password1) == false) {
                            error = errorMess[11];
                        }
                    },
                    'password2': function () {
                        let elems = form.elements;

                        if (formVal.password2.length == 0) {
                            error = errorMess[8];
                        }
                        else if (elems.password1.value !== elems.password2.value) {
                            error = errorMess[12];
                        }
                    }
                };
            validate[property]();
            return error;
        }


        [].forEach.call(elements, function (element) {
            element.addEventListener('blur', function (e) {
                let formElement = e.target,
                    property = formElement.getAttribute('name'),
                    dataField = {};

                dataField[property] = formElement.value;

                let error = getError(dataField, property);
                if (error.length != 0) {
                    showError(property, error);
                }
                return false;
            });
        });

        function showError(property, error) {
            let formElement = form.querySelector('[name=' + property + ']'),
                errorBox = formElement.parentElement.nextElementSibling;

            formElement.classList.add('form-control_error');
            errorBox.innerHTML = error;
            errorBox.style.display = 'block';
        }

        function cleanError(el) {
            let errorBox = el.parentElement.nextElementSibling;
            el.classList.remove('form-control_error');
            errorBox.removeAttribute('style');
        }

        function getFormData(form) {
            let controls = {};
            if (!form.elements) return '';
            for (let i = 0, ln = form.elements.length; i < ln; i++) {
                let element = form.elements[i];
                if (element.tagName.toLowerCase() !== 'button') {
                    controls[element.name] = element.value;
                }
            }
            return controls;
        }


        function sendFormData(formVal) {
            let xhr = new XMLHttpRequest(),
                body = 'username=' + encodeURIComponent(formVal.username) +
                    '&usermail=' + encodeURIComponent(formVal.usermail) +
                    '&subject=' + encodeURIComponent(formVal.subject) +
                    '&textmess=' + encodeURIComponent(formVal.textmess);

            xhr.open('POST', '/sendmail.php', true);
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
            xhr.setRequestHeader('Cache-Control', 'no-cache');

            xhr.onreadystatechange = function () {
                // callback
            }

            xhr.send(body);
        }
    }

)();