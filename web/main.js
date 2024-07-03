document.addEventListener('DOMContentLoaded', () => {
    const optionButtons = document.querySelectorAll('.option-button');
    const resultContainer = document.getElementById('result-container');
    const resultIcon = document.getElementById('result-icon');
    const resultText = document.getElementById('result-text');
    const feedbackText = document.getElementById('feedback-text');
    const producerText = document.getElementById('producer-text');
    const modal = document.getElementById("modal");
    const selectButton = document.getElementById("select-button");
    const characterSelect = document.getElementById("character-select");
    const svgAnimation = document.getElementById('svg-animation');

    let isLocked = false;
    let affectionTotal = 0; // 親愛度の初期値
    let personality = "ツンデレ妹"; // 初期値としてツンデレ妹を設定

    // モーダルを表示
    modal.style.display = "flex";

    // キャラクター選択ボタンのクリックイベントを設定
    selectButton.addEventListener("click", () => {
        personality = characterSelect.value;
        updateCharacter(personality);
        modal.style.display = "none";
    });

    // 各オプションボタンにクリックイベントを設定
    optionButtons.forEach(button => {
        button.addEventListener('click', () => handleSelection(button));
    });

    // 選択ボタンの処理
    async function handleSelection(selectedButton) {
        if (isLocked) return;

        isLocked = true;
        const message = selectedButton.textContent;

        // 他のボタンを無効にする
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
            // 全てのボタンを再度有効にする
            optionButtons.forEach(button => button.disabled = false);
        }
    }

    // 結果を更新する
    function updateResult(result) {
        const icon = getResultIcon(result.評価);

        resultIcon.textContent = icon;
        resultText.textContent = `評価: ${result.評価}`;
        feedbackText.textContent = `累計親愛度: ${affectionTotal}`;
        resultContainer.classList.remove('hidden');
        resultContainer.classList.add('show');
    }

    // 評価に応じたアイコンを取得する
    function getResultIcon(score) {
        if (score <= 0) {
            return '😅 バッド'; // バッド
        } else if (score < 10) {
            return '😉 ノーマル'; // ノーマル
        } else if (score < 20) {
            return '😊 グッド'; // グッド
        } else {
            return '😇 パーフェクト'; // パーフェクト
        }
    }

    // 妹のコメントを更新する
    function updateSisterComment(reaction, innerVoice) {
        producerText.textContent = `${reaction} (${innerVoice})`;
    }

    // アニメーションを再生する
    function playAnimation() {
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
