<template>
  <div>
    <header class="d-flex justify-content-between align-items-center">
      <a href="/" class="d-block ml-2" title="Remote Bingo">
        <img src="/logo.svg" alt="Remote Bingo" class="logo">
      </a>
      <nav class="d-flex text-center">
        <a href="#how-to-play" class="d-none d-sm-block px-3 py-3">{{ $t('how_to_play') }}</a>
        <nuxt-link v-bind:to="roomsLink" class="d-block px-3 py-3">{{ $t('create_room') }}</nuxt-link>
        <a href="/ja/" v-if="$i18n.locale !== 'ja'" class="d-none d-sm-block px-3 py-3">日本語</a>
      </nav>
    </header>
    <main>
      <div id="main-visual">
        <h1 class="text-center text-white">
          <span v-if="$i18n.locale === 'ja'">リモートで出来る<br class="d-inline d-sm-none">ビンゴゲーム</span>
          <span v-else>Remote bingo game</span>
        </h1>
      </div>
      <div id="message" class="d-flex justify-content-center py-5">
        <div class="d-inline-block text-left px-3">
          <p>
            {{ $t('index.message_1') }}<br>
            {{ $t('index.message_2') }}
          </p>
          <p>
            {{ $t('index.message_3') }}<br>
            {{ $t('index.message_4') }}
          </p>
          <p>
            {{ $t('index.message_5') }}<br>
            {{ $t('index.message_6') }}
          </p>
        </div>
      </div>
      <div id="how-to-play" class="py-5">
        <div class="container">
        <h2 class="mb-3">{{ $t('how_to_play') }}</h2>
        <section class="card p-3 mb-4">
          <h3>{{ $t('index.how_to_play_1_title') }}</h3>
          <p>
            {{ $t('index.how_to_play_1_text_1') }}<br>
            <span v-if="$i18n.locale === 'ja'"><a href="/rooms">ルーム作成</a>へ進んでください。<br></span>
            <span v-else>Proceed to <a href="/rooms">Create room</a>.<br></span>
            {{ $t('index.how_to_play_1_text_2') }}<br>
            {{ $t('index.how_to_play_1_text_3') }}<br>
            <img src="/screenshot01.png" alt="create room page" class="screenshot">
          </p>
        </section>
        <section class="card p-3 mb-4">
          <h3>{{ $t('index.how_to_play_2_title') }}</h3>
          <p>
            {{ $t('index.how_to_play_2_text_1') }}<br>
            {{ $t('index.how_to_play_2_text_2') }}<br>
            {{ $t('index.how_to_play_2_text_3') }}<br>
            <img src="/screenshot02.png" alt="ready page" class="screenshot">
          </p>
        </section>
        <section class="card p-3 mb-4">
          <h3>{{ $t('index.how_to_play_3_title') }}</h3>
          <p>
            {{ $t('index.how_to_play_3_text_1') }}<br>
            {{ $t('index.how_to_play_3_text_2') }}<br>
            {{ $t('index.how_to_play_3_text_3') }}<br>
            <img src="/screenshot03.png" alt="entry page" class="screenshot"><br>
            <img src="/screenshot04.png" alt="card page" class="screenshot">
          </p>
        </section>
        <section class="card p-3 mb-4">
          <h3>{{ $t('index.how_to_play_4_title') }}</h3>
          <p>
            {{ $t('index.how_to_play_4_text_1') }}<br>
            {{ $t('index.how_to_play_4_text_2') }}
          </p>
        </section>
        <section class="card p-3 mb-4">
          <h3>{{ $t('index.how_to_play_5_title') }}</h3>
          <p>
            {{ $t('index.how_to_play_5_text_1') }}<br>
            {{ $t('index.how_to_play_5_text_2') }}<br>
            {{ $t('index.how_to_play_5_text_3') }}<br>
            <img src="/screenshot05.png" alt="draw page" class="screenshot">
          </p>
        </section>
        </div>
      </div>
    </main>
    <footer class="py-3">
      <nav class="text-center my-3">
        <a class="mx-2 my-3" href="#how-to-play">{{ $t('how_to_play') }}</a>
        <nuxt-link v-bind:to="roomsLink" class="mx-2 my-3">{{ $t('create_room') }}</nuxt-link>
        <a class="mx-2 my-3" href="/privacy">{{ $t('privacy_policy') }}</a>
        <a class="mx-2 my-3" href="mailto:remotebingo824@gmail.com">{{ $t('contact_us') }}</a>
      </nav>
      <div class="text-center"><a href="/" title="Remote Bingo"><img src="/logo.svg" alt="Remote Bingo" class="logo"></a></div>
      <div class="text-center">&copy; Remote Bingo All rights reserved.</div>
    </footer>
  </div>
</template>

<script>
export default {
  head() {
    if (this.$i18n.locale === 'ja') {
      const description = 'リモートビンゴはオンラインのビンゴツールです。離れた場所でもリアルタイムなビンゴゲームを楽しめます。';
      return {
        meta: [
          { hid: 'description', name: 'description', content: description },
          { property: 'og:description', content: description }
        ]
      }
    }
  },
  computed: {
    roomsLink() {
      return this.localePath('/rooms');
    }
  },
  beforeCreate() {
    const language = (window.navigator.languages && window.navigator.languages[0]) ||
            window.navigator.language ||
            window.navigator.userLanguage ||
            window.navigator.browserLanguage;
    if (language === 'ja' && this.$i18n.locale !== 'ja') {
      this.$router.push('/ja/')
    }
  }
}
</script>

<style>

.logo {
  width: 200px;
}

header {
  position: fixed;
  background: rgba(21, 21, 21, 0.5);
  width: 100%;
  z-index: 1000;
}

header nav a, header nav a:hover {
  color: #fafafa;
  font-weight: 700;
}

header nav a:hover {
  background: rgba(21, 21, 21, 1);
  text-decoration: none;
}

#main-visual {
  background: url('/shibuya.jpg');
  background-position: center center;
	background-size: cover;
	background-repeat: no-repeat;
  height: 80vh;
  padding-top: 35vh;
  
}

#main-visual h1 {
  background: rgba(21, 21, 21, 0.5)
}

#message {
  background: #fff;
}

#how-to-play {
  background: #e0e0e0;
}

#how-to-play h3 {
  font-size: 1.25rem;
  font-weight: 700;
  padding-bottom: 0.5rem;
  margin-bottom: 1rem;
}

#how-to-play p {
  margin-bottom: 0;
}

#how-to-play a, #how-to-play a:hover {
  color: #424242;
  font-weight: 700;
}

.screenshot {
  max-width: 160px;
}

footer {
  background: #424242;
  color: #fafafa;
}

footer a, footer a:hover {
  color: #fafafa;
}

</style>
