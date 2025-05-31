// api/geofence.js

// Handler untuk Vercel Function
export default async function handler(req, res) {
    // Hanya izinkan metode POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    // Ambil BOT_TOKEN dan CHAT_ID dari Vercel Environment Variables
    const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

    // Ambil pesan dari body request
    const { text } = req.body;

    // Validasi bahwa Environment Variables sudah disetel dan pesan ada
    if (!TELEGRAM_BOT_TOKEN) {
        console.error('TELEGRAM_BOT_TOKEN environment variable is not set.');
        return res.status(500).json({ error: 'Server configuration error: Telegram Bot Token is missing.' });
    }
    if (!TELEGRAM_CHAT_ID) {
        console.error('TELEGRAM_CHAT_ID environment variable is not set.');
        return res.status(500).json({ error: 'Server configuration error: Telegram Chat ID is missing.' });
    }
    if (!text) {
        return res.status(400).json({ error: 'Text message is required in the request body.' });
    }

    const telegramApiUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

    try {
        const telegramResponse = await fetch(telegramApiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                chat_id: TELEGRAM_CHAT_ID,
                text: text,
                parse_mode: 'Markdown' // Opsi: 'HTML' atau 'Markdown'
            })
        });

        const data = await telegramResponse.json();

        if (telegramResponse.ok) {
            console.log('Telegram API response:', data);
            res.status(200).json({ message: 'Notification sent!', data: data });
        } else {
            console.error('Telegram API error:', data);
            // Teruskan pesan error dari Telegram jika ada
            res.status(telegramResponse.status).json({ error: data.description || 'Failed to send Telegram message', telegram_response: data });
        }
    } catch (error) {
        console.error('Error sending message to Telegram:', error);
        res.status(500).json({ error: 'Internal server error while sending Telegram message.' });
    }
}
