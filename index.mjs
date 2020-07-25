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

//********************************************************************************************

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



function localize () {
    let langS = navigator.language;
    userLangS = langS.split('-')[0];
    for (let keyS in translationO) {
        let oneO = translationO[keyS];
        let prevod = '';
        if (userLangS in oneO) {
            prevod = oneO[userLangS];
        }
        if (prevod.length === 0) {
            prevod = oneO['en']
        }
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

localize ()
registerHandlers ();
