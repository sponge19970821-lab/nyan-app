/**
 * Nyan App（にゃんアプ）のメインクラス
 * これはSpring Bootアプリの起動点です
 */

package com.nyanapp;

// Spring Boot関連のインポート
import org.springframework.boot.SpringApplication;  // アプリを起動するクラス
import org.springframework.boot.autoconfigure.SpringBootApplication;  // これをつけるとSpring Bootアプリになる
import org.springframework.context.annotation.Bean;  // Beanを定義するアノテーション
import org.springframework.web.servlet.config.annotation.CorsRegistry;  // CORS設定用
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;  // Webの設定

/**
 * @SpringBootApplication：このクラスがSpring Bootアプリであることを示す
 */
@SpringBootApplication
//外部から使える公開クラス
public class NyanAppApplication {

    /**
     * main メソッド：プログラムのスタート地点
     * @param args コマンドライン引数（起動時に渡される値）
     */
    public static void main(String[] args) {
        // Spring Bootアプリを起動します
        SpringApplication.run(NyanAppApplication.class, args);
    }

    /**
     * CORS設定メソッド
     * CORS = Cross-Origin Resource Sharing（クロスオリジンリソース共有）
     * フロントエンド（localhost:3000）からバックエンド（localhost:8080）へのリクエストを許可する設定
     * これがないと、ブラウザのセキュリティ機能がリクエストをブロックしてしまう
     * 
     * 設定内容：
     * - allowedOrigins：どのオリジン（URL）からのリクエストを許可するか
     * - allowedMethods：どのHTTPメソッド（GET, POST等）を許可するか
     * - allowedHeaders：どのリクエストヘッダーを許可するか（* = すべて）
     * - allowCredentials：認証情報（Cookie等）の送信を許可するか
     */
    @Bean  // このメソッドが返すオブジェクトをSpring Bootが管理する
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override  // 親クラスのメソッドをオーバーライド（上書き）
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")  // すべてのパス（/** = ワイルドカード）に対して
                        .allowedOrigins("http://localhost:3000", "http://127.0.0.1:3000")  // このオリジンからのリクエストを許可
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")  // これらのHTTPメソッドを許可
                        .allowedHeaders("*")  // すべてのヘッダーを許可
                        .allowCredentials(true);  // クッキーなどの認証情報の送信を許可
            }
        };
    }
}
