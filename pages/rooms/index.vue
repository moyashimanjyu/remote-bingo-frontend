<template>
<div>
    <div class="m-3">
        <div class="mb-3">
            <label for="room-name" class="small d-inline-block font-weight-bold w-25">{{ $t('room_name') }}</label>
            <input type="text" id="room-name" v-model="roomName" class="form-control">
        </div>
        <div class="mb-3">
            <label for="password" class="small d-inline-block font-weight-bold w-25">{{ $t('password') }}</label>
            <input type="text" id="password" v-model="password" class="form-control">
        </div>
    </div>
    <div class="m-3"><p>{{ $t('text.input_room_name') }}<br>{{ $t('text.input_password') }}</p></div>
    <div class="text-center">
        <button v-on:click="makeRoom" v-bind:disabled="roomName.length == 0" class="btn btn-primary">{{ $t('create_room') }}</button>
    </div>
</div>
</template>

<script>
import firebase from '~/plugins/firebase';
import 'firebase/firestore';
import passwordHash from 'password-hash';

export default {
    data: () => {
        return {
            roomName: '',
            password: '',
        }
    },
    created: () => {
    },
    methods: {
        async makeRoom() {
            if (this.roomName.length == 0) {
                return;
            }
            const db = firebase.firestore();
            let rooms = db.collection('rooms');
            const hashedPassword = this.password.length > 0 ? passwordHash.generate(this.password, { algorithm: "sha256" }) : '';
            const doc = await rooms.add({
                name: this.roomName,
                password: hashedPassword,
                status: 0,
                drawnNumbers: [],
            });
            this.$router.push({
                path: this.localePath('/rooms/ready'),
                query: {
                    r: doc.id
                } 
            });
        },
    }
}
</script>

<style scoped>

</style>
