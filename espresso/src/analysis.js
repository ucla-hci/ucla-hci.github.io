// 
// text processing and nlp analysis
// 
var ESPRESSO = ESPRESSO || {}

//
ESPRESSO.SPACECODE = 32
ESPRESSO.BACKSPACECODE = 8
ESPRESSO.ENTERCODE = 13
ESPRESSO.TERMINALSYMBOLS = ['.', '?', '!']
ESPRESSO.AFTERTERMINALSYMBOLS = [' ', '"', undefined]
// ESPRESSO.TERMINALSYMBOLCODES = [190, 191, 49]

//
ESPRESSO.LABELS = {}
ESPRESSO.LABELS.SENTIMENTPOSITIVE = 0.1
ESPRESSO.LABELS.SENTIMENTNEGATIVE = 0.2

//
//  detect whether a character is a terminal symbol
//
ESPRESSO.isTerminalSymbol = (c) => {
    for (symbol of ESPRESSO.TERMINALSYMBOLS) {
        if (symbol == c) {
            return true
        }
    }
    return false
}

//
//  detect whether a character often proceeds after a terminal symbol
//  e.g., space, quotation mark, or end of the paragraph
//
ESPRESSO.isWhatProceedsTerminalSymbol = (c) => {
    for (symbol of ESPRESSO.AFTERTERMINALSYMBOLS) {
        if (symbol == c) {
            return true
        }
    }
}

//
//  load model necessary for analysis
//
ESPRESSO.loadModel = () => {
    loadJSON('data/AFINN.json', function (obj) {
        ESPRESSO.afinn = obj
    })
}

//
//  analyze a sentence as a string
//
ESPRESSO.analyze = (str) => {
    if(ESPRESSO.afinn != undefined) {
        return _sentimentAnalysis(str, ESPRESSO.afinn)
    }
}


// ----------------------------------------------------------------------------------
// specific analysis below
// ----------------------------------------------------------------------------------

//
//  perform sentiment analysis
//
let _sentimentAnalysis = (str, afinn) => {
    // tokenize
    let words = str.toLowerCase().split(' ')
    let results = []
    
    // clean up and add up score
    for(w of words) {
        w = w.replace(/[^\w]/g, '')
        let score = w in afinn ? afinn[w] : 0
        results.push({word: w, score: parseInt(score)})
    }

    return results
}