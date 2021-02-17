// if (e.which == ESPRESSO.SPACECODE || e.which == ESPRESSO.ENTERCODE) {
    // let writtenText = ESPRESSO.cleanUpWritingHtml($("#pWriting").html())
    // if (ESPRESSO.isTerminalSymbol(writtenText.slice(-2)[0]) || e.which == ESPRESSO.ENTERCODE) {
    // if (ESPRESSO.isTerminalSymbol(ESPRESSO.lastKeyCode)) {
    //     // savePosition()
    //     let htmlWriting = ESPRESSO.processWriting()

    //     // $("#pWriting").html(htmlWriting)
    //     // restorePosition()
    //     // setEndOfContenteditable($("#pWriting")[0])

    //     // log($("#pWriting").html())

    //     let sentence = ESPRESSO.entryCurrent.sentences.slice(-1)[0]
    //     let results = ESPRESSO.analyze(sentence)

    //     // log($(':focus'))
    //     ESPRESSO.visualize(sentence, results)


    // }

    // experiment


// function setEndOfContenteditable(contentEditableElement) {
//     var range, selection;
//     if (document.createRange)//Firefox, Chrome, Opera, Safari, IE 9+
//     {
//         range = document.createRange();//Create a range (a range is a like the selection but invisible)
//         range.selectNodeContents(contentEditableElement);//Select the entire contents of the element with the range
//         range.collapse(false);//collapse the range to the end point. false means collapse to end rather than the start
//         selection = window.getSelection();//get the selection object (allows you to change selection)
//         selection.removeAllRanges();//remove any selections already made
//         selection.addRange(range);//make the range you have just created the visible selection
//     }
//     else if (document.selection)//IE 8 and lower
//     {
//         range = document.body.createTextRange();//Create a range (a range is a like the selection but invisible)
//         range.moveToElementText(contentEditableElement);//Select the entire contents of the element with the range
//         range.collapse(false);//collapse the range to the end point. false means collapse to end rather than the start
//         range.select();//Select the range (make it the visible selection
//     }
// }

// var saved
// var sel
// function restorePosition() {
//     // if(saved[0] == "pWriting") {
//     //     setEndOfContenteditable($("#pWriting")[0])
//     //     return
//     // }

//     try {
//         let elm = $('#' + saved.id)
//         elm.focus()
//         // let sel = document.getSelection();
//         // log(saved)
//         // sel.extend(saved[0], saved[1]);
//         // log(elm)

//         sel.collapse(elm[0].childNodes[0], saved.offset);
//         // log(sel)
//     } catch (error) {
//         console.error(error)

//         setEndOfContenteditable($("#pWriting")[0])
//         // sel.collapse(saved.node, saved.offset);
//     }

// }

// function savePosition(elm) {
//     sel = document.getSelection();
//     // saved = [$(sel.focusNode.parentElement).attr('id'), sel.focusOffset];
//     // if(sel.focusNode.parentElement == null) {
//     //     sel.focusNode = $('#pWriting')[0]
//     // }
//     saved = {
//         id: $(sel.focusNode.parentElement).attr('id'),
//         node: sel.focusNode,
//         offset: sel.focusOffset
//     }
//     // log(saved)
//     // log(sel)
//     // log($(sel.focusNode.parentElement).attr('id'))
// }


//
//
//
ESPRESSO.formatEssay = (writingArea, sentences) => {
    let html = writingArea.html()
    // log('before', html)
    let wrappedSentences = ESPRESSO.wrapSentences(sentences)
    for (let i = 0; i < wrappedSentences.length; i++) {
        let s = sentences[i]
        while (s[0] == ' ') {
            s = s.substring(1)
        }
        let t = wrappedSentences[i]
        if (html.search(t) < 0) {
            html = html.replace(s, t)
        }
    }

    html = html.replaceAll('<span><span>', '<span>')
    html = html.replaceAll('</span></span>', '</span>')

    // let spans = writingArea.children('span')
    // let lastSpan
    // for(s of sentences) {
    //     let needsToInsert = true
    //     for(span of spans) {
    //         if(span.innerHTML.search(s) >= 0) {
    //             needsToInsert = false
    //             lastSpan = span
    //             break
    //         }
    //     }

    //     if(needsToInsert) {
    //         let spanNew = $('<span>')
    //         spanNew.html(s)
    //         if(lastSpan != undefined) {
    //             spanNew.insertAfter(lastSpan)
    //             lastSpan = undefined
    //         } else {
    //             let htmlCode = writingArea.html().replace(s, '<span>'+s+'</span>')
    //             writingArea.html(htmlCode)
    //             // writingArea.append($('<span>'))
    //             setEndOfContenteditable(writingArea[0])
    //         }
    //     }
    // }

    // logz('after', html)
    return html;
}

