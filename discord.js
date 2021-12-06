var axios = require('axios');
const {MessageAttachment} = require("discord.js")
class Discord {
    constructor() {
        this.config = {
            method: 'post',
            url: process.env.DISCORD_CHANNEL,
            headers: { 
              'Content-Type': 'multipart/form-data',
            },
        };
        this.server = {
            type: "",
            location: "",
            title: "Accountable"
        }
        this.colors = {
            yellow: 16705372,
            green: 3066993,
            red: 15158332,
        }
        this.templates = {
            "serverRestart": {
                "username": "Server",
                "avatar_url": "https://cdn.iconscout.com/icon/premium/png-512-thumb/data-storage-server-1646910-1397320.png",
                "embeds": [
                        { 
                            title: `${this.server.title}`,
                            description: 'This server has restarted',
                            color: this.colors.yellow
                        }
                    ],
                },
            message: {
                "username": "Server",
                "avatar_url": "https://cdn.iconscout.com/icon/premium/png-512-thumb/data-storage-server-1646910-1397320.png",
                "embeds": [
                        {
                            title: `${this.server.title}`,
                            description: '',
                            color: this.colors.green,
                        }
                    ],
            },
            log: {
                "username": `${this.server.title}`,
                "avatar_url": "https://cdn.iconscout.com/icon/premium/png-512-thumb/data-storage-server-1646910-1397320.png",
                "embeds": [
                        {
                            title: `History`,
                            description: "",
                            color: this.colors.green,
                        }
                    ],
            },
            imageEmbed: {
                //title: `${this.server.title}`,
                //color: this.colors.green,
                image: {
                    url: "",
                    //height: 720,
                    //width: 1280
                }

            }
        }
    }

    setConfigData(data) {
        this.config.data = JSON.stringify(data)
    }

    message() {
        return new Promise((resolve, reject) => {
            axios(this.config)
            .then(function (response) {
                resolve()
            })
            .catch(function (error) {
                reject()
                console.log(error);
            });
        })
    }

    sendAction(action) {
        this.setConfigData(this.templates[action])
        this.message();
    }

    sendMessage(msg, color = "green") {
        return new Promise((resolve, reject) => {
            let message =  JSON.parse(JSON.stringify(this.templates.message))
            message.embeds[0].description = msg;
            message.embeds[0].color = this.colors[color];
            this.setConfigData(message)
            this.message().then(resolve).catch(reject)
        })
    }

    sendLog(history) {
        return new Promise((resolve, reject) => {
            let message =  JSON.parse(JSON.stringify(this.templates.log))
            message.embeds[0].description = ""
            history.forEach((h, i) => {
                //message.embeds[0].description += `\`\`\`${h.title}\`\`\``
            })
            let m = {};
            m.file = []
            for (let i = 0; i < 4; i++) {
                let imgEmbed = JSON.parse(JSON.stringify(this.templates.imageEmbed))
                imgEmbed.title = `ss-${i}.jpg`
                imgEmbed.image.url = `attachment://ss-${i}.jpg`
                //imgEmbed.image.url = `https://i.imgur.com/ZGPxFN2.jpg`
                m.file.push(
                    {
                        attachment:`./ss-${i}.jpg`,
                        name:`ss-${i}.jpg`,
                    })
                message.embeds.push(imgEmbed)
            }

            m.payload_json = JSON.stringify(message);
            console.log(m)
            this.setConfigData(m)
            this.message().then(resolve).catch(reject)
            

        })
        
    }

}

let discord = new Discord();

module.exports = {discord};