export default async function handler(req, res) {
    const token = "7827787394:AAGnGRImrIOPMJF9mdfT4zAkjJfHwzqEILU";
    const chat_ids = {
      kamu: "1985797056",
      pacar: "1294887924",
    };
  
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const today = `${day}-${month}`;
  
    let message = null;
    let chat_id = null;
  
    if (today === "16-04") {
      message = "🎉 tes";
      chat_id = chat_ids.kamu;
    } else if (today === "23-11") {
      message = "🎉 Selamat ulang tahun, Gep! Semoga hari ini jadi awal dari hal-hal baik yang lebih banyak, lebih indah, dan lebih bikin senyum. Makasih udah jadi orang yang kuat, tulus, dan selalu ngasih rasa nyaman buat orang-orang di sekitarmu. Tetap jadi kamu yang keren, apa adanya, dan penuh cinta. Hari ini tentang kamu, jadi jangan lupa bahagia ya. 🤍✨";
      chat_id = chat_ids.pacar;
    }
  
    if (message && chat_id) {
      const telegramUrl = `https://api.telegram.org/bot${token}/sendMessage`;
      try {
        const response = await fetch(telegramUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id,
            text: message
          })
        });
        const data = await response.json();
        res.status(200).json({ status: "Sent", data });
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    } else {
      res.status(200).json({ message: "Bukan hari ulang tahun siapa-siapa." });
    }
  }
