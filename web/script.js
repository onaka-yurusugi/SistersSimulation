document.addEventListener('DOMContentLoaded', () => {
    const optionButtons = document.querySelectorAll('.option-button');
    const resultContainer = document.getElementById('result-container');
    const resultIcon = document.getElementById('result-icon');
    const resultText = document.getElementById('result-text');
    const feedbackText = document.getElementById('feedback-text');
    const turnNumber = document.getElementById('turn-number');
    const producerText = document.getElementById('producer-text');

    let isLocked = false;
    let affectionTotal = 0; // 親愛度の初期値

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
            const result = await evaluateMessage(message, "ツンデレ妹", affectionTotal);
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
