<template>
<div class="body">
    <div class="hide">Room ID: {{ this.$route.query.r }}</div>
    <div class="hide">Card ID: {{ this.$route.query.cd }}</div>
    <div class="card d-block m-3 p-2">
        <div><span class="small d-inline-block font-weight-bold w-25">{{ $t('room_name') }}</span>{{ this.roomName }}</div>
        <div><span class="small d-inline-block font-weight-bold w-25">{{ $t('player_name') }}</span>{{ this.playerName }}</div>
    </div>
 
    <div class="bingo-card">
        <table>
            <tr>
                <th v-for="t in titles" v-bind:key="t"><span>{{ t }}</span></th>
            </tr>
            <tr v-for="v in vNums" v-bind:key="v">
                <td v-for="h in hNums" v-bind:key="h" v-bind:class="drawnNumber(numbers[v][h])">
                    <div v-bind:class="drawnCircle(numbers[v][h])">
                        <span v-if="numbers[v][h] == '*'" class="free">FREE</span>
                        <span v-else class="number">{{ numbers[v][h] }}</span>
                    </div>
                </td>
            </tr>
        </table>
        <div class="line-area">
            <div v-for="i in [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]" v-bind:key="i" v-bind:class="bingoLine(i)"></div>
        </div>
    </div>

    <div v-bind:class="readyToStart">
        <div class="ready-to-start">{{ $t('text.wait_start_game') }}</div>
    </div>
    <div v-bind:class="reachCutin">
        <div class="reach-cutin">{{ $t('reach') }}!</div>
    </div>
    <div v-bind:class="bingoCutin">
        <div class="bingo-cutin">{{ $t('bingo') }}!</div>
    </div>
    <div v-bind:class="drawCutin">
        <div class="draw-cutin">{{ drawnNumbers[drawnNumbers.length - 1] }}</div>
    </div>

</div>
</template>

<script>
import firebase from '~/plugins/firebase';
import 'firebase/firestore';
import * as Cookies from 'js-cookie';
import cookie from 'cookie';

export default {
    data: () => {
        return {
            roomName: '',
            playerName: '',
            titles: ['B', 'I', 'N', 'G', 'O'],
            vNums: [0, 1, 2, 3, 4],
            hNums: [0, 1, 2, 3, 4],
            numbers: [
                [],
                [],
                [],
                [],
                [],
            ],
            drawnNumbers: [],
            reach: false,
            bingo: false,
            draw: false,
            ready: false,
            statuses: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        }
    },
    created() {
        const db = firebase.firestore();
        let rooms = db.collection('rooms');
        rooms.doc(this.$route.query.r).onSnapshot(doc => {
            this.roomName = doc.data().name;
            this.drawnNumbers = doc.data().drawnNumbers;
            this.ready = (doc.data().status == 0)
            if (doc.data().status == 1 && this.drawnNumbers.length > 0) {
                this.draw = true;
                const animated = document.querySelector('.draw-cutin');
                animated.onanimationend = () => {
                    this.draw = false;
                };
            }
            this.judgement();
        });
        let cards = db.collection('cards');
        cards.doc(this.$route.query.c).onSnapshot(doc => {
            this.playerName = doc.data().playerName;
            this.numbers = JSON.parse(doc.data().numbers);
            this.judgement();
        });
    },
    computed: {
        reachCutin() {
            return {
                hide: !this.reach || this.bingo,
                reach: this.reach && !this.bingo,
            }
        },
        bingoCutin() {
            return {
                hide: !this.bingo,
                bingo: this.bingo,
            }
        },
        drawCutin() {
            return {
                hide: !this.draw,
                draw: this.draw,
            }
        },
        readyToStart() {
            return {
                hide: !this.ready,
                ready: this.ready,
            }
        }
    },
    methods: {
        drawnNumber(no) {
            return {
                'drawn-number': this.drawnNumbers.includes(no)
            }
        },
        drawnCircle(no) {
            return {
                circle: true,
                'drawn-circle': this.drawnNumbers.includes(no) || no == '*'
            }
        },
        bingoLine(index) {
            let classes = {
                'bingo-line': true,
                hide: this.statuses[index] != 2,
            };
            classes['line' + (index + 1)] = this.statuses[index] == 2
            return classes;
        },
        judgement() {
            const lines = [
                [{v:0, h:0}, {v:1, h:0}, {v:2, h:0}, {v:3, h:0}, {v:4, h:0}],
                [{v:0, h:1}, {v:1, h:1}, {v:2, h:1}, {v:3, h:1}, {v:4, h:1}],
                [{v:0, h:2}, {v:1, h:2},             {v:3, h:2}, {v:4, h:2}],
                [{v:0, h:3}, {v:1, h:3}, {v:2, h:3}, {v:3, h:3}, {v:4, h:3}],
                [{v:0, h:4}, {v:1, h:4}, {v:2, h:4}, {v:3, h:4}, {v:4, h:4}],
                [{v:0, h:0}, {v:0, h:1}, {v:0, h:2}, {v:0, h:3}, {v:0, h:4}],
                [{v:1, h:0}, {v:1, h:1}, {v:1, h:2}, {v:1, h:3}, {v:1, h:4}],
                [{v:2, h:0}, {v:2, h:1},             {v:2, h:3}, {v:2, h:4}],
                [{v:3, h:0}, {v:3, h:1}, {v:3, h:2}, {v:3, h:3}, {v:3, h:4}],
                [{v:4, h:0}, {v:4, h:1}, {v:4, h:2}, {v:4, h:3}, {v:4, h:4}],
                [{v:0, h:0}, {v:1, h:1},             {v:3, h:3}, {v:4, h:4}],
                [{v:0, h:4}, {v:1, h:3},             {v:3, h:1}, {v:4, h:0}],
            ];
            let bingoCount = 0;
            let reachCount = 0;
            for (let line = 0; line < lines.length; line++) {
                let hits = 0;
                for (let point = 0; point < lines[line].length; point++) {
                    let p = lines[line][point];
                    if (this.drawnNumbers.includes(this.numbers[p.v][p.h])) {
                        hits++;
                    }
                }
                if (hits == lines[line].length) {
                    console.log('BINGO!');
                    if (this.statuses[line] < 2) {
                        this.bingo = true;
                        const animated = document.querySelector('.bingo-cutin');
                        animated.onanimationend = () => {
                            this.bingo = false;
                        };
                        this.statuses[line] = 2;
                    }
                    bingoCount++;
                } else if (hits == lines[line].length - 1) {
                    console.log('REACH!');
                    if (this.statuses[line] < 1) {
                        this.reach = true;
                        const animated = document.querySelector('.reach-cutin');
                        animated.onanimationend = () => {
                            this.reach = false;
                        };
                        this.statuses[line] = 1;
                    }
                    reachCount++;
                }
            }
            const db = firebase.firestore();
            let cards = db.collection('cards');
            cards.doc(this.$route.query.c).update({
                bingo: bingoCount,
                reach: reachCount,
            });
        }
    }
}
</script>

