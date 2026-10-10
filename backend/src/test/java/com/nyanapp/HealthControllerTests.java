package com.nyanapp;

// テスト実行の目印やSpringのテスト環境を読み込む
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;

// GET/POSTリクエストを組み立てるテスト用メソッド
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
// HTTPステータスとJSONの応答内容を検証するメソッド
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

// Spring Bootを起動し、HTTP経由で健康APIを検証するテスト群
@SpringBootTest
@AutoConfigureMockMvc
public class HealthControllerTests {

    // 実サーバーを起動せずAPIリクエストを再現するテスト用クライアント
    @Autowired
    private MockMvc mockMvc;

    // 健康データをPOSTし、保存成功の応答を確認する
    @Test
    public void testAddHealth() throws Exception {
        // /healthへJSON形式の健康記録をPOSTする
        mockMvc.perform(post("/health")
            // リクエスト本文がJSONであることを指定する
                .contentType("application/json")
            // 日付、体重、食事、水分、気分を含むテストデータを送る
                .content("{\"date\": \"2024-01-15\", \"weight\": 4.5, \"food\": 100, \"water\": 200, \"mood\": \"happy\"}"))
            // APIがHTTP 200を返すことを確認する
                .andExpect(status().isOk())
            // 応答JSONのmessageがsavedであることを確認する
                .andExpect(jsonPath("$.message").value("saved"));
    }

    // 健康データのGETが成功ステータスを返すことを確認する
    @Test
    public void testGetHealth() throws Exception {
        // /healthへGETリクエストを送り、一覧取得APIを呼び出す
        mockMvc.perform(get("/health"))
            // APIが正常なHTTP 200を返すことを確認する
                .andExpect(status().isOk());
    }
}
