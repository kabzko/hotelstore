<template>
    <ion-page>
        <ion-header>
            <ion-toolbar>
                <ion-buttons slot="start">
                    <ion-back-button default-href="/" color="primary"></ion-back-button>
                </ion-buttons>
            </ion-toolbar>
        </ion-header>
        <ion-content>
            <div>
                ₱ {{ formatPrice(wallet) }}
            </div>
            <div>
                <ion-grid>
                    <ion-row>
                        <ion-col>
                            <ion-button @click="cashOut()">Cash Out</ion-button>
                        </ion-col>
                    </ion-row>
                </ion-grid>
            </div>
            <ion-list>
                <ion-list-header>
                    Transaction history
                </ion-list-header>
                <ion-item v-for="transaction, index of transactions" :key="transaction + index">
                    <div v-if="transaction.status_id == 3">
                        {{ transaction.name }} | + ₱ {{ formatPrice(transaction.amount) }}
                    </div>
                    <div v-else>
                        {{ transaction.name }} | - ₱ {{ formatPrice(transaction.amount) }}
                    </div>
                </ion-item>
            </ion-list>
        </ion-content>
    </ion-page>
</template>

<script>
import { IonPage, IonHeader, IonToolbar, IonContent, IonButtons, IonBackButton, modalController } from "@ionic/vue";
import { useRoute } from "vue-router";
import Global from "../components/Global";
import axios from "axios";
import CashOut from "./CashOut";

export default {
    components: {
        IonPage, IonHeader, IonToolbar, IonContent, IonButtons, IonBackButton
    },
    setup() {
        const route = useRoute();
        const transactionid = route.params.transactionid;
        return {
            transactionid,
        }
    },
    data() {
        return {
            transactions: [],
            wallet: 0,
            storeid: "",
        };
    },
    created() {
        this.storeid = JSON.parse(localStorage.store)[0].id;
    },
    mounted() {
        this.loadStoreWallet();
    },
    methods: {
        formatPrice(value) {
            const val = (value/1).toFixed(2).replace(",", ".")
            return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        },
        loadStoreWallet() {
            Global.methods.Loading();
            axios.post(Global.methods.GetURL() + "/store_wallet", {
                storeid: this.storeid,
            }).then(res => {
                this.transactions = [];
                res.data.transactions.forEach(x => {
                    if (x.status_id == 3 || x.status_id == 7) {
                        this.transactions.push({
                            name: x.name,
                            amount: x.amount,
                            status_id: x.status_id,
                        });
                    } 
                });
                this.wallet = res.data.wallet[0].wallet;
            }).catch(err => {
                console.log(err);
            }).finally(() => {
                setTimeout(() => {
                    Global.methods.Unloading();
                }, 500);
            });
        },
        async cashOut() {
            const modal = await modalController.create({
                component: CashOut,
                cssClass: "my-custom-class",
                componentProps: {
                    wallet: this.wallet,
                },
            });
            await modal.present();
            const { data } = await modal.onWillDismiss();
            if (data != undefined && data.status == "success") {
                this.loadStoreWallet();
            }
        }
    },
}
</script>

<style lang="scss" scoped>

</style>