//
//
//
ESPRESSO.processWriting = () => {
    if (ESPRESSO.entryCurrent == undefined) {
        return
    }

    let htmlWriting = $("#pWriting").html()
    // logz('html', htmlWriting)
    let writtenText = ESPRESSO.cleanUpWritingHtml(htmlWriting)
    ESPRESSO.entryCurrent.strHtml = undefined
    if (writtenText.length > 0) {
        let sentences = ESPRESSO.breakSentences(writtenText)
        if (sentences != null && sentences.length > 0) {
            // htmlWriting = ESPRESSO.formatEssay($("#pWriting"), sentences)
            ESPRESSO.entryCurrent.sentences = sentences
            ESPRESSO.entryCurrent.strHtml = htmlWriting
        }
    }

    if (ESPRESSO.entryCurrent.strHtml == undefined) {
        ESPRESSO.entryCurrent.strHtml = $("#pWriting").html()
    }

    return htmlWriting
}

// if ($('span.' + cls)[0] != undefined) {
        //     htmlCode = htmlCode.replace($('span.' + cls)[0].outerHTML, $('span.' + cls).html())
        // }

 // // the visualized sentence
    // if ($('span.focused')[0] != undefined) {
    //     htmlCode = htmlCode.replace($('span.focused')[0].outerHTML, $('span.focused').html())
    // }

    // // // highlighted words
    // // if ($('span.hlword')[0] != undefined) {
    // //     htmlCode = htmlCode.replaceAll($('span.hlword')[0].outerHTML, $('span.hlword').html())
    // // }

    // // the notification
    // if ($('span.notification')[0] != undefined) {
    //     htmlCode = htmlCode.replace($('span.notification')[0].outerHTML, $('span.notification').html())
    // }


     // htmlSentence = htmlSentence.replaceAll(spanWord[0].outerHTML, w)
        // htmlSentence = htmlSentence.replaceAll(w, spanWord[0].outerHTML)
        // log(htmlSentence)

         // if(w.length <= 0) {
        //     continue
        // }

 // spanNotification.click(function(e){
    //     _highlightWord('become')
    //     e.stopPropagation()
    // })


// let _visualizeSentiment = (strSentence, result) => {

// }

//
//
//
// let _highlightWord = (word) => {
//     // let spanHighlighted = $('<span>')
//     // // spanHighlighted.addClass('focused')
//     // spanHighlighted.addClass('hlword')
//     // spanHighlighted.html(word)
//     // return str.replaceAll(word, spanHighlighted[0].outerHTML)

//     $('span.word').filter(function () {
//         return $(this).html() === word
//     }).addClass('hlword')
// }

 // recover cursor position
        // if ($('span.focused')[0] != undefined) {
        //     setCaretContentEditable($('span.focused')[0], idxFocused - idxStart)
        // }


//
//
//
let setCaretContentEditable = (elm, idx) => {
    let range = document.createRange()
    let sel = window.getSelection()
    range.setStart(elm.childNodes[0], idx)
    range.collapse(true)
    sel.removeAllRanges()
    sel.addRange(range)
    elm.focus()
}

//
//
//
ESPRESSO.createEmptyAnalysisResults = () => {
    return {
        sentiment: []
    }
}


//
//
//
ESPRESSO.cleanUpWritingHtml = (str) => {
    // log("[before clean-up] " + str)
    let cleanList = [
        ["&nbsp;", " "]
    ]

    let strClean = str
    for (pair of cleanList) {
        strClean = strClean.replaceAll(pair[0], pair[1])
    }

    return strClean.replace(/(<([^>]+)>)/ig, '');
}

//
//
//
ESPRESSO.wrapSentences = (sentences) => {
    let wrappedSentences = []
    let idx = 0
    for (s of sentences) {
        while (s[0] == ' ') {
            s = s.substring(1)
        }
        wrappedSentences.push("<span>" + s + "</span>")
    }

    // return str.replace("\n", "<br>")
    return wrappedSentences
}


// //
// //  analyze a sentence
// //  - return: [{bow: [], label: string, value: float}]
// //
// ESPRESSO.analyze = (sentence) => {
//     let results = ESPRESSO.createEmptyAnalysisResults()
//     let words = sentence.match(/\b(\w+)\b/g)
//     results.sentiment.push({ bow: [words[words.length / 2]], label: ESPRESSO.LABELS.SENTIMENTPOSITIVE, value: undefined })
//     return results
// }


// //
// //
// //
// ESPRESSO.getLastSentence = (str) => {
//     let idx = -1
//     for (symbol of ESPRESSO.TERMINALSYMBOLS) {
//         idx = Math.max(idx, str.lastIndexOf(symbol))
//     }

//     // handle !! ?! ...
//     while (ESPRESSO.isTerminalSymbol(str[idx])) {
//         idx -= 1
//     }
//     let str2 = str.slice(0, idx)

//     let idx2 = -1
//     for (symbol of ESPRESSO.TERMINALSYMBOLS) {
//         idx2 = Math.max(idx2, str2.lastIndexOf(symbol))
//     }

//     // remove leading space
//     while (str[idx2 + 1] == ' ') {
//         idx2 += 1
//     }

//     return str.slice(idx2 + 1, str.length - 1)
// }