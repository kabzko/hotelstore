<template>
    <ion-page>
        <ion-header>
            <ion-toolbar>
                <ion-buttons slot="start">
                    <ion-button @click="closeModal()" :disabled="status">
                        <ion-icon slot="icon-only" :icon="close" color="primary"></ion-icon>
                    </ion-button>
                </ion-buttons>
                <ion-title>
                    <span>{{ route + " " + street }}</span><br>
                    <small>{{ city + " " + province + " " + country }}</small>
                </ion-title>
                <ion-buttons slot="end">
                    <ion-button @click="autoLocation()">
                        <ion-icon slot="icon-only" :icon="locate" color="primary"></ion-icon>
                    </ion-button>
                </ion-buttons>
            </ion-toolbar>
        </ion-header>
        <ion-content :hidden="load">
            <div class="map-size" id="mapDivRef">
            </div>
        </ion-content>
        <ion-footer :hidden="Load">
            <div class="footer">
                <ion-button mode="ios" @click="confirmLocation()" expand="full" color="primary" :disabled="Status">Confirm location</ion-button>
            </div>
        </ion-footer>
    </ion-page>
</template>

<script>
import { LocationAccuracy } from "@ionic-native/location-accuracy";
import { Diagnostic } from "@ionic-native/diagnostic";
import { Geolocation } from "@ionic-native/geolocation";
import { IonContent, IonPage, IonButton, IonIcon, IonHeader, IonToolbar, useBackButton, modalController } from "@ionic/vue";
import { locate, close } from "ionicons/icons";

export default({
    components: {
        IonContent, IonPage, IonButton, IonIcon, IonHeader, IonToolbar
    },
    setup() {
        return { 
            locate, 
            close
        }
    },
    data() {
        return {
            load: true,
            status: false,
            coord: "Empty",
            route: "",
            street: "",
            city: "",
            province: "",
            country: "",
            timeout: "",
            map: "",
            lat: "",
            lng: "",
            address: "",
        }
    },
    mounted() {
        // Diagnostic.isLocationEnabled().then((isEnabled) => {
            // if(!isEnabled){
                // LocationAccuracy.request(LocationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(() => {
                    // this.loadGoogleMap();
                // });
            // } else {
                this.loadGoogleMap();
            // }
        // });
    },
    created() {
        if (localStorage.mycoordinates != undefined) {
            this.coord = "Not Empty";
        }
        useBackButton(100, () => {
            if (this.coord == "Not Empty") {
                this.$router.back();
            }
        });
    },
    methods: {
        loadGoogleMap() {
            setTimeout(() => {
                Geolocation.getCurrentPosition().then(res => {
                    this.load = false;
                    this.map =  new window.google.maps.Map(document.getElementById("mapDivRef"), {
                        zoom: 18,
                        clickableIcons: false,
                        disableDefaultUI: true,
                        disableDoubleClickZoom: true,
                        mapTypeControl: false,
                        scaleControl: false,
                        center: { lat: res.coords.latitude, lng: res.coords.longitude }
                    });
                    this.lat = this.map.getCenter().toUrlValue().split(",")[0];
                    this.lng = this.map.getCenter().toUrlValue().split(",")[1];
                    this.marking();

                    this.map.addListener("center_changed", () => {
                        this.lat = this.map.getCenter().toUrlValue().split(",")[0];
                        this.lng = this.map.getCenter().toUrlValue().split(",")[1];
                    });
                    this.map.addListener("drag", () => {
                        clearTimeout(this.timeout);
                        this.status = true;
                    });
                    this.map.addListener("dragend", () => {
                        this.timeout = setTimeout(() => {
                            this.marking();
                        }, 1000); 
                    });
                });
            }, 250);
        },
        marking() {   
            new window.google.maps.Geocoder().geocode({
                "latLng": new window.google.maps.LatLng(
                    this.lat,
                    this.lng
                )
            }, res => {
                if (res[1].address_components.length == 6) {
                    this.route = res[1].address_components[0].short_name + " " + res[1].address_components[1].short_name;
                    this.street = res[1].address_components[2].short_name;
                    this.city = res[1].address_components[3].short_name;
                    this.province = res[1].address_components[4].short_name;
                    this.country = res[1].address_components[5].short_name;
                } else if (res[1].address_components.length == 5) {
                    this.route = res[1].address_components[0].short_name;
                    this.street = res[1].address_components[1].short_name;
                    this.city = res[1].address_components[2].short_name;
                    this.province = res[1].address_components[3].short_name;
                    this.country = res[1].address_components[4].short_name;
                } else if (res[1].address_components.length == 4) {
                    this.street = res[1].address_components[0].short_name;
                    this.city = res[1].address_components[1].short_name;
                    this.province = res[1].address_components[2].short_name;
                    this.country = res[1].address_components[3].short_name;
                } else if (res[1].address_components.length == 3) {
                    this.city = res[1].address_components[0].short_name;
                    this.province = res[1].address_components[1].short_name;
                    this.country = res[1].address_components[2].short_name;
                } else if (res[1].address_components.length == 2) {
                    this.province = res[1].address_components[0].short_name;
                    this.country = res[1].address_components[1].short_name;
                } else {
                    this.country = res[1].address_components[0].short_name;
                }
                this.address = this.route + " " + this.street + " " + this.city + " " + this.province;
             }).catch(err => {
                console.log(err);
            });
            this.status = false;
        },
        confirmLocation() {
            modalController.dismiss({
                status: "success",
                lat: this.lat,
                lng: this.lng,
                address: this.address,
            });
        },
        autoLocation() {
            Diagnostic.isLocationEnabled().then((isEnabled) => {
                if(!isEnabled){
                    LocationAccuracy.request(LocationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(() => {
                        this.loadGoogleMap();
                    });
                } else {
                    Geolocation.getCurrentPosition().then(res => {
                        this.lat = res.coords.latitude;
                        this.lng = res.coords.longitude;
                        const position = new window.google.maps.LatLng(res.coords.latitude, res.coords.longitude);
                        this.map.setCenter(position);
                        this.marking();
                    });
                }
            });
        },
        closeModal() {
            modalController.dismiss();
        }
    },
})
</script>

<style lang="scss" scoped>
    .map-size {
        width: 100%;
        height: 100%;
    }
    .footer {
        margin: 5px 5px;
    }
    #mapDivRef {
        position: relative;
    }
    #mapDivRef:after {
        width: 26px;
        height: 35px;
        display: block;
        content: " ";
        position: absolute;
        top: 50%; left: 50%;
        margin: -40px 0 0 -11px;
        background: url("../assets/Marker.png") no-repeat;
        background-size: 26px 35px;
        pointer-events: none;
    }
</style>