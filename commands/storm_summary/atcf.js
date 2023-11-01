const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require('discord.js');
const scraper = require('../../scrapers/scrape-atcf');

module.exports = {
	// Create command
    data: new SlashCommandBuilder()
		.setName('atcf')
		.setDescription('Provides ATCF\'s sector file data.'),
    
    // Ran upon calling in Discord
	async execute(interaction) {
        // Defer bot reponse to prevent timeout
        await interaction.deferReply();

        try {
            // Variables
            let data = await scraper.scraper();

            // Create embed
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
        } catch (error) {
            await interaction.editReply('An error has occurred. ATCF\'s sector file may be down.');
        }
	},
};