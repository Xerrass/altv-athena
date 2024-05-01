<template>
    <div class="outer" v-if="display">
        <div class="inner">
            <div class="elevator">
                <div class="header">
                    {{ elevator.name }}
                </div>
                <div class="spots">
                    <div class="spot" v-for="elevatorStop in elevator.elevatorStops">
                        <div v-if="elevatorStop.show" class="spot-inner" @click="teleport(elevatorStop)">
                            <button class="spot-button">
                                <div class="spot-text">{{ elevatorStop.name }}</div>

                            </button>
                        </div>


                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import WebViewEvents from '@ViewUtility/webViewEvents';
import { ELEVATOR_EVENTS } from '../shared/enum/events'
import { IElevator, IElevatorStop } from '../shared/interfaces/IElevator'
import { ref, onMounted } from 'vue';

const ComponentName = 'Elevator';

let elevator = ref({} as IElevator)
let display = ref(true);

function setElevator(_elevator: IElevator) {
    elevator.value = _elevator
}

function hover() {
    //WebViewEvents.playSoundFrontend('HIGHLIGHT', 'HUD_FRONTEND_DEFAULT_SOUNDSET');
}

function teleport(elevatorStop) {
    WebViewEvents.emitClient(ELEVATOR_EVENTS.VIEW_TELEPORT, elevatorStop)
    //WebViewEvents.playSoundFrontend('HIGHLIGHT', 'HUD_FRONTEND_DEFAULT_SOUNDSET');
}

onMounted(() => {
    WebViewEvents.on(ELEVATOR_EVENTS.VIEW_SETELEVATOR, setElevator)
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
}

.elevator {
    width: 400px;
    position: absolute;
    right: 0px;
    margin-right: 20px;
    margin-bottom: 60px;
    text-align: center;
    margin: 10px;
    border: 2px;
    border-color: black;
    border-radius: 2px;
    border-style: double;
    background-image: url("/plugins/xs-elevator-background.jpg");
}

.spots {
    border: 0px;
}

.spot-inner {
    width: inherit;
    margin: 15px;
    height: 200px;
    background-image: url("/plugins/xs-elevator-elevatorPannel.png");
    background-size: contain;
    background-repeat: no-repeat;
}

.spot-button {
    font-size: 32px;
    border-radius: 12px;
    border: 0px;
    margin-top: 10px;
    margin-bottom: 10px;
    background-color: rgba(0, 255, 255, 0.0);

}

.spot-text {
    font-size: 32px;
    color: black;
    font-weight: 700;
    border-radius: 40px;
    width: inherit;
    height: 50px;
    padding-top: 65px;
    padding-right: 100px;
}

.img {
    height: 150px;
    overflow: hidden;
    display: inline-block;
}

.img-header {
    max-width: 200px;
    max-height: 75px;
    opacity: 0.7;
}

.header {
    font-size: 40px;
    text-align: center;
    margin: 5px;
    border-radius: 10px;
    border: 2px;
    border-color: black;
    border-style: double;
    background-color: rgba(200, 200, 200, 1);
}

.debug-border {
    border: 2px;
    border-color: black;
    border-radius: 5px;
    border-style: dashed;
}
</style>