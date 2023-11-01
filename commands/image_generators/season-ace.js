// Imports
const {SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle, Message, AttachmentBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder} = require('discord.js');
const {PythonShell} = require('python-shell');

module.exports = {
	// Creates command
    data: new SlashCommandBuilder()
		.setName('plotace')
		.setDescription('Plots the ACE history of a specified season using Tropycal.')
        .addStringOption(option =>
			option
				.setName('basin')
				.setDescription('Basin acronym to streamline the cyclone search. (ie. natl, epac)')
                .setRequired(true))
        .addStringOption(option => 
            option
                .setName('year')
                .setDescription('Year of the season being inquired about. (Note: For SHEM seasons, use second year)')
                .setRequired(true)),

    // Runs when user inputs command
	async execute(interaction) {
        console.log(`Running /plotace for ${interaction.user.username}.`);
        await interaction.deferReply();

        // Save user inputs
        let basin = interaction.options.getString('basin');
        let year = interaction.options.getString('year');
        
        // Run python script and save generated plot to variable
        await runPyScript(basin.toLowerCase(), year);
        const attachment = new AttachmentBuilder('./python_scripts/exports/generate_season_ace/season_ace.png');

        // Create response
        await interaction.editReply({ 
            files: [attachment]
        })
        
        console.log(`/plotace ran successfully by ${interaction.user.username}.`);
    }
};

let runPyScript = async (basin, year) => {
    PythonShell.defaultOptions = {
        pythonPath: '../../../../../../../../Users/cmfam/miniconda3/envs/spyder-env/python.exe', 
        scriptPath: './python_scripts', 
        stderrParser: (line) => {
            console.error(`Python STDERR: ${line}`);
        },
    }
    await PythonShell
        .run(`generate_season_ace.py`, {args: [basin, year]})
        .then(messages => {
            console.log(`Python script has finished running.`);
        });
}