const Discord = require("discord.js");
const dotenv = require("dotenv").config();
const { indexOf } = require("ffmpeg-static");
const ytdl = require("ytdl-core");
const cron = require("cron");

const client = new Discord.Client();

client.login(process.env.KEY);

client.on("ready", (e) => {
  console.log("I am ready!");
});

const playSingleMusic = async (message, musicLink, afterFinish) => {
  const songInfo = await ytdl.getInfo(musicLink);

  const song = {
    title: songInfo.videoDetails.title,
    url: songInfo.videoDetails.video_url,
  };

  const voiceChannel = message.member.voice.channel;

  let connection = await voiceChannel.join();

  connection.play(ytdl(song.url)).on("finish", () => {
    voiceChannel.leave();
    afterFinish();
  });
};

client.on("message", async (message) => {
  if (message.content === "/active_barka") {
    message.delete();

    async function playBarka() {
      let listOfAllMembers = [];

      const barkaChanel = await message.guild.channels.create(
        "Czas na barke!!!",
        {
          type: "voice",
        }
      );

      barkaChanel.guild.members.cache.forEach((e) => {
        setTimeout(() => {
          listOfAllMembers.push({
            member: e,
            prevChannel: e.voice.channel,
          });

          e.voice.setChannel(barkaChanel);
        }, 200);
      });

      function afterBotFinish() {
        listOfAllMembers.forEach((listElement) => {
          setTimeout(() => {
            listElement.member.voice.setChannel(listElement.prevChannel);
          }, 200);
        });
        setTimeout(() => {
          chanelToDelete.delete();
        }, 3000);
      }

      playSingleMusic(
        message,
        "https://www.youtube.com/watch?v=0qzLRlQFFQ4&t=38s&ab_channel=VerbumDei",
        afterBotFinish
      );
    }

    let job1 = new cron.CronJob("0 37 21 * * *", playBarka);

    job1.start();
  }
});

client.on("message", async (message) => {
  if (message.content === "/papus") {
    message.delete();

    playSingleMusic(
      message,
      "https://www.youtube.com/watch?v=vXTpoukGFIs",
      () => {
        console.log("Music has been finished!");
      }
    );
  }
});
