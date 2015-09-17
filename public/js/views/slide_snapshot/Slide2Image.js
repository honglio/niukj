define(['jquery'], function($) {


    var Slide2Image = (function() {

        // check if we have canvas support
        var bHasCanvas = false;
        var oCanvas = document.createElement("canvas");
        if (oCanvas.getContext("2d")) {
            bHasCanvas = true;
        }

        // Not support canvas, bail out.
        if (!bHasCanvas) {
            return {
                saveAsPNG: function() {}
            };
        }

        var bHasDataURL = !!(oCanvas.toDataURL);

        // sends the generated file to the client
        var saveFile = function(strData, deckId, cb) {
            $.ajax({
                    url: '/articles/uploadCoverImg',
                    type: 'POST',
                    data: {
                        src: strData,
                        name: deckId + '.png'
                    }
                })
                .success(function(res, status, body) {
                    console.log(res);
                    // cb(res);
                })
                .error(function(body, status, err) {
                    // console.log("error");
                    // console.log('body' + body);
                    // console.log('status' + status);
                    // console.log('err' + err);
                });
        };

        // generates a <img> object containing the imagedata
        var makeImageObject = function(strSource, cb) {
            var oImgElement = document.createElement("img");
            oImgElement.src = strSource;
            cb(oImgElement);
        };

        var scaleCanvas = function(oCanvas, iWidth, iHeight) {
            if (iWidth && iHeight) {
                var oSaveCanvas = document.createElement("canvas");
                oSaveCanvas.width = iWidth;
                oSaveCanvas.height = iHeight;
                oSaveCanvas.style.width = iWidth + "px";
                oSaveCanvas.style.height = iHeight + "px";

                var oSaveCtx = oSaveCanvas.getContext("2d");

                oSaveCtx.drawImage(oCanvas, 0, 0, oCanvas.width, oCanvas.height, 0, 0,
                    iWidth, iHeight);
                return oSaveCanvas;
            }
            return oCanvas;
        };

        return {
            saveAsPNG: function(oCanvas, bReturnImg, iWidth, iHeight, deckId, cb) {
                if (!bHasDataURL) {
                    return false;
                }
                var oScaledCanvas = scaleCanvas(oCanvas, iWidth, iHeight);
                var strData = oScaledCanvas.toDataURL("image/png");
                if (bReturnImg) {
                    return makeImageObject(strData, cb);
                } else {
                    return saveFile(strData.replace(/^data:image\/\w+;base64,/, ""), deckId, cb);
                }
                return true;
            }
        };

    })();

    return Slide2Image;
});
