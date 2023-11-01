// Imports
const {SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle, Message, AttachmentBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder} = require('discord.js');
const {PythonShell} = require('python-shell');

module.exports = {
	// Creates command
    data: new SlashCommandBuilder()
		.setName('plotstorm')
		.setDescription('Plots the track of a specified storm using Tropycal.')
        .addStringOption(option =>
			option
				.setName('basin')
				.setDescription('Basin acronym to streamline the cyclone search. (ie. natl, epac)')
                .setRequired(true))
        .addStringOption(option =>
			option
				.setName('name')
				.setDescription('Storm name OR ATCF identifier.')
                .setRequired(true))
        .addStringOption(option => 
            option
                .setName('year')
                .setDescription('If using a storm name, this is the year to select from.')
                .setRequired(true)),

    // Runs when user inputs command
	async execute(interaction) {
        console.log(`Running /plotstorm for ${interaction.user.username}.`);
        await interaction.deferReply();

        // Save user inputs
        let basin = interaction.options.getString('basin');
        let name = interaction.options.getString('name');
        let year = interaction.options.getString('year');
        
        // Run python script and save generated plot to variable
        await runPyScript(basin.toLowerCase(), name.toLowerCase(), year);
        const attachment = new AttachmentBuilder('./python_scripts/exports/generate_storm_track/track.png');

        // Create response
        await interaction.editReply({ 
            files: [attachment]
        })
        
        console.log(`/plotstorm ran successfully by ${interaction.user.username}.`);
    }
};

let runPyScript = async (basin, name, year) => {
    PythonShell.defaultOptions = {pythonPath: '../../../../../../../../Users/cmfam/miniconda3/envs/spyder-env/python.exe', scriptPath: './python_scripts' }
    await PythonShell.run(`generate_storm_track.py`, {args: [basin, name, year]}).then(messages=>{
        return
    });
}