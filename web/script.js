document.addEventListener('DOMContentLoaded', () => {
    const optionButtons = document.querySelectorAll('.option-button');
    const resultContainer = document.getElementById('result-container');
    const resultIcon = document.getElementById('result-icon');
    const resultText = document.getElementById('result-text');
    const feedbackText = document.getElementById('feedback-text');
    const turnNumber = document.getElementById('turn-number');
    const producerText = document.getElementById('producer-text');
    const nextTurnButton = document.getElementById('next-turn-button');

    let currentTurn = 4;
    let isLocked = false;

    optionButtons.forEach(button => {
        button.addEventListener('click', () => handleSelection(button));
    });

    nextTurnButton.addEventListener('click', startNextTurn);

    async function evaluateMessage(message, personality) {
        const response = await fetch('http://localhost:8101/evaluate', {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message, personality })
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
            const result = await evaluateMessage(message, "ツンデレ妹");
            updateResult(result);
            updateTurnCounter();
            updateSisterComment(result.反応, result.心の声);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            isLocked = false;
            nextTurnButton.classList.remove('hidden');
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
        feedbackText.textContent = `累計親愛度: ${result.累計親愛度}`;
        resultContainer.classList.remove('hidden');
    }

    function updateTurnCounter() {
        currentTurn--;
        turnNumber.textContent = currentTurn;

        if (currentTurn === 0) {
            endGame();
        }
    }

    function updateSisterComment(reaction, innerVoice) {
        producerText.textContent = `${reaction} ${innerVoice}`;
    }

    function startNextTurn() {
        resultContainer.classList.add('hidden');
        nextTurnButton.classList.add('hidden');
        optionButtons.forEach(button => {
            button.disabled = false;
        });
        updateSisterComment("新しいターンが始まりました！", "");
    }

    function endGame() {
        optionButtons.forEach(button => button.disabled = true);
        nextTurnButton.classList.add('hidden');
        producerText.textContent = '(ゲーム終了)';
    }
});
