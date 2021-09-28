<template>
    <ion-page>
        <ion-header>
            <ion-toolbar>
                <ion-buttons slot="start">
                    <ion-button @click="closeModal()">
                        <ion-icon slot="icon-only" :icon="closeSharp"></ion-icon>
                    </ion-button>
                </ion-buttons>
                <ion-title>
                    {{ storeName }}
                </ion-title>
            </ion-toolbar>
        </ion-header>
        <ion-content>
            <div v-for="(category, index) of categories" :key="category + index">
                <ion-grid>
                    <ion-row>
                        <ion-col>
                            {{ category.name }}
                        </ion-col>
                        <ion-col>
                            <router-link to="">View All</router-link>
                        </ion-col>
                    </ion-row>
                </ion-grid>
                <ion-slides pages="true" :options="slideOpts">
                    <ion-slide v-for="(product, index) of filterCategory(category.name)" :key="product + index">
                        <ion-card @click="nextPage(product.id, orderid)">
                            <div class="product-img">
                                <img :src="product.images">
                            </div>
                            <div>
                                {{ product.name }}
                            </div>
                        </ion-card>
                    </ion-slide>
                </ion-slides>
            </div>
        </ion-content>
    </ion-page>
</template>

<script>
import { IonPage, IonHeader, IonTitle, IonToolbar, IonContent, IonButtons, IonButton, IonIcon, IonSlides, IonSlide, modalController } from "@ionic/vue";
import { ref, onMounted } from "vue";
import { closeSharp } from "ionicons/icons";
import Global from "../components/Global";
import axios from "axios";
import Product from "./Product";

export default({
    components: {
        IonPage, IonHeader, IonTitle, IonToolbar, IonContent, IonButtons, IonButton, IonIcon, IonSlides, IonSlide
    },
    setup() {
        const modalNav = ref(null);
        const carouselOpts = {
            loop: true,
            pagination: {
                el: ".swiper-pagination",
                "dynamicBullets": true
            }
        };
        const slideOpts = {
            slidesPerView: "2",
            freeMode: true
        };
        onMounted(() => {
            const v = document.getElementById("modal-nav");
            modalNav.value = v;
        });
        const nextPage = (productid) => {
            modalNav.value.push(Product, {
                modalNav: modalNav,
                productid: productid,
            });
        };
        const closeModal = async () => {
            await modalController.dismiss();
        };
        return {
            closeSharp,
            carouselOpts,
            slideOpts,
            nextPage,
            closeModal,
        }
    },
    data() {
        return {
            categories: [],
            products: [],
            storeName: "",
            storeid: "",
        }
    },
    created() {
        if (typeof localStorage.store !== "undefined") {
            this.storeid = JSON.parse(localStorage.store)[0].id;
        }
    },
    mounted() {
        this.loadStoreDetail();
    },
    methods: {
        filterCategory(category) {
            return this.products.filter(x => x.category == category);
        },
        loadStoreDetail() {
            Global.methods.Loading();
            axios.post(Global.methods.GetURL() + "/store_detail", {
                storeid: this.storeid,
            }).then(res => {
                this.categories = res.data.categories;
                this.products = res.data.products;
                this.storeName = res.data.store[0].name;
            }).catch(err => {
                console.log(err);
            }).finally(() => {
                setTimeout(() => {
                    Global.methods.Unloading();
                }, 500);
            });
        }
    },
})
</script>

<style lang="scss" scoped>
    .carousel img {
        height: 48vw;
        display: block;
        margin: auto;
    }
    ion-grid ion-row {
        ion-col:nth-child(2) {
            text-align: right;
        }
    }
    .product-img img {
        height: 40vw;
        display: block;
        margin: auto;
    }
</style>
