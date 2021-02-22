// 
// data structures
// 
var ESPRESSO = ESPRESSO || {}



ESPRESSO.entries = []
ESPRESSO.entryCurrent = undefined
// {
//     timestamp: undefined,
//     sentences: []
// }
ESPRESSO.idxLastTerminal = -1
ESPRESSO.sentence = ""
ESPRESSO.prevWritingHtml = ""

//
//  save essays
//
ESPRESSO.save = () => {
  for (entry of ESPRESSO.entries) {
    entry.strHtml = code2char(entry.strHtml)
    entry.strHtml= entry.strHtml.replaceAll(';', '\t')
  }
  document.cookie = 'data=' + JSON.stringify({ entries: ESPRESSO.entries })
}

//
//  load cookie data into essay data structure
//
ESPRESSO.load = () => {
  try {
    let entriesData = getCookie('data')
    console.log(entriesData)
    ESPRESSO.entries = JSON.parse(entriesData).entries
    for (entry of ESPRESSO.entries) {
      entry.strHtml = char2code(entry.strHtml)
      entry.strHtml= entry.strHtml.replaceAll('\t', ';')
    }
    ESPRESSO.updateList()
  } catch (error) {
    console.log(document.cookie)
    console.error('Reading stored entries error!')
  }
}

// 
// https://www.w3schools.com/js/js_cookies.asp
// 
function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}