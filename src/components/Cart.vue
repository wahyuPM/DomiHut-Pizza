<template>
  <div class="cart">
    <div class="cart__header">
      <h3 class="bolder">CART</h3>
    </div>
    <div class="cart__body">
      <div v-for="(row, index) in items" :key="index" class="cart__body-item">
        <div class="cart__body-item-img">
          <img :src="`${$app_url + row.item.image}`" alt="pizza" />
        </div>
        <div class="cart__body-item-desc">
          <div class="cart__body-item-desc-title">
            <p class="text-start bolder">{{ row.item.name }}</p>
          </div>
          <div class="cart__body-item-desc-toping mb-2">
            <p v-if="row.item.toping.length === 0" class="text-start">
              No Topings
            </p>
            <p
              v-else
              v-for="(toping, index) in row.item.toping"
              :key="index"
              class="text-start"
            >
              {{ toping.name }}, &nbsp;
            </p>
          </div>
          <div class="cart__body-item-desc-price">
            <p class="">
              $ <span class="text-dark">{{ row.subTotal }}</span>
            </p>
          </div>
        </div>
        <div @click="deleteItem(row.id)" class="cart__delete">
          <i class="fa-solid fa-xmark cart__delete-icon"></i>
        </div>
      </div>
    </div>
    <div class="cart__footer">
      <h2>Total :</h2>
      <h2 class="bold">${{ total }}</h2>
    </div>
  </div>
</template>

<script>
export default {
  name: "CartComponent",
  props: ["items", "total"],
  methods: {
    deleteItem(id) {
      this.$emit("deleteItem", id);
    },
  },
};
</script>