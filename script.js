$(document).ready(function() {
  $(".btn-upload").click(function() {
    console.log("upload");
    $(this).button("loading");
    $("#imageInput").trigger("click");
  });

  $("#imageInput").on("change", function(evt) {
    handleFileSelect(evt);
  });

  $("#canvas").mousemove(function(event) {
    let color = getCurrentRGBColor(event);
    let rgb =  color.r + ", " + color.g + ", " + color.b;
    let hex = "#" + rgbToHex(color.r, color.g, color.b);

    $("#rgb-color").text(rgb);
    $("#hex-color").text(hex);
    $(".color-sample").css("background-color", hex);
  });

  $("#canvas").mousedown(function(event) {
    let color = getCurrentRGBColor(event);
    let hex = "#" + rgbToHex(color.r, color.g, color.b);
    $("#colorHistory").append("<p>" + hex + "</p>");
  });
});

function handleFileSelect(evt) {
  var files = evt.target.files;
  var uploadedImage = files[0];

  if (!uploadedImage.type.match('image.*')) {
    notAnImage();
    return;
  }

  var reader = new FileReader();
  var canvas = $("#canvas").get(0);
  var img = document.createElement("img");

  reader.onload = (function(theFile) {
    return function(e) {
      var MAX_WIDTH = 600;
      var MAX_HEIGHT = 450;
      
      img.src = e.target.result;

      img.onload = function() {
        var width = img.width;
        var height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;

        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
        showImage();
      }
    };
  })(uploadedImage);

  reader.readAsDataURL(uploadedImage);
}

function showImage() {
  $(".btn-upload").button('reset');
  $(".btn-upload").hide();

  $("#canvas").slideDown('slow');
}

function notAnImage() {
  $("#not-an-image").show();
  $(".btn-upload").button('reset');
  $(".btn-upload").text("Try again");
}

function rgbToHex(R,G,B) {
  return toHex(R)+toHex(G)+toHex(B)
}

function toHex(n) {
  n = parseInt(n,10);
  if (isNaN(n)) return "00";
  n = Math.max(0,Math.min(n,255));return "0123456789ABCDEF".charAt((n-n%16)/16) + "0123456789ABCDEF".charAt(n%16);
}

function getCurrentRGBColor(event) {
  let canvas = $("#canvas").get(0)
  let rect = canvas.getBoundingClientRect();
  let x = event.clientX - rect.left;
  let y = event.clientY - rect.top;

  let ctx = canvas.getContext('2d');
  let imgData = ctx.getImageData(x, y, 1, 1).data;
  return {
    "r": imgData[0],
    "g": imgData[1],
    "b": imgData[2]
  };
}
