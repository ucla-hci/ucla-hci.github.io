var UCLAHCI = UCLAHCI || {};

//
//	check mobile platform
//
window.mobilecheck = function () {
    var check = false;
    (function (a) {
        if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true
    })(navigator.userAgent || navigator.vendor || window.opera)
    return check
};

//
//	check whether need to be responsive
//
UCLAHCI.checkResponsiveness = function () {
    if ($(window).width() < 1080 || window.mobilecheck() == true) {
        UCLAHCI.isMobile = true;
        $('body').css('margin-left', '5%');
        $('body').css('margin-right', '5%');
        $('.topnav a').css('float', 'none');
        $('.topnav a').css('display', 'block');
        $('.topnav a').css('text-align', 'right');
        $('.topnav a').css('padding-bottom', '0px');

    } else if ($(window).width() < 1150) {
        // $('.topnav a:hover').css('color', '#2d68c4');
    } else {
        // $('.topnav a:hover').css('color', '#2d68c4');
    }
}

$(document).ready(function () {
    YAML.load('config.yml', function (result) {
        UCLAHCI.config = result;

        UCLAHCI.checkResponsiveness();

        YAML.load('data.yml', function (data) {
            UCLAHCI.data = data;
            // console.log(UCLAHCI.data);

            UCLAHCI.updateUI();
            UCLAHCI.updateUrl(UCLAHCI.config.LANDINGPAGE);

            var page;
            var idxSharp = location.href.indexOf('#');
            if (idxSharp >= 0) page = location.href.substring(idxSharp + 1);
            var idxDot = page.indexOf('.');

            if (page != undefined) {
                UCLAHCI.page = page;
                UCLAHCI.updatePage();
                if (idxDot >= 0) {

                }
            }
        });
    });
});

function showHamMenu() {
    // var topnav = $('#topnav');
    // if(topnav.hasClass('topnav')) {
    //     topnav.removeClass('topnav');
    //     topnav.addClass('topnav responsive');
    // } else {
    //     topnav.removeClass('topnav responsive');
    //     topnav.addClass('topnav');
    // }
}

