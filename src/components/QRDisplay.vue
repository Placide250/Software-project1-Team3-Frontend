<template>
  <div>
    <img v-if="qrDataURL" :src="qrDataURL" alt="Ticket QR Code" width="200" height="200" />
    <p v-else>Generating QR...</p>
  </div>
</template>

<script>
import QRCode from "qrcode";

export default {
  name: "QRDisplay",
  props: {
    ticketURL: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      qrDataURL: "",
    };
  },
  async mounted() {
    if (this.ticketURL) {
      this.qrDataURL = await QRCode.toDataURL(this.ticketURL, { width: 200 });
    }
  },
};
</script>