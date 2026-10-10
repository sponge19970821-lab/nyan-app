/**
 * HealthController クラス
 * フロントエンド(Next.js)からのリクエストを受け取り、データベースに保存・取得するクラスです
 * REST API の仲介役として機能します
 */

package com.nyanapp.controller;
//ニャンアップのコントローラーのパッケージを指定

// 必要なクラスをインポート
import com.nyanapp.model.Health;  // Health モデルクラス
import com.nyanapp.repository.HealthRepository;  // データベース操作用
import org.springframework.beans.factory.annotation.Autowired;  // 自動的に必要なオブジェクトを注入
import org.springframework.http.ResponseEntity;  // HTTP レスポンスを作成
import org.springframework.web.bind.annotation.*;  // REST API の注解

import java.util.List;  // リスト（複数のデータ）
import java.util.Map;  // マップ（キーと値の組み合わせ）

/**
 * @RestController：このクラスが REST API のコントローラーであることを示す
 * @RequestMapping("/health")：すべてのメソッドが "/health" というURL で始まる
 * 
 * 例：POST /health  →  addHealth メソッドが実行される
 *    GET /health   →  getHealth メソッドが実行される
 */
@RestController
@RequestMapping("/health")
public class HealthController {
    
    /**
     * healthRepository：データベース操作を行うオブジェクト
     * @Autowired：Spring Boot が自動的に作成・注入してくれる
     * （プログラマーが new で作成する必要がない）
     */
    @Autowired
    private HealthRepository healthRepository;
    
    /**
     * addHealth メソッド：ペットの健康データをデータベースに保存する
     * 
     * @PostMapping：HTTP POST リクエスト（データを送信する）に対応
     * @RequestBody：リクエストボディ（送られてきたデータ）を Health オブジェクトに自動変換
     * @return：HTTP レスポンス（サーバーからの返信）
     * 
     * 使用例：
     * POST http://localhost:8080/health
     * リクエストボディ: {"date": "2024-01-15", "weight": 4.5, "food": 100, "water": 200, "mood": "happy"}
     * レスポンス: {"message": "saved"}
     */
    @PostMapping
    public ResponseEntity<Map<String, String>> addHealth(@RequestBody Health health) {
        // データベースに保存
        healthRepository.save(health);
        // 保存成功のメッセージを返す（HTTP ステータス 200 OK）
        return ResponseEntity.ok(Map.of("message", "saved"));
    }
    
    /**
     * getHealth メソッド：すべての健康データをデータベースから取得する
     * 
     * @GetMapping：HTTP GET リクエスト（データを取得する）に対応
     * @return：保存されているすべての Health データのリスト
     * 
     * 使用例：
     * GET http://localhost:8080/health
     * レスポンス: [{"id": 1, "date": "2024-01-15", "weight": 4.5, ...}, {...}]
     */
    @GetMapping
    public ResponseEntity<List<Health>> getHealth() {
        // データベースからすべてのデータを取得して返す（HTTP ステータス 200 OK）
        return ResponseEntity.ok(healthRepository.findAll());
    }
}
