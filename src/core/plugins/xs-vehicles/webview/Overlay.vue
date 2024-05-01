<template>
    <div class="outer" v-if="display">
        <div class="inner">
            <div class="elevator">
                {{ speed }}
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import WebViewEvents from '@ViewUtility/webViewEvents';
import { ref, onMounted } from 'vue';
import { XVEHICLE_VIEW_EVENTS } from '../shared/enum/events';

const ComponentName = 'Spedometer';

let speed = ref(0)
let display = ref(true);

function setSpeed(_speed: number) {
    speed.value = _speed
}

onMounted(() => {
    WebViewEvents.emitReady(ComponentName);
})
</script>

<style scoped>
.outer {
    height: 100%;
}

.inner {
    position: absolute;
    color: red;
    bottom: 10px;
    font-size: 50px;
}
</style>