UCLAHCI.updatePage = function () {
    var page = UCLAHCI.page;
    $('#' + page).addClass('active');
    $('.content').empty();
    if (page == 'team') {
        $('.content').append(UCLAHCI.showTeam(UCLAHCI.data.team));
        $('.content').append($('<br/><br/><h2>Collaborators</h2>'))
        $('.content').append(UCLAHCI.showTeam(UCLAHCI.data.collaborators));
        $('.content').append($('<br/><br/><h2>Alumni</h2>'))
        $('.content').append(UCLAHCI.showTeam(UCLAHCI.data.alumni));

    } else if (page == 'projects') {
        for (project of UCLAHCI.data.projects) {
            var div = $('<div/>');
            div.addClass('project');
            var tb = $('<table/>');

            var trImg = $('<tr/>');
            var img = $('<img/>');
            img.attr('src', 'assets/' + project.img);
            img.addClass('project');
            img.attr('id', project.name);
            img.click(function (e) {
                var divPage = $('<div class="page"></div>');
                divPage.popup({
                    transition: 'all 0.3s',
                    onclose: function () {
                        UCLAHCI.updateUrl('');
                        $(document.body).css('overflow', 'scroll')
                    }
                });
                divPage.popup('show');
                var name = $(e.target).attr('id');
                divPage.append(UCLAHCI.makeProjectPage(name));
                $(document.body).css('overflow', 'hidden')
            });
            trImg.append(img);
            tb.append(trImg);

            var trName = $('<tr/>');
            var divName = $('<div/>');
            divName.addClass('info');
            divName.html('<b>' + project.name + '</b>');
            trName.append(divName);
            tb.append(trName);

            var trPubs = $('<tr/>');
            var divPubs = $('<div/>');
            divPubs.addClass('info');
            divPubs.html(project.pubs);
            trPubs.append(divPubs);
            tb.append(trPubs);

            div.append(tb);

            $('.content').append(div);
        }
    } else if (page == 'aboutus') {
        var tb = $('<table/>');
        // tb.attr('border', 1);
        var tr1 = $('<tr/>');
        // tr1.addClass('aboutus');

        var divMission = $('<div/>');
        divMission.addClass('mission');
        divMission.css('width', UCLAHCI.isMobile ? '80%' : '40%');
        divMission.append('<h2>Minion Statement</h2>');
        divMission.append('<p>' + UCLAHCI.data.aboutus[0].mission + '</p>');

        var divPhotos = $('<div/>');
        divPhotos.css('width', UCLAHCI.isMobile ? '80%' : '40%');
        divPhotos.css('float', UCLAHCI.isMobile ? 'none' : 'right');
        divPhotos.css('margin-right', UCLAHCI.isMobile ? 'auto' : '80px');
        divPhotos.addClass('photos');
        var divRow = $('<div/>');
        divRow.addClass('row');
        var numCols = 3;
        var numPhotosCol = 3;
        var photos = UCLAHCI.data.aboutus[0].photos;
        var cntrPhotos = 0;
        for (var i = 0; i < numCols; i++) {
            var divCol = $('<div/>');
            divCol.addClass('column');
            for (var j = 0; j < numPhotosCol && cntrPhotos < photos.length; j++) {
                var img = $('<img/>');
                img.addClass('photo');
                img.attr('src', 'assets/' + photos[cntrPhotos++]);
                divCol.append(img);
            }
            divRow.append(divCol);
        }
        divPhotos.append(divRow);

        tr1.append(divMission);
        tr1.append(divPhotos);

        var tr2 = $('<tr/>');

        var divInfo = $('<div/>');
        divInfo.addClass('sponsors');
        divInfo.css('width', UCLAHCI.isMobile ? '80%' : '40%');

        var contact = UCLAHCI.data.aboutus[0].contact;

        var pInfo = $('<p>' + contact.description + '</p>');
        pInfo.css('margin', '30px');
        divInfo.append(pInfo);

        var pAddr = $('<p>' + contact.address + '</p>');
        pAddr.css('margin', '30px');
        divInfo.append(pAddr);

        var pEmail = $('<p>' + contact.email + '</p>');
        pEmail.css('margin', '30px');
        divInfo.append(pEmail);

        divInfo.append('<br/>');

        var pSponsors = $('<p>We are generously supported by: </p>');
        pSponsors.css('margin', '30px');
        divInfo.append(pSponsors);
        var sponsors = UCLAHCI.data.aboutus[0].sponsors;
        for (sponsor of sponsors) {
            var a = $('<a/>');
            a.attr('href', sponsor.url);
            a.attr('target', '_blank');
            var img = $('<img/>');
            img.addClass('sponsor');
            img.attr('src', 'assets/' + sponsor.img);
            a.append(img);
            divInfo.append(a);
        }

        var divMap = $('<div/>');
        divMap.addClass('map');
        divMap.css('width', UCLAHCI.isMobile ? '80%' : '40%');
        divMap.css('float', UCLAHCI.isMobile ? 'none' : 'right');
        divMap.css('margin-right', UCLAHCI.isMobile ? 'auto' : '100px');
        var mapCode = UCLAHCI.data.aboutus[0].map;
        mapCode = mapCode.replace('width="500"', UCLAHCI.isMobile ? 'width="100%"' : 'width="500"')
        divMap.append(mapCode);

        tr2.append(divMap);
        tr2.append(divInfo);


        tb.append(tr1);
        tb.append('<tr><td><br/></td></tr>')
        tb.append(tr2);
        $('.content').append(tb);
    }
}

