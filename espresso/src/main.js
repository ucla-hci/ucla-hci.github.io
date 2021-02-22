// 
// the main file
// 
var ESPRESSO = ESPRESSO || {}

//
// jquery document ready function
//
$(document).ready(() => {
    // testing sandbox functions
    ESPRESSO.sandbox()

    // reading from cookie
    ESPRESSO.load()

    // load an existing essay or create a new essay
    if (ESPRESSO.entries.length > 0) {
        ESPRESSO.entryCurrent = ESPRESSO.entries[ESPRESSO.entries.length - 1]
        // $('li:first-child').children('a.entry').children('span').click()
        // log(v=$('li:last-child').children('span'))
        ESPRESSO.showEssay(ESPRESSO.entryCurrent.id)
    } else {
        ESPRESSO.createEmptyEssay()
    }

    // event handlers for the essay body of text
    $("#pWriting")[0].contentEditable = true
    $("#pWriting").click(ESPRESSO.onMouseClick)
    $("#pWriting").keyup(ESPRESSO.onKeyUp)

    // event handlers for other control buttons
    $('#btnNew').click(() => { ESPRESSO.createEmptyEssay() })
    $('#aMenu').click(() => { ESPRESSO.toggleSidebar() })

    // autosave every few seconds
    ESPRESSO.autoSave(ESPRESSO.AUTOSAVEINTERVAL)

    // load model data
    ESPRESSO.loadModel()
})

//
// event handler for clicking the essay text
//
ESPRESSO.onMouseClick = (e) => {
    // initialize an entry
    if (ESPRESSO.entryCurrent == undefined) {
        ESPRESSO.resetWritingArea("")
        ESPRESSO.prevWritingHtml = ""
        ESPRESSO.entryCurrent = {
            id: Date.now(),
            timestamp: ESPRESSO.strDate(new Date()),
            strHtml: "",
        }
        ESPRESSO.entries.push(ESPRESSO.entryCurrent)
        ESPRESSO.updateList()
        ESPRESSO.showEssay(ESPRESSO.entryCurrent.id)
        return
    }

    // remove the previously focused sentence
    $("#pWriting").removeClass('focused')


    ESPRESSO.isIdling = false
    ESPRESSO.tsLastInput = Date.now()
    if (!ESPRESSO.clickedOnFocusedSentence) {
        ESPRESSO.monitorIdling(500)
    }
    ESPRESSO.clickedOnFocusedSentence = false

}

//
// event handler for clicking the focused sentence
//
ESPRESSO.onMouseClickFocusedSentence = (e) => {
    clearTimeout(ESPRESSO.toIdling)
    ESPRESSO.clickedOnFocusedSentence = true
    setTimeout(() => {
        ESPRESSO.showNonTextElements()
    }, ESPRESSO.IDLINGTIMEOUT);
}

//
// hide non-textual widgets when typing
//
ESPRESSO.onKeyUp = (e) => {
    ESPRESSO.hideNonTextElements()
    clearTimeout(ESPRESSO.toIdling)
    ESPRESSO.isDirty = true
}

//
// update the list of essays (in the sidebar)
//
ESPRESSO.updateList = () => {
    $('#ulEntries').empty()
    for (let i = ESPRESSO.entries.length - 1; i >= 0; i--) {
        let entry = ESPRESSO.entries[i]
        $('#ulEntries').append(ESPRESSO.uiSidebarEntry(entry.id, entry.timestamp))
    }
}

//
//  create an empty essay
//
ESPRESSO.createEmptyEssay = () => {
    ESPRESSO.entryCurrent = undefined
    ESPRESSO.resetWritingArea()
}

//
//  toggle to show/hide sidebar
//
ESPRESSO.toggleSidebar = () => {
    if ($('td.sidebar').is(':visible')) {
        $('td.sidebar').hide('fast')
    } else {
        $('td.sidebar').show('fast')
    }
}

//
//  reset the writing area to that of an empty essay
//
ESPRESSO.resetWritingArea = (placeholder) => {
    // TODO: no hardcoded string
    $("#pWriting").html(placeholder == undefined ? "Start writing here." : placeholder)
    $('.focused').removeClass('focused')
}

