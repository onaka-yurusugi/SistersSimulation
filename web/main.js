document.addEventListener('DOMContentLoaded', () => {
    const resultContainer = document.getElementById('result-container');
    const resultIcon = document.getElementById('result-icon');
    const resultText = document.getElementById('result-text');
    const feedbackText = document.getElementById('feedback-text');
    const producerText = document.getElementById('producer-text');
    const modal = document.getElementById("modal");
    const selectButton = document.getElementById("select-button");
    const characterSelect = document.getElementById("character-select");
    const svgAnimation = document.getElementById('svg-animation');
    const freeTextButton = document.getElementById('free-text-button');
    const freeTextInput = document.getElementById('free-text-input');
    const freeTextContainer = document.getElementById('free-text-container');
    const optionsContainer = document.getElementById('options-container');
    const modeToggleButton = document.getElementById('mode-toggle-button');

    let isLocked = false;
    let affectionTotal = 0;
    let personality = "ツンデレ妹";
    let isFreeTextMode = false;

    // 初期状態で自由記入エリアを非表示に設定
    freeTextContainer.style.display = 'none';

    modal.style.display = "flex";

    selectButton.addEventListener("click", () => {
        personality = characterSelect.value;
        updateCharacter(personality);
        modal.style.display = "none";
    });

    freeTextButton.addEventListener('click', async () => {
        if (isLocked) return;

        isLocked = true;
        const message = freeTextInput.value;
        freeTextInput.value = '';

        try {
            const result = await evaluateMessage(message, personality, affectionTotal);
            affectionTotal += result.評価;
            updateResult(result);
            playAnimation();
            updateSisterComment(result.反応, result.心の声);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            isLocked = false;
        }
    });

    modeToggleButton.addEventListener('click', () => {
        isFreeTextMode = !isFreeTextMode;
        if (isFreeTextMode) {
            optionsContainer.style.display = 'none';
            freeTextContainer.style.display = 'flex';
            modeToggleButton.textContent = "選択肢モードに切り替え";
        } else {
            optionsContainer.style.display = 'flex';
            freeTextContainer.style.display = 'none';
            modeToggleButton.textContent = "自由記入モードに切り替え";
        }
    });

    async function handleSelection(selectedButton) {
        if (isLocked) return;

        isLocked = true;
        const message = selectedButton.textContent;

        const optionButtons = document.querySelectorAll('.option-button');
        optionButtons.forEach(button => {
            button.disabled = button !== selectedButton;
        });

        try {
            const result = await evaluateMessage(message, personality, affectionTotal);
            affectionTotal += result.評価;
            updateResult(result);
            playAnimation();
            updateSisterComment(result.反応, result.心の声);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            isLocked = false;
            optionButtons.forEach(button => button.disabled = false);
            displayRandomOptions(handleSelection);
        }
    }

    function updateResult(result) {
        const icon = getResultIcon(result.評価);

        resultIcon.textContent = icon;
        resultText.textContent = `評価: ${result.評価}`;
        feedbackText.textContent = `累計親愛度: ${affectionTotal}`;
        resultContainer.classList.remove('hidden');
        resultContainer.classList.add('show');
    }

    function getResultIcon(score) {
        if (score <= 0) {
            return '😅 バッド';
        } else if (score < 10) {
            return '😉 ノーマル';
        } else if (score < 20) {
            return '😊 グッド';
        } else {
            return '😇 パーフェクト';
        }
    }

    function updateSisterComment(reaction, innerVoice) {
        producerText.textContent = `${reaction} (${innerVoice})`;
    }

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

    displayRandomOptions(handleSelection);
});
