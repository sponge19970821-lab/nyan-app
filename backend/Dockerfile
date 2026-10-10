#========================================================#
# Dockerfile：Java バックエンドアプリをコンテナ化するファイル
# このファイルを使うと、どのパソコンでも同じ環境でアプリが動く
#========================================================#

# ビルドステージ：アプリをコンパイルする段階
# Maven 3.9 と Java 17 を使用してアプリをビルド
FROM maven:3.9-eclipse-temurin-17 AS build

# コンテナ内の作業ディレクトリを /app に設定
WORKDIR /app

# ホストの pom.xml（Maven 設定ファイル）をコンテナにコピー
COPY pom.xml .

# Maven の依存ライブラリをダウンロード（ネットワークのみを使用）
RUN mvn dependency:go-offline

# ソースコード（src ディレクトリ）をコンテナにコピー
COPY src src

# Maven でプロジェクトをビルド
# -DskipTests：テストをスキップして時間を短縮
# 結果：target/ ディレクトリに JAR ファイルが生成される
RUN mvn clean package -DskipTests

#========================================================#
# 実行ステージ：コンパイルされたアプリを実行する段階
# Java 17 ランタイムのみ（ビルドツールは不要）
FROM eclipse-temurin:17-jre

# 作業ディレクトリを /app に設定
WORKDIR /app

# ビルドステージから JAR ファイルをコピー
# nyan-app-backend-1.0.0.jar → app.jar にリネーム
COPY --from=build /app/target/nyan-app-backend-*.jar app.jar

# ポート 8080 を外部に公開
# フロントエンド（localhost:3000）からこのポートでアクセス可能
EXPOSE 8080

# コンテナ起動時のコマンド
# Java を使って JAR ファイルを実行
CMD ["java", "-jar", "app.jar"]
