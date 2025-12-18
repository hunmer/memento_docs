// .vitepress/theme/index.js
import DefaultTheme from 'vitepress/theme'
import PluginSwiper from './components/PluginSwiper.vue'
import './custom.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    // 注册全局组件
    app.component('PluginSwiper', PluginSwiper)
  }
}
