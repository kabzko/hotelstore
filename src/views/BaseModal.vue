<template>
    <div>
        <ion-nav :root="Store" id="modal-nav"></ion-nav>
    </div>
</template>

<script>
import { IonNav } from "@ionic/vue";
import Store from "./Store";

export default({
    components: {
        IonNav
    },
    setup() {
        return {
            Store,
        }
    },
});
</script>
