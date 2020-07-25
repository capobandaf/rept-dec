export class PeriodicDecimal {
    static statOk = 0;
    static statPeriodicBad = 1;
    static statQuotientBad = 2;
    static statPeriodLong = 3;

    /**  */
    static periodicToQuotient(repeatingS, decDelimitS='.') {
        repeatingS = repeatingS.trim();
        let reptExec
        if (decDelimitS === '.') {
            reptExec = /^(?<intPart>[0-9]+)\.(?<decPart>[0-9]*)(\((?<reptPart>[0-9]+)\))?$/.exec(repeatingS);
        }
        if (decDelimitS === ',') {
            reptExec = /^(?<intPart>[0-9]+)\,(?<decPart>[0-9]*)(\((?<reptPart>[0-9]+)\))?$/.exec(repeatingS);
        }
        if (reptExec === null) {
            return [PeriodicDecimal.statPeriodicBad, "is not valid"];
        }
        let { decPart, intPart, reptPart } = reptExec.groups;
        // let decPart = reptExec.groups.decPart
        /**v šoli smo se učili da za odpravo periode:
         * 1) nastaviš začetek periode na prvo decimalno mesto v števcu     >for_2<
         * 2) na obeh straneh ulomka množiš z 10^(dolžino periode)     >for_1<
         * 3) odšteješ začetno periodično število od števca ter 1 od imenovalca     >for_1<
         * 2/3 skupaj pomenita da vzamem število do začetka druge pr+eriode, ga pretvorim v ulomek in na obeh straneh množim z 10^(dolžino periode)^-1 (999....99)
         */
        let faktorMnStr = "";
        if (reptPart === undefined) {
            faktorMnStr = faktorMnStr + "1";
            reptPart = "";
        }
        else {
            for (let i = 0; i < reptPart.length; i++) { // for_1
                faktorMnStr = faktorMnStr + "9";
            }
        }
        if (decPart === undefined) {
            decPart = "";
        } 
        else {
            for (let i = 0; i < decPart.length; i++) { // for_2
                faktorMnStr = faktorMnStr + "0";
            }
        }
        let števec;
        if (reptPart === "") {
            števec = BigInt(intPart + decPart + reptPart);
        }
        else {
            števec = BigInt(intPart + decPart + reptPart) - BigInt(intPart + decPart);
        }
        // ker delam z BigInt in ne BigFloat ali kaj takega
        let imenovalec = BigInt(faktorMnStr);

        //      return ` okrajšan ulomek je "${števec}"/"${imenovalec}" `;
        let dgcZaŠirjenUlom = PeriodicDecimal.gcd(imenovalec, števec);
        let okrImenovalec = imenovalec / dgcZaŠirjenUlom;
        let okrŠtevec = števec / dgcZaŠirjenUlom;
        return [PeriodicDecimal.statOk, `${okrŠtevec}/${okrImenovalec}`];
    }

    /**
     * 
     * @param ulomek 
     * @param decDelimitS 
     * @param maxPeriod 
     */
    static quotientToPeriodic(ulomek, decDelimitS, maxPeriod) {
        ulomek = ulomek.trim();
        let ulomExec = /^(?<števec>[0-9]+)\/(?<imenovalec>[0-9]+)$/.exec(ulomek);
        if (ulomExec === null) {
            return [PeriodicDecimal.statQuotientBad, "is not valid"];
        }
        let { števec, imenovalec } = ulomExec.groups;
        let imenovalecBi = BigInt(imenovalec)
        let števecBi = BigInt(števec)

        let celoŠtDelBi = števecBi/imenovalecBi
        let decimalDelA = new Array; // števke za decimalko; v začetku še ne vemo, kje se loti periodični del
        
        let maxŠteviloŠtevkBi = imenovalecBi + BigInt(števec.length);
        
        let deljenecBi = števecBi%imenovalecBi;
        let žeRabljenDeljeni = new Map(); // ključ: ostanek pri deljenju 0..imenovaleInt-1; vrednost: število znakov za decimalko

        let začetekPeriode;
        let številoŠtevk=0;
        while (true) {
            deljenecBi *= 10n;
            if (žeRabljenDeljeni.has(deljenecBi)) {
                začetekPeriode = žeRabljenDeljeni.get(deljenecBi);
                break;
            }
            if (številoŠtevk < maxPeriod) {
                žeRabljenDeljeni.set(deljenecBi, številoŠtevk);
            } else {
                return [PeriodicDecimal.statPeriodLong, 'prevelika perioda'];
            }
            decimalDelA.push((deljenecBi/imenovalecBi).toString());
            deljenecBi = deljenecBi%imenovalecBi;
            številoŠtevk++;
        }
        let decimalDelS = decimalDelA.join("")
        let reptPart = decimalDelS.substring(začetekPeriode)
        let decPart = decimalDelS.substring(0, začetekPeriode)
        
        let periodicDecŠt = celoŠtDelBi.toString() + decDelimitS + decPart;
        if (reptPart !== "0") {
            periodicDecŠt += "(" + reptPart + ")";
        }
        return [PeriodicDecimal.statOk, `${periodicDecŠt}`];
    }

    /** greatest common divisor */
    static gcd(število1, število2) {
        let večjeŠt;
        let manjšeŠt;
        let placeholder;
        if (število1 < število2) {
            večjeŠt = število2;
            manjšeŠt = število1;
        }
        else {
            večjeŠt = število1;
            manjšeŠt = število2;
        }
        while (true) {
            let ostanekPriDeljenju = večjeŠt % manjšeŠt;
            if (ostanekPriDeljenju !== 0n) {
                placeholder = manjšeŠt;
                manjšeŠt = ostanekPriDeljenju;
                večjeŠt = placeholder;
            }
            else {
                break;
            }
        }
        return manjšeŠt;
    }
}