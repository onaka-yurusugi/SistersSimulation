document.addEventListener('DOMContentLoaded', () => {
    const elements = getElements(); // DOM要素を取得
    let state = initializeState(); // 初期状態を設定

    // 自由記入エリアを初期状態で非表示に設定
    elements.freeTextContainer.style.display = 'none';
    // モーダルを表示
    elements.modal.style.display = 'flex';

    // キャラクター選択ボタンのクリックイベント
    elements.selectButton.addEventListener("click", () => {
        state.personality = elements.characterSelect.value;
        updateCharacter(state.personality);
        elements.modal.style.display = "none";
    });

    // 自由記入ボタンのクリックイベント
    elements.freeTextButton.addEventListener('click', () => handleFreeText(elements, state));

    // モード切替ボタンのクリックイベント
    elements.modeToggleButton.addEventListener('click', () => toggleMode(elements, state));

    // ランダムオプションの表示
    displayRandomOptions(button => handleSelection(button, elements, state));
});

// DOM要素を取得する関数
function getElements() {
    return {
        resultContainer: document.getElementById('result-container'),
        resultIcon: document.getElementById('result-icon'),
        resultText: document.getElementById('result-text'),
        feedbackText: document.getElementById('feedback-text'),
        producerText: document.getElementById('producer-text'),
        modal: document.getElementById("modal"),
        selectButton: document.getElementById("select-button"),
        characterSelect: document.getElementById("character-select"),
        svgAnimation: document.getElementById('svg-animation'),
        freeTextButton: document.getElementById('free-text-button'),
        freeTextInput: document.getElementById('free-text-input'),
        freeTextContainer: document.getElementById('free-text-container'),
        optionsContainer: document.getElementById('options-container'),
        modeToggleButton: document.getElementById('mode-toggle-button')
    };
}

// 初期状態を設定する関数
function initializeState() {
    return {
        isLocked: false,
        affectionTotal: 0,
        personality: "ツンデレ妹",
        isFreeTextMode: false
    };
}

// 自由記入のメッセージを処理する関数
async function handleFreeText(elements, state) {
    if (state.isLocked) return;

    state.isLocked = true; // ロック状態にする
    const message = elements.freeTextInput.value;
    elements.freeTextInput.value = '';

    try {
        const result = await getEvaluationResult(message, state); // 評価結果を取得
        updateStateAndUI(result, elements, state); // 状態とUIを更新
    } catch (error) {
        console.error('Error:', error);
    } finally {
        state.isLocked = false; // ロックを解除
    }
}

// モードを切り替える関数
function toggleMode(elements, state) {
    state.isFreeTextMode = !state.isFreeTextMode;
    if (state.isFreeTextMode) {
        elements.optionsContainer.style.display = 'none';
        elements.freeTextContainer.style.display = 'flex';
        elements.modeToggleButton.textContent = "選択肢モードに切り替え";
    } else {
        elements.optionsContainer.style.display = 'flex';
        elements.freeTextContainer.style.display = 'none';
        elements.modeToggleButton.textContent = "自由記入モードに切り替え";
        displayRandomOptions(button => handleSelection(button, elements, state));
    }
}

// オプションの選択を処理する関数
async function handleSelection(selectedButton, elements, state) {
    if (state.isLocked) return;

    state.isLocked = true; // ロック状態にする
    const message = selectedButton.textContent;

    // 選択されたボタンを強調表示
    const buttons = elements.optionsContainer.querySelectorAll('.option-button');
    buttons.forEach(button => {
        button.disabled = button !== selectedButton;
        button.classList.toggle('selected', button === selectedButton);
    });

    try {
        const result = await getEvaluationResult(message, state); // 評価結果を取得
        updateStateAndUI(result, elements, state); // 状態とUIを更新
    } catch (error) {
        console.error('Error:', error);
    } finally {
        state.isLocked = false; // ロックを解除
        buttons.forEach(button => button.disabled = false);

        // 新しいオプションをすぐに表示
        displayRandomOptions(button => handleSelection(button, elements, state));
    }
}

// 評価結果を取得する関数
async function getEvaluationResult(message, state) {
    const gameRules = new GameRules();
    const prompt = gameRules.createPrompt(message, state.personality, state.affectionTotal);
    return await evaluateMessage(prompt);
}

// 状態とUIを更新する関数
function updateStateAndUI(result, elements, state) {
    state.affectionTotal += result.評価; // 親愛度を更新
    updateResult(result, elements, state.affectionTotal); // 結果をUIに反映
    playAnimation(elements.svgAnimation); // アニメーションを実行
    updateSisterComment(result, elements); // 妹のコメントを更新
}

// 結果をUIに反映する関数
function updateResult(result, elements, affectionTotal) {
    const icon = getResultIcon(result.評価);
    elements.resultIcon.textContent = icon;
    elements.resultText.textContent = `評価: ${result.評価}`;
    elements.feedbackText.textContent = `累計親愛度: ${affectionTotal}`;
    elements.resultContainer.classList.remove('hidden');
    elements.resultContainer.classList.add('show');
}

// 結果アイコンを取得する関数
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

// 妹のコメントを更新する関数
function updateSisterComment(result, elements) {
    elements.producerText.textContent = `${result.反応} (${result.心の声})`;
}

// アニメーションを実行する関数
function playAnimation(svgAnimation) {
    svgAnimation.style.display = 'block';
    svgAnimation.style.opacity = 1;
    setTimeout(() => {
        svgAnimation.style.opacity = 0;
        setTimeout(() => {
            svgAnimation.style.display = 'none';
        }, 1000);
    }, 3000);
}