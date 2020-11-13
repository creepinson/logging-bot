import Discord from "discord.js";
import fs from "fs";
const client = new Discord.Client();

const logStream = fs.createWriteStream(`${__dirname}/../mentions.log`);

client.once("ready", () => {
	console.log("Ready!");
});

client.on("message", async (message) => {
	//this event is fired, whenever the bot sees a new message
	if (
		!message.mentions ||
		!message.mentions.users ||
		message.mentions.users.size < 1
	)
		return;
	if (message.author.id === client.user.id) return;
	
	const log = JSON.stringify({
		guild: message.guild.id,
		content: message.cleanContent,
		mentions: message.mentions.users.map((u) => ({
			id: u.id,
			tag: u.tag,
		})),
	});
	logStream.write(log);
	try {
		const logGuildChannel = await message.guild.channels.cache
			.find((c) => c.name.includes("mod-logs"))
			.fetch();
		const logChannel: Discord.TextChannel = (await client.channels.cache.find(
			(c) => c.id === logGuildChannel.id && c.type === "text"
		)) as Discord.TextChannel;
		await logChannel.send(log);
	} catch {}
});
client.login(process.env.TOKEN);
