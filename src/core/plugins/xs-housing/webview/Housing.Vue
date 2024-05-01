<template>
    <div class="outer" v-if="display">
        <div class="inner">
            <div class="house float-right " v-if="isHouse">
                <div class="img ">
                    <img class="img-header" src="/plugins/img.jpg" />
                </div>
                <div class="address ">
                    {{ appartment.address }}
                </div>
                <div class="controlls ">
                    <div class="controll-item " @mouseover="hover">Klingeln</div>
                    <div class="controll-item " @click="toggleLock" v-if="appartment.door_locked">Locked</div>
                    <div class="controll-item " @click="toggleLock" v-if="!appartment.door_locked">Unlocked</div>

                    <div class="controll-item " @mouseover="hover" @click="enter">Haus Betreten</div>
                </div>

            </div>
            <div class="highrise float-right debug-border" v-if="isHighrise">

            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import WebViewEvents from '@ViewUtility/webViewEvents';
import { ref, onMounted } from 'vue';
import { HOUSING_INTERACTIONS } from '@AthenaPlugins/x-housing/shared/enums/events';
import { IAppartment } from '@AthenaPlugins/x-housing/shared/interfaces/IAppartment';

const ComponentName = 'Housing';

let appartment = ref({ dimension: 0, address: "", pos: { x: 0, y: 0, z: 0 } } as IAppartment)
let display = ref(true);
let isHouse = ref(true);
let isHighrise = ref(false);

function setAppartment(_appartment: IAppartment) {
    appartment.value = _appartment

}
function enter() {
    if (!appartment.value.door_locked) {
        WebViewEvents.emitClient(HOUSING_INTERACTIONS.ENTER)
    }
}
function hover() {
    //WebViewEvents.playSoundFrontend('HIGHLIGHT', 'HUD_FRONTEND_DEFAULT_SOUNDSET');
}
function toggleLock() {
    WebViewEvents.emitClient(HOUSING_INTERACTIONS.TOGGLE_LOCK)
}

onMounted(() => {
    WebViewEvents.on(HOUSING_INTERACTIONS.VIEW_SETAPPARTMENT, setAppartment)
    //WebViewEvents.on(HOUSING_INTERACTIONS.TOGGLE_LOCK, this.toggleLock);
    WebViewEvents.emitReady(ComponentName);
})
</script>

<style scoped>
.outer {
    width: 100%;
    color: black;

}

.inner {
    float: right;
    opacity: 0.9;
    background-color: gray;
}

.house {
    width: 500px;
    height: 250px;
    position: absolute;
    bottom: 0px;
    right: 0px;
    background-color: gray;
    margin-right: 20px;
    margin-bottom: 60px;
}

.img {
    height: 150px;
    overflow: hidden;
    display: inline-block;
}

.img-header {
    max-width: 500px;
    margin-top: -110px;
    opacity: 0.7;
}

.address {
    font-size: 24px;
    text-align: center;
    margin: 5px;
    background-color: gray;
}

.controll-item {
    margin: 9px;
    width: 140px;
    float: right;
    text-align: center;
    border: 1px;
    border-style: double;
}

.lock {}

.debug-border {
    border: 2px;
    border-color: black;
    border-radius: 5px;
    border-style: dashed;
}
</style>