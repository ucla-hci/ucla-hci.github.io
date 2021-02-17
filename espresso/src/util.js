//
//  a collection of utility functions
//
var ESPRESSO = ESPRESSO || {}

//
//  log message
//
let log = (x) => {
    console.log(x)
}

//
//  log a continuous list of messages
//
let logz = (...lsInfo) => {
    let str = ""
    for (info of lsInfo) {
        str += info + ' '
    }
    console.log(str)
}

//
//  unit-testing code
//
ESPRESSO.sandbox = () => {
//    log(_fillZeros(11, 10))
}

//
//  load json file
//
let loadJSON = (path, process) => {
    var xmlhttp = new XMLHttpRequest()
    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var obj = JSON.parse(this.responseText);
            process(obj)
        }
    }
    xmlhttp.open("GET", path, true)
    xmlhttp.send()
}

//
//
//
let char2code = (str) => {
    let strNew = str
    for(pair of ESPRESSO.SPECIALCHARACTERS) {
        strNew = strNew.replaceAll(pair.character, pair.code)
    }
    return strNew
}

//
//
//
let code2char = (str) => {
    let strNew = str
    for(pair of ESPRESSO.SPECIALCHARACTERS) {
        strNew = strNew.replaceAll(pair.code, pair.character)
    }
    return strNew
}