<template>
    <div>

        <head>
            <meta name="google-signin-client_id"
                content="9716725623-6d3jbatuo66qho6hj5ipptdcm114be7f.apps.googleusercontent.com">
        </head>

        <div class="d-flex align-items-center" id="navbar">
            <p>Program Studi Informatika UKDW</p>
        </div>

        <div id="loginPanel">
            <p id="judulWeb" class="pt-4 pl-4 mb-0">Perwalian Informatika UKDW</p>
            <div id="garis"></div>

            <div class="d-flex pb-4">
                <div class="row mx-0">
                    <div class="col-lg-6 col-md-12 px-0 d-flex justify-content-center">
                        <div id="loginPanelKiri" class="text-center mx-3">
                            <img class="pt-4" src="../../public/frontend/media/people.jpg" alt="people.jpg">
                        </div>
                    </div>

                    <div class="col-lg-6 col-md-12 px-0 d-flex justify-content-center align-self-center">
                        <div id="loginPanelKanan">
                            <div class="text-center">
                                <p class="judulWelcome mb-1">Selamat Datang !</p>
                                <p>Login untuk melanjutkan</p>
                            </div>

                            <v-form @submit.prevent>
                                <div>
                                    <v-text-field v-model="this.username" label="Username" id="username"
                                        class="mb-2"></v-text-field>
                                    <v-text-field v-model="this.password" label="Password" id="password"
                                        class="mb-2"></v-text-field>
                                    <v-btn type="submit" color="blue" @click="login()" block class="mb-5"
                                        id="btnSubmit">Submit</v-btn>
                                </div>
                            </v-form>
                        </div>
                    </div>
                </div>
            </div>

            <div class="d-flex justify-content-center text-center">
                <div id="snackbar" class="text-center">
                    <p class="mx-auto mb-0 text-center">{{ this.pesanSnackBar }}</p>
                </div>
            </div>

        </div>
    </div>
</template>

<script>
import axios from 'axios'
import firebase from 'firebase'
import Cookies from 'js-cookie';
// import { getAuth, signInWithCustomToken } from "firebase/auth";

