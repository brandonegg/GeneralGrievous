const Discord = require('discord.js');
const client = new Discord.Client();
const readline = require("readline");
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

//Defined as ['chat message command'] = 'file name'
const soundLibrary = new Map([
  ["up top", 'clap'],
  ["UP TOP", 'claploud'],
  ['honk', 'honk'],
  ['HONK', 'honkloud'],
  ['thomas', 'thomassoundloud'],
  ['maggy','maggy'],
  ['elchavo', 'MaggyJellyFinal']
])

const maxQueueLength = 5;

let queue = [] // stores song names

connectionEstablished = false
//while (!connectionEstablished) {
  rl.question("Please enter your discord bot key:", function(key) {
    client.login(key).then(function(result) {
      console.log("Login successful, General Grievous going online!");
      connectionEstablished = true;
    }, function(err) {
      console.log("Invalid key, try again!");
    });
  });
//}

client.on('message', async message => {
  // Voice only works in guilds, if the message does not come from a guild,
  // we ignore it
  if (!message.guild) return;

  if (soundLibrary.has(message.content)) {
    if (message.member.voice.channel) {
      
      addToQueue(message.content,message)
    } else {
      message.reply('You need to join a voice channel first!');
    }
  }
});

async function addToQueue(selectedSong, originalMessage) {
  if (queue.length < maxQueueLength) {
    queue.push(selectedSong);
    if (queue.length-1 == 0) {
      const connection = await originalMessage.member.voice.channel.join();
      playTrack('./sounds/'+soundLibrary.get(selectedSong)+'.mp3', connection);
    }
  } else {
    
    originalMessage.reply("The queue is currently full! \n Queue: " + queue);
  }
}

async function playTrack(songAddress, vcConnection) {
  console.log(songAddress);
  const dispatcher = vcConnection.play(songAddress);
  dispatcher.setVolume = 100;
  dispatcher.on('finish', () => {
    console.log('Finished playing!');
    dispatcher.destroy();

    queue.shift();
    console.log(queue);
    
    if (queue.length > 0){
      console.log(queue.length);
      playTrack('./sounds/'+soundLibrary.get(queue[0])+'.mp3', vcConnection)
    } else {
      vcConnection.disconnect();
    }
  });
}

//TO ADD:
// - Grenade
// - bruh
// - Implement queue, keep track of each audio type and play them in order