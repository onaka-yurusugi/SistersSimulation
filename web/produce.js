const optionTexts = [
    "髪型変えたんだね、すごく似合ってるよ。",
    "今日の服装、すごくおしゃれだね。",
    "勉強頑張ってるみたいだね、偉いな。",
    "手伝ってくれてありがとう、助かったよ。",
    "最近運動してる？すごく健康的だね。",
    "昨日の料理、めちゃくちゃ美味しかったよ。",
    "笑顔が素敵だね、元気がもらえるよ。",
    "趣味の作品、見せてくれてありがとう、すごく上手だね。",
    "今日は一緒に映画でも見る？楽しい時間を過ごせそうだよ。",
    "素敵なプレゼント、ありがとう！大切にするね。",
    "新しい友達ができたんだって？おめでとう！",
    "そのアクセサリー、すごく可愛いね。",
    "努力してる姿、尊敬してるよ。",
    "今日は何か面白いことあった？話を聞かせて。",
    "お手伝いするから、何か困ったことがあったら言ってね。",
    "最近の本、すごく面白そうだね、貸してくれる？",
    "おしゃれなカフェ見つけたんだけど、一緒に行かない？",
    "そのネイル、すごく可愛いね、どこでやったの？",
    "最近のドラマ、観てる？おすすめ教えて！",
    "いつも笑顔でいてくれてありがとう、元気をもらってるよ。"
];

const optionsContainer = document.getElementById("options-container");

function getRandomOptions() {
    const shuffled = optionTexts.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3);
}

function createOptionButton(text) {
    const button = document.createElement("button");
    button.className = "option-button";
    button.textContent = text;
    button.dataset.outcome = "normal"; // ここは適宜変更してください
    return button;
}

function displayRandomOptions(handleSelection) {
    const options = getRandomOptions();
    optionsContainer.innerHTML = "";
    options.forEach(optionText => {
        const button = createOptionButton(optionText);
        optionsContainer.appendChild(button);
        button.addEventListener('click', () => handleSelection(button));
    });
}
