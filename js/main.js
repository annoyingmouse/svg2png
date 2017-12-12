'use strict';

//svg4everybody();
var getInternetExplorerVersion = function getInternetExplorerVersion() {
    var rv = -1;
    var ua = navigator.userAgent;
    if (navigator.appName === 'Microsoft Internet Explorer') {
        if (new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})").exec(ua) !== null) {
            rv = parseFloat(RegExp.$1);
        }
    } else if (navigator.appName === 'Netscape') {
        if (new RegExp("Trident/.*rv:([0-9]{1,}[\.0-9]{0,})").exec(ua) != null) {
            rv = parseFloat(RegExp.$1);
        }
    }
    return rv;
};
if (getInternetExplorerVersion() === 11) {
    // Get all the SVG tags
    var svgs = document.getElementsByTagName("svg");
    for (var i = 0; i < svgs.length; i++) {
        // Check to see if the SVG tag has a USE tag (indicating an external asset).
        var external = svgs[i].getElementsByTagName("use");
        if (external.length) {
            (function () {
                // Truthy/Falsy
                var href = external[0].getAttribute("xlink:href");
                var hrefParts = href.split("#");
                var xhttp = new XMLHttpRequest();
                xhttp.onreadystatechange = function () {
                    if (this.readyState === 4 && this.status === 200) {
                        var xmlString = this.responseText;
                        var parser = new DOMParser();
                        var svgDoc = parser.parseFromString(xmlString, "text/xml");
                        var glyph = hrefParts.length > 1 ? svgDoc.getElementById(hrefParts[1]) : svgDoc;
                        console.log(glyph);
                    }
                };
                xhttp.open("GET", hrefParts[0], true);
                xhttp.send();
            })();
        }
    }
}