UCLAHCI.showTeam = function (team) {
    var divTeam = $('<div/>');
    for (member of team) {
        var div = $('<div/>');
        div.addClass('team');
        var tb = $('<table/>');

        var trImg = $('<tr/>');
        var img = $('<img/>');
        img.attr('src', 'assets/' + member.img);
        img.attr('img', member.img);
        img.attr('alt', member.imgalt);

        img.mouseenter(function (e) {
            $(e.target).attr('src', 'assets/' + $(e.target).attr('alt') || $img.attr('img'));
            // $(e.target).addClass('team');
        });

        img.mouseleave(function (e) {
            $(e.target).attr('src', 'assets/' + $(e.target).attr('img'));
        });

        img.addClass('team');
        img.attr('id', member.name);
        if (member.projects != undefined && member.projects.length > 0) {
            img.click(function (e) {
                var divPage = $('<div class="page"></div>');
                divPage.popup({
                    transition: 'all 0.3s',
                    onclose: function () {
                        UCLAHCI.updateUrl('');
                        $(document.body).css('overflow', 'scroll')
                    }
                });
                divPage.popup('show');
                var name = $(e.target).attr('id');
                divPage.append(UCLAHCI.makeMemberPage(name));
                $(document.body).css('overflow', 'hidden')
            });
        }
        trImg.append(img);
        tb.append(trImg);

        var trName = $('<tr/>');
        var divName = $('<div/>');
        divName.addClass('info');
        divName.html('<b>' + member.name + '</b>');
        trName.append(divName);
        tb.append(trName);

        var trRole = $('<tr/>');
        var divRole = $('<div/>');
        divRole.addClass('info');
        divRole.html(member.role + (member.expertise != undefined ? '<br>' + member.expertise : ''));
        trRole.append(divRole);
        tb.append(trRole);

        div.append(tb);

        divTeam.append(div);
    }
    return divTeam;
}

UCLAHCI.updateUI = function () {
    $('.topnav a').click(function (e) {
        $('.topnav a').removeClass('active');
        // $(e.target).addClass('active');
        UCLAHCI.page = $(e.target).attr('id');
        UCLAHCI.updatePage();
    });
}


