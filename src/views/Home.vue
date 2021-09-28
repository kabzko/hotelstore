<template>
    <ion-page>
        <ion-header>
            <ion-toolbar>
                <ion-menu-button slot="start" color="primary"></ion-menu-button>
            </ion-toolbar>
        </ion-header>
        <ion-content>
            <ion-card v-if="products == 0">
                <p>
                    Complete your hotel/resort details and products by clicking get started.
                </p>
                <router-link :to="{ path: '/storedetail' }">
                    <ion-button>Get Started</ion-button>
                </router-link>
            </ion-card>
            <ion-card v-if="status == 2 && products != 0">
                <p>
                    Enable your account so user can see your products by click continue.
                </p>
                <router-link :to="{ path: '/storedetail' }">
                    <ion-button>Continue</ion-button>
                </router-link>
            </ion-card>
            <div v-if="status == 1 && products != 0">
                <ion-segment v-model="segment">
                    <ion-segment-button value="new">
                        New({{ appointments.length }})
                    </ion-segment-button>
                    <ion-segment-button value="active">
                        Active({{ activeappointments.length }})
                    </ion-segment-button>
                </ion-segment>
            </div>
            <ion-card>
                <div v-if="segment == 'new'">
                    <ion-list>
                        <ion-item button lines="full" v-for="appointment, index of appointments" :key="appointment + index"  @click="bookedDetail(appointment.id)">
                            <ion-grid>
                                <ion-row>
                                    <ion-col>
                                        {{ appointment.roomname }}
                                    </ion-col>
                                </ion-row>
                                <ion-row>
                                    <ion-col>
                                        {{ appointment.startday }}, {{ appointment.startdate }} - {{ appointment.endday }}, {{ appointment.enddate }}
                                    </ion-col>
                                </ion-row>
                            </ion-grid>
                        </ion-item>
                    </ion-list>
                </div>
                <div v-if="segment == 'active'">
                    <ion-list>
                        <ion-item button lines="full" v-for="appointment, index of activeappointments" :key="appointment + index" @click="bookedDetail(appointment.id)">
                            <ion-grid>
                                <ion-row>
                                    <ion-col>
                                        {{ appointment.roomname }}
                                    </ion-col>
                                </ion-row>
                                <ion-row>
                                    <ion-col>
                                        {{ appointment.startday }}, {{ appointment.startdate }} - {{ appointment.endday }}, {{ appointment.enddate }}
                                    </ion-col>
                                </ion-row>
                            </ion-grid>
                        </ion-item>
                    </ion-list>
                </div>
            </ion-card>
        </ion-content>
    </ion-page>
</template>

<script>
import { IonPage, IonHeader, IonToolbar, IonContent, IonSegment, IonSegmentButton } from "@ionic/vue";
// import { LocalNotifications } from '@ionic-native/local-notifications';
import Global from "../components/Global";
import axios from "axios";

