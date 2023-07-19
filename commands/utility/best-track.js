const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require('discord.js');
const scraper = require('../../scrapers/scrape-btk');
const func = require('../../functions');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('btk')
		.setDescription('Provides best track information about specified disturbance.')
        .addStringOption(option =>
			option
				.setName('identifier')
				.setDescription('Storm ID of the disturbance. (ie. al01)')
                .setRequired(true)),

	async execute(interaction) {
        await interaction.deferReply();

        let identifier = interaction.options.getString('identifier');
        let rand = Math.random().toString(36).slice(2);
        let data = await scraper.scraper(identifier);

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
	        .setImage(`https://cdn.star.nesdis.noaa.gov/FLOATER/${identifier.toUpperCase()}2023/GEOCOLOR/latest.jpg?${rand}`)
        if(data[21] != 0) {embed.addFields({name: 'Eye:', value: `${data[21]} n mi`, inline: true})}

        // Button information
        const sourceButton = new ButtonBuilder()
            .setLabel('Source')
            .setStyle(ButtonStyle.Link);
        if((identifier.substr(0,2).toLowerCase() == 'al') || (identifier.substr(0,2).toLowerCase() == 'ep')) {
            sourceButton.setURL('https://ftp.nhc.noaa.gov/atcf/btk/');
            embed.setFooter({ text: `Valid as of ${data[2].substr(4, 2)}/${data[2].substr(6, 2)}/${data[2].substr(0, 4)} ${data[2].substr(8, 2)}:00 UTC\nIn the case of discrepancies, refer to NHC.` });
        } else {
            sourceButton.setURL(`https://www.ssd.noaa.gov/PS/TROP/DATA/ATCF/JTWC/b${identifier}2023.dat`);
            embed.setFooter({ text: `Valid as of ${data[2].substr(4, 2)}/${data[2].substr(6, 2)}/${data[2].substr(0, 4)} ${data[2].substr(8, 2)}:00 UTC\nIn the case of discrepancies, refer to an official RMSC.` });
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