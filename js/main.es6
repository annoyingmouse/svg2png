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
                    // console.log(svgDoc);
                    const glyph = svgDoc.getElementById(hrefParts[1]);
                    // console.log(glyph);
                    const XMLS = new XMLSerializer();
                    const svgStr = XMLS.serializeToString(glyph);
                    // console.log(svgStr);
                    const svgBlob = new Blob([svgStr]);
                    // console.log(svgBlob);
                    const domURL = self.URL; // || self.webkitURL || self;
                    const url = domURL.createObjectURL(svgBlob);
                    // console.log(url);
                    const img = new Image;
                    img.onload = function(){

                    }


                }
            };
            xhttp.open("GET", hrefParts[0], true);
            xhttp.send();

        }
    }


}

const XMLtoString = (elem) => {
    let serialized = null;
    try {
        // XMLSerializer exists in current Mozilla browsers
        const serializer = new XMLSerializer();
        serialized = serializer.serializeToString(elem);
    }catch (e) {
        // Internet Explorer has a different approach to serializing XML
        serialized = elem.xml;
    }
    return serialized;
};