<style scoped>

@font-face {
    font-family: Oswald;
    src: url('/Oswald-Bold.ttf');
}

.body {
    position: relative;
    background: #F5F5F5;
}

.bingo-card {
    background: #FAFAFA;
    box-shadow: 0 0 8px #424242;
    margin: 16px;
    padding: 4px;
    display: inline-block;
    position: relative;
}
.bingo-card table {
    background: linear-gradient(#FFF176, #FBC02D);
    border-collapse: separate;
    border-spacing: 4px;
}
.bingo-card th,
.bingo-card td {
    width: 64px;
    height: 64px;
    text-align: center;
    font-size: 32px;
    margin: 4px;
}
.bingo-card th span {
	color: #FFFDE7;
	text-shadow: 0 0 0.2rem #212121;
}
.bingo-card td {
    /* font-family: Oswald, sans-serif; */
    font-weight: 700;
    background: #fff;
    text-align: center;
}

.circle {
    background: linear-gradient(#E3F2FD, #BBDEFB);
    height: 56px;
    width: 56px;
    border-radius: 50%;
    display: inline-block;
}

.drawn-circle {
    background: linear-gradient(#FFEBEE, #FFCDD2);
}

.number {
    vertical-align: middle;
}

.free {
    font-size: 24px;
    color: #F44336;
    vertical-align: middle;
}

.drawn-number {
    color: #F44336;
    font-weight: bold;
}

.hide {
    display: none;
}

.reach,
.bingo,
.draw {
    display: flex;
    position: absolute;
    top: 45vh;
    left: 0;
    width: 100vw;
    height: 10vh;
    background-color: #FAFAFA;
    opacity: 1.0;
    z-index: 10;
    justify-content: center;
    align-items: center;
    animation: cutin 2.5s cubic-bezier(0.4, 0.0, 0.2, 1);
    border-top: solid #F44336 8px;
    border-bottom: solid #F44336 8px;
}
.reach,
.bingo {
    top: 40vh;
}
.draw {
    top: 50vh;
}
.reach .reach-cutin,
.bingo .bingo-cutin,
.draw .draw-cutin {
    font-size: 32px;
    color: #F44336;
    opacity: 1.0;
    animation: cutin 2.5s cubic-bezier(0.4, 0.0, 0.2, 1);
}

@keyframes cutin {
    0% {
        transform: translateX(100vw);
    }
    50% {
        transform: translateX(0);
    }
    100% {
        transform: translateX(-100vw);
    }
}

.ready {
    display: flex;
    position: absolute;
    top: 40vh;
    left: 0;
    width: 100vw;
    height: 10vh;
    background-color: #FAFAFA;
    opacity: 0.8;
    z-index: 10;
    justify-content: center;
    align-items: center;
    border-top: solid #9E9E9E 8px;
    border-bottom: solid #9E9E9E 8px;
}
.ready-to-start {
    font-size: 16px;
    color: #424242;
    opacity: 1.0;
}

.line-area {
    position: absolute;
    top: 76px;
    left: 8px;
    width: calc(100% - 16px);
    height: calc(100% - 84px);
    overflow: hidden;
}

.bingo-line {
    position: absolute;
    border: solid #F44336 16px;
    opacity: 0.5;
}

.bingo-line.line1 {
    left: 16px;
    height: 100%;
}

.bingo-line.line2 {
    left: calc(12px + 68px);
    height: 100%;
}

.bingo-line.line3 {
    left: calc(12px + (68px * 2));
    height: 100%;
}

.bingo-line.line4 {
    left: calc(12px + (68px * 3));
    height: 100%;
}

.bingo-line.line5 {
    left: calc(12px + (68px * 4));
    height: 100%;
}

.bingo-line.line6 {
    top: 18px;
    width: 100%;
}

.bingo-line.line7 {
    top: calc(18px + 68px);
    width: 100%;
}

.bingo-line.line8 {
    top: calc(18px + (68px * 2));
    width: 100%;
}

.bingo-line.line9 {
    top: calc(18px + (68px * 3));
    width: 100%;
}

.bingo-line.line10 {
    top: calc(18px + (68px * 4));
    width: 100%;
}

.bingo-line.line11 {
    top: 146px;
    width: 100%;
    transform: skewY(45deg);
    border-width: 20px;
}

.bingo-line.line12 {
    top: 146px;
    width: 100%;
    transform: skewY(-45deg);
    border-width: 20px;
}

</style>
