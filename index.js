require('dotenv').config();
const { Client } = require('discord.js-selfbot-v13');
const client = new Client();

const mySecret = process.env['TOKEN']
const mySecret2 = process.env['BUMP_CHANNEL']

client.on('ready', async () => {
    console.log(`Logged in as ${client.user.tag}!`);

    try {
        const channel = await client.channels.fetch(process.env.BUMP_CHANNEL);

        async function bump() {
            try {
                await channel.sendSlash('302050872383242240', 'bump');
                console.count('Bumped!');
                return true;
            } catch (error) {
                console.error('Failed to send bump request:', error.message);
                console.log('Waiting for the next bump time...');
                return false;
            }
        }

        async function loop() {
            while (true) {
                // Random time between 2 hours and 2.5 hours (in milliseconds)
                const randomNum = Math.round(Math.random() * (9000000 - 7200000 + 1)) + 7200000;

                const success = await bump();

                if (success) {
                    console.log(`Waiting for ${(randomNum / 1000 / 60).toFixed(2)} minutes before the next bump...`);
                    await new Promise(resolve => setTimeout(resolve, randomNum));
                } else {
                    // If bump failed, wait a shorter time (15 minutes) and try again
                    console.log('Bump failed, will try again in 15 minutes...');
                    await new Promise(resolve => setTimeout(resolve, 15 * 60 * 1000));
                }
            }
        }

        // Start the bumping process
        loop();

    } catch (error) {
        console.error('Error initializing bumper:', error);
    }
});

// Login with the token from environment variables
client.login(process.env.TOKEN);