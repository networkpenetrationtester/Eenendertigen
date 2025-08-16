class Mazzo {
    constructor(carte) {
        this.carte = carte || creaMazzo();
    }

    get numeroCarte() {
        return this.carte.length;
    }

    mischia() {
        for (let i = this.numeroCarte - 1; i > 0; i--) {
            let nuovoMazzo = Math.floor(Math.random() * (i + 1));
            let vecchioMazzo = this.carte[nuovoMazzo];
            this.carte[nuovoMazzo] = this.carte[i];
            this.carte[i] = vecchioMazzo;
        }
        return this.carte;
    }
}

class Carta {
    static semi = ["bastoni", "spade", "denari", "coppe"];
    static valori = ["asso", "2", "3", "4", "5", "6", "7", "fante", "cavallo", "re"];
    constructor(seme, valore) {
        this.seme = seme;
        this.valore = valore;
        this.src = `immagini/carte napoletane/${valore} ${seme}.jpg`
    }
    calcolaPunteggio() {
        switch (this.valore) {
            case "asso":
                return 11;
            case "fante":
            case "cavallo":
            case "re":
                return 10;
            default:
                return parseInt(this.valore);
        }
    }
}

function creaMazzo() {
    return Carta.semi.flatMap(seme => {
        return Carta.valori.map(valore => {
            return new Carta(seme, valore);
        });
    });
}

function finisciGioco() {
    memoria.finito = true;
    document.getElementById("giocatore2_punteggio").hidden = false;
    document.getElementById("giocatore1_punteggio").hidden = false;
    for (let i = 0; i < 3; i++) {
        memoria.ultimoGiocatore.elemento.children[i].children[0].src = memoria.ultimoGiocatore.carte[i].src;
    }
    if (memoria.giocatore1.punteggio > memoria.giocatore2.punteggio) {
        messaggioVittoria.textContent = "Giocatore 1 ha vinto!"
    } else if (memoria.giocatore1.punteggio < memoria.giocatore2.punteggio) {
        messaggioVittoria.textContent = "Giocatore 2 ha vinto!"
    } else {
        messaggioVittoria.textContent = "Pareggio!"
    }
    vittoria.style.display = "flex";
}

function calcolaPunteggioGiocatore(carteGiocatore) {
    let punteggiPerSeme = {
        bastoni: 0,
        spade: 0,
        denari: 0,
        coppe: 0
    };

    carteGiocatore.forEach(carta => {
        let punteggioCarta = carta.calcolaPunteggio();
        punteggiPerSeme[carta.seme] += punteggioCarta;
    });

    let punteggioMax = Math.max(...Object.values(punteggiPerSeme));
    return punteggioMax;
}

function distribuisciCarte() {
    memoria.giocatore1.carte = memoria.mazzoIniziale.splice(0, 3);
    memoria.giocatore2.carte = memoria.mazzoIniziale.splice(0, 3);
    memoria.centro.carte = memoria.mazzoIniziale.splice(0, 1);
    memoria.mazzo.carte = memoria.mazzoIniziale;
}


function scambiaGiocatori() {
    let temp = memoria.giocatoreCorrente;
    memoria.giocatoreCorrente = memoria.ultimoGiocatore;
    memoria.ultimoGiocatore = temp;
}

function aggiornaImmagini() {
    for (let i = 0; i < 3; i++) {
        memoria.giocatoreCorrente.elemento.children[i].children[0].src = memoria.giocatoreCorrente.carte[i].src;
        memoria.ultimoGiocatore.elemento.children[i].children[0].src = "immagini/carte napoletane/retro.jpg";
    }
    document.getElementById("centro").src = memoria.centro.carte[memoria.centro.carte.length - 1].src;
}

function aggiornaPunteggi() {
    memoria.giocatore1.punteggio = calcolaPunteggioGiocatore(memoria.giocatore1.carte);
    memoria.giocatore2.punteggio = calcolaPunteggioGiocatore(memoria.giocatore2.carte);
    document.getElementById("giocatore1_punteggio").style.visibility = "hidden";
    document.getElementById("giocatore2_punteggio").style.visibility = "hidden";
    if (memoria.giocatoreCorrente == memoria.giocatore1) {
        document.getElementById("giocatore1_punteggio").innerText = "Punteggio: " + memoria.giocatore1.punteggio;
        document.getElementById("giocatore1_punteggio").style.visibility = "visible";
    } else {
        document.getElementById("giocatore2_punteggio").innerText = "Punteggio: " + memoria.giocatore2.punteggio;
        document.getElementById("giocatore2_punteggio").style.visibility = "visible";
    }
    if (memoria.giocatore1.punteggio == 31 || memoria.giocatore2.punteggio == 31) {
        memoria.finito == true;
        finisciGioco();
    }
}

