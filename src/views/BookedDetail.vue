<template>
    <ion-page>
        <ion-header>
            <ion-toolbar>
                <ion-buttons slot="start">
                    <ion-back-button default-href="/" color="primary"></ion-back-button>
                </ion-buttons>
                <ion-title>
                    {{ building }}
                </ion-title>
            </ion-toolbar>
        </ion-header>
        <ion-content>
            <ion-grid>
                <ion-row>
                    <ion-col>
                        {{ firstname }} {{ lastname }}
                    </ion-col>
                </ion-row>
                <ion-row>
                    <ion-col>
                        {{ email }}
                    </ion-col>
                </ion-row>
                <ion-row>
                    <ion-col>
                        {{ mobile }}
                    </ion-col>
                </ion-row>
                <ion-row>
                    <ion-col>
                        {{ booked }}
                    </ion-col>
                </ion-row>
                <ion-row>
                    <ion-col>
                        {{ roomname }}
                    </ion-col>
                </ion-row>
                <ion-row>
                    <ion-col>
                        {{ formatPrice(rate) }} {{ ratetype }}
                    </ion-col>
                </ion-row>
                <ion-row>
                    <ion-col>
                        Booked {{ room }}
                        <span v-if="room == 1">
                            room
                        </span>
                        <span v-else>
                            rooms
                        </span>
                        at {{ night }}
                        <span v-if="night == 1">
                            night
                        </span>
                        <span v-else>
                            nights
                        </span>
                    </ion-col>
                </ion-row>
                <ion-row>
                    <ion-col>
                        {{ statusname }}
                    </ion-col>
                </ion-row>
                <ion-row>
                    <ion-col>
                        Customer Downpayment: {{ formatPrice(downpayment) }}
                    </ion-col>
                </ion-row>
                <ion-row>
                    <ion-col>
                        Total: {{ formatPrice(total) }}
                    </ion-col>
                </ion-row>
                <ion-row v-if="status == 2">
                    <ion-col>
                        Balance: {{ formatPrice(balance) }}
                    </ion-col>
                </ion-row>
                <ion-row v-if="status == 2">
                    <ion-col>
                        <ion-button expand="full" @click="updateRoom()">Update Room</ion-button>
                    </ion-col>
                </ion-row>
            </ion-grid>
            <ion-grid>
                <ion-row v-if="status == 2">
                    <ion-col>
                        <ion-item lines="none">
                            <ion-label position="floating">Type</ion-label>
                            <ion-input v-model="type"></ion-input>
                        </ion-item>
                    </ion-col>
                    <ion-col>
                        <ion-item lines="none">
                            <ion-label position="floating">Amount</ion-label>
                            <ion-input v-model="amount"></ion-input>
                        </ion-item>
                    </ion-col>
                </ion-row>
                <ion-row v-if="status == 2">
                    <ion-col>
                        <ion-button expand="full" @click="addExtraCharges()">Add Extra Charges</ion-button>
                    </ion-col>
                </ion-row>
                <ion-row v-for="charge, index of charges" :key="charge + index">
                    <ion-col>
                        {{ charge.title }}
                    </ion-col>
                    <ion-col>
                        {{ formatPrice(charge.amount) }}
                    </ion-col>
                </ion-row>
            </ion-grid>
        </ion-content>
        <ion-footer>
            <div>
                <ion-grid>
                    <ion-row v-if="status == 2">
                        <ion-col>
                            <ion-button expand="full" color="primary" @click="payThruWallet()">Pay thru wallet</ion-button>
                        </ion-col>
                        <ion-col>
                            <ion-button expand="full" color="primary">Pay thru cashier</ion-button>
                        </ion-col>
                    </ion-row>
                    <ion-row v-if="status == 2">
                        <ion-col>
                            <ion-button expand="full" color="primary">Cancel Booked</ion-button>
                        </ion-col>
                    </ion-row>
                </ion-grid>
            </div>
        </ion-footer>
    </ion-page>
