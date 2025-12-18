<template>
  <div v-if="screenshots.length > 0" class="plugin-swiper-container">
    <swiper
      :modules="modules"
      :slides-per-view="1"
      :space-between="30"
      :rewind="true"
      :autoplay="autoplayEnabled ? {
        delay: 3000,
        disableOnInteraction: false,
      } : false"
      :pagination="{ clickable: true }"
      :grab-cursor="true"
      :allow-touch-move="true"
      class="plugin-swiper"
      @swiper="onSwiper"
    >
      <swiper-slide v-for="(screenshot, index) in screenshots" :key="index">
        <img
          :src="screenshot"
          :alt="`${pluginName} 截图 ${index + 1}`"
          loading="lazy"
          draggable="false"
        />
      </swiper-slide>
    </swiper>
    <!-- 自定义导航按钮（通过点击事件直接控制） -->
    <div class="swiper-nav-btn swiper-nav-prev" @click="slidePrev">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="15 18 9 12 15 6"></polyline>
      </svg>
    </div>
    <div class="swiper-nav-btn swiper-nav-next" @click="slideNext">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="9 18 15 12 9 6"></polyline>
      </svg>
    </div>
  </div>
</template>

<script setup>
import { shallowRef, computed } from 'vue'
import { withBase } from 'vitepress'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Pagination, Autoplay } from 'swiper/modules'

// 导入 Swiper 样式
import 'swiper/css'
import 'swiper/css/pagination'

// Swiper 实例（使用 shallowRef 避免深度响应式代理破坏实例方法）
const swiperRef = shallowRef(null)

const onSwiper = (swiper) => {
  swiperRef.value = swiper
}

// 导航方法
const slidePrev = () => {
  console.log('slidePrev', swiperRef.value)
  swiperRef.value?.slidePrev()
}

const slideNext = () => {
  console.log('slideNext', swiperRef.value)
  swiperRef.value?.slideNext()
}

const props = defineProps({
  // 插件名称（与 plugins/ 目录下的文件夹名一致）
  pluginName: {
    type: String,
    required: true
  },
  // 是否启用自动播放
  autoplay: {
    type: Boolean,
    default: true
  }
})

// Swiper 模块
const modules = [Pagination, Autoplay]

// 是否启用自动播放
const autoplayEnabled = computed(() => props.autoplay)

// 获取截图目录名
const screenshotDir = computed(() => {
  return pluginDirMap[props.pluginName] || props.pluginName
})

// 获取截图路径列表
const screenshots = computed(() => {
  const dir = screenshotDir.value
  const files = screenshotData[dir] || []

  // 构建完整路径（使用 VitePress 的 withBase 动态获取 base 路径）
  return files.map(file => withBase(`/screenshots/${dir}/${file}`))
})

// 插件名映射到截图目录名 (unchanged)
const pluginDirMap = {
  'activity': 'activity',
  'chat': 'chat',
  'diary': 'diary',
  'notes': 'notes',
  'openai': 'openai',
  'goods': 'goods',
  'bill': 'bill',
  'checkin': 'checkin',
  'calendar': 'calendar',
  'day': 'days',              // 映射不一致
  'todo': 'todo',
  'tracker': 'tracker',
  'contact': 'contact',
  'timer': 'timer',
  'store': 'store',
  'nodes': 'nodes',
  'calendar_album': 'calendar',  // 可能需要调整
  'habits': 'habit',          // 映射不一致
  'database': 'database'
}

// 所有截图数据（从脚本获取） (unchanged)
const screenshotData = {
  "activity": [
    "IMG_0050.PNG",
    "IMG_0051.PNG"
  ],
  "agent_chat": [
    "IMG_0052.PNG",
    "IMG_0057.PNG",
    "IMG_0058.PNG",
    "IMG_0060.PNG",
    "IMG_0061.PNG"
  ],
  "bill": [
    "IMG_0068.PNG",
    "IMG_0070.PNG",
    "IMG_0071.PNG",
    "IMG_0072.PNG",
    "IMG_0073.PNG"
  ],
  "calendar": [
    "IMG_0078.PNG"
  ],
  "chat": [
    "IMG_0046.PNG",
    "IMG_0047.PNG"
  ],
  "checkin": [
    "IMG_0077.PNG"
  ],
  "contact": [
    "IMG_0089.PNG"
  ],
  "days": [
    "IMG_0082.PNG"
  ],
  "diary": [
    "IMG_0048.PNG",
    "IMG_0049.PNG"
  ],
  "floatingball": [
    "IMG_0095.PNG"
  ],
  "goods": [
    "IMG_0063.PNG",
    "IMG_0067.PNG"
  ],
  "habit": [
    "IMG_0090.PNG",
    "IMG_0091.PNG"
  ],
  "home": [
    "IMG_0094.PNG"
  ],
  "nodes": [
    "IMG_0088.PNG"
  ],
  "notes": [
    "IMG_0062.PNG"
  ],
  "openai": [
    "IMG_0053.PNG",
    "IMG_0054.PNG",
    "IMG_0055.PNG",
    "IMG_0056.PNG"
  ],
  "settings": [
    "IMG_0096.PNG"
  ],
  "store": [
    "IMG_0086.PNG",
    "IMG_0087.PNG"
  ],
  "timer": [
    "IMG_0079.PNG"
  ],
  "todo": [
    "IMG_0075.PNG",
    "IMG_0076.PNG"
  ],
  "tracker": [
    "IMG_0085.PNG"
  ],
  "webview": [
    "IMG_0092.PNG",
    "IMG_0093.PNG"
  ]
}
</script>

<style scoped>
.plugin-swiper-container {
  position: relative;
  margin: 2rem 0;
}

.plugin-swiper {
  --swiper-pagination-color: var(--vp-c-brand-1);
}

/* 自定义导航按钮 */
.swiper-nav-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 10;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--vp-c-brand-1);
  opacity: 0.7;
  transition: opacity 0.2s ease;
}

.swiper-nav-btn:hover {
  opacity: 1;
}

.swiper-nav-btn svg {
  width: 24px;
  height: 24px;
}

.swiper-nav-prev {
  left: 8px;
}

.swiper-nav-next {
  right: 8px;
}

/* 图片样式：禁止选中和拖拽 */
:deep(.swiper-slide) img {
  display: block;
  width: 100%;
  height: auto;
  border-radius: 8px;
  user-select: none;
  -webkit-user-select: none;
  -webkit-user-drag: none;
  pointer-events: none;
}
</style>