//
//  show essay of a specific id
//
ESPRESSO.showEssay = (id) => {
    for (entry of ESPRESSO.entries) {
        if (entry.id == id) {
            ESPRESSO.resetWritingArea(entry.strHtml)
            ESPRESSO.entryCurrent = entry

            if (ESPRESSO.entrySelected != undefined) {
                ESPRESSO.entrySelected.removeClass('selected')
            }
            ESPRESSO.entrySelected = $('span#' + id)
            ESPRESSO.entrySelected.addClass('selected')

            return
        }
    }
}

//
//  saving the current essay into cookie
//
ESPRESSO.autoSave = (interval) => {
    if (ESPRESSO.isDirty) {
        ESPRESSO.entryCurrent.strHtml = ESPRESSO.deFocus($('#pWriting').html())
        ESPRESSO.save()
        ESPRESSO.isDirty = false
    }

    setTimeout(() => {
        ESPRESSO.autoSave(interval)
    }, interval);
}

//
//  delete an essay by id
//
ESPRESSO.deleteEssay = (id) => {
    for (let i = 0; i < ESPRESSO.entries.length; i++) {
        if (ESPRESSO.entries[i].id == id) {
            let idNext
            if (i + 1 < ESPRESSO.entries.length) {
                idNext = ESPRESSO.entries[i + 1].id
            } else if (i - 1 >= 0) {
                idNext = ESPRESSO.entries[i - 1].id
            }

            ESPRESSO.entries.splice(i, 1)
            ESPRESSO.updateList()
            ESPRESSO.save()

            if (idNext != undefined) {
                ESPRESSO.showEssay(idNext)
            } else {
                ESPRESSO.createEmptyEssay()
            }

            return
        }
    }
}

//
//  monitor whether a sentence is considered idling after being clicked for some time
//
ESPRESSO.monitorIdling = (interval) => {
    if (ESPRESSO.isIdling) {
        return
    }

    if (Date.now() - ESPRESSO.tsLastInput >= ESPRESSO.IDLINGTIMEOUT) {
        ESPRESSO.onIdling()
    }

    ESPRESSO.toIdling = setTimeout(() => {
        ESPRESSO.monitorIdling(interval)
    }, interval);

}

//
//  event handler when a clicked sentence is idling
//
ESPRESSO.onIdling = () => {
    ESPRESSO.isIdling = true

    let htmlCode = $("#pWriting").html().replaceAll("&nbsp;", " ")      // &nbsp; creates troubles

    // remove previous focus
    htmlCode = ESPRESSO.deFocus(htmlCode)

    // locate the focused sentence
    let sel = document.getSelection()
    let focusedText = sel.focusNode.nodeValue
    let idxFocused = sel.focusOffset

    // find the start of the focused sentence
    let idxStart = 0
    for (var i = idxFocused - 1; i >= 0; i--) {
        if (ESPRESSO.isTerminalSymbol(focusedText[i]) && focusedText[i + 1] == ' ') {
            idxStart = i + 1
            break
        }
    }
    // find the end of the focused sentence
    // the terminal symbol needs to be followed by an empty space or the end of the essay
    let idxEnd = -1
    for (var i = idxFocused; i < focusedText.length; i++) {
        if (ESPRESSO.isTerminalSymbol(focusedText[i]) && ESPRESSO.isWhatProceedsTerminalSymbol(focusedText[i + 1])) {
            idxEnd = i + 1
            break
        }
    }

    logz(idxStart, idxEnd)
    if (idxStart <= idxEnd) {
        let focusedSentence = focusedText.slice(idxStart, idxEnd)
        let results = ESPRESSO.analyze(focusedSentence)
        let formattedSentence = ESPRESSO.focus(focusedSentence, results)

        // replace it in the html code of writing area
        let focusedTextNew = focusedText.slice(0, Math.max(0, idxStart)) + formattedSentence + focusedText.slice(Math.min(idxEnd, focusedText.length))

        let htmlCodeNew = htmlCode.replace(char2code(focusedText), focusedTextNew)
        $("#pWriting").html(htmlCodeNew)

        $("#pWriting").addClass('focused')
        $("#pWriting").ready(() => {
            ESPRESSO.addInputToFocusedSentence()
        })
    }
}