</template>

<script>
import { IonPage, IonHeader, IonToolbar, IonContent, IonFooter, IonButtons, IonButton, IonBackButton, IonGrid, IonRow, IonCol, IonItem, IonLabel, IonInput } from "@ionic/vue";
import Global from "../components/Global";
import axios from "axios";

export default {
    components: {
        IonPage, IonHeader, IonToolbar, IonContent, IonFooter, IonButtons, IonButton, IonBackButton, IonGrid, IonRow, IonCol, IonItem, IonLabel, IonInput,
    },
    data() {
        return {
            dayname: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
            monthname: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            charges: [],
            amount: 0,
            subtotal: 0,
            total: 0,
            balance: 0,
            orderid: this.$route.query.orderid,
            booked: "",
            building: "",
            roomname: "",
            rate: "",
            ratetype: "",
            room: "",
            status: "",
            statusname: "",
            downpayment: "",
            type: "",
            night: "",
            userid: "",
            storeid: "",
            firstname: "",
            lastname: "",
            email: "",
            mobile: "",
        };
    },
    created() {
        if (typeof localStorage.store !== "undefined") {
            this.storeid = JSON.parse(localStorage.store)[0].id;
        }
    },
    ionViewWillEnter() {
        this.loadBookedDetail();
    },
    methods: {
        timeFormat(time) {
            time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];
            if (time.length > 1) {
                const timeparts = time.slice(1);
                const meridiem = timeparts[0] < 12 ? ' AM' : ' PM'
                return ('0' + (timeparts[0] % 12 || 12)).slice(-2) + timeparts[1] + timeparts[2] + meridiem;
            }
        },
        formatPrice(value) {
            const val = (value/1).toFixed(2).replace(",", ".")
            return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        },
        loadBookedDetail() {
            Global.methods.Loading();
            axios.post(Global.methods.GetURL() + "/store_booked_room_detail", {
                orderid: this.orderid,
            }).then(res => {
                this.firstname = res.data.room[0].firstname;
                this.lastname = res.data.room[0].lastname;
                this.email = res.data.room[0].email;
                this.mobile = res.data.room[0].mobile;
                this.userid = res.data.room[0].user_id;
                this.booked = this.dayname[new Date(res.data.room[0].from_datetime).getDay()] + ", " + this.monthname[new Date(res.data.room[0].from_datetime).getMonth()] + " " + new Date(res.data.room[0].from_datetime).getDate() + " @ " + this.timeFormat(res.data.room[0].checkin) + " - " + this.dayname[new Date(res.data.room[0].to_datetime).getDay()] + ", " + this.monthname[new Date(res.data.room[0].from_datetime).getMonth()] + " " + new Date(res.data.room[0].to_datetime).getDate() + " @ " + this.timeFormat(res.data.room[0].checkout);
                this.building = res.data.room[0].building;
                this.roomname = res.data.room[0].roomname;
                this.rate = res.data.room[0].rate;
                this.ratetype = res.data.room[0].rate_type;
                this.room = res.data.room[0].room;
                this.status = res.data.room[0].status_id;
                this.statusname = res.data.room[0].statusname;
                this.downpayment = res.data.downpayment[0].amount;
                this.night = Math.ceil(((new Date(res.data.room[0].to_datetime).getTime() - new Date(res.data.room[0].from_datetime).getTime()) / (1000 * 3600 * 24)));
                this.charges = res.data.charges;
                this.charges.forEach(x => {
                    this.subtotal += x.amount;
                });
                this.balance = (((this.rate * this.night) + this.subtotal) - this.downpayment);
                this.total = (((this.rate * this.night) + this.subtotal));
            }).catch(err => {
                console.log(err);
            }).finally(() => {
                setTimeout(() => {
                    Global.methods.Unloading();
                }, 500);
            });
        },
    },
}
</script>

<style lang="scss" scoped>
    ion-item {
        border: 1px solid #c8c7cc;
        border-radius: 10px;
    }
</style>