//
//  create a unique part of the url from the title
//
UCLAHCI.createUrl = function (title) {
    if (title == undefined) return ''
    return title.replace(/[&\/\\#,+()$~%.'":*;?<>{}]/g, '')
        .replace(/ /g, '-').toLowerCase()
}

//
//  update window url with project name (that's been clicked)
//
UCLAHCI.updateUrl = function (name) {
    var idxSharp = location.href.indexOf('#')
    var urlNew = location.href
    if (idxSharp >= 0) urlNew = urlNew.substring(0, idxSharp)
    location.href = urlNew + '#' + UCLAHCI.createUrl(name)
}

UCLAHCI.makeMemberPage = function (name) {
    var member;
    for (m of UCLAHCI.data.team) {
        if (m.name == name) {
            member = m;
            break;
        }
    }

    var divPage = $('<div/>');
    divPage.append('<h2>' + member.name + '</h2>')
    // divPage.html(member.name);

    var divProfile = $('<div/>');
    divProfile.css('width', UCLAHCI.isMobile ? '80%' : '30%');
    divProfile.css('display', UCLAHCI.isMobile ? 'block' : 'inline-block');
    var img = $('<img/>');
    img.attr('src', 'assets/' + member.img);

    img.addClass('team');
    divProfile.append(img);

    divProfile.append('<div>' + member.role + '</div>');
    divProfile.append('<div>' + member.affliation + '</div>');
    divProfile.append('<div>' + member.email + '</div>');

    divPage.append(divProfile);

    var divInfo = $('<div/>');
    divInfo.css('width', UCLAHCI.isMobile ? '80%' : '70%');
    divInfo.css('float', UCLAHCI.isMobile ? 'auto' : 'right');
    divInfo.append('<p>' + member.bio + '</p>');

    if (member.projects != undefined && member.projects.length > 0) {
        divInfo.append('<br/>Projects:');

        var divProjImgs = $('<div/>');
        for (name of member.projects) {
            var img = $('<img/>');
            img.addClass('project-small');
            var project;
            for (p of UCLAHCI.data.projects) {
                if (p.name == name) {
                    project = p;
                    break;
                }
            }
            img.attr('src', 'assets/' + project.img);
            divProjImgs.append(img);
        }
        divInfo.append(divProjImgs);

    }

    divPage.append(divInfo);

    return divPage;
}

UCLAHCI.makeProjectPage = function (name) {
    var project;
    for (p of UCLAHCI.data.projects) {
        if (p.name == name) {
            project = p;
            break;
        }
    }

    var divPage = $('<div/>');
    divPage.append('<h2>' + project.title + '</h2>');

    if (project.authors != undefined) {
        var divAuthors = $('<div/>');
        divAuthors.addClass('authors');
        for (author of project.authors) {
            divAuthors.append(author + '<br/>');
        }
        divPage.append(divAuthors);
    }

    var pAbstract = $('<p>' + project.abstract + '</p><br/>');
    divPage.append(pAbstract);

    var widthMedia = window.innerWidth * 0.6;
    var heightMedia = widthMedia * 315 / 560;
    project.videoSite = project.videoSite | 'youtube';
    var codeVideo = UCLAHCI.getVideoEmbedCode(project.videoSite, project.video, widthMedia, heightMedia);
    var divVideo = $('<div/>');
    divVideo.html(codeVideo);
    divPage.append(divVideo);

    divPage.append('<br/>');

    if (project.album != undefined) {
        var codeOnLoad = ''
        var divPhotos = $('<iframe id="ifPhotos" onload="' + codeOnLoad +
            '" style="position: relative; top: 0; left: 0; text-align: left; width: 100%; height: ' +
            heightMedia * 1.2 + 'px;" src="https://flickrembed.com/cms_embed.php?source=flickr&layout=responsive&input=' + project.album + '&sort=0&by=album&theme=default_notextpanel&scale=fit&limit=100&skin0&skin=alexis&autoplay=false" scrolling="no" frameborder="0" allowFullScreen="true" webkitallowfullscreen="true" mozallowfullscreen="true"></iframe>')

        divPage.append(divPhotos)
    }

    //
    // pub & bib tex
    //

    if (project.citation != undefined && project.bibtex != undefined) {
        var divPubBib = $('<div class="divpubbib"></div>')

        var divPub = $('<div></div>');
        if (UCLAHCI.isMobile) {
            divPub.append($('<table style="table-layout:fixed;" class="tbpubinfo" width="100%" align="center" border="0" cellspacing="0" cellpadding="10px">' +
                '<tr><td><a href="' + project.paperUrl + '" target="_blank">' + '<img src="' + 'assets/' + project.thumbnail + '"/></a></td></tr>' +
                '<tr><td class="tdpubinfo">' + project.citation + '</td></tr>' +
                '<tr><td><div class="div-bib">' + project.bibtex + '</div></td></tr></table>'));
        } else {
            divPub.append($('<table class="tbpubinfo" width="100%" align="center" border="0" cellspacing="0" cellpadding="10px">' +
                '<tr><td><a href="' + project.paperUrl + '" target="_blank">' + '<img class="imgpaper" src="' + 'assets/' + project.thumbnail + '"/></a></td>' +
                '<td class="tdpubinfo">' + project.citation + '</td></tr>' +
                '<tr><td colspan=2><div class="div-bib">' + project.bibtex + '</div></td></tr></table>'));
        }

        divPubBib.append(divPub)
        divPage.append(divPubBib)
    }
    
    divPage.append($('<br>'));

    return divPage;
}

UCLAHCI.getVideoEmbedCode = function (type, vid, w, h, iframeId) {
    var srcCode = type == 'youtube' ? 'https://www.youtube.com/embed/' + vid + '?rel=0' :
        'https://player.vimeo.com/video/' + vid
    // console.info(iframeId)
    return '<iframe id="' + iframeId + '" src="' + srcCode + '" width="' + w + '" height="' + h + '" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>'
}