/**
 * Health クラス
 * ペットの健康データを保存するクラスです
 * データベースに保存される情報を定義しています
 */

package com.nyanapp.model;

// データベース関連のインポート
import jakarta.persistence.Entity;  // このクラスをデータベースのテーブルにする
import jakarta.persistence.GeneratedValue;  // IDを自動生成する
import jakarta.persistence.GenerationType;  // ID自動生成の方法を指定
import jakarta.persistence.Id;  // 主キー（ユニークな識別番号）

/**
 * @Entity：このクラスがデータベースのテーブルになることを示す
 * つまり、各フィールドがデータベースのカラム（列）になります
 */
@Entity
public class Health {
    
    /**
     * id フィールド：データベース上での唯一の識別番号
     * @Id：このフィールドが主キー（主な鍵）であることを示す
     * @GeneratedValue：idを自動で1, 2, 3...と増やしていく
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;  // Long型：大きい整数を格納できる
    
    // 以下はペットの情報
    private String date;    // 日付（例："2024-01-15"）
    private Double weight;  // 体重（例：4.5 kg）
    private Integer food;   // 食事の量（例：100 g）
    private Integer water;  // 水の量（例：200 ml）
    private String mood;    // 機嫌（例："happy" または "sad"）

    /**
     * コンストラクタ（空のコンストラクタ）
     * データベースから読み込むときなど、フィールドを指定しない場合に使用
     */
    public Health() {}
    
    /**
     * コンストラクタ（パラメータ付き）
     * 新しいデータを作成するときに、すべてのフィールドを指定して使用する
     * 
     * @param date ペットの日付
     * @param weight ペットの体重
     * @param food ペットの食事量
     * @param water ペットの水分量
     * @param mood ペットの気分
     */
    public Health(String date, Double weight, Integer food, Integer water, String mood) {
        this.date = date;
        this.weight = weight;
        this.food = food;
        this.water = water;
        this.mood = mood;
    }    
    // ========== Getter / Setter メソッド ==========
    // Getter：フィールドの値を取得するメソッド
    // Setter：フィールドの値を設定するメソッド
    
    /** データベースが割り当てた識別番号を返す */
    public Long getId() {
        return id;
    }

    /** データベース上の識別番号を設定する */
    public void setId(Long id) {
        this.id = id;
    }

    /** 記録日を返す */
    public String getDate() {
        return date;
    }

    /** 記録日を設定する */
    public void setDate(String date) {
        this.date = date;
    }

    /** 体重を返す */
    public Double getWeight() {
        return weight;
    }

    /** 体重を設定する */
    public void setWeight(Double weight) {
        this.weight = weight;
    }    
    /** 食事量を返す */
    public Integer getFood() {
        return food;
    }

    /** 食事量を設定する */
    public void setFood(Integer food) {
        this.food = food;
    }

    /** 飲水量を返す */
    public Integer getWater() {
        return water;
    }

    /** 飲水量を設定する */
    public void setWater(Integer water) {
        this.water = water;
    }

    /** 気分を返す */
    public String getMood() {
        return mood;
    }

    /** 気分を設定する */
    public void setMood(String mood) {
        this.mood = mood;
    }
}
