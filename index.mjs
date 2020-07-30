"strict"

import {PeriodicDecimal} from './PeriodicDecimal.mjs'
import {translationO, statusCodeO, defaultSeparatorO} from './translation.mjs'
import {examples} from './examples.mjs'

let userLangS = 'en';


function convertPeriodic () {
    let inputS = document.getElementById('period_input_id').value;
    let pointCheckedB = document.getElementById('point_id').checked;
    let separatorS = pointCheckedB ? '.' : ',';

    let [statusN, outputS] = PeriodicDecimal.periodicToQuotient (inputS, separatorS);
    
    if (statusN !== PeriodicDecimal.statOk) {
        outputS = localizedStatus (statusN);
    }
    document.getElementById('period_output_field').innerText = outputS;
}

function convertQuotient () {


    let inputS = document.getElementById('quot_input_id').value;
    let maxPeriodS = document.getElementById('m_period_input_id').value;
    let pointCheckedB = document.getElementById('point_id').checked;
    let separatorS = pointCheckedB ? '.' : ',';

    let maxPeriodN = parseInt (maxPeriodS, 10);
    if (isNaN(maxPeriodN)) {
        maxPeriodN = 1000000;
    }
    
    let [statusN, outputS] = PeriodicDecimal.quotientToPeriodic(inputS, separatorS, maxPeriodN);
    
    if (statusN !== PeriodicDecimal.statOk) {
        outputS = localizedStatus (statusN);
    }
    document.getElementById('quot_output_field').innerText = outputS;
}

function registerHandlers () {
    document.getElementById('period_button_id').addEventListener('click', convertPeriodic);
    document.getElementById('quot_button_id').addEventListener('click', convertQuotient);
    document.getElementById('period_example_button_id').addEventListener('click', changeExample);
    document.getElementById('quot_example_button_id').addEventListener('click', changeExample);
    document.getElementById('langs_id').addEventListener('change', localizeToLang);
    document.getElementById('comma_id').addEventListener('change', localizeSeparator);
    document.getElementById('point_id').addEventListener('change', localizeSeparator);
}

/** The function localizes the status code to the current language */
function localizedStatus (statusN) {
    let keyS = '' + statusN;
    let oneO = statusCodeO[keyS];
    let prevod = '';
    if (userLangS in oneO) {
        prevod = oneO[userLangS];
    }
    if (prevod.length === 0) {
        prevod = oneO['en']
    }
    return prevod;
}

/**The function localizes the status code to the given language.
 * It does NOT check if the language is in translationO from translation.mjs.
 * In translationO are curently en, de, it, sl*/
function localize (selectLangS) {
    for (let keyS in translationO) {
        let oneO = translationO[keyS];
        let prevod = '';
        prevod = oneO[selectLangS];
        if (keyS === 'title') {
            document.title = prevod;
        } else {
            let elemO = document.getElementById(keyS);
            if (elemO == null) {
                continue;
            }
            elemO.innerText = prevod
        }
    }
    let separatorS = defaultSeparatorO[selectLangS];
    let pointElem = document.getElementById('point_id');
    let commaElem = document.getElementById('comma_id');
    if (separatorS === '.') {
        pointElem.checked = true;
    } else {
        commaElem.checked = true;
    }
    localizeSeparator();
}


function localizeSeparator() {
    let pointElem = document.getElementById('point_id');
    let decimalPoint;
    if (pointElem.checked) {   
        decimalPoint = document.getElementById('period_input_id').value.replace(/,/, '.');
        document.getElementById('period_input_id').value = decimalPoint;
        decimalPoint = document.getElementById('quot_output_field').innerText.replace(/,/, '.');
        document.getElementById('quot_output_field').innerText = decimalPoint;
    } else {
        decimalPoint = (document.getElementById('period_input_id').value).replace(/\./, ',');
        document.getElementById('period_input_id').value = decimalPoint;
        decimalPoint = document.getElementById('quot_output_field').innerText.replace(/\./, ',');
        document.getElementById('quot_output_field').innerText = decimalPoint;
    }
}


function changeExample (event) {
    let srcElement = event.srcElement;
    let exampleId = Number(srcElement.dataset.iex);
    let buttonId = srcElement.id;

    let inputId = buttonId.replace (/_example_button_/, '_input_');
    let outputId = buttonId.replace (/_example_button_id/, '_output_field');

    let inputElem = document.getElementById(inputId);
    let outputElem = document.getElementById(outputId);

    if (inputElem === null) {
        console.log('Internal error: no inputElem');
        return;
    }
    if (outputElem === null) {
        console.log('Internal error: no outputElem');
        return;
    }

    if (exampleId === (examples.length-1)) {
        exampleId = 0;
        srcElement.dataset.iex = String(exampleId);
    } 
    else {
        exampleId++;
        srcElement.dataset.iex = String(exampleId);
    }

    if (buttonId === "period_example_button_id") {
        inputElem.value = examples[exampleId].per;
        outputElem.innerText = examples[exampleId].quot;
    }
    if (buttonId === "quot_example_button_id") {
        inputElem.value = examples[exampleId].quot;
        outputElem.innerText = examples[exampleId].per;
    }
    localizeSeparator();
}


function localizeStartup () {
    let langS = navigator.language;
    userLangS = langS.split('-')[0];
    if (! (userLangS in translationO['title'])) {
        userLangS = 'en';
    }
    document.getElementById("langs_id").value = userLangS;
    localize(userLangS);
}


function localizeToLang () {
    let langsElem = document.getElementById('langs_id');
    let langCode = langsElem.value;
    localize(langCode);
}

localizeStartup ()
registerHandlers ();