// Description: ゲームのルールを定義するクラス
class GameRules {
    constructor() {
        this.system_message = "あなたは親愛なる兄との会話をしています。100文字程度の一言で回答してください｡";
        this.personalities = personalities; // 妹ハーレムを定義したオブジェクト
    }

    createPrompt(message, personality, affectionScore) {
        let reaction;
        if (affectionScore < 0) {
            reaction = "親愛度が低いため、冷たい反応を返してください。";
        } else if (affectionScore < 50) {
            reaction = "親愛度が中程度のため、少し冷たいが関心を持っている反応を返してください。";
        } else if (affectionScore < 100) {
            reaction = "親愛度が高いため、とても暖かい反応を返してください。";
        } else {
            reaction = "親愛度がとても高いため、どデカい恋愛感情を持った反応を返してください。";
        }

        const bonusTopic = this.personalities[personality].bonusTopic;
        const bonusCondition = bonusTopic ? `また、発言が"${bonusTopic}"に関連している場合、評価に20点を追加してください。` : '';

        return `
        ${this.system_message}
        以下の発言に対する評価、反応メッセージ、および攻略のアドバイスをJSON形式で出力してください。
        発言: "${message}"
        妹の性格: ${this.personalities[personality].description}
        ${reaction}
        評価: [-10~+30]の範囲で数値化してください。
        ${bonusCondition}
        出力形式は以下のようにしてください：
        {
            "評価": 数値,
            "反応": "反応メッセージ",
            "心の声": "攻略のヒントにもなるような妹の心の中の反応"
        }
        例:
        {
            "評価": 40,
            "反応": "ありがとう。気に入ったみたいでよかった。",
            "心の声": "褒めてくれて嬉しいけど、他の変化も見て欲しいな。"
        }
        `;
    }
}

async function evaluateMessage(message, personality, currentAffection) {
    const gameRules = new GameRules();
    const prompt = gameRules.createPrompt(message, personality, currentAffection);

    const response = await fetch('http://localhost:8101/evaluate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            prompt: prompt
        })
    });

    if (!response.ok) {
        throw new Error('APIリクエストに失敗しました');
    }

    const data = await response.json();
    const result = data.result.replace("```json", "").replace("```", "").trim();
    return JSON.parse(result);
}
