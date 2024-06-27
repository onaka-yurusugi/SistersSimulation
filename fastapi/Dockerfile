# ベースイメージとしてPythonの公式イメージを使用
FROM python:3.11-slim

# 作業ディレクトリを設定
WORKDIR /app

# 必要なパッケージをインストール
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# アプリケーションのコードをコンテナ内にコピー
COPY ./app/ .

# コンテナ起動時に実行されるコマンドを指定
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--reload"]
