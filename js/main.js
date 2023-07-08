const form = document.querySelector('#form')
const weightInputOne = document.querySelector('#weightInputOne')
const weightInputTwo = document.querySelector('#weightInputTwo')
const heightInput = document.querySelector('#heightInput')
const errorBlock = document.querySelector('#error')
const BMIBG = document.querySelector('.BMI')
const resultsList = document.querySelector('#resultsList')
const emptyBlock = document.querySelector('#empty')
const iconInform = document.querySelector('#iconInform')
const infoBlock = document.querySelector('#infoBlock')

const select = document.querySelector('.change-lang')
const allLanguage = ['eng', 'ru']

select.addEventListener('change', changeURLLanguage)

const resultBMINum = document.querySelector('#resultBMINUm')
const resultBMIText = document.querySelector('#resultBMIText')

let results = []

if (localStorage.getItem('results')) {
    results = JSON.parse(localStorage.getItem('results'))
    results.forEach(result => renderResults(result))
}

checkEmptyList()

form.addEventListener('submit', checkValid)
resultsList.addEventListener('click', deleteResult)
iconInform.addEventListener('click', () => {
    infoBlock.classList.toggle('information-block-active')
})

function calculateBMI(event) {
    event.preventDefault()
    let BMI = 0
    let weight = parseFloat(weightInputOne.value + ',' + weightInputTwo.value)
    let height = parseFloat(heightInput.value) / 100
    height = (height * height).toFixed(4)
    BMI = Number((weight / height).toFixed(2))
    let definition = definitionAccordance(BMI)

    resultBMINum.textContent = BMI
    resultBMIText.textContent = definition[0]
    BMIBG.classList.add(definition[1])

    let date = new Date()
    date = date.toLocaleDateString('ru-US')

    addResult(event, BMI, definition[0], date)
}

function definitionAccordance(BMI) {
    console.log(typeof BMI)
    let hash = changeLanguage()
    let color = ''
    let accordance = ''
    if (hash === 'ru') {
        if (BMI <= 16) {
            accordance = 'Выраженный дефицит массы тела'
            color = 'BMI-bad'
        }
        if (16 < BMI && BMI <= 18.5) {
            accordance = 'Недостаточная (дефицит) масса тела'
            color = 'BMI-normal'
        }
        if ((18, 5 < BMI && BMI <= 25)) {
            accordance = 'Норма'
            color = 'BMI-good'
        }
        if (25 < BMI && BMI <= 30) {
            accordance = 'Избыточная масса тела (предожирение)'
            color = 'BMI-normal'
        }
        if (30 < BMI && BMI <= 35) {
            accordance = 'Ожирение 1 степени'
            color = 'BMI-bad'
        }
        if (35 < BMI && BMI <= 40) {
            accordance = 'Ожирение 2 степени'
            color = 'BMI-bad'
        }
        if (BMI > 40) {
            accordance = 'Ожирение 3 степени'
            color = 'BMI-bad'
        }
    } else {
        if (BMI <= 16) {
            accordance = 'Pronounced body weight deficiency'
            color = 'BMI-bad'
        }
        if (16 < BMI && BMI <= 18.5) {
            accordance = 'Insufficient (deficiency) body weight'
            color = 'BMI-normal'
        }
        if ((18, 5 < BMI && BMI <= 25)) {
            accordance = 'Normal'
            color = 'BMI-good'
        }
        if (25 < BMI && BMI <= 30) {
            accordance = 'Overweight (pre-obesity)'
            color = 'BMI-normal'
        }
        if (30 < BMI && BMI <= 35) {
            accordance = 'Obesity of the 1st degree'
            color = 'BMI-bad'
        }
        if (35 < BMI && BMI <= 40) {
            accordance = 'Obesity of the 2nd degree'
            color = 'BMI-bad'
        }
        if (BMI > 40) {
            accordance = 'Obesity of the 3nd degree'
            color = 'BMI-bad'
        }
    }

    return [accordance, color]
}

