// rept-dec.js
// repeating decimals
// https://edabit.com/challenge/YLdgd8dav2joTpXbn

/*
        seems to be a bug in node v13.11.0
        repeatingS = '0.2'
        let reptExec = /^(?<intPart>[0-9]+)\.(?<decPart>[0-9]*)(\((?<reptPart>[0-9]+)\))?$/.exec(repeatingS);
        if (reptExec === null) {
            return "is not valid";
        }

*/

"strict";
import {PeriodicDecimal} from "./PeriodicDecimal.mjs"

function testToQuotient (asStringS, expectedStatusN, asQuotient) {
    let [statusN, resultS] = PeriodicDecimal.periodicToQuotient (asStringS);
    if (statusN !== expectedStatusN) {
        console.log ("BAD: status different:   "+JSON.stringify([asStringS, expectedStatusN, asQuotient]));
    } else if (statusN !== PeriodicDecimal.statOk && asQuotient !== resultS) {
        console.log ("BAD: quotient different: "+JSON.stringify([asStringS, expectedStatusN, asQuotient])+", is "+resultS);
    } else {
        console.log ("OK:                      "+JSON.stringify([asStringS, expectedStatusN, asQuotient]));
    }
}


function testToPeriodic (asQuotient, expectedStatusN, asStringS) {
    let [statusN, resultS] = PeriodicDecimal.quotientToPeriodic(asStringS, '.', 1000000);
    if (statusN !== expectedStatusN) {
        console.log ("BAD: status different:   "+JSON.stringify([asStringS, expectedStatusN, asQuotient]));
    } else if (statusN === PeriodicDecimal.statOk && asQuotient !== resultS) {
        console.log ("BAD: quotient different: "+JSON.stringify([asStringS, expectedStatusN, asQuotient])+", is "+resultS);
    } else {
        console.log ("OK:                      "+JSON.stringify([asStringS, expectedStatusN, asQuotient]));
    }
}

function periodicToQuotient () {
    let [decodedB, resultS] = PeriodicDecimal.periodicToQuotient (this);
    return decodedB ? resultS : "n/a";
}

String.prototype.periodicToQuotient = periodicToQuotient;

function main () {
    let pretvorjenS = "0.1(3)".periodicToQuotient();
    //console.log (`pretvorba: ${pretvorjenS}`);

    /*
    testToQuotient ("0.1(3)", PeriodicDecimal.statOk, "2/15");
    testToQuotient ("0.(3)", PeriodicDecimal.statOk, "1/3");
    testToQuotient ("3.2(1)", PeriodicDecimal.statOk, "289/90");
    testToQuotient ("0.2(42)", PeriodicDecimal.statOk, "8/33");
    testToQuotient ("0.2", PeriodicDecimal.statOk, "1/5");
    testToQuotient ("45.745", PeriodicDecimal.statOk, "9149/200");
    testToQuotient ("12.(142857)", PeriodicDecimal.statOk, "85/7");
    testToQuotient ("0.57129(4117647058823529)", PeriodicDecimal.statOk, "1214/2125");
    testToQuotient (" 54.5(4)", PeriodicDecimal.statOk, "4909/90");
    testToQuotient ("0.924)", PeriodicDecimal.statOk, "");
    testToQuotient ("0.3()", PeriodicDecimal.statPeriodicBad, "");
    testToQuotient ("a.(5)", PeriodicDecimal.statPeriodicBad, "");
    testToQuotient ("x", PeriodicDecimal.statPeriodicBad, "");
    testToQuotient ("5.((3)", PeriodicDecimal.statPeriodicBad, "");
    testToQuotient ("45.4(df)", PeriodicDecimal.statPeriodicBad, "");
    testToQuotient ("()34.f", PeriodicDecimal.statPeriodicBad, "");
    testToQuotient ("()45.45", PeriodicDecimal.statPeriodicBad, "");
    testToQuotient ("45.h", PeriodicDecimal.statPeriodicBad, "");
    testToQuotient ("(34.34)", PeriodicDecimal.statPeriodicBad, "");
    testToQuotient ("0.05(3", PeriodicDecimal.statPeriodicBad, "");
    */
    testToPeriodic ("0.1(3)", PeriodicDecimal.statOk, "2/15");
    testToPeriodic ("0.(3)", PeriodicDecimal.statOk, "1/3");

    testToPeriodic ("3.2(1)", PeriodicDecimal.statOk, "289/90");    
    testToPeriodic ("", PeriodicDecimal.statPeriodLong, "1235199/15485863");
    testToPeriodic ("0.(24)", PeriodicDecimal.statOk, "8/33");
    testToPeriodic ("0.2", PeriodicDecimal.statOk, "1/5");
    testToPeriodic ("45.745", PeriodicDecimal.statOk, "9149/200");
    testToPeriodic ("12.(142857)", PeriodicDecimal.statOk, "85/7");
    testToPeriodic ("0.571(2941176470588235)", PeriodicDecimal.statOk, "1214/2125");
    testToPeriodic ("54.5(4)", PeriodicDecimal.statOk, "4909/90");



    return 0;
}

main();
