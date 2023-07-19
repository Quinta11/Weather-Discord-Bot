//const wait = require('node:timers/promises').setTimeout; don't know if I'll need this but just in case
const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require('discord.js');
const scraper = require('../../scrapers/scrape-dprint');
const func = require('../../functions');

module.exports = {
	// Creates command
    data: new SlashCommandBuilder()
		.setName('dprint')
		.setDescription('Provides latest D-PRINT estimation for specified disturbance.')
        .addStringOption(option =>
			option
				.setName('identifier')
				.setDescription('Storm ID of the disturbance. (ie. al01)')
                .setRequired(true)),

    // Runs when user inputs command
	async execute(interaction) {
        await interaction.deferReply();
        
        let identifier = interaction.options.getString('identifier');
        let altIdentifier = await func.convertIdentifier(identifier);
        let rand = Math.random().toString(36).slice(2);

        // Read data from web scraper
        let data = await scraper.scraper(altIdentifier);

        // Embed information
		let embed = new EmbedBuilder()
	        .setColor(0x0099FF)
	        .setTitle(`Latest D-PRINT estimation for ${altIdentifier.toUpperCase()}`)
	        .addFields(
                { name: 'Average:', value: `${data[2]}`, inline: true },
                { name: '25th Percentile:', value: `${data[3]}`, inline: true },
                { name: '75th Percentile:', value: `${data[4]}`, inline: true},
	        )
	        .setImage(`${data[5]}?${rand}`)
            .setFooter({ text: `Valid as of ${data[0]}, ${data[1]}` });

        // Button information
        const sourceButton = new ButtonBuilder()
            .setLabel('Source')
            .setURL('https://tropic.ssec.wisc.edu/real-time/DPRINT/')
            .setStyle(ButtonStyle.Link);
        const row = new ActionRowBuilder()
			.addComponents(sourceButton);
        
        // Create response
        await interaction.editReply({ 
            embeds: [embed], 
            components: [row]
        });
        console.log(`/dprint ran successfully by ${interaction.user.username}.`);
	},
};