function addResult(event, BMI, accordance, date) {
    event.preventDefault()
    const newResult = {
        id: Date.now(),
        BMIValue: BMI,
        accordanceValue: accordance,
        dateValue: date,
    }
    results.push(newResult)
    console.log(results)

    saveResult()

    renderResults(newResult)

    weightInputOne.value = ''
    weightInputTwo.value = ''
    heightInput.value = ''

    checkEmptyList()
}

function renderResults(result) {
    const resultHTML = `<li">
                            <div class="card card-lg results-element" id="${result.id}>
                                <h2 class="card-subtitle" style="font-size: 20px">${result.dateValue}</h2>
                                <div class="result">
                                    <h3 class="result-title BMI-lg">${result.BMIValue}</h3>
                                    <h3 class="result-title">${result.accordanceValue}</h3>
                                    <button type="button" data-action="delete" class="btn-action">
                                        <img src="./img/cross.png" alt="Delete" width="18" height="18">
                                    </button>
                                </div>
                            </div>
                        </li>`

    resultsList.insertAdjacentHTML('beforeend', resultHTML)
}

function deleteResult(event) {
    console.log('yes')
    if (event.target.dataset.action !== 'delete') return
    const parentNode = event.target.closest('.results-element')
    const id = Number(parentNode.id)
    console.log('yesssss')
    const index = results.findIndex(result => result.id === id)
    results.splice(index, 1)
    saveResult()
    parentNode.remove()
    console.log(results.length)
    checkEmptyList()
}

function saveResult() {
    localStorage.setItem('results', JSON.stringify(results))
    console.log(results)
}

function checkEmptyList() {
    if (results.length === 0) {
        const emptyListHTML = `<li>
                                    <div class="card" id="empty">
                                        <h3 class="result-title lng-resultTitleEmpty" style="font-size: 20px">На данный момент расчетов ИМТ произведено не было.</h3>
                                    </div>
                                </li>`
        resultsList.insertAdjacentHTML('afterbegin', emptyListHTML)
    }
    console.log(results.length)

    if (results.length > 0) {
        const emptyListEl = document.querySelector('#empty')
        emptyListEl ? emptyListEl.remove() : null
    }

    changeLanguage()
}

function checkValid(event) {
    event.preventDefault()
    console.log(weightInputOne)

    if (!weightInputOne.value || !weightInputTwo.value || !heightInput.value) {
        error = 'Все поля должны быть заполнены'
        showError(error)
        return
    }

    if (
        weightInputOne.value < 0 ||
        weightInputTwo.value < 0 ||
        heightInput.value < 0
    ) {
        error = 'Значение не может быть меньше нуля'
        showError(error)
        return
    }

    if (
        !(weightInputOne.value.length <= 3 && weightInputOne.value.length > 0)
    ) {
        error = 'Значение веса не может быть больше 999 и меньшше или равно 0'
        showError(error)
        return
    }
    if (weightInputTwo.value.length != 1) {
        error = 'Точность ввода значения - 1 знак после запятой'
        showError(error)
        return
    }
    if (!(heightInput.value.length <= 5 && heightInput.value.length > 0)) {
        error =
            'Значение роста не может быть больше 99999 или меньше или равно 0'
        showError(error)
        return
    }

    calculateBMI(event)
    errorBlock.classList.remove('error-active')
}

function showError(error) {
    errorBlock.textContent = error
    errorBlock.classList.add('error-active')
}

function changeURLLanguage() {
    let lang = select.value
    location.href = window.location.pathname + '#' + lang
    location.reload()
}

function changeLanguage() {
    let hash = window.location.hash
    hash = hash.substr(1)
    console.log(hash)
    if (!allLanguage.includes(hash)) {
        location.href = window.location.pathname + '#ru'
        location.reload()
    }

    select.value = hash

    if (hash === 'eng') {
        weightInputOne.placeholder = 'kg'
        weightInputTwo.placeholder = 'g'
        heightInput.placeholder = 'sm'
    }

    for (let key in langArr) {
        let elem = document.querySelector('.lng-' + key)
        if (elem) {
            elem.innerHTML = langArr[key][hash]
        }
    }
    return hash
}

changeLanguage()
