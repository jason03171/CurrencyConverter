# historical-exchange-rate-chart Specification

## Purpose
TBD - created by archiving change add-historical-exchange-rate-chart. Update Purpose after archive.
## Requirements
### Requirement: 歷史匯率圖表顯示
系統**必須**能夠顯示選定貨幣對的歷史匯率趨勢圖表，使用線圖格式顯示過去一段時間的匯率變化。

#### Scenario: 成功載入30天歷史圖表
- **WHEN** 用戶選擇貨幣對並點擊"查看歷史"按鈕
- **THEN** 系統顯示modal窗口，包含過去30天的匯率線圖
- **AND** 圖表顯示日期在X軸，匯率值在Y軸
- **AND** 圖表包含網格線和數據點標記

#### Scenario: 圖表載入中顯示
- **WHEN** 用戶請求歷史圖表且數據正在獲取中
- **THEN** 系統顯示載入指示器
- **AND** 禁用modal的關閉按鈕直到數據載入完成

#### Scenario: 圖表載入失敗處理
- **WHEN** 歷史數據獲取失敗
- **THEN** 系統顯示錯誤訊息"無法載入歷史數據"
- **AND** 提供"重試"按鈕讓用戶重新嘗試

### Requirement: 時間範圍選擇
系統**必須**允許用戶選擇不同的歷史時間範圍來查看圖表。

#### Scenario: 切換到7天視圖
- **WHEN** 用戶在圖表modal中選擇"7天"選項
- **THEN** 圖表更新顯示過去7天的數據
- **AND** X軸標籤調整為每日格式

#### Scenario: 切換到90天視圖
- **WHEN** 用戶選擇"90天"選項
- **THEN** 圖表更新顯示過去90天的數據
- **AND** X軸標籤調整為每週格式

### Requirement: 歷史數據獲取
系統**必須**能夠從API獲取指定貨幣對和時間範圍的歷史匯率數據。

#### Scenario: API數據獲取成功
- **WHEN** 系統請求歷史數據
- **THEN** API返回包含日期和匯率值的JSON數組
- **AND** 數據按日期升序排序
- **AND** 每個數據點包含日期字串和數值匯率

#### Scenario: 數據緩存使用
- **WHEN** 請求的歷史數據已在24小時內緩存
- **THEN** 系統使用緩存數據而非重新API調用
- **AND** 圖表顯示最後更新時間

#### Scenario: API失敗時的fallback
- **WHEN** 歷史API調用失敗
- **THEN** 系統顯示錯誤訊息
- **AND** 不阻止用戶繼續使用基本轉換功能

### Requirement: 圖表互動功能
系統**必須**提供基本的圖表互動功能以增強用戶體驗。

#### Scenario: 數據點懸停顯示
- **WHEN** 用戶將滑鼠懸停在圖表數據點上
- **THEN** 顯示tooltip包含確切的日期和匯率值

#### Scenario: 響應式圖表
- **WHEN** modal窗口大小改變
- **THEN** 圖表自動調整大小以適應新尺寸
- **AND** 保持圖表的可讀性

### Requirement: 圖表關閉功能
系統**必須**提供明確的方式讓用戶關閉歷史圖表modal。

#### Scenario: 點擊關閉按鈕
- **WHEN** 用戶點擊modal右上角的X按鈕
- **THEN** modal窗口關閉
- **AND** 返回到主轉換界面

#### Scenario: 點擊背景遮罩
- **WHEN** 用戶點擊modal背景區域
- **THEN** modal窗口關閉
- **AND** 返回到主轉換界面

