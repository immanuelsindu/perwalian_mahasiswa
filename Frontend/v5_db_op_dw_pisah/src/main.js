import { createApp } from "vue";
import App from "./App.vue";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.js";
import router from "./router";
import store from "@/store/index";

//vuetify
import "vuetify/styles";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import "@mdi/font/css/materialdesignicons.css";

//axios
import * as Vue from "vue"; // in Vue 3
import axios from "axios";
import VueAxios from "vue-axios";

//firebase
import firebase from 'firebase/app';

const firebaseConfig = {
    apiKey: "AIzaSyAB2QSI1oTZhXh-xndPusKdwE4jjMjP6JU",
    authDomain: "srm-user.firebaseapp.com",
    projectId: "srm-user",
    storageBucket: "srm-user.appspot.com",
    messagingSenderId: "573533885273",
    appId: "1:573533885273:web:8b712fb6f9c9f56865f248",
    measurementId: "G-ZMFXZ48ZQP"
};

firebase.initializeApp(firebaseConfig)

const vuetify = createVuetify({
    icons: {
        defaultSet: "mdi",
    },
    components,
    directives,
});

const app = createApp(App)

app.use(vuetify)
app.use(router)
app.use(store)
app.use(VueAxios, axios)

app.mount("#app");


