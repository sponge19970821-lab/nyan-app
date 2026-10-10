/**
 * HealthRepository インターフェース
 * データベースへのアクセスを管理するクラスです
 * データの保存（save）、読み込み（find）、削除（delete）などを行います
 */

package com.nyanapp.repository;

// 必要なクラスをインポート
import com.nyanapp.model.Health;  // Health クラスをインポート
import org.springframework.data.jpa.repository.JpaRepository;  // データベース操作用の基本メソッドを持つインターフェース
import org.springframework.stereotype.Repository;  // このクラスがリポジトリであることを示す

/**
 * @Repository：このクラスがデータベース操作を担当することを示す
 * このアノテーションをつけることで、Spring Boot がこのクラスを自動的に管理する
 * 
 * JpaRepository<Health, Long> について：
 * - Health：このリポジトリが管理するモデルクラス
 * - Long：主キー（id）のデータ型
 * 
 * JpaRepository を継承するだけで、以下のメソッドが自動的に使える：
 * - save()：データをデータベースに保存
 * - findAll()：すべてのデータを取得
 * - findById()：ID で特定のデータを取得
 * - delete()：データをデータベースから削除
 * - 他にも多数のメソッドが自動的に使える
 */
@Repository
public interface HealthRepository extends JpaRepository<Health, Long> {
    // カスタムメソッドが必要な場合はここに追加
    // 基本的なメソッドは JpaRepository が提供するので、
    // 複雑な検索などが必要なときだけ新しいメソッドを定義する
}
}
