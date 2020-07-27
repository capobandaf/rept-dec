"strict"

import {PeriodicDecimal} from './PeriodicDecimal.mjs'
import {translationO, statusCodeO} from './translation.mjs'

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
    document.getElementById('langs_id').addEventListener('change', localizeToLang);
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
}


function localizeStartup () {
    let langS = navigator.language;
    userLangS = langS.split('-')[0];
    if (! (userLangS in translationO['title'])) {
        userLangS = 'en';
    }
    localize(userLangS);
    document.getElementById("langs_id").value = userLangS;
}


function localizeToLang () {
    let langsElem = document.getElementById('langs_id');
    let langCode = langsElem.value;
    localize(langCode);
}

localizeStartup ()
registerHandlers ();
