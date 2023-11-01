
//const fs = require('fs');
async function loadModules() {
    const d3 = await import("d3");
    const jsdom = require("jsdom");
    const { JSDOM } = jsdom;
    const { document } = (new JSDOM()).window;
    const fileSaver = require("file-saver");
    const sharp = require("sharp");

    var width = 1000;
    var height = 1000;

    var svg = d3.select(document).select("body").append("svg")
        .attr('xmlns', 'http://www.w3.org/2000/svg')
        .attr("width", width)
        .attr("height", height);

    var data = [1, 250, 750]

    svg.append("g").selectAll("circle")
        .data(data)
        .enter("circle")
            .append("circle").attr("cx", d => d)
            .attr("cy", "250")
            .style("fill", "red")
            .attr("r", "25")
    //fileSaver.saveAs(svg, "file.svg");
    console.log(svg.node().outerHTML)

    /*sharp('file.svg')
        .png()
        .toFile("pleasework.png")
        .then(function(info) {
            console.log(info)
          })
          .catch(function(err) {
            console.log(err)
          })*/
          

          sharp('file.svg')
            .png()
            .toFile('output.png')
}

async function download (document) {
}

loadModules();

/*let calculator = async () => {
    //let season = '2020'
    fs.readFile();


    

    console.log(globalArray);
}

fs.readFile(`./databases/season/${season}/best-track.txt`, 'utf8', (err, data) => {
    if(err) {
        console.error(err);
        return;
    }

    globalArray.push(data);
});

calculator();*/

