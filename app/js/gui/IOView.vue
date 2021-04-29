<template>
    <div class="screen">
        <div class="screen">
            <div class="container h-100">
                <div class="row h-100">

                    <div v-for="columnIndex in 2" :key="columnIndex" class="col-sm text-center">
                        <h3 class="text-light mt-3">Port 0</h3>
                        <button v-for="buttonIndex in 8" :class="{'btn-warning': !isPinSelected(0, pinId(columnIndex, buttonIndex)),
                                'bg-success': isPinSelected(0, pinId(columnIndex, buttonIndex))}"
                                class="btn text-light btn-lg mt-3 btn-block"
                                @click="togglePin(0, pinId(columnIndex, buttonIndex))">Pin
                            {{ pinId(columnIndex, buttonIndex) }}
                        </button>
                    </div>

                    <div class="col-sm text-center">
                        <h3 class="text-light mt-3">Columns</h3>
                        <button v-for="(pin, index) in 5"
                                class="btn bg-primary text-light btn-lg mt-3 btn-block"
                                @click="setLightState(index)">#{{ index + 1 }}</button>
                    </div>

<!--                    <div class="col-sm text-center">-->
<!--                        <h3 class="text-light mt-3">Upper row</h3>-->
<!--                        <button v-for="(pin, index) in lowerRowPins" :class="{'btn-warning': !isPinSelected(0, pin),-->
<!--                                    'bg-success': isPinSelected(0, pin)}"-->
<!--                                class="btn text-light btn-lg mt-3 btn-block"-->
<!--                                @click="togglePin(0, pin)">#{{ index + 1 }}</button>-->
<!--                    </div>-->

<!--                    <div v-for="columnIndex in 2" :key="columnIndex" class="col-sm text-center">-->
<!--                        <h3 class="text-light mt-3">Port 1</h3>-->
<!--                        <button v-for="buttonIndex in 8" :class="{'btn-warning': !isPinSelected(1, pinId(columnIndex, buttonIndex)),-->
<!--                                'bg-success': isPinSelected(1, pinId(columnIndex, buttonIndex))}"-->
<!--                                class="btn text-light btn-lg mt-3 btn-block"-->
<!--                                @click="togglePin(1, pinId(columnIndex, buttonIndex))">Pin-->
<!--                            {{ pinId(columnIndex, buttonIndex) }}-->
<!--                        </button>-->
<!--                    </div>-->
                </div>

            </div>
        </div>
    </div>
</template>

<script>

import axios from 'axios';

const ColumnPins = {
    upper: [
        3,14,15,4,11
    ],
    lower: [
        9,8,13,7,10
    ]
};

export default {
    name: "IOView",
    data() {
        return {
            port0State: [],
            port1State: []
        };
    },
    computed: {
        lowerRowPins() {
            return [
                9,8,13,7,10
            ];
        },
        upperRowPins() {
            return [
                3,14,15,4,11
            ];
        }
    },
    methods: {
        isPinSelected(port, pin) {
            if (port === 0) {
                return !this.port0State[pin] || false;
            }
            if (port === 1) {
                return !this.port1State[pin] || false;
            }
            return false;
        },
        portId(columnIndex) {
            return columnIndex < 3 ? 0 : 1;
        },
        pinId(columnIndex, buttonIndex) {
            if (columnIndex === 2) {
                buttonIndex += 8;
            }
            return buttonIndex;
        },
        togglePin(port, pin) {
            if (port === 0) {
                const val = !this.port0State[pin] || false;
                this.setPortPin(port, pin, () => {
                    this.$set(this.port0State, pin, val);
                });
            }
            if (port === 1) {
                const val = !this.port1State[pin] || false;
                this.setPortPin(port, pin, () => {
                    this.$set(this.port1State, pin, val);
                });
            }
        },
        setPortPin(port, pin, callback) {
            const pinName = 'pin' + pin;
            const state = this.isPinSelected(port, pin) ? 1 : 0;
            axios.get('http://raspberry.pi:8888/set-port-pins', {
                responseType: 'text',
                params: {
                    port: port,
                    [pinName]: state
                }
            })
                .then(function (response) {
                    callback();
                })
                .catch(function (error) {
                    alert(error);
                });
        },
        setPortPinSilent(pin, state) {
            const pinName = 'pin' + pin;
            axios.get('http://raspberry.pi:8888/set-port-pins', {
                responseType: 'text',
                params: {
                    port: 0,
                    [pinName]: state
                }
            });
        },
        setLightState(column) {
            for (const [i, v] of ColumnPins.lower.entries()) {
                this.setPortPinSilent(v, i === column)
            }
            for (const [i, v] of ColumnPins.upper.entries()) {
                this.setPortPinSilent(v, i === column)
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.screen {
    position: absolute;
    width: 1024px;
    height: 768px;
}
</style>