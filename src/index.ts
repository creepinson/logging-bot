import Discord from "discord.js";
import fs from "fs";
const client = new Discord.Client();

const logStream = fs.createWriteStream(`${__dirname}/../mentions.log`);

client.once("ready", () => {
	console.log("Ready!");
});

client.on("message", (message) => {
	//this event is fired, whenever the bot sees a new message
	if (message.mentions.has(message.author)) {
		logStream.write(
			JSON.stringify({
				guild: message.guild.id,
				content: message.content,
				mentions: message.mentions.users.map((u) => ({
					id: u.id,
					tag: u.tag,
				})),
			})
		);
	}
});
client.login(process.env.TOKEN);
