'use strict';

/*
 * https://community.spiceworks.com/topic/411506-detecting-ie11
 * Not pretty, but it works
 */
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
// If we're looking at IE11
if (getInternetExplorerVersion() === 11) {
    // Get all the SVG tags
    var svgs = document.getElementsByTagName("svg");

    var _loop = function _loop(i) {
        // Get a reference to the initial SVG element
        var svgElement = svgs[i];
        // Check to see if the SVG tag has a USE tag (indicating an external asset).
        var external = svgs[i].getElementsByTagName("use");
        // Get dimensions of the SVG
        var height = parseInt(svgs[i].getAttribute("height"), 10);
        var width = parseInt(svgs[i].getAttribute("width"), 10);
        if (external.length) {
            // Truthy/Falsy
            // Get the link to the external SVG from the first USE tag (we only have the one, right?)
            var href = external[0].getAttribute("xlink:href");
            // Split it on the hash symbol
            var hrefParts = href.split("#");
            // Do the ajax shimmy
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function () {
                // If we're sorted
                if (this.readyState === 4 && this.status === 200) {
                    // Get the XML string
                    var xmlString = this.responseText;
                    // Create a parse
                    var parser = new DOMParser();
                    // Parse the XML string as XML
                    var svgDoc = parser.parseFromString(xmlString, "text/xml");
                    // Get the specific SVG from the parsed SVG
                    var glyph = svgDoc.getElementById(hrefParts[1]);
                    // Create an SVG serializer
                    var XMLS = new XMLSerializer();
                    // Convert the SVG XML into a string
                    var svgStr = XMLS.serializeToString(glyph);
                    // Create a Blob from the string
                    var svgBlob = new Blob([svgStr], {
                        "type": 'image/svg+xml;charset=utf-8'
                    });
                    // Create an URL from the Blob
                    var url = URL.createObjectURL(svgBlob);
                    // Create an IMG tag
                    var img = new Image();
                    // Once the image is loaded...
                    img.onload = function () {
                        // ...replace the original element with the IMG...
                        svgElement.parentNode.replaceChild(img, svgElement);
                        // ... and tidy up after ourselves.
                        URL.revokeObjectURL(url);
                    };
                    // Set the IMG tag to have the src of the URL
                    img.src = url;
                    // Set its height and width
                    img.height = height;
                    img.width = width;
                }
            };
            // Grab the SVG element
            xhttp.open("GET", hrefParts[0], true);
            xhttp.send();
        }
    };

    for (var i = 0; i < svgs.length; i++) {
        _loop(i);
    }
}