export default {
    name: "LoginPage",
    data() {
        return {
            username: '',
            password: '',
            namaDosen : '',
            pesanSnackBar: '',
        }
    },
    head: {
        link: [
            {
                rel: 'stylesheet',
                href: 'https://cdn.jsdelivr.net/npm/bootstrap@4.0.0/dist/css/bootstrap.min.css',
                integrity: 'sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm',
                crossorigin: 'anonymous'
            },
            {
                rel: "stylesheet",
                href: "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.5.0/font/bootstrap-icons.css",
            },
            {
                rel: "stylesheet",
                href: "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
            }
        ],

    }, mounted() {
        const script = document.createElement('script');
        script.src = 'https://apis.google.com/js/platform.js';
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);

        this.cekLogin()
        
    },
    created() {
        this.scrollTop()
    },
    methods: {
        cekToken(){
            // mengambil token dari url param
            // const currentURL = window.location.href;
            // const url = new URL(currentURL);
            // const uid = url.searchParams.get('uid');
            // console.log(uid);
            // // simpan ke storage , karena value di url param hilang jika halaman di reload
            // localStorage.setItem('firebase-uid', uid)

            // firebase.auth().onAuthStateChanged((user) => {
            //     console.log(user );
            // });

            // getAuth()
            //     .getUser(uid)
            //     .then((userRecord) => {
            //         // See the UserRecord reference doc for the contents of userRecord.
            //         console.log(`Successfully fetched user data: ${userRecord.toJSON()}`);
            //     })
            //     .catch((error) => {
            //         console.log('Error fetching user data:', error);
            //     });


            // Mendapatkan informasi pengguna berdasarkan UID
            // firebase.auth().getUser(uid)
            // .then((userRecord) => {
            //     // Informasi pengguna
            //     console.log('Informasi Pengguna:', userRecord.toJSON());
            // })
            // .catch((error) => {
            //     console.error('Error:', error);
            // });
            // firebase.auth().onAuthStateChanged((user) => {
            // if (user) {
            //     // User logged in already or has just logged in.
            //     console.log(user.uid);
            // } else {
            //     // User not logged in or has just logged out.
            // }
            // });


        },
        async cekLogin(){
            try {
                // cek cookies
                let tempAuthObject = Cookies.get('authObject');
                this.authObject = JSON.parse(tempAuthObject)
                // jika cookies tidak kosong
                if(this.authObject != null){ 
                    // true jika merupakan email ti, staff, fti (karena website dibuat untuk dosen ti)
                    if(this.cekEmail((this.authObject.email).toString())){ 
                        // misal "sindu@ti.ukdw.ac.id" jadi "sindu"
                        this.namaDosen = this.emailToName(this.authObject.email)
                        console.log(this.namaDosen);
                        try {
                            const response = await axios.get(process.env.VUE_APP_API_OPERASIONAL + `/cekLoginDosen/`, {
                                    params: {
                                        username: this.namaDosen
                                    },
                                });

                                if (response.data.error === false) {
                                    localStorage.setItem('kodeDosen', response.data.response[0].kode_dosen)
                                    localStorage.setItem('namaDosen', response.data.response[0].nama)

                                    //memberikan sesi login ke dosen wali                    
                                    this.$store.commit("setAksesLogin", true)
                                    
                                    // simpan ke local storage 
                                    localStorage.setItem('authObject', this.authObject)

                                    // jika login berhasil pindah ke halaman beranda
                                    this.$router.push({ name: 'Beranda' })
                                }else{
                                    // jika gagal arahkan kembali ke login srm
                                    window.location.href = `http://localhost:9070/login`;
                                }
                        } catch (error) {
                            this.pesanSnackBar = "Akun pengguna tidak ditemukan"
                            this.snackbar()
                        }
                    }else{
                        console.log("masuk a");
                        // jika email selain ti, staff, fti
                        window.location.href = `http://localhost:9070/login`;
                    }
                }else{
                    console.log("masuk b");
                    // jika cookies kosong
                    window.location.href = `http://localhost:9070/login`;
                }
            } catch (error) {
                console.log(error.message);
            }
            
        },
        scrollTop() {
            window.scrollTo({
                top: 0,
                behavior: "smooth" // Animasi smooth scrolling
            });
        },
        async login() {
            if (this.username != undefined && this.password != undefined) {
                try {
                    const response = await axios.get(process.env.VUE_APP_API_OPERASIONAL + `/loginDosen2/`, {
                        params: {
                            username: this.username,
                            password: this.password
                        },
                    });

                    if (response.data.error === false) {
                        localStorage.setItem('kodeDosen', response.data.response[0].kode_dosen)
                        localStorage.setItem('namaDosen', response.data.response[0].nama)

                        //memberikan sesi login ke dosen wali                    
                        this.$store.commit("setAksesLogin", true)
                        // ubah nilai isDisplayShouldLogin
                        this.$store.commit("setIsDiplayShouldLogin", false)


                        this.$router.push({ name: 'Beranda' })
                    }
                } catch (error) {
                    console.error("Terjadi kesalahan saat mengambil data:", error);
                    this.pesanSnackBar = "Akun pengguna tidak ditemukan"
                    this.snackbar()
                }
            } else {
                this.pesanSnackBar = "Pastikan Username dan password tidak kosong"
                this.snackbar()
            }
        },
        // isShouldLogin(){
        //     if(this.$store.getters.getIsShouldDisplayLogin){
        //         this.pesanSnackBar = "Silahkan login terlebih dahulu untuk melanjutkan"
        //         this.snackbar()
        //     }
        // },
        snackbar() {
            var x = document.getElementById("snackbar");
            x.className = "show";
            setTimeout(function () {
                x.className = x.className.replace("show", "");
            }, 3000);
        },
        emailToName(email){
            // Menghilangkan karakter non-alfanumerik dan mengonversi ke huruf kecil
            let username = email.split('@')[0]; // misal sindu@ti.ukdw.ac.id
            username = username.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
            return username; // misal sindu
        }, 
        cekEmail(email){ // true jika email selain @si.ukdw.ac.id
            const email_ti = /@ti\.ukdw\.ac\.id$/;
            const email_staff = /@staff\.ukdw\.ac\.id$/;
            const email_fti = /@fti\.ukdw\.ac\.id$/;

            if(email_ti.test(email)){
                return true
            }else if( email_staff.test(email)){
                return true
            }else if(email_fti.test(email)){
                return true
            }else{
                return false // berarti bukan email ti, staff, fti
            }
        }
    },
    
}
</script>

<style scoped src="./../../public/frontend/styling/indexLogin.css"></style>