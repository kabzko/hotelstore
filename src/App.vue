<template>
    <ion-app>
        <ion-menu content-id="main" type="overlay" swipeGesture="false">
            <ion-content>
                <ion-list>
                    <ion-list-header>{{ name }}</ion-list-header>
                    <ion-menu-toggle auto-hide="false">
                        <ion-item lines="none" button router-link="/profile">
                            <ion-icon slot="start" color="dark" :icon="personCircleOutline"></ion-icon>
                            <ion-label>Profile</ion-label>
                        </ion-item>
                    </ion-menu-toggle>
                    <ion-menu-toggle auto-hide="false">
                        <ion-item lines="none" button router-link="/storedetail">
                            <ion-icon slot="start" color="dark" :icon="storefrontOutline"></ion-icon>
                            <ion-label>Store</ion-label>
                        </ion-item>
                    </ion-menu-toggle>
                    <ion-menu-toggle auto-hide="false">
                        <ion-item lines="none" button router-link="/booked">
                            <ion-icon slot="start" color="dark" :icon="bookmarksOutline"></ion-icon>
                            <ion-label>Reservation</ion-label>
                        </ion-item>
                    </ion-menu-toggle>
                    <ion-menu-toggle auto-hide="false">
                        <ion-item lines="none" button router-link="/wallet">
                            <ion-icon slot="start" color="dark" :icon="walletOutline"></ion-icon>
                            <ion-label>Wallet</ion-label>
                        </ion-item>
                    </ion-menu-toggle>
                    <ion-menu-toggle auto-hide="false" @click="logout()">
                        <ion-item lines="none" button>
                            <ion-icon slot="start" color="dark" :icon="logOutOutline"></ion-icon>
                            <ion-label>Sign Out</ion-label>
                        </ion-item>
                    </ion-menu-toggle>
                </ion-list>
            </ion-content>
        </ion-menu>
        <ion-router-outlet id="main"></ion-router-outlet>
    </ion-app>
</template>

<script>
import { IonApp, IonRouterOutlet, IonContent, IonList, IonListHeader, IonMenuToggle, IonItem, IonLabel } from "@ionic/vue";
import { personCircleOutline, storefrontOutline, bookmarksOutline, walletOutline, logOutOutline } from "ionicons/icons";
// import { Plugins } from '@capacitor/core';
import Global from "./components/Global.vue";

// const { LocalNotifications } = Plugins;

export default({
    components: {
        IonApp, IonRouterOutlet, IonContent, IonList, IonListHeader, IonMenuToggle, IonItem, IonLabel
    },
    setup() {
        return {
            personCircleOutline, 
            storefrontOutline, 
            bookmarksOutline, 
            walletOutline, 
            logOutOutline
        }
    },
    created() {
        // const channel = {
        //     id: 'IncomingReservation',
        //     name: 'Incoming Reservation',
        //     importance: 5,
        //     visibility: 1,
        // };
        // LocalNotifications.createChannel(channel);
        if (typeof localStorage.store !== "undefined") {
            this.storeid = JSON.parse(localStorage.store)[0].id;
            this.name = JSON.parse(localStorage.store)[0].name;
        }
    },
    data() {
        return {
            storeid: "",
            name: "",
        }
    },
    methods: {
        loadData() {
            if (typeof localStorage.store !== "undefined") {
                this.storeid = JSON.parse(localStorage.store)[0].id;
                this.name = JSON.parse(localStorage.store)[0].name;
            }
        },
        logout() {
            Global.methods.Loading();
            localStorage.clear();
            setTimeout(() => {
                Global.methods.Unloading();
                this.$router.replace("/");
            }, 1000);
        }
    },
    watch: {
        '$route': 'LoadData'
    }
});
</script>

<style lang="scss" scoped>
    ion-list {
        padding: 20px 0;
    }
    ion-list-header {
        font-size: 18px;
        color: var(--ion-color-primary);
        margin-bottom: 10px;
    }
    ion-item {
        --color: black !important;
    }
</style>