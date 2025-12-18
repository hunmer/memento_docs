# 插件轮播图功能实现文档

## 功能概述

为 Memento 文档站点的所有插件页面添加了基于 Swiper 的轮播图功能，展示插件的截图，提升文档的视觉效果和用户体验。

## 实现方案

### 1. 核心组件

**文件位置**: `.vitepress/theme/components/PluginSwiper.vue`

**特性**:
- 基于 Swiper.js 实现的响应式轮播图
- 支持导航按钮、分页器、自动播放
- 深色模式兼容
- 支持单个或多个截图的展示
- 懒加载图片优化性能

### 2. 主题配置

**文件位置**: `.vitepress/theme/index.js`

**功能**:
- 注册全局组件 `PluginSwiper`
- 集成自定义样式

**样式文件**: `.vitepress/theme/custom.css`
- 轮播图容器样式
- 导航和分页器样式
- 深色模式支持

### 3. 截图数据管理

组件内置了所有插件的截图数据映射，包含 22 个插件共 41 张截图：

```javascript
const screenshotData = {
  "activity": ["IMG_0050.PNG", "IMG_0051.PNG"],
  "chat": ["IMG_0046.PNG", "IMG_0047.PNG"],
  "diary": ["IMG_0048.PNG", "IMG_0049.PNG"],
  // ... 更多插件
}
```

### 4. 插件页面集成

已在以下 20 个插件页面顶部添加轮播图组件：

1. Activity - 活动追踪
2. Chat - 聊天
3. Diary - 日记
4. OpenAI - 助手
5. Bill - 账单
6. Goods - 物品
7. Notes - 笔记
8. Checkin - 签到
9. Calendar - 日历
10. Day - 纪念日
11. Todo - 任务
12. Tracker - 目标追踪
13. Contact - 联系人
14. Timer - 计时器
15. Store - 积分商店
16. Nodes - 节点笔记本
17. Habits - 习惯管理
18. Calendar Album - 日历相册
19. Database - 数据库

### 5. 自动化脚本

**文件位置**: `scripts/update-screenshots.cjs`

**功能**:
- 自动扫描 `.vitepress/public/screenshots` 目录
- 收集所有插件的截图文件
- 更新组件中的 `screenshotData` 对象
- 提供详细统计信息

**使用方法**:
```bash
npm run update:screenshots
```

**输出示例**:
```
🔍 扫描截图目录...
✅ 找到 22 个插件，共 41 张截图
   📁 activity: 2 张
   📁 agent_chat: 5 张
   ...

📝 更新组件文件...
✅ 组件文件更新成功！
```

## 技术细节

### 依赖库
- **swiper**: ^12.0.3 - 轮播图核心库
- **vitepress**: ^1.0.0 - 文档站点框架
- **vue**: ^3.3.0 - Vue 3 响应式框架

### 组件属性

```vue
<PluginSwiper
  plugin-name="activity"  // 插件名称（必填）
  :autoplay="true"        // 是否启用自动播放（可选，默认true）
/>
```

### 路径映射

插件名称与截图目录的映射关系：

```javascript
const pluginDirMap = {
  'activity': 'activity',
  'chat': 'chat',
  'day': 'days',           // 特殊映射：插件名为 day，目录名为 days
  'habits': 'habit',       // 特殊映射：插件名为 habits，目录名为 habit
  // ...
}
```

### 截图路径规则

截图文件应放置在：
```
.vitepress/public/screenshots/{插件目录名}/{截图文件}
```

例如：
```
.vitepress/public/screenshots/activity/IMG_0050.PNG
.vitepress/public/screenshots/chat/IMG_0046.PNG
```

## 部署与访问

### 开发模式
```bash
npm run docs:dev
```
访问地址: http://localhost:5176/

**⚠️ 重要提示**: 修复了模块加载错误
- 问题：`Failed to load module script` 错误
- 原因：base 路径配置为 `/memento_docs/` 导致本地开发时模块无法正确加载
- 解决方案：修改 VitePress 配置，使用动态 base 路径
  ```javascript
  base: process.env.NODE_ENV === 'production' ? '/memento_docs/' : './'
  ```

### 构建生产版本
```bash
npm run docs:build
npm run docs:preview
```

构建输出说明：
- 本地预览：扁平结构，直接访问 `http://localhost:4173/`
- 生产部署：使用 `/memento_docs/` 前缀，适用于 GitHub Pages 等静态托管

## 使用指南

### 添加新插件的截图

1. 将截图文件放入对应目录：
   ```
   .vitepress/public/screenshots/{插件名}/
   ```

2. 运行更新脚本：
   ```bash
   npm run update:screenshots
   ```

3. 重启开发服务器

4. 在插件页面添加组件（如果尚未添加）：
   ```markdown
   <PluginSwiper plugin-name="{插件名}" />
   ```

### 修改截图

1. 替换 `.vitepress/public/screenshots/{插件名}/` 中的文件
2. 重启开发服务器（无需运行更新脚本）

### 禁用自动播放

```vue
<PluginSwiper plugin-name="activity" :autoplay="false" />
```

## 文件清单

### 新增文件
- `.vitepress/theme/index.js` - 主题配置文件
- `.vitepress/theme/custom.css` - 自定义样式
- `.vitepress/theme/components/PluginSwiper.vue` - 轮播图组件
- `scripts/update-screenshots.cjs` - 截图更新脚本

### 修改文件
- `package.json` - 添加 `update:screenshots` 脚本命令
- `plugins/*/index.md` - 20个插件页面添加轮播图组件

## 效果预览

轮播图功能已部署至开发环境：
- **地址**: http://localhost:5176/plugins/activity/
- **特性**:
  - 自动播放（3秒间隔）
  - 左右导航按钮
  - 底部圆点分页器
  - 响应式设计
  - 深色模式兼容
  - 无模块加载错误

## 注意事项

1. 截图文件格式支持：PNG、JPG、JPEG
2. 截图文件名会自动排序
3. 单个截图不会显示导航按钮
4. 组件仅在有截图时显示
5. 图片采用懒加载优化性能

## 未来扩展

- [ ] 添加截图放大预览功能
- [ ] 支持视频截图轮播
- [ ] 添加截图描述文字
- [ ] 支持自定义轮播速度
- [ ] 添加截图下载功能
