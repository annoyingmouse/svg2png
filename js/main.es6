//svg4everybody();
const getInternetExplorerVersion = () => {
    let rv = -1;
    const ua = navigator.userAgent;
    if (navigator.appName === 'Microsoft Internet Explorer'){
        if (new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})").exec(ua) !== null){
            rv = parseFloat( RegExp.$1 );
        }
    }else if (navigator.appName === 'Netscape') {
        if (new RegExp("Trident/.*rv:([0-9]{1,}[\.0-9]{0,})").exec(ua) != null){
            rv = parseFloat( RegExp.$1 );
        }
    }
    return rv;
};
if(getInternetExplorerVersion() === 11){
    // Get all the SVG tags
    const svgs = document.getElementsByTagName("svg");
    for(let i = 0; i < svgs.length; i++){
        // Check to see if the SVG tag has a USE tag (indicating an external asset).
        const external = svgs[i].getElementsByTagName("use");
        if(external.length){ // Truthy/Falsy
            const href = external[0].getAttribute("xlink:href");
            const hrefParts = href.split("#");
            let xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
                if (this.readyState === 4 && this.status === 200) {
                    const xmlString = this.responseText;
                    const parser = new DOMParser();
                    const svgDoc = parser.parseFromString(xmlString, "text/xml");
                    const glyph = (hrefParts.length > 1) ? svgDoc.getElementById(hrefParts[1]) : svgDoc;
                    console.log(glyph);

                }
            };
            xhttp.open("GET", hrefParts[0], true);
            xhttp.send();

        }
    }


}