export default({
    components: {
        IonPage, IonHeader, IonToolbar, IonContent, IonSegment, IonSegmentButton
    },
    data() {
        return {
            dayname: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
            monthname: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            appointments: [],
            activeappointments: [],
            loop: false,
            segment: "new",
            storeid: "",
            products: "",
            status: "",
        }
    },
    created() {
        this.storeid = JSON.parse(localStorage.store)[0].id;
    },
    beforeMount() {
        this.loadPendingBooked();
    },
    ionViewWillEnter() {
        this.checkStatus();
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
        checkStatus() {
            axios.post(Global.methods.GetURL() + "/store_status", {
                storeid: this.storeid,
            }).then(res => {
                localStorage.product = res.data.product;
                localStorage.status = res.data.status;
                this.products = localStorage.product;
                this.status = localStorage.status;
            }).catch(err => {
                console.log(err);
            });
        },
        loadPendingBooked() {
            Global.methods.Loading();
            axios.post(Global.methods.GetURL() + "/store_pending_booked_list", {
                storeid: this.storeid,
            }).then(res => {
                if (res.data.new.length != 0) {
                    this.segment = "new";
                } else {
                    this.segment = "active";
                }
                localStorage.reserve = res.data.length;
                this.appointments = [];
                this.activeappointments = [];
                res.data.new.forEach(x => {
                    this.appointments.push({
                        id: x.id,
                        startday: this.dayname[new Date(x.from_datetime).getDay()],
                        endday: this.dayname[new Date(x.to_datetime).getDay()],
                        startdate: this.monthname[new Date(x.from_datetime).getMonth()] + " " + ("0" + new Date(x.from_datetime).getDate()).slice(-2) + ", " + new Date(x.from_datetime).getFullYear(),
                        enddate: this.monthname[new Date(x.to_datetime).getMonth()] + " " + ("0" + new Date(x.to_datetime).getDate()).slice(-2) + ", " + new Date(x.to_datetime).getFullYear(),
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
                res.data.active.forEach(x => {
                    this.activeappointments.push({
                        id: x.id,
                        startday: this.dayname[new Date(x.from_datetime).getDay()],
                        endday: this.dayname[new Date(x.to_datetime).getDay()],
startdate: this.monthname[new Date(x.from_datetime).getMonth()] + " " + ("0" + new Date(x.from_datetime).getDate()).slice(-2) + ", " + new Date(x.from_datetime).getFullYear(),
                        enddate: this.monthname[new Date(x.to_datetime).getMonth()] + " " + ("0" + new Date(x.to_datetime).getDate()).slice(-2) + ", " + new Date(x.to_datetime).getFullYear(),
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
                // this.loopLoad();
            }).catch(err => {
                console.log(err);
            }).finally(() => {
                setTimeout(() => {
                    Global.methods.Unloading();
                }, 500);
            });
        },
        // loopLoad() {
        //     setInterval(() => {
        //         if (this.loop == false) {
        //             this.loop = true;
        //             axios.post(Global.methods.GetURL() + "/store_pending_booked_list", {
        //                 storeid: this.storeid,
        //             }).then(res => {
        //                 if (res.data.length == localStorage.reserve) {
        //                     LocalNotifications.schedule({
        //                         id: 1,
        //                         title: "You have new reservation",
        //                         text: "Check it out now...",
        //                         channel: "IncomingReservation",
        //                     });
        //                 }
        //                 localStorage.reserve = res.data.length;
        //                 this.appointments = [];
        //                 res.data.forEach(x => {
        //                     this.appointments.push({
        //                         id: x.id,
        //                         startday: this.dayname[new Date(x.from_datetime).getDay()],
        //                         endday: this.dayname[new Date(x.to_datetime).getDay()],
        //                         startdate: new Date(x.from_datetime).getDate(),
        //                         enddate: new Date(x.to_datetime).getDate(),
        //                         room: x.room,
        //                         building: x.building,
        //                         roomname: x.roomname,
        //                         rate: x.rate,
        //                         rate_type: x.rate_type,
        //                         statusname: x.statusname,
        //                     });
        //                 });
        //             }).catch(err => {
        //                 console.log(err);
        //             }).finally(() => {
        //                 this.loop = false;
        //             });
        //         }
        //     }, 1000);
        // },
        bookedDetail(id) {
            this.$router.push({ path: "/reservationdetail", query: { orderid: id }});
        }
    }
})
</script>

<style lang="scss" scoped>
    ion-content {
        --padding-top: 0;
        --padding-bottom: 0;
        --padding-start: 10px;
        --padding-end: 10px;
    }
    ion-card {
        border-radius: 4.3vw;
    }
    ion-list {
        padding-top: 0;
        padding-bottom: 0;
        ion-item:last-child {
            --border-width: 0;
        }
    }
    ion-segment {
        ion-segment-button {
            --indicator-color: none;
        }
    }
</style>