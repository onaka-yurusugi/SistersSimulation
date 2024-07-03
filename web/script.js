document.addEventListener('DOMContentLoaded', () => {
    const optionButtons = document.querySelectorAll('.option-button');
    const resultContainer = document.getElementById('result-container');
    const resultIcon = document.getElementById('result-icon');
    const resultText = document.getElementById('result-text');
    const feedbackText = document.getElementById('feedback-text');
    const producerText = document.getElementById('producer-text');
    const modal = document.getElementById("modal");
    const characterImage = document.getElementById("character-image");
    const characterName = document.getElementById("character-name");
    const selectButton = document.getElementById("select-button");
    const characterSelect = document.getElementById("character-select");

    let isLocked = false;
    let affectionTotal = 0; // 親愛度の初期値
    let personality = "ツンデレ妹"; // 初期値としてツンデレ妹を設定

    modal.style.display = "flex";

    selectButton.addEventListener("click", () => {
        personality = characterSelect.value;
        updateCharacter(personality);
        modal.style.display = "none";
    });

    function updateCharacter(personality) {
        switch (personality) {
            case "ツンデレ妹":
                characterImage.src = "./images/ツンデレ.webp";
                characterName.textContent = "【ツンデレ妹】";
                producerText.textContent = "・・・なによ。";
                break;
            case "クーデレ妹":
                characterImage.src = "./images/クーデレ.webp";
                characterName.textContent = "【クーデレ妹】";
                producerText.textContent = "うん、なに？";
                break;
            case "デレデレ妹":
                characterImage.src = "./images/デレデレ.webp";
                characterName.textContent = "【デレデレ妹】";
                producerText.textContent = "お兄ちゃん、大好き！";
                break;
            case "ヤンデレ妹":
                characterImage.src = "./images/ヤンデレ.webp";
                characterName.textContent = "【ヤンデレ妹】";
                producerText.textContent = "お兄ちゃんは私だけのもの...";
                break;
            case "活発妹":
                characterImage.src = "./images/活発.webp";
                characterName.textContent = "【活発妹】";
                producerText.textContent = "お兄ちゃん、遊ぼうよ！";
                break;
            case "ダウナー妹":
                characterImage.src = "./images/ダウナー.webp";
                characterName.textContent = "【ダウナー妹】";
                producerText.textContent = "ふーん、別に...";
                break;
            case "おっとり妹":
                characterImage.src = "./images/おっとり.webp";
                characterName.textContent = "【おっとり妹】";
                producerText.textContent = "お兄ちゃん、どうしたの？";
                break;
            case "ミステリアス妹":
                characterImage.src = "./images/ミステリアス.webp";
                characterName.textContent = "【ミステリアス妹】";
                producerText.textContent = "秘密が多い妹...";
                break;
            case "社交的妹":
                characterImage.src = "./images/社交的.webp";
                characterName.textContent = "【社交的妹】";
                producerText.textContent = "お兄ちゃん、友達と遊びに行こうよ！";
                break;
            case "クリエイティブ妹":
                characterImage.src = "./images/クリエイティブ.webp";
                characterName.textContent = "【クリエイティブ妹】";
                producerText.textContent = "お兄ちゃん、これ見て！";
                break;
            case "委員長妹":
                characterImage.src = "./images/委員長.webp";
                characterName.textContent = "【委員長妹】";
                producerText.textContent = "お兄ちゃん、宿題やった？";
                break;
            case "夢見がち妹":
                characterImage.src = "./images/夢見がち.webp";
                characterName.textContent = "【夢見がち妹】";
                producerText.textContent = "お兄ちゃん、夢の話しようよ！";
                break;
        }
    }

    optionButtons.forEach(button => {
        button.addEventListener('click', () => handleSelection(button));
    });

    async function evaluateMessage(message, personality, currentAffection) {
        const response = await fetch('http://localhost:8101/evaluate', {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message, personality, current_affection: currentAffection })
        });

        if (!response.ok) {
            throw new Error('APIリクエストに失敗しました');
        }

        return response.json();
    }

    async function handleSelection(selectedButton) {
        if (isLocked) return;

        isLocked = true;
        const message = selectedButton.textContent;

        optionButtons.forEach(button => {
            button.disabled = button !== selectedButton;
        });

        try {
            const result = await evaluateMessage(message, personality, affectionTotal);
            affectionTotal += result.評価; // 親愛度を更新
            updateResult(result);
            playAnimation();
            updateSisterComment(result.反応, result.心の声);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            isLocked = false;
            optionButtons.forEach(button => button.disabled = false); // ボタンを再度有効にする
        }
    }

    function updateResult(result) {
        let icon;
        if (result.評価 <= 0) {
            icon = '😅 バッド'; // バッド
        } else if (result.評価 < 10) {
            icon = '😉 ノーマル'; // ノーマル
        } else if (result.評価 < 20) {
            icon = '😊 グッド'; // グッド
        } else {
            icon = '😇 パーフェクト'; // パーフェクト
        }

        resultIcon.textContent = icon;
        resultText.textContent = `評価: ${result.評価}`;
        feedbackText.textContent = `累計親愛度: ${affectionTotal}`;
        resultContainer.classList.remove('hidden');
        resultContainer.classList.add('show');
    }

    function updateSisterComment(reaction, innerVoice) {
        producerText.textContent = `${reaction} ${innerVoice}`;
    }

    function playAnimation() {
        const svgAnimation = document.getElementById('svg-animation');
        svgAnimation.style.display = 'block';
        svgAnimation.style.opacity = 1;
        setTimeout(() => {
            svgAnimation.style.opacity = 0;
            setTimeout(() => {
                svgAnimation.style.display = 'none';
            }, 1000);
        }, 3000);
    }
});
