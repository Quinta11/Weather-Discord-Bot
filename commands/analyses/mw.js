//const wait = require('node:timers/promises').setTimeout; don't know if I'll need this but just in case
const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle, Message, AttachmentBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require('discord.js');
const axios = require('axios');
const fs = require('fs');
const https = require('https');
const scraper = require('../../scrapers/scrape-mw');
const func = require('../../functions');
const year = new Date().getUTCFullYear();

module.exports = {
	// Creates command
    data: new SlashCommandBuilder()
		.setName('mw')
		.setDescription('Provides latest microwave pass from specified satellite for specified disturbance.')
        .addStringOption(option =>
			option
				.setName('identifier')
				.setDescription('Storm ID of the disturbance. (ie. al01)')
                .setRequired(true))
        .addStringOption(option => 
            option
                .setName('satellite')
                .setDescription('Satellite to pull microwave pass from. (ie. gpm)')
                .setRequired(true)),

    // Runs when user inputs command
	async execute(interaction) {
        console.log(`Running /mw for ${interaction.user.username}.`);
        await interaction.deferReply();

        let identifier = interaction.options.getString('identifier');
        let satellite = interaction.options.getString('satellite');
        let data = await scraper.scraper(identifier, satellite);
        
        if(typeof data === 'boolean') {
            await interaction.editReply('One of your parameters provided is either invalid, or the file location does not exist.');
        } else {
            const imageUrl = `https://www.nrlmry.navy.mil/tcdat/tc${year}/AL/${identifier.toUpperCase()}${year}/png/89H/${satellite.toUpperCase()}/${data}`
            const fileName = 'downloaded.png'
            const response = await axios.get(imageUrl, { responseType: 'stream', httpsAgent: new https.Agent({ rejectUnauthorized: false }), setTimeout: 5000 });
            const imageStream = await response.data.pipe(fs.createWriteStream(fileName));
            const attachment = new AttachmentBuilder(fileName);

            // Button information
            const sourceButton = new ButtonBuilder()
                .setLabel('Source')
                .setURL('https://tropic.ssec.wisc.edu/real-time/DPRINT/')
                .setStyle(ButtonStyle.Link);
            const filter1 = new ButtonBuilder()
                .setCustomId('89H')
                .setLabel('89GHz')
                .setStyle(ButtonStyle.Secondary);
            const filter2 = new ButtonBuilder()
                .setCustomId('color89')
                .setLabel('89 color')
                .setStyle(ButtonStyle.Secondary);
            const filter3 = new ButtonBuilder()
                .setCustomId('color37')
                .setLabel('37 color')
                .setStyle(ButtonStyle.Secondary);
            const row = new ActionRowBuilder()
                .addComponents(filter1, filter2, filter3, sourceButton);
                
            imageStream.on('finish', async () => {
                // Create response
                await interaction.editReply({ 
                    files: [attachment],
                    components: [row]
                }).then(() => {
                    fs.unlinkSync(fileName);
                }).catch(console.error);
            });
            
            console.log(`/mw ran successfully by ${interaction.user.username}.`);
        }
	},
};