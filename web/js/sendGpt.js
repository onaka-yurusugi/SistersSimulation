async function evaluateMessage(prompt) {
    const apiKey = 'YOUR_OPENAI_API_KEY'; // お兄ちゃんのOpenAI APIキーに置き換えてね。
    const apiUrl = 'https://api.openai.com/v1/chat/completions';
    const errorMessage = {
        評価: 0,
        反応: '＜エラー＞APIリクエストに失敗したみたい。sendGpt.js内のAPIキーの設定を確認してみてね。',
        心の声: '早くお兄ちゃんと話したいなあ。'
    };

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'gpt-4o', // 使用するモデルを指定してね（例: gpt-3.5-turbo, gpt-4o）
                messages: [
                    { "role": "user", "content": prompt }
                ]
            })
        });

        if (!response.ok) {
            return errorMessage;
        }

        const data = await response.json();
        const result = data.choices[0].message.content.replace("```json", "").replace("```", "").trim();
        return JSON.parse(result);

    } catch (error) {
        return errorMessage;
    }
}
