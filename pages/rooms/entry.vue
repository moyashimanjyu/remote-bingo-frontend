<template>
<div>
    <div class="card d-block m-3 p-2">
        <div><span class="small d-inline-block font-weight-bold w-25">{{ $t('room_id') }}</span>{{ this.$route.query.r }}</div>
        <div><span class="small d-inline-block font-weight-bold w-25">{{ $t('room_name') }}</span>{{ this.roomName }}</div>
    </div>

    <div class="m-3">
        <div class="mb-3">
            <label class="small d-inline-block font-weight-bold w-25">{{ $t('name') }}</label>
            <input type="text" v-model="playerName" class="form-control">
        </div>
        <div class="mb-3" v-show="this.room && this.room.password.length > 0">
            <label class="small d-inline-block font-weight-bold w-25">{{ $t('password') }}</label>
            <input type="password" v-model="password" class="form-control">
        </div>
    </div>

    <div class="text-center">
        <button v-on:click="entry()" v-bind:disabled="buttonEnable" class="btn btn-primary">{{ $t('entry_game') }}</button>
    </div>
    <div v-show="this.room && this.room.status > 1" class="text-center">
        {{ $t('text.closed_room') }}
    </div>

</div>
</template>

<script>
import firebase from '~/plugins/firebase';
import 'firebase/firestore';
import axios from 'axios';
import * as Cookies from 'js-cookie';
import cookie from 'cookie';
import passwordHash from 'password-hash';

export default {
    data: () => {
        return {
            roomName: '',
            playerName: '',
            password: '',
            room: null,
            progress: false
        }
    },
    computed: {
        buttonEnable() {
            return this.playerName.length == 0 || this.progress
        }
    },
    created() {
        const db = firebase.firestore();
        let rooms = db.collection('rooms');
        rooms.doc(this.$route.query.r).onSnapshot(room => {
            this.roomName = room.data().name;
            this.room = room.data();
        });
    },
    methods: {
        async entry() {
            if (this.room.password.length > 0) {
                if (!passwordHash.verify(this.password, this.room.password, { algorithm: 'sha256' })) {
                    return;
                }
            }
            this.progress = true;

            const playerId = Cookies.getJSON('playerId');

            const api = axios.create();
            const res = await api({
                url: '/functions/createCard',
                method: 'get',
                params: {
                    roomId: this.$route.query.r,
                    playerId: playerId === undefined ? '' : playerId,
                    playerName: this.playerName,
                }
            });

            Cookies.set('playerId', playerId ? playerId : res.data.playerId, { expires: 3600, secure: false });

            this.$router.push({
                path: this.localePath('/rooms/card'),
                query: {
                    r: this.$route.query.r,
                    c: res.data.cardId
                } 
            });
        },
    }
}
</script>

<style scoped>

</style>
