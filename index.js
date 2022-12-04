const qrcode = require('qrcode-terminal');

const { Client, LocalAuth } = require('whatsapp-web.js');

const country_code = "521";
const number = "8139845815";

const client = new Client({
    restartOnAuthFail: true,
    puppeteer: {
	headless: false,
    executablePath: "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",

},
    authStrategy: new LocalAuth(),
    ffmpegPath: 'ffmpeg/bin/ffmpeg.exe'
});

client.initialize();

client.on('qr', qr => {
    qrcode.generate(qr, {small: true});
});

client.on('ready', () => {
    console.log('El cliente está listo');
})

client.on("authenticated", (session) => {
    console.log('WHATSAPP WEB => Authenticated');
});

client.on('auth_failure', msg => {
    console.error('Hubo un error en la autenticación', msg);
})

client.on('message', async msg => {
    let chat = await msg.getChat();

    if(msg.hasMedia && chat.isGroup && msg.body === '.sticker')
    {
        const media = await msg.downloadMedia();

        client.sendMessage(msg.from, media, { sendMediaAsSticker: true,stickerAuthor:"Angel Leal",stickerName:"Sticker" });        
    }
    else if(msg.hasMedia && !chat.isGroup)
    {
        const media = await msg.downloadMedia();

        client.sendMessage(msg.from, media, { sendMediaAsSticker: true,stickerAuthor:"Angel Leal",stickerName:"Sticker" });
    }
    else if(msg.hasQuotedMsg && msg.body === '.sticker')
    {
        let mensaje = await msg.getQuotedMessage();
        const media = await mensaje.downloadMedia();

        client.sendMessage(msg.from, media, { sendMediaAsSticker: true,stickerAuthor:"Angel Leal",stickerName:"Sticker" });

    }
    else if(msg.body === '.sticker')
    {
        let mensaje = await chat.fetchMessages({limit: 9999});
        for (const mens of mensaje.reverse()) {
            if(mens.hasMedia)
            {
                const media = await mens.downloadMedia();
                client.sendMessage(msg.from, media, { sendMediaAsSticker: true,stickerAuthor:"Angel Leal",stickerName:"Sticker" });
                break;
            }
        }


    }
})
