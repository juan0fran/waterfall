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
    } else if (e.key == "+") {
        spectrum.incrementAveraging();
    } else if (e.key == "-") {
        spectrum.decrementAveraging();
    } 
}


function main()
{
	var spectrum = new Spectrum(
        "waterfall", {
            spectrumPercent: 40
    });

    // Bind keypress handler
    window.addEventListener("keydown", function (e) {
        keypress(e, spectrum);
    });

    var ws = new WebSocket("ws://" + window.location.host + "/websocket_example");
   
    ws.onopen = function(evt) {
        console.log("connected!");
    }
    ws.onclose = function(evt) {
        console.log("closed");
    }
    ws.onerror = function(evt) {
        console.log("error: " + evt.message);
    }
    ws.onmessage = function (evt) {
        var data = JSON.parse(evt.data);

        if (data.data) {
            spectrum.addData(data.data);
        } else {
            if (data.center) {
                spectrum.setCenterHz(data.center);
            }
            if (data.span) {
                spectrum.setSpanHz(data.span);
            }
        }
    }
}

window.onload = main;

