// 
// custom ui elements
// 
var ESPRESSO = ESPRESSO || {}

//
//  create sidebar
//
ESPRESSO.uiSidebarEntry = (id, strTimestamp) => {
    let liEntry = $('<li>')
    liEntry.addClass('entry')

    // the entry's date time
    let aEntry = $('<a>')
    aEntry.addClass('entry')
    aEntry.attr('href', 'javascript:void(0)')
    let spanEntry = $('<span>')
    spanEntry.addClass('entry')
    spanEntry.attr('id', id)
    spanEntry.html(strTimestamp)
    spanEntry.click(() => {
        ESPRESSO.showEssay(id)
    })
    aEntry.append(spanEntry)
    liEntry.append(aEntry)

    // the delete button
    let aDel = $('<a>')
    aDel.addClass('delete')
    aDel.attr('href', 'javascript:void(0)')
    let spanDel = $('<span>')
    spanDel.html('&#10005;')
    spanDel.click(() => {
        if (confirm('Are you sure to delete this essay?')) {
            ESPRESSO.deleteEssay(id)
        }
    })
    aDel.append(spanDel)
    liEntry.append(aDel)

    return liEntry
}

//
//  return the string with the formatted date
//
ESPRESSO.strDate = (ts) => {
    return _fillZeros(ts.getMonth() + 1, 10) + '/' + _fillZeros(ts.getDate(), 10) + '/' 
    + ts.getFullYear() + ' ' + _fillZeros(ts.getHours(), 10) + ':' + _fillZeros(ts.getMinutes(), 10)
}


//
//  reformat the sentence in focus
//
ESPRESSO.focus = (strSentence, results) => {
    let spanVisualized = $('<span>')
    spanVisualized.addClass('focused')

    let htmlSentence = ""

    // add tag to each word
    // let strWords = strSentence.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '')
    let words = strSentence.split(' ')
    for (let i = 0; i < words.length; i++) {
        let w = words[i] //.replace(/[^\w]/g, '')

        let spanWord = $('<span>')
        spanWord.addClass('word')
        spanWord.html(w)

        htmlSentence += spanWord[0].outerHTML
        // htmlSentence += (i == words.length - 1) ? words[i].slice(-1) : ' '
        htmlSentence += (i == words.length - 1) ? '' : ' '
    }

    htmlSentence = _addNotification(htmlSentence, strSentence, results)

    spanVisualized.html(htmlSentence)

    return spanVisualized[0].outerHTML
}

//
//  remove html's span elements (created for the focused sentence)
//
ESPRESSO.deFocus = (htmlCode) => {
    let classes = ['focused', 'word', 'notification', 'hlword']

    for (cls of classes) {
        $('span.' + cls).each(function (i) {
            htmlCode = htmlCode.replace($(this)[0].outerHTML, $(this).html())
        })
    }

    return htmlCode
}

//
//  highlight the positive and negative words in the focused sentence
//
ESPRESSO.highlightWords = (posWords, negWords) => {
    for (w of posWords) {
        $("span.word").filter(function () {
            let spanWord = $(this).html().replace(/[^\w]/g, '')
            // let timeOut
            if (spanWord.toLowerCase() === w) {
                $(this).addClass('positive')
            }
            $(this).hover(function (e) {
                // log($(e.target).html())
                // clearTimeout(timeOut)
            })
        })
    }

    for (w of negWords) {
        $("span.word").filter(function () {
            let spanWord = $(this).html().replace(/[^\w]/g, '')
            if (spanWord.toLowerCase() === w) {
                $(this).addClass('negative')
            }
            $(this).hover(function (e) {
                // log($(e.target).html())
            })
        })
    }

}

//
//  add a notification to a sentence to indicate the analysis results
//      - html: the html code of the sentence
//      - str: the sentence as string
//      - results: the analysis results
//
let _addNotification = (html, str, results) => {
    // create the notification element
    let spanNotification = $('<span>')
    spanNotification.addClass('notification')
    spanNotification.attr('str', str)

    // calculate the total score from the analysis results
    let scoreTotal = 0
    let posWords = []
    let negWords = []
    for (r of results) {
        scoreTotal += r.score
        if (r.score > 0) {
            posWords.push(r.word)
        } else if (r.score < 0) {
            negWords.push(r.word)
        }
    }
    // log(scoreTotal)

    // assign color
    let color = ESPRESSO.GREY
    if (scoreTotal < 0) {
        color = ESPRESSO.RED
    } else if (scoreTotal > 0) {
        color = ESPRESSO.GREEN
    }

    spanNotification.css('background-color', color)
    spanNotification.attr('posWords', posWords.toString())
    spanNotification.attr('negWords', negWords.toString())

    return html + spanNotification[0].outerHTML
}

//
//  add event handlers to the focused sentence to make it interactive
//
ESPRESSO.addInputToFocusedSentence = (elm) => {
    // event handler for clicking a word in the focused sentence
    $('span.word').click(function (e) {
        ESPRESSO.onMouseClickFocusedSentence(e)
    })

    // event handler for clicking the notification
    $('span.notification').click(function (e) {
        let elm = $(e.target)
        let posWords = elm.attr('posWords').split(',')
        let negWords = elm.attr('negWords').split(',')
        ESPRESSO.highlightWords(posWords, negWords)
        _fadeOut(elm)
    })
}

//
// fade in and show an element
//
let _fadeIn = (elm) => {
    elm.fadeIn('slow', function () {
        elm.show()
    })
}

//
// fade out and hide an element
//
let _fadeOut = (elm) => {
    elm.fadeOut('slow', function () {
        elm.hide()
    })
}

//
// hide widgets and visualizations alongside a sentence
//
ESPRESSO.hideNonTextElements = () => {
    _fadeOut($('span.notification'))
    setTimeout(() => {
        $("span.word").removeClass('positive')
        $("span.word").removeClass('negative')
    }, ESPRESSO.TIMEOUTHIGHLIGHTSDISAPPEAR);

}

//
// show widgets and visualizations alongside a sentence
//
ESPRESSO.showNonTextElements = () => {
    _fadeIn($('span.notification'))
}

//
//
//
let _fillZeros = (x, n) => {
    let strX = ""
    let numZeros = n.toString().length - x.toString().length
    for (let i = 0; i < numZeros; i++) {
        strX += '0'
    }
    return strX + x
}