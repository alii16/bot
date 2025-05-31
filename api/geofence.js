// api/geofence.js

// Handler untuk Vercel Function
export default async function handler(req, res) {
    // Hanya izinkan metode POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    // Ambil data dari body request
    const { bot_token, chat_id, text } = req.body;

    // Validasi input
    if (!bot_token || !chat_id || !text) {
        return res.status(400).json({ error: 'bot_token, chat_id, and text are required in the request body.' });
    }

    const telegramApiUrl = `https://api.telegram.org/bot${bot_token}/sendMessage`;

    try {
        const telegramResponse = await fetch(telegramApiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                chat_id: chat_id,
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
