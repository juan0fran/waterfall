function keypress(e, spectrum) {
    if (e.key == " ") {
        spectrum.togglePaused();
    } else if (e.key == "f") {
        spectrum.toggleFullscreen();
    } else if (e.key == "c") {
        spectrum.toggleColor();
    } else if (e.key == "ArrowUp") {
        spectrum.rangeUp();
    } else if (e.key == "ArrowDown") {
        spectrum.rangeDown();
    } else if (e.key == "ArrowLeft") {
        spectrum.rangeHalf();
    } else if (e.key == "ArrowRight") {
        spectrum.rangeDouble();
    } else if (e.key == "s") {
        spectrum.incrementSpectrumPercent();
    } else if (e.key == "w") {
        spectrum.decrementSpectrumPercent();
    } 
}

function main()
{
	var spectrum = new Spectrum(
        "waterfall", {
            spectrumPercent: 20
    });

    // Bind keypress handler
    window.addEventListener("keydown", function (e) {
        keypress(e, spectrum);
    });

    var socket = io.connect('/');

    socket.on('disconnect', function(){
    	console.log("disconnected from server")
    });

    socket.on('message', function(data){
    	console.log("received message " + data)
    })

    socket.on('data', function(data){

        if (data.s) {
            spectrum.addData(data.s);
        } else {
            if (data.center) {
                spectrum.setCenterHz(data.center);
            }
            if (data.span) {
                spectrum.setSpanHz(data.span);
            }
        }
    })

}

window.onload = main;

