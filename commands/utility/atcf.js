const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require('discord.js');
const scraper = require('../../scrapers/scrape-atcf');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('atcf')
		.setDescription('Provides ATCF\'s sector file data.'),
        
	async execute(interaction) {
        await interaction.deferReply();

        let data = await scraper.scraper();

		let embed = new EmbedBuilder()
	        .setColor(0x0099FF)
	        .setTitle(`ATCF Sector File Information`)
            .setDescription(`${data}`);

        // Button information
        const sourceButton = new ButtonBuilder()
            .setLabel('Source')
            .setURL('https://www.nrlmry.navy.mil/tcdat/sectors/atcf_sector_file')
            .setStyle(ButtonStyle.Link);
        const row = new ActionRowBuilder()
			.addComponents(sourceButton);

        // Create response
        await interaction.editReply({ 
            embeds: [embed],
            components: [row]
        });
        console.log(`/atcf ran successfully by ${interaction.user.username}`);
	},
};