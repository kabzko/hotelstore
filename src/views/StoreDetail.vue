<template>
    <ion-page>
        <ion-header>
            <ion-toolbar>
                <ion-buttons slot="start">
                    <ion-back-button default-href="/" color="primary"></ion-back-button>
                </ion-buttons>
                <ion-buttons slot="end">
                    <router-link :to="{ path: '/newproduct' }">
                        <ion-button>
                            <ion-icon slot="icon-only" :icon="addSharp"></ion-icon>
                        </ion-button>
                    </router-link>
                </ion-buttons>
            </ion-toolbar>
        </ion-header>
        <ion-content>
            <div class="store-upload">
                <div class="store-edit">
                    <label id="storeInputImage" for="storeFileInput">
                        <input type="file" id="storeFileInput" accept="image/*" @change="getStoreImage" />
                        <ion-icon style="font-size: 32px;" slot="icon-only" :icon="pencilSharp" color="primary"></ion-icon>
                    </label>
                </div>
                <div class="store-save" v-if="storeimage != ''" @click="uploadImage()">
                    <label id="storeInputImage">
                        <ion-icon style="font-size: 32px;" slot="icon-only" :icon="cloudUploadOutline" color="primary"></ion-icon>
                    </label>
                </div>
                <div class="store-preview">
                    <div id="storeImagePreview">
                    </div>
                </div>
            </div>
            <div>
                <h4>
                    {{ storeName }}
                </h4>
            </div>
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
                        <router-link :to="{ path: '/updateproduct', params: { productid: product.id }}">
                            <ion-card>
                                <div class="product-img">
                                    <img :src="product.images">
                                </div>
                                <div>
                                    {{ product.name }}
                                </div>
                            </ion-card>
                        </router-link>
                    </ion-slide>
                </ion-slides>
            </div>
        </ion-content>
        <ion-footer>
            <div class="footer">
                <ion-button color="success" expand="full" v-if="status == 2" @click="changeStatus(1)">
                    Enable Hotel/Resort
                </ion-button>
                <ion-button color="danger" expand="full" v-if="status == 1" @click="changeStatus(2)">
                    Disable Hotel/Resort
                </ion-button>
            </div>
        </ion-footer>
    </ion-page>
</template>

<script>
import { IonPage, IonHeader, IonToolbar, IonContent, IonFooter, IonButtons, IonButton, IonBackButton, IonIcon } from "@ionic/vue";
import { addSharp, pencilSharp, cloudUploadOutline } from "ionicons/icons";
import Global from "../components/Global";
import axios from "axios";

export default({
    components: {
        IonPage, IonHeader, IonToolbar, IonContent, IonFooter, IonButtons, IonButton, IonBackButton, IonIcon
    },
    setup() {
        const carouselOpts = {
            loop: false,
            pagination: {
                el: ".swiper-pagination",
                "dynamicBullets": true
            }
        };
        const slideOpts = {
            slidesPerView: "2",
            freeMode: true
        };
        return {
            addSharp,
            pencilSharp,
            cloudUploadOutline,
            carouselOpts,
            slideOpts,
        }
    },
    data() {
        return {
            categories: [],
            products: [],
            carousel: true,
            storeName: "",
            storeid: "",
            status: "",
            storeimage: "",
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
        getStoreImage(input) {
            if (input.target.files && input.target.files[0]) {
                let reader = new FileReader();
                reader.readAsDataURL(input.target.files[0]);
                reader.onload = input => {
                    this.storeimage = document.getElementById("storeFileInput").files[0];
                    document.getElementById("storeImagePreview").style.backgroundImage = "url(" + input.target.result + ")";
                }             
            }
        },
        loadStoreDetail() {
            Global.methods.Loading();
            axios.post(Global.methods.GetURL() + "/store_detail", {
                storeid: this.storeid,
            }).then(res => {
                this.categories = res.data.categories;
                this.products = res.data.products;
                this.storeName = res.data.store[0].name;
                this.status = res.data.store[0].status_id;
                if (res.data.store[0].images != "") {
                    document.getElementById("storeImagePreview").style.backgroundImage = "url(" + res.data.store[0].images + ")";
                }
            }).catch(err => {
                console.log(err);
            }).finally(() => {
                setTimeout(() => {
                    Global.methods.Unloading();
                }, 500);
            });
        },
        uploadImage() {
            const Data = new FormData();
            Data.append("carouselimage", this.storeimage);
            Data.append("storeid", this.storeid);
            axios.post(Global.methods.GetURL() + "/store_upload_carousel", Data)
            .then(res => {
                if (res.data == 1) {
                    this.loadStoreDetail();
                    this.image = "";
                }
            }).catch(err => {
                console.log(err);
            });
        },
        changeStatus(status) {
            if (this.image != "") {
                axios.post(Global.methods.GetURL() + "/store_update_status", {
                    storeid: this.storeid,
                    status: status,
                }).then(res => {
                    if (res.data == 1) {
                        this.loadStoreDetail();
                    } else {
                        console.log("You don't have any products yet");
                    }
                }).catch(err => {
                    console.log(err);
                });
            } else {
                console.log("You must upload image in carousell before enabling your store");
            }
        }
    },
})
</script>

<style lang="scss" scoped>
    ion-grid ion-row {
        ion-col:nth-child(2) {
            text-align: right;
        }
    }
    .store-upload {
        position: relative;
        max-width: 100%;
        margin: 10px auto;
    }
    .store-upload .store-edit {
        position: absolute;
        right: 17px;
        z-index: 1;
        top: 10px;
    }
    .store-upload .store-edit input {
        display: none;
    }
    .store-upload .store-edit #storeInputImage {
        display: inline-block;
        width: 40px;
        height: 40px;
        margin-bottom: 0;
        border-radius: 2px;
        background: #ffffff;
        border: 1px solid transparent;
        box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.12);
        cursor: pointer;
        font-weight: normal;
        transition: all 0.2s ease-in-out;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .store-upload .store-edit #storeInputImage:hover {
        background: #f1f1f1;
        border-color: #d6d6d6;
    }
    .store-upload .store-save {
        position: absolute;
        right: 17px;
        z-index: 1;
        top: 50px;
    }
    .store-upload .store-save #storeInputImage {
        display: inline-block;
        width: 40px;
        height: 40px;
        margin-bottom: 0;
        border-radius: 2px;
        background: #ffffff;
        border: 1px solid transparent;
        box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.12);
        cursor: pointer;
        font-weight: normal;
        transition: all 0.2s ease-in-out;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .store-upload .store-save #storeInputImage:hover {
        background: #f1f1f1;
        border-color: #d6d6d6;
    }
    .store-upload .store-preview {
        width: 97vw;
        height: 30vh;
        position: relative;
        border-radius: 2px;
    }
    .store-upload .store-preview > div {
        height: 100%;
        border-radius: 2px;
        background-repeat: no-repeat;
        background-position: center;
        background-size: contain;
        margin: 0 10px;
    }
    .product-img img {
        height: 40vw;
        display: block;
        margin: auto;
    }
</style>
