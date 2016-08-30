var weights = 0;
var lonmoments = 0;
var latmoments = 0;

var zfgweights = 0;
var zfglat = 0;
var zfglon = 0;

var togwweights = 0;
var togwlat = 0;
var togwlon = 0;

var latcoordinates = [[95.5, -0.8], [95.5, 1], [98, 2.6], [101.5, 1.2], [101.5, -0.7], [97.5, -2.2], [97, -2.2]];
var loncoordinates = [[95.5, 920], [95.5, 1275], [96.5, 1370], [100, 1370], [101.5, 1175], [101.5, 920]];

function pointinpolygon(point, vs) {
    // https://github.com/substack/point-in-polygon/blob/master/index.js
    // ray-casting algorithm based on
    // http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html
    
    var x = point[0], y = point[1];
    
    var inside = false;
    for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
        var xi = vs[i][0], yi = vs[i][1];
        var xj = vs[j][0], yj = vs[j][1];
        
        var intersect = ((yi > y) != (yj > y))
            && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }
    
    return inside;
};

function updateTotals(latarm, lonarm, weight) {
    weights = weights + weight;
    lonmoments = lonmoments + lonarm*weight;
    latmoments = latmoments + latarm*weight;
};
function calculateTotals() {
    weights = 0;
    lonmoments = 0;
    latmoments = 0;

    var theForm = document.forms["balanceform"];

    var bem = parseFloat(theForm.elements["bem"].value);
    var latemptycofg = parseFloat(theForm.elements["latemptycofg"].value);
    var lonemptycofg = parseFloat(theForm.elements["lonemptycofg"].value);

    updateTotals(latemptycofg, lonemptycofg, bem);

    var dualsinstalled = theForm.elements["dualsinstalled"].checked;
    if(!dualsinstalled)
    {

        var dualsweight = -2.6;
        var dualslatarm = -12.88;
        var dualslonarm = 66.27;
        updateTotals(dualslatarm, dualslonarm, dualsweight);
    };

    var pilotweight = parseFloat(theForm.elements["pilot"].value);
    var pilotlatarm = 10.7;
    var pilotlonarm = 78;
    updateTotals(pilotlatarm, pilotlonarm, pilotweight);

    var passengerweight = parseFloat(theForm.elements["passenger"].value);
    var passengerlatarm = -9.3;
    var passengerlonarm = 78;
    updateTotals(passengerlatarm, passengerlonarm, passengerweight);


    var leftdoorinstalled = theForm.elements["leftdoorinstalled"].checked;
    if(!leftdoorinstalled)
    {

        var doorweight = -5.2;
        var doorlatarm = 21;
        var doorlonarm = 77.5;
        updateTotals(doorlatarm, doorlonarm, doorweight);
    };

    var rightdoorinstalled = theForm.elements["rightdoorinstalled"].checked;
    if(!rightdoorinstalled)
    {

        var doorweight = -5.2;
        var doorlatarm = -21;
        var doorlonarm = 77.5;
        updateTotals(doorlatarm, doorlonarm, doorweight);
    };

    zfgweights = weights;
    zfglat = latmoments/weights;
    zfglon = lonmoments/weights;

    var divobj = document.getElementById('emptyCOFG');
    divobj.innerHTML = "Empty COFG: " + zfglon.toFixed(2) + ", " + zfglat.toFixed(2) + " - " + zfgweights + "lbs";

    var mainweight = parseFloat(theForm.elements["main"].value)*6;
    var mainlatarm = -11;
    var mainlonarm = 108.6;
    updateTotals(mainlatarm, mainlonarm, mainweight);

    var auxweight = parseFloat(theForm.elements["aux"].value)*6;
    var auxlatarm = 11.2;
    var auxlonarm = 103.8;
    updateTotals(auxlatarm, auxlonarm, auxweight);

    togwweights = weights;
    togwlat = latmoments/weights;
    togwlon = lonmoments/weights;

    var divobj = document.getElementById('fullCOFG');
    divobj.innerHTML = "Fueled COFG: " + togwlon.toFixed(2) + ", " + togwlat.toFixed(2) + " - " + togwweights + "lbs";

};
function calculateCoordinates(canvas, max, min, value){
    var realwidth = max-min;
    var realdiff = value-min;
    var alongpercentage = realdiff/realwidth;
    return alongpercentage*canvas;
};
function drawGraph(){
    var c = document.getElementById("loncanvas");
    var ctx = c.getContext("2d");

    ctx.clearRect(0, 0, c.width, c.height);

    var lonmaxw = 103;
    var lonminw = 95;
    var lonmaxh = 1400;
    var lonminh = 900;


    var canvaswidth = c.scrollWidth;
    var canvasheight = c.scrollHeight;

    ctx.beginPath();
    ctx.moveTo(calculateCoordinates(canvaswidth, lonmaxw, lonminw, loncoordinates[0][0]),calculateCoordinates(canvasheight, lonmaxh, lonminh, loncoordinates[0][1]));
    for (var i=1, coordinate; coordinate = loncoordinates[i]; i++) {
        ctx.lineTo(calculateCoordinates(canvaswidth, lonmaxw, lonminw, coordinate[0]),calculateCoordinates(canvasheight, lonmaxh, lonminh, coordinate[1]));
    };
    ctx.closePath();
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(calculateCoordinates(canvaswidth, lonmaxw, lonminw, zfglon),calculateCoordinates(canvasheight, lonmaxh, lonminh, zfgweights));
    ctx.lineTo(calculateCoordinates(canvaswidth, lonmaxw, lonminw, togwlon),calculateCoordinates(canvasheight, lonmaxh, lonminh, togwweights));
    ctx.stroke();

    var c = document.getElementById("latcanvas");
    var ctx = c.getContext("2d");

    ctx.clearRect(0, 0, c.width, c.height);

    var latmaxw = 103;
    var latminw = 95;
    var latmaxh = 3;
    var latminh = -3;


    var canvaswidth = c.scrollWidth;
    var canvasheight = c.scrollHeight;

    ctx.beginPath();
    ctx.moveTo(calculateCoordinates(canvaswidth, latmaxw, latminw, latcoordinates[0][0]),calculateCoordinates(canvasheight, latmaxh, latminh, latcoordinates[0][1]));
    for (var i=1, latcoordinate; coordinate = latcoordinates[i]; i++) {
        ctx.lineTo(calculateCoordinates(canvaswidth, latmaxw, latminw, coordinate[0]),calculateCoordinates(canvasheight, latmaxh, latminh, coordinate[1]));
    };
    ctx.closePath();
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(calculateCoordinates(canvaswidth, latmaxw, latminw, zfglon),calculateCoordinates(canvasheight, latmaxh, latminh, zfglat));
    ctx.lineTo(calculateCoordinates(canvaswidth, latmaxw, latminw, togwlon),calculateCoordinates(canvasheight, latmaxh, latminh, togwlat));
    ctx.stroke();

};
function checkLimits(){
    var inlimits = pointinpolygon([zfglon, zfglat], latcoordinates) && pointinpolygon([togwlon, togwlat], latcoordinates) && pointinpolygon([zfglon, zfgweights], loncoordinates) && pointinpolygon([togwlon, togwweights], loncoordinates);
    var divobj = document.getElementById('inlimits');
    if(inlimits){
        divobj.innerHTML = "All OK!";
    } else {
        divobj.innerHTML = "Out of limits!!!";

    };
};
function updatePage(){
    calculateTotals();
    drawGraph();
    checkLimits();
};
