document.addEventListener('DOMContentLoaded', () => {
    const optionButtons = document.querySelectorAll('.option-button');
    const resultContainer = document.getElementById('result-container');
    const resultIcon = document.getElementById('result-icon');
    const resultText = document.getElementById('result-text');
    const feedbackText = document.getElementById('feedback-text');
    const turnNumber = document.getElementById('turn-number');
    const producerText = document.getElementById('producer-text');

    let currentTurn = 4;
    let isLocked = false;

    const outcomes = {
        normal: { icon: '⚠️', text: 'ノーマル', feedback: 'まあまあの反応です。もう少し工夫できそうですね。' },
        perfect: { icon: '✅', text: 'パーフェクト', feedback: '素晴らしい質問です！相手の興味を引き出せています。' },
        bad: { icon: '❌', text: 'バッド', feedback: 'ステレオタイプな発言は避けましょう。もっと個人の興味に焦点を当てると良いでしょう。' }
    };

    optionButtons.forEach(button => {
        button.addEventListener('click', () => handleSelection(button));
    });

    function handleSelection(selectedButton) {
        if (isLocked) return;

        isLocked = true;
        const outcome = selectedButton.dataset.outcome;

        optionButtons.forEach(button => {
            button.disabled = button !== selectedButton;
        });

        updateResult(outcome);
        updateTurnCounter();
        updateSisterComment();
    }

    function updateResult(outcome) {
        const { icon, text, feedback } = outcomes[outcome];
        resultIcon.textContent = icon;
        resultText.textContent = text;
        feedbackText.textContent = feedback;
        resultContainer.classList.remove('hidden');
    }

    function updateTurnCounter() {
        currentTurn--;
        turnNumber.textContent = currentTurn;

        if (currentTurn === 0) {
            endGame();
        }
    }

    function updateSisterComment() {
        producerText.textContent = outcomes.normal.feedback;
    }

    function endGame() {
        optionButtons.forEach(button => button.disabled = true);
        producerText.textContent = '(ゲーム終了)';
    }
});