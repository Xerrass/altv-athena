<template>
    <Frame minWidth="500px" maxWidth="500px">
        <div>
            <p>test</p>
        </div>

    </Frame>
</template>

<script lang="ts">
import WebViewEvents from '@ViewUtility/webViewEvents';
import { defineComponent, defineAsyncComponent } from 'vue';
import ResolvePath from '@utility/pathResolver';
//import { HOUSING_INTERACTIONS } from '@AthenaPlugins/x-housing/shared/events';


export const ComponentName = 'Housing';
export default defineComponent({
    name: ComponentName,
    components: {
        Button: defineAsyncComponent(() => import('@components/Button.vue')),
        Frame: defineAsyncComponent(() => import('@components/Frame.vue')),
        Icon: defineAsyncComponent(() => import('@components/Icon.vue')),
        Toolbar: defineAsyncComponent(() => import('@components/Toolbar.vue')),
    },
    props: {
        emit: Function,
    },
    data() {
        return {

        };
    },
    methods: {
        ResolvePath,
        relayClosePage() {
            WebViewEvents.emitClose();
        },
        setLocales(localeObject) {
            this.locales = localeObject;
        },
        toggleLock() {

        }
    },
    mounted() {
        //WebViewEvents.on(HOUSING_INTERACTIONS.TOGGLE_LOCK, this.toggleLock);
        WebViewEvents.emitReady(ComponentName);

    },
});
</script>