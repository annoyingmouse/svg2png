/*
 * https://community.spiceworks.com/topic/411506-detecting-ie11
 * Not pretty, but it works
 */
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
// If we're looking at IE11
if(getInternetExplorerVersion() === 11){
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const target = document.getElementById("target");
    target.appendChild(canvas);
    // Get all the SVG tags
    const svgs = document.getElementsByTagName("svg");
    for(let i = 0; i < svgs.length; i++){
        // Get a reference to the initial SVG element
        const svgElement = svgs[i];
        // Check to see if the SVG tag has a USE tag (indicating an external asset).
        const external = svgs[i].getElementsByTagName("use");
        // Get dimensions of the SVG
        const height = parseInt(svgs[i].getAttribute("height"), 10);
        const width = parseInt(svgs[i].getAttribute("width"), 10);
        canvas.width = width;
        canvas.height = height;

        if(external.length){ // Truthy/Falsy
            // Get the link to the external SVG from the first USE tag (we only have the one, right?)
            const href = external[0].getAttribute("xlink:href");
            // Split it on the hash symbol
            const hrefParts = href.split("#");
            // Do the ajax shimmy
            let xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
                // If we're sorted
                if (this.readyState === 4 && this.status === 200) {
                    // Get the XML string
                    const xmlString = this.responseText;
                    let svgBlob = null;
                    // If there's only the one glyph in the SVG:
                    if(hrefParts.length === 1){
                        svgBlob = new Blob([this.responseText], {
                            "type": 'image/svg+xml;charset=utf-8'
                        });
                    }else{ // If we're looking at an ID within the SVG:
                        // Create a parser
                        const parser = new DOMParser();
                        // Parse the XML string as XML
                        const svgDoc = parser.parseFromString(xmlString, "text/xml");
                        // Get the specific SVG from the parsed SVG
                        const glyph = svgDoc.getElementById(hrefParts[1]);
                        // Create an SVG serializer
                        const XMLS = new XMLSerializer();
                        // Convert the SVG XML into a string
                        const svgStr = XMLS.serializeToString(glyph);
                        // Create a Blob from the string
                        svgBlob = new Blob([svgStr], {
                            "type": 'image/svg+xml;charset=utf-8'
                        });
                    }
                    // Create an URL from the Blob
                    const url = URL.createObjectURL(svgBlob);
                    // Create an IMG tag
                    const img = new Image;
                    // Once the image is loaded...
                    img.onload = function(){
                        ctx.drawImage(this, 0, 0);
                        // ...replace the original element with the IMG...
                        svgElement.parentNode.replaceChild(img, svgElement);
                        // ... and tidy up after ourselves.
                        URL.revokeObjectURL(url);

                        //const injectedImage = document.getElementById(`svg${i}Created`);
                        const canvas1 = document.getElementById('canvas1');
                        const context = canvas1.getContext('2d');
                        context.drawImage(img, 0, 0, img.width, img.height);
                        window.navigator.msSaveBlob(canvas.msToBlob(), "snowman.png");




                        // const cloned = document.createElement("canvas");
                        // const context = cloned.getContext("2d");
                        // cloned.width = width;
                        // cloned.height = height;
                        // context.drawImage(canvas, 0, 0);
                        // target.appendChild(cloned);
                        // const blob = canvas.msToBlob();
                        // window.navigator.msSaveBlob(blob, "snowman.png");


                        // window.navigator.msSaveBlob(canvas, 'snowman.png');
                        //window.navigator.msSaveBlob(blob, 'dicomimage.png'););

                        // const pngImg = new Image;
                        // pngImg.onload = function(){
                        //     target.appendChild(pngImg)
                        // };
                        // pngImg.src = cloned.toDataURL();
                        // pngImg.height = height;
                        // pngImg.width = width;
                    };
                    // Set the IMG tag to have the src of the URL
                    img.src = url;
                    // Set its height and width
                    img.height = height;
                    img.width = width;
                    img.id = `svg${i}Created`;
                }
            };
            // Grab the SVG element
            xhttp.open("GET", hrefParts[0], true);
            xhttp.send();
        }
    }
}