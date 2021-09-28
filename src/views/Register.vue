<template>
    <ion-page>
        <ion-content>
            <div>
                <label for="">Email</label>
                <input type="email" placeholder="Enter email" v-model="email">
            </div>
            <div v-if="status != 'Confirm'">
                <label for="">Password</label>
                <input type="password" placeholder="Enter password" v-model="password">
            </div>
            <div v-if="status != 'Confirm'">
                <label for="">Confirm Password</label>
                <input type="password" placeholder="Enter confirm password" v-model="confirmpassword">
            </div>
            <div>
                <button @click="confirmemail()">{{ status }}</button>
            </div>
            <div>
                <button @click="gotosignin()">Sign in</button>
            </div>
        </ion-content>
    </ion-page>
</template>

<script>
import { IonPage, IonContent } from "@ionic/vue";
import Global from "../components/Global";
import axios from "axios";

export default({
    components: {
        IonPage, IonContent
    },
    data() {
        return {
            email: "",
            password: "",
            confirmpassword: "",
            status: "Confirm",
        }
    },
    methods: {
        confirmemail() {
            if (this.status == "Confirm") {
                if (this.email != "") {
                    axios.post(Global.methods.GetURL() + "/store_check_email", {
                        email: this.email,
                    }).then(res => {
                        if (res.data == 1) {
                            this.status = "Next";
                        } else {
                            console.log("email already exist");
                        }
                    }).catch(err => {
                        alert(err);
                    });
                } else {
                    console.log("email is empty");
                }
            } else {
                if (this.password == this.confirmpassword) {
                    this.$router.push({ path: "/information", query: { email: this.email, password: this.password }});
                } else {
                    console.log("confirm password must be the same of password");
                }
            }
        },
        gotosignin() {
            this.$router.back();
        }
    },
})
</script>

<style lang="scss" scoped>

</style>
