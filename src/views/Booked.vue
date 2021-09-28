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
            <ion-list>
                <ion-list-header>
                    <ion-label>Past Booked</ion-label>
                </ion-list-header>
                <ion-item button v-for="appointment, index of pastappointments" :key="appointment + index" @click="bookedDetail(appointment.id)">
                    <ion-label>
                        <h2>{{ appointment.startday }}, {{ appointment.startdate }} @ {{ timeFormat(appointment.checkin) }}  - {{ appointment.endday }}, {{ appointment.enddate }} @ {{ timeFormat(appointment.checkout) }}</h2>
                        <h3>{{ appointment.building }}</h3>
                        <p>Booked {{ appointment.room }} 
                            <span v-if="appointment.room == 1">room</span>
                            <span v-else>rooms</span>
                            at {{ appointment.roomname }} <br> Rate of ₱ {{ formatPrice(appointment.rate) }} {{ appointment.rate_type }}
                        </p>
                        <h2>Status: {{ appointment.statusname }}</h2>
                    </ion-label>
                </ion-item>
            </ion-list>
        </ion-content>
    </ion-page>
</template>

<script>
import { IonPage, IonHeader, IonToolbar, IonContent, IonButtons, IonBackButton, IonList, IonListHeader, IonLabel } from "@ionic/vue";
import Global from "../components/Global";
import axios from "axios";

export default {
    components: {
        IonPage, IonHeader, IonToolbar, IonContent, IonButtons, IonBackButton, IonList, IonListHeader, IonLabel
    },
    data() {
        return {
            dayname: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
            monthname: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            pastappointments: [],
            storeid: "",
        };
    },
    created() {
        if (typeof localStorage.store !== "undefined") {
            this.storeid = JSON.parse(localStorage.store)[0].id;
        }
    },
    beforeMount() {
        this.loadAllBooked();
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
        loadAllBooked() {
            Global.methods.Loading();
            axios.post(Global.methods.GetURL() + "/store_booked_list", {
                storeid: this.storeid,
            }).then(res => {
                this.pastappointments = [];
                res.data.forEach(x => {
                    this.pastappointments.push({
                        id: x.id,
                        startday: this.dayname[new Date(x.from_datetime).getDay()],
                        endday: this.dayname[new Date(x.to_datetime).getDay()],
                        startdate: this.monthname[new Date(x.from_datetime).getMonth()] + " " + new Date(x.from_datetime).getDate(),
                        enddate: this.monthname[new Date(x.to_datetime).getMonth()] + " " + new Date(x.to_datetime).getDate(),
                        room: x.room,
                        building: x.building,
                        roomname: x.roomname,
                        rate: x.rate,
                        rate_type: x.rate_type,
                        statusname: x.statusname,
                        checkin: x.checkin,
                        checkout: x.checkout,
                    });
                });
            }).catch(err => {
                console.log(err);
            }).finally(() => {
                setTimeout(() => {
                    Global.methods.Unloading();
                }, 500);
            });
        },
        movePage() {
            const calendar = this.$refs.calendar;
            this.loadAllBooked(calendar.pages[0].month);
        },
        bookedDetail(id) {
            this.$router.push({ path: "/bookeddetail", query: { orderid: id }});
        }
    },
}
</script>

<style lang="scss" scoped>

</style>