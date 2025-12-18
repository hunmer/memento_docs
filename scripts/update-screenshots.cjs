#!/usr/bin/env node

/**
 * 自动扫描截图目录并更新 PluginSwiper 组件中的截图数据
 *
 * 使用方法: node scripts/update-screenshots.js
 */

const fs = require('fs');
const path = require('path');

const SCREENSHOTS_DIR = path.join(__dirname, '../.vitepress/public/screenshots');
const COMPONENT_FILE = path.join(__dirname, '../.vitepress/theme/components/PluginSwiper.vue');

/**
 * 扫描截图目录获取所有插件的截图文件
 */
function scanScreenshots() {
  const result = {};

  if (!fs.existsSync(SCREENSHOTS_DIR)) {
    console.error('❌ 截图目录不存在:', SCREENSHOTS_DIR);
    return result;
  }

  const dirs = fs.readdirSync(SCREENSHOTS_DIR, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

  for (const dir of dirs) {
    const dirPath = path.join(SCREENSHOTS_DIR, dir);
    const files = fs.readdirSync(dirPath)
      .filter(file => /\.(png|jpg|jpeg)$/i.test(file))
      .sort();

    if (files.length > 0) {
      result[dir] = files;
    }
  }

  return result;
}

/**
 * 更新组件文件中的截图数据
 */
function updateComponent(screenshotData) {
  if (!fs.existsSync(COMPONENT_FILE)) {
    console.error('❌ 组件文件不存在:', COMPONENT_FILE);
    return false;
  }

  let content = fs.readFileSync(COMPONENT_FILE, 'utf-8');

  // 查找并替换 screenshotData 对象
  const dataStr = JSON.stringify(screenshotData, null, 2);
  const regex = /const screenshotData = \{[\s\S]*?\n\}/;

  if (!regex.test(content)) {
    console.error('❌ 无法找到 screenshotData 定义');
    return false;
  }

  content = content.replace(regex, `const screenshotData = ${dataStr}`);

  fs.writeFileSync(COMPONENT_FILE, content, 'utf-8');

  return true;
}

/**
 * 主函数
 */
function main() {
  console.log('🔍 扫描截图目录...');
  const screenshotData = scanScreenshots();

  const pluginCount = Object.keys(screenshotData).length;
  const totalScreenshots = Object.values(screenshotData).reduce((sum, files) => sum + files.length, 0);

  console.log(`✅ 找到 ${pluginCount} 个插件，共 ${totalScreenshots} 张截图`);

  // 显示详细信息
  for (const [plugin, files] of Object.entries(screenshotData)) {
    console.log(`   📁 ${plugin}: ${files.length} 张`);
  }

  console.log('\n📝 更新组件文件...');
  if (updateComponent(screenshotData)) {
    console.log('✅ 组件文件更新成功！');
    console.log('\n💡 提示：重启开发服务器以查看更新效果');
  } else {
    console.error('❌ 组件文件更新失败');
    process.exit(1);
  }
}

main();
