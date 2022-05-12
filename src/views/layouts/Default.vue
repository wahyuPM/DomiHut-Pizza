<template>
  <div>
    <div class="container-fluid default">
      <Nav />
      <router-view />
    </div>
  </div>
</template>

<script>
import Nav from "../../components/Nav.vue";
export default {
  name: "DefaultLayout",
  components: {
    Nav,
  },
};
</script>