function aggiornaElementi() {
    memoria.ultimoGiocatore.elemento.parentElement.style.pointerEvents = "none";
    memoria.giocatoreCorrente.elemento.parentElement.style.pointerEvents = null;
    for (let i = 0; i < 3; i++) {
        memoria.ultimoGiocatore.elemento.children[i].style.backgroundColor = null;
    }
    document.getElementById("numeroMazzo").innerText = memoria.mazzo.carte.length;
}

function aggiornaMemoria() {
    if (!memoria.finito) {
        scambiaGiocatori();
        aggiornaPunteggi();
        aggiornaElementi();
        aggiornaImmagini();
        memoria.giocatore1.seleziona = null;
        memoria.giocatore2.seleziona = null;
    }

    if (memoria.giocatoreCorrente.bussa || memoria.finito) {
        finisciGioco();
    }
}

function resettaBordi() {
    for (let i = 0; i < 3; i++) {
        let bottoneGiocatore1 = memoria.giocatore1.elemento.children[i];
        bottoneGiocatore1.style.border = "5px solid #000";
    }
    for (let i = 0; i < 3; i++) {
        let bottoneGiocatore2 = memoria.giocatore2.elemento.children[i];
        bottoneGiocatore2.style.border = "5px solid #000";
    }
}

function selezionaCarta(indice) {
    resettaBordi();
    memoria.giocatoreCorrente.seleziona = indice;
    let elemento = memoria.giocatoreCorrente.elemento.children[indice];
    elemento.style.border = "5px solid green";
}

function rimischiaMazzo() {
    let ultimoCentroCarta = memoria.centro.carte[0];
    memoria.centro.carte.shift();
    let centroCarte = memoria.centro.carte;
    memoria.centro.carte = [ultimoCentroCarta];
    let nuovoMazzo = new Mazzo(centroCarte);
    memoria.mazzo.carte = nuovoMazzo.mischia();
}

function scambiaConCentro() {
    if (memoria.giocatoreCorrente.seleziona == null) {
        return;
    }
    let cartaGiocatore = memoria.giocatoreCorrente.carte[memoria.giocatoreCorrente.seleziona];
    let cartaCentro = memoria.centro.carte[memoria.centro.carte.length - 1];
    let temp = {
        src: cartaCentro.src,
        seme: cartaCentro.seme,
        valore: cartaCentro.valore
    }
    cartaCentro.src = cartaGiocatore.src;
    cartaCentro.seme = cartaGiocatore.seme;
    cartaCentro.valore = cartaGiocatore.valore;
    cartaGiocatore.src = temp.src;
    cartaGiocatore.seme = temp.seme;
    cartaGiocatore.valore = temp.valore;
    aggiornaMemoria();
}

function scambiaConMazzo() {
    if (memoria.giocatoreCorrente.seleziona == null) {
        return;
    }
    if (memoria.mazzo.carte.length == 0) {
        rimischiaMazzo();
    }
    let cartaGiocatore = memoria.giocatoreCorrente.carte[memoria.giocatoreCorrente.seleziona];
    memoria.giocatoreCorrente.carte[memoria.giocatoreCorrente.seleziona] = memoria.mazzo.carte.pop();
    memoria.centro.carte.push(cartaGiocatore);
    aggiornaMemoria();
}

function bussa() {
    memoria.giocatoreCorrente.bussa = true;
    aggiornaMemoria();
}

function inizializza() {
    document.getElementById("vittoria").style.display = "none";
    document.getElementById("nuovaPartita").style.display = "none";
    memoria.finito = false;
    memoria.giocatore1.bussa = false;
    memoria.giocatore2.bussa = false;
    memoria.mazzoIniziale = new Mazzo().mischia();
    memoria.giocatoreCorrente = memoria.giocatore1;
    memoria.ultimoGiocatore = memoria.giocatore2;
    memoria.giocatore1.elemento.parentElement.style.pointerEvents = null;
    distribuisciCarte();
    document.getElementById("numeroMazzo").innerText = memoria.mazzo.carte.length;
    aggiornaImmagini();
    aggiornaPunteggi();
}

let memoria = {
    finito: false,
    giocatoreCorrente: null,
    ultimoGiocatore: null,
    giocatore1: {
        carte: [],
        seleziona: null,
        elemento: document.getElementById("giocatore1_carte"),
        bussa: false,
        punteggio: 0
    },
    giocatore2: {
        carte: [],
        seleziona: null,
        elemento: document.getElementById("giocatore2_carte"),
        bussa: false,
        punteggio: 0
    },
    centro: {
        carte: [],
        elemento: document.getElementById("centro"),
    },
    mazzo: {
        carte: [],
        elemento: document.getElementById("mazzo"),
    },
    mazzoIniziale: []
}