// Firebase Data
var database = firebase.database();
var userRef = database.ref("user");
var poopRef = database.ref("poop");

// Get the canvas Width/Height
var width = document.body.clientWidth;
var height = document.body.clientHeight;

// push some data to firebase about ourselves
var myUser = userRef.push();
var myX = Math.random() * width;
var myY = Math.random() * height;
var mySize = 100;
myUser.set( {
    name: 'Ashwin',
    x: myX,
    y: myY,
    size: mySize
});
myUser.onDisconnect().remove();

// Create an image element to load the emoji image
var poop = document.createElement("img");
poop.setAttribute("src", "poop.png");

// Create a canvas that fits the screen exactly
var canvas = document.createElement("canvas");
canvas.setAttribute('width', '' + width);
canvas.setAttribute('height', '' + height);
document.body.appendChild(canvas);

// Graphics context
var context = canvas.getContext('2d');

var player = {};
userRef.on('child_added', function(user) {
    player[user.key] = user.val();
});
userRef.on('child_changed', function(user) {
    player[user.key] = user.val();
});
userRef.on('child_removed', function(user) {
    delete player[user.key];
});

// Get the mouse motion, and update two variables that store where it is
var mouseX = width / 2;
var mouseY = height / 2;
document.onmousemove = function(m) {
  mouseX = m.clientX;
  mouseY = m.clientY;
};

function frame() {
    // Clear the background
    context.clearRect(0, 0, width, height);

    for (var playerId in player) {
      var playerData = player[playerId];
      context.drawImage(poop,
      playerData.x - playerData.size / 2,
      playerData.y - playerData.size / 2,
      playerData.size, playerData.size);
    }

    myX += (mouseX - myX) / 10;
    myY += (mouseY - myY) / 10;
    myUser.child("x").set(myX);
    myUser.child("y").set(myY);

    window.requestAnimationFrame(frame);
}

frame();
