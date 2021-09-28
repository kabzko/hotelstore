<template>
    <ion-page>
        <ion-content>
            <div>
                <label for="">Name</label>
                <input type="text" v-model="name">
            </div>
            <div>
                <label for="">Location</label>
                <input type="text" v-model="latitude" readonly>
                <input type="text" v-model="longitude" readonly>
                <button @click="setLocation()">Set location</button>
            </div>
            <div>
                <label for="">Address</label>
                <input type="text" v-model="address" readonly>
            </div>
            <div>
                <ion-list-header>
                    <ion-label>
                        Category
                    </ion-label>
                </ion-list-header>
                <ion-item v-for="entry, index in form" :key="entry + index">
                    <ion-label>
                        {{ entry.val }}
                    </ion-label>
                    <ion-checkbox slot="start" @update:modelValue="entry.isChecked = $event" :modelValue="entry.isChecked" color="primary"></ion-checkbox>
                </ion-item>
            </div>
            <div>
                <ion-item>
                    <ion-label position="floating">Check-in Time</ion-label>
                    <ion-datetime display-format="hh:mm A" minute-values="0,15,30,45" v-model="checkin"></ion-datetime>
                </ion-item>
            </div>
            <div>
                <ion-item>
                    <ion-label position="floating">Check-out Time</ion-label>
                    <ion-datetime display-format="hh:mm A" minute-values="0,15,30,45" v-model="checkout"></ion-datetime>
                </ion-item>
            </div>
            <div>
                <button @click="register()">Sign up</button>
            </div>
        </ion-content>
    </ion-page>
</template>

<script>
import { IonPage, IonContent, IonItem, IonCheckbox, IonDatetime, modalController } from "@ionic/vue";
import Coordinator from "./Coordinator";
import Global from "../components/Global";
import axios from "axios";

export default({
    components: {
        IonPage, IonContent, IonItem, IonCheckbox, IonDatetime
    },
    setup() {
        const form = [
            { val: "Hotel", isChecked: false },
            { val: "Resort", isChecked: false },
        ];
        return {
            form,
        }  
    },
    data() {
        return {
            email: this.$router.query.email,
            password: this.$router.query.password,
            name: "",
            address: "",
            category: "",
            checkin: "",
            checkout: "",
            latitude: "",
            longitude: "",
        }
    },
    methods: {
        register() {
            this.category = "";
            this.form.filter(x => x.isChecked == true).forEach((x, index) => {
                if (this.form.filter(x => x.isChecked == true).length == (index + 1)) {
                    this.category += x.val;
                } else {
                    this.category += x.val + ";";
                }
            });
            axios.post(Global.methods.GetURL() + "/store_register", {
                email: this.email,
                password: this.password,
                name: this.name,
                address: this.address,
                category: this.category,
                checkin: this.checkin,
                checkout: this.checkout,
                latitude: this.latitude,
                longitude: this.longitude,
            }).then(res => {
                localStorage.store = JSON.stringify(res.data);
                location.replace("/");
            }).catch(err => {
                alert(err);
            });
        },
        async setLocation() {
            const modal = await modalController.create({
                component: Coordinator,
                cssClass: "my-custom-class",
            });
            await modal.present();
            const { data } = await modal.onWillDismiss();
            if (data != undefined && data.status == "success") {
                this.latitude = data.lat;
                this.longitude = data.lng;
                this.address = data.address;
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
