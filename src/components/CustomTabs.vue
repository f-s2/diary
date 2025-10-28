<template>
	<div class="relative">
		<div class="flex gap-8px mb-0 overflow-x-auto" ref="navRef">
			<span
                class="px-10px py-7px rounded-3px text-13px flex-shrink-0 bg-white"
                :class="[active === key ? 'color-primary font-500 border-1px border-solid border-primary' : 'color-#999']"
				v-for="({ name, key }, i) in list"
				:key="key"
				@click="changeSort(key, i)"
				ref="titles"
			>
				{{ name }}
			</span>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { nextTick, ref, watch } from 'vue'

	const props = defineProps<{
		list: {name: string, key: any}[]
		value?: string
        selectDefault?: boolean
	}>()

	const titles = ref<HTMLElement>()

	const navRef = ref<HTMLElement>()

    const active = ref<string>()

	const emit = defineEmits<{
		(e: 'update:value', value: string): void
		(e: 'change', option:{value: string, index: number, key: string}): void
	}>()

    watch(active, nv => {
        if(nv !== props.value) {
            emit('update:value', nv)
            const index = props.list.findIndex(v => v.key === nv)
            emit('change', {value: nv, key:nv, index})
        }
    })

    watch(() => props.value, nv => {
        if(nv !== active.value) {
            active.value = nv
        }
    })

    watch(() => props.list.reduce((pre, cur) => pre+=`${cur.key}`,''), (nv) => {
        if(nv) {        
            if(props.selectDefault) {
                !props.value && changeSort(props.list[0].key, 0)
            } else {
                active.value = undefined
            }   
        }
    }, {
        immediate: true
    })

	function changeSort(value: string, index: number) {
        active.value = value        
		nextTick(() => handleScroll(index))
	}

	function scrollLeftTo(scroller: HTMLElement, to: number, timer = 1) {
    // 已经渲染的帧数
		let count = 0
		
		const from = scroller.scrollLeft
    
		const frames = Math.round(timer * 60) // 需要渲染的总帧数

		function anime() {
      // 每一帧画面需要位移的距离
			scroller.scrollLeft += (to - from) / frames

      // 当已渲染的帧数少于需渲染总帧数，继续进行渲染
			if(++count < frames) {
				requestAnimationFrame?.(anime)
			}
		}

		anime()
	}

	function handleScroll(index: number) {
		if (!navRef.value) return

		const title = titles.value[index]
    // 相对比较靠中间的位置
		const to = title.offsetLeft - (navRef.value.offsetWidth - title.offsetWidth) / 2

		scrollLeftTo(navRef.value, to, 0.3)
	}
</script>