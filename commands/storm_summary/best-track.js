const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require('discord.js');
const scraperBtk = require('../../scrapers/scrape-btk');
const scraperVis = require('../../scrapers/scrape-rammb-vis');
const func = require('../../functions');
const year = new Date().getUTCFullYear();

module.exports = {
	// Create command
    data: new SlashCommandBuilder()
		.setName('btk')
		.setDescription('Provides best track information about specified disturbance.')
        .addStringOption(option =>
			option
				.setName('identifier')
				.setDescription('Storm ID of the disturbance. (ie. al01)')
                .setRequired(true)),

    // Ran upon calling in Discord
	async execute(interaction) {
        // Defer bot response to prevent timeout
        await interaction.deferReply();

        // Variables
        let identifier = interaction.options.getString('identifier');
        let rand = Math.random().toString(36).slice(2);
        let data = await scraperBtk.scraper(identifier);
        let imagePath = await scraperVis.scraper(identifier);

		// Creating embed
        let embed = new EmbedBuilder()
	        .setColor(0x0099FF)
	        .setTitle(`${await func.selectClassification(data[10], data[8])} ${data[27]} (${data[0]}${data[1]})`)
            .setThumbnail(`${await func.selectThumbnail(data[8])}`)
	        .addFields(
		        { name: 'Center fix:', value: `${await func.fixCoords(data[6])} ${await func.fixCoords(data[7])}`},
                { name: 'Current intensity:', value: `${data[8]} kts / ${data[9]} hPa`},
                { name: 'Max gusts:', value: `${data[20]} kts`, inline: true},
                { name: 'RMW:', value: `${data[19]} n mi`, inline: true },
	        )
        if(data[21] != 0) {
            embed.addFields({name: 'Eye:', value: `${data[21]} n mi`, inline: true})
        }
        if(data[7].includes('W')) {
            embed.setImage(`https://cdn.star.nesdis.noaa.gov/FLOATER/${identifier.toUpperCase()}${year}/GEOCOLOR/latest.jpg?${rand}`)
        } else {
            embed.setImage(`https://rammb-data.cira.colostate.edu${imagePath}?${rand}`)
        }

        // Button information
        const sourceButton = new ButtonBuilder()
            .setLabel('Source')
            .setStyle(ButtonStyle.Link);
        if(data[7].includes('W')) {
            sourceButton.setURL('https://ftp.nhc.noaa.gov/atcf/btk/');
            embed.setFooter({ text: `Valid as of ${data[2].substr(4, 2)}/${data[2].substr(6, 2)}/${data[2].substr(0, 4)} ${data[2].substr(8, 2)}:00 UTC\nIn the case of discrepancies, refer to NHC.` });
        } else {
            sourceButton.setURL(`https://www.ssd.noaa.gov/PS/TROP/DATA/ATCF/JTWC/b${identifier}${year}.dat`);
            embed.setFooter({ text: `Valid as of ${data[2].substr(4, 2)}/${data[2].substr(6, 2)}/${data[2].substr(0, 4)} ${data[2].substr(8, 2)}:00 UTC\nIn the case of discrepancies, refer to JTWC.` });
        }
        const row = new ActionRowBuilder()
			.addComponents(sourceButton);

        // Create response
        await interaction.editReply({ 
            embeds: [embed],
            components: [row]
        });
        console.log(`/btk ran successfully by ${interaction.user.username}.`);
	},
};