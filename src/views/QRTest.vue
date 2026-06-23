<template>
  <div style="padding: 40px; text-align: center;">
    <h2>QR Test</h2>
    <QRDisplay ticketURL="https://planetarium.app/verify/TEST-001" />
  </div>
</template>

<script>
import QRDisplay from "@/components/QRDisplay.vue";

export default {
  name: "QRTest",
  components: { QRDisplay },
};
</script>