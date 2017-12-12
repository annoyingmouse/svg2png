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
                        // console.log(svgDoc);
                        var glyph = svgDoc.getElementById(hrefParts[1]);
                        // console.log(glyph);
                        var XMLS = new XMLSerializer();
                        var svgStr = XMLS.serializeToString(glyph);
                        // console.log(svgStr);
                        var svgBlob = new Blob([svgStr]);
                        // console.log(svgBlob);
                        var domURL = self.URL; // || self.webkitURL || self;
                        var url = domURL.createObjectURL(svgBlob);
                        // console.log(url);
                        var img = new Image();
                        img.onload = function () {};
                    }
                };
                xhttp.open("GET", hrefParts[0], true);
                xhttp.send();
            })();
        }
    }
}

var XMLtoString = function XMLtoString(elem) {
    var serialized = null;
    try {
        // XMLSerializer exists in current Mozilla browsers
        var serializer = new XMLSerializer();
        serialized = serializer.serializeToString(elem);
    } catch (e) {
        // Internet Explorer has a different approach to serializing XML
        serialized = elem.xml;
    }
    return serialized;
};