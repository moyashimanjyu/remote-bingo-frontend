<template>
<div>
    <div class="card d-block m-3 p-2">
        <div><span class="small d-inline-block font-weight-bold w-25">{{ $t('room_id') }}</span>{{ this.$route.query.r }}</div>
        <div><span class="small d-inline-block font-weight-bold w-25">{{ $t('room_name') }}</span>{{ this.roomName }}</div>
    </div>

    <div class="card d-block m-3 p-2">
        <div>
            <label class="small d-inline-block font-weight-bold w-25" for="room-url">{{ $t('room_url') }}</label>
            <input type="text" v-bind:value="this.roomUrl" id="room-url" class="form-control" readonly>
        </div>
    </div>
    <div class="m-3">
        {{ $t('text.share_url') }}
    </div>

    <div class="m-3" v-if="this.cards.length > 0">
        <div class="small font-weight-bold">{{ $t('member_list') }}</div>
        <table class="card table d-table">
            <thead>
                <tr>
                    <th scope="col">#</th>
                    <th scope="col">{{ $t('name') }}</th>
                    <th scope="col">{{ $t('card') }}</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(card, i) in this.cards" v-bind:key="card.cardId">
                    <td scope="row">{{ i + 1 }}</td>
                    <td>{{ card.playerName }}</td>
                    <td><nuxt-link v-bind:to="cardUrl(card.cardId)" target="_blank">{{ $t('view') }}</nuxt-link></td>
                </tr>
            </tbody>
        </table>
    </div>
    <div class="m-3" v-else>
        {{ $t('text.wait_entry_members') }}
    </div>

    <div class="text-center">
        <button v-on:click="start_game()" v-bind:disabled="this.cards.length === 0" class="btn btn-primary">{{ $t('start_game') }}</button>
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
            cards: [],
        }
    },
    computed: {
        roomUrl() {
            return process.env.APP_URL + this.localePath('/rooms/entry') + '?r=' + this.$route.query.r;
        }
    },
    created() {
        const db = firebase.firestore();
        let rooms = db.collection('rooms');
        rooms.doc(this.$route.query.r).onSnapshot(doc => {
            this.roomName = doc.data().name;
        });
        let cards = db.collection('cards');
        cards.where('roomId', '==', this.$route.query.r).onSnapshot(querySnapshot => {
            querySnapshot.docChanges().forEach(change => {
                if (change.type == 'added') {
                    console.log(change.doc.data().playerName, ' joined.');
                    this.cards.push({
                        cardId: change.doc.id,
                        playerId: change.doc.data().playerId,
                        playerName: change.doc.data().playerName,
                    });
                }
            });
        });
    },
    methods: {
        start_game() {
            const db = firebase.firestore();
            let rooms = db.collection('rooms');
            rooms.doc(this.$route.query.r).get().then(doc => {
                rooms.doc(this.$route.query.r).update({
                    status: 1
                });
            });
            this.$router.push({
                path: this.localePath('/rooms/master'),
                query: {
                    r: this.$route.query.r
                } 
            });
        },
        cardUrl(cardId) {
            return this.localePath('/rooms/card') + '?r=' + this.$route.query.r + '&c=' + cardId;
        }
    }
}
</script>

<style scoped>

</style>
