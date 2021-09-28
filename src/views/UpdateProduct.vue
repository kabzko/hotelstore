<template>
    <ion-page>
        <ion-header>
            <ion-toolbar>
                <ion-buttons slot="start">
                    <ion-back-button default-href="/" color="primary"></ion-back-button>
                </ion-buttons>
                <ion-buttons slot="end">
                    <ion-button @click="saveProduct()">
                        <ion-icon slot="icon-only" :icon="cloudUploadOutline" color="primary"></ion-icon>
                    </ion-button>
                </ion-buttons>
            </ion-toolbar>
        </ion-header>
        <ion-content>
            <div class="update-upload">
                <div class="update-edit">
                    <label id="updateInputImage" for="updateFileInput">
                        <input type="file" id="updateFileInput" accept="image/*" @change="readURL" />
                        <ion-icon style="font-size: 32px;" slot="icon-only" :icon="pencilSharp" color="primary"></ion-icon>
                    </label>
                </div>
                <div class="update-preview">
                    <div id="updateImagePreview">
                    </div>
                </div>
            </div>
            <ion-item lines="none">
                <ion-label position="floating">Category</ion-label>
                <ion-select v-model="category">
                    <ion-select-option v-for="(cat, index) of categories" :key="cat + index" :value="cat.category">{{ cat.category }}</ion-select-option>
                    <ion-select-option value="Create new">Create new</ion-select-option>
                </ion-select>
            </ion-item>
            <ion-item v-if="createNew == 1" lines="none">
                    <ion-label position="floating">New Category</ion-label>
                    <ion-input type="text" v-model="newCategory"></ion-input>
                </ion-item>
            <ion-item>
                <ion-label>Name</ion-label>
                <ion-input v-model="name"></ion-input>
            </ion-item>
            <ion-grid>
                <ion-row>
                    <ion-col>
                        <ion-item>
                            <ion-label>Facilities</ion-label>
                            <ion-input v-model="facility"></ion-input>
                        </ion-item>
                        <div class="ion-text-end">
                            <ion-button @click="addTags()">Add Tags</ion-button>
                        </div>
                    </ion-col>
                </ion-row>
                <ion-row>
                    <ion-col>
                        <div v-for="tag, index of facilities" :key="tag + index">
                            {{ tag }}
                        </div>
                    </ion-col>
                </ion-row>
            </ion-grid>
            <ion-item>
                <ion-label>Entry</ion-label>
                <ion-input v-model="entry"></ion-input>
            </ion-item>
            <ion-item>
                <ion-label>Room Availability</ion-label>
                <ion-input v-model="roomAvailable"></ion-input>
            </ion-item>
            <ion-item>
                <ion-label>Rate</ion-label>
                <ion-input v-model="rate"></ion-input>
            </ion-item>
            <ion-item>
                <ion-label>Rate Type</ion-label>
                <ion-select v-model="rateType">
                    <ion-select-option value="per day">Per Day</ion-select-option>
                    <ion-select-option value="per night">Per Night</ion-select-option>
                </ion-select>
            </ion-item>
        </ion-content>
    </ion-page>
</template>

<script>
import { IonPage, IonHeader, IonToolbar, IonContent, IonButtons, IonButton, IonBackButton, IonIcon, IonInput, IonGrid, IonRow, IonCol, IonSelect, IonSelectOption } from "@ionic/vue";
import { pencilSharp, cloudUploadOutline } from "ionicons/icons";
import { useRoute } from "vue-router";
import Global from "../components/Global";
import axios from "axios";

export default {
    components: {
        IonPage, IonHeader, IonToolbar, IonContent, IonButtons, IonButton, IonBackButton, IonIcon, IonInput, IonGrid, IonRow, IonCol, IonSelect, IonSelectOption
    },
    setup() {
        const route = useRoute();
        const productid = route.params.productid;
        return {
            pencilSharp,
            cloudUploadOutline,
            productid,
        }
    },
    data() {
        return {
            categories: [],
            facilities: [],
            createNew: 0,
            name: "",
            facility: "",
            tags: "",
            entry: "",
            roomAvailable: "",
            rate: "",
            rateType: "",
            storeid: "",
            category: "",
            newCategory: "",
            updateimage: "",
        }
    },
    created() {
        if (typeof localStorage.store !== "undefined") {
            this.storeid = JSON.parse(localStorage.store)[0].id;
        }
    },
    mounted() {
        this.loadProductCategory();
    },
    methods: {
        readURL(input) {
            if (input.target.files && input.target.files[0]) {
                let reader = new FileReader();
                reader.readAsDataURL(input.target.files[0]);
                reader.onload = input => {
                    this.updateimage = document.getElementById("updateFileInput").files[0];
                    document.getElementById("updateImagePreview").style.backgroundImage = "url(" + input.target.result + ")";
                }             
            }
        },
        loadProductCategory() {
            Global.methods.Loading();
            axios.post(Global.methods.GetURL() + "/store_product_update_detail", {
                productid: this.productid,
                storeid: this.storeid,
            }).then(res => {
                this.categories = res.data.category;
                this.name = res.data.product[0].name;
                this.facilities = res.data.product[0].facility.split(";");
                this.entry = res.data.product[0].entry;
                this.rate = res.data.product[0].rate;
                this.rateType = res.data.product[0].rate_type;
                this.roomAvailable = res.data.product[0].room_availability;
                if (res.data.product[0].images != "") {
                    document.getElementById("updateImagePreview").style.backgroundImage = "url(" + res.data.product[0].images + ")";
                }
                setTimeout(() => {
                    this.category = res.data.product[0].category;
                }, 500);
            }).catch(err => {
                console.log(err);
            }).finally(() => {
                setTimeout(() => {
                    Global.methods.Unloading();
                }, 500);
            });
        },
        addTags() {
            if (this.facility != "") {
                this.facilities.push(this.facility);
                this.facility = "";
            }
        },
        saveProduct() {
            let category;
            if (this.createNew == 1) {
                category = this.newCategory;
            } else {
                category = this.category
            }
            this.facilities.forEach((x, index) => {
                if (this.facilities.length == (index + 1)) {
                    this.tags += x;
                } else {
                    this.tags += x + ";";
                }
            });
            axios.post(Global.methods.GetURL() + "/store_update_product", {
                storeid: this.storeid,
                category: category,
                name: this.name,
                facility: this.tags,
                entry: this.entry,
                rate: this.rate,
                ratetype: this.rateType,
                room: this.roomAvailable,
            }).then(res => {
                if (res.data == 1) {
                    //
                }
            }).catch(err => {
                console.log(err);
            });
        }
    },
    watch: {
        category() {
            if (this.category === "Create new") {
                this.createNew = 1;
            } else {
                this.createNew = 0;
            }
        }
    }
}
</script>

<style lang="scss" scoped>
    .update-upload {
        position: relative;
        max-width: 100%;
        margin: 10px auto;
    }
    .update-upload .update-edit {
        position: absolute;
        right: 12px;
        z-index: 1;
        top: 10px;
    }
    .update-upload .update-edit input {
        display: none;
    }
    .update-upload .update-edit #updateInputImage {
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
    .update-upload .update-edit #updateInputImage:hover {
        background: #f1f1f1;
        border-color: #d6d6d6;
    }
    .update-upload .update-preview {
        width: 97vw;
        height: 30vh;
        position: relative;
        border-radius: 2px;
    }
    .update-upload .update-preview > div {
        width: 100%;
        height: 100%;
        border-radius: 2px;
        background-repeat: no-repeat;
        background-position: center;
        background-size: contain;
    }
</style>