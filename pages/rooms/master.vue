<template>
<div>
    <div class="card d-block m-3 p-2">
        <div><span class="small d-inline-block font-weight-bold w-25">{{ $t('room_id') }}</span>{{ this.$route.query.r }}</div>
        <div><span class="small d-inline-block font-weight-bold w-25">{{ $t('room_name') }}</span>{{ this.roomName }}</div>
    </div>

    <div class="text-center">
        <button v-on:click="draw" class="btn btn-primary" v-bind:disabled="drawEffect">{{ $t('draw') }}</button>
    </div>

    <div class="small font-weight-bold">{{ $t('drawn_numbers') }}</div>
    <div class="text-nowrap table-responsive">
        <table class="card table d-table table-fixed">
            <tr>
                <th>B</th>
                <td v-for="no in bNumbers" v-bind:class="drawnNumber(no)" v-bind:key="no">{{ no }}</td>
            </tr>
            <tr>
                <th>I</th>
                <td v-for="no in iNumbers" v-bind:class="drawnNumber(no)" v-bind:key="no">{{ no }}</td>
            </tr>
            <tr>
                <th>N</th>
                <td v-for="no in nNumbers" v-bind:class="drawnNumber(no)" v-bind:key="no">{{ no }}</td>
            </tr>
            <tr>
                <th>G</th>
                <td v-for="no in gNumbers" v-bind:class="drawnNumber(no)" v-bind:key="no">{{ no }}</td>
            </tr>
            <tr>
                <th>O</th>
                <td v-for="no in oNumbers" v-bind:class="drawnNumber(no)" v-bind:key="no">{{ no }}</td>
            </tr>
        </table>
    </div>

    <div class="m-3">
        <div class="small font-weight-bold">{{ $t('member_list') }}</div>
        <table class="card table d-table">
            <tr>
                <th scope="col">#</th>
                <th scope="col">{{ $t('name') }}</th>
                <th scope="col">{{ $t('bingo') }}</th>
                <th scope="col">{{ $t('reach') }}</th>
                <th scope="col">{{ $t('card') }}</th>
            </tr>
            <tr v-for="(card, i) in this.cards" v-bind:key="card.cardId">
                <td scope="row">{{ i + 1 }}</td>
                <td>{{ card.playerName }}</td>
                <td>{{ card.bingo }}</td>
                <td>{{ card.reach }}</td>
                <td><nuxt-link v-bind:to="cardUrl(card.cardId)" target="_blank">{{ $t('view') }}</nuxt-link></td>
            </tr>
        </table>
    </div>

    <div class="text-center">
        <button v-on:click="finish" class="btn btn-secondary">{{ $t('end_game') }}</button>
    </div>

    <div v-bind:class="drawCutin">
        <div class="draw-cutin">{{ drawnNumbers[drawnNumbers.length - 1] }}</div>
    </div>

</div>
</template>

<script>
import firebase from '~/plugins/firebase';
import 'firebase/firestore';
export default {
    data: () => {
        return {
            roomName: '',
            bNumbers: [ 1,  2,  3,  4,  5,  6,  7,  8,  9, 10, 11, 12, 13, 14, 15],
            iNumbers: [16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30],
            nNumbers: [31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45],
            gNumbers: [46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60],
            oNumbers: [61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75],
            drawnNumbers: [],
            cards: [],
            drawEffect: false,
            status: null,
        }
    },
    computed: {
        drawCutin() {
            return {
                'd-none': !this.drawEffect,
                draw: this.drawEffect,
            }
        },
    },
    created() {
        const db = firebase.firestore();
        let rooms = db.collection('rooms');
        rooms.doc(this.$route.query.r).onSnapshot(doc => {
            this.roomName = doc.data().name;
            this.status = doc.data().status;
            this.drawnNumbers = doc.data().drawnNumbers;
        });
        let dbCards = db.collection('cards');
        dbCards.where('roomId', '==', this.$route.query.r).onSnapshot(query => {
            query.docChanges().forEach(change => {
                if (change.type == 'added') {
                    this.cards.push({
                        cardId: change.doc.id,
                        playerId: change.doc.data().playerId,
                        playerName: change.doc.data().playerName,
                    });
                } else if (change.type == 'modified') {
                    let target = this.cards.find(c => c.cardId == change.doc.id);
                    if (target) {
                        target.bingo = change.doc.data().bingo;
                        target.reach = change.doc.data().reach;
                    }
                    const compare = (a, b) => {
                        if (a.bingo > b.bingo) {
                            return -1;
                        } else if (a.bingo < b.bingo) {
                            return 1;
                        } else if (a.reach > b.reach) {
                            return -1;
                        } else if (a.reach < b.reach) {
                            return 1;
                        } else {
                            return 0;
                        }
                    }
                    this.cards.sort(compare);
                }
            });
        });
    },
    methods: {
        draw() {
            if (this.drawnNumbers.length >= 75 || this.status == 2) {
                return;
            }
            var rand = Math.floor(Math.random() * Math.floor(75)) + 1;
            while (this.drawnNumbers.includes(rand)) {
                rand = Math.floor(Math.random() * Math.floor(75)) + 1;
            }
            this.drawnNumbers.push(rand);

            const db = firebase.firestore();
            let rooms = db.collection('rooms');
            rooms.doc(this.$route.query.r).update({
                drawnNumbers: this.drawnNumbers,
            });

            this.cards.sort((a, b) => {
                if (a.bingo > b.bingo) return -1;
                if (a.bingo < b.bingo) return 1;
                if (a.reach > b.reach) return -1;
                if (a.reach < b.reach) return 1;
                return 0;
            });

            this.drawEffect = true;
            const animated = document.querySelector('.draw-cutin');
            animated.onanimationend = () => {
                this.drawEffect = false;
            };
        },
        finish() {
            const db = firebase.firestore();
            let rooms = db.collection('rooms');
            rooms.doc(this.$route.query.r).update({
                status: 2,
            });
            this.status = 2;
        },
        drawnNumber(no) {
            return {
                'drawn-number': this.drawnNumbers.includes(no)
            }
        },
        cardUrl(cardId) {
            return this.localePath('/rooms/card') + '?r=' + this.$route.query.r + '&c=' + cardId;
        }
    }
}
</script>

<style scoped>

.drawn-number {
    color: #F44336;
    font-weight: bold;
}

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
    animation: cutin 3.0s cubic-bezier(0.4, 0.0, 0.2, 1);
    border-top: solid #F44336 8px;
    border-bottom: solid #F44336 8px;
}
.draw .draw-cutin {
    font-size: 32px;
    color: #F44336;
    opacity: 1.0;
    animation: cutin 3.0s cubic-bezier(0.4, 0.0, 0.2, 1);
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

</style>
