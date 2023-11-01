const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require('discord.js');
const scraper = require('../../scrapers/scrape-dmint');
const func = require('../../functions');

module.exports = {
	// Creates command
    data: new SlashCommandBuilder()
		.setName('dmint')
		.setDescription('Provides latest D-MINT estimation for specified disturbance.')
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
	        .setTitle(`Latest D-MINT estimation for ${altIdentifier.toUpperCase()}`)
	        .addFields(
		        { name: 'Microwave Sensor:', value: `${data[2]}`},
                { name: 'Average:', value: `${data[4]}`, inline: true },
                { name: '25th Percentile:', value: `${data[5]}`, inline: true },
                { name: '75th Percentile:', value: `${data[6]}`, inline: true},
	        )
	        .setImage(`${data[7]}?${rand}`)
            .setFooter({ text: `Valid as of ${data[0]}, ${data[1]}` });

        // Button information
        const sourceButton = new ButtonBuilder()
            .setLabel('Source')
            .setURL('https://tropic.ssec.wisc.edu/real-time/DMINT/')
            .setStyle(ButtonStyle.Link);
        const row = new ActionRowBuilder()
			.addComponents(sourceButton);
        
        // Create response
        await interaction.editReply({ 
            embeds: [embed], 
            components: [row]
        });
        console.log(`/dmint ran successfully by ${interaction.user.username}.`);
	},
};