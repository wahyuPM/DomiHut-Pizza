<template>
  <div class="row">
    <div class="col-md-12 col-lg-8">
      <div class="home">
        <div class="home__header">
          <div class="home__header-title uppercase">
            <h3 class="bolder text-uppercase">Menu</h3>
          </div>
        </div>
        <div class="home__body">
          <div class="row align-items-stretch">
            <div
              class="col-md-4 d-flex align-items-stretch"
              v-for="(row, index) in pizzaList"
              :key="index"
            >
              <div
                @click.prevent="chooseToping(row.id)"
                class="home__body-item"
              >
                <div class="home__body-item-img">
                  <img :src="`${$app_url + row.image}`" alt="pizza" />
                </div>
                <div class="home__body-item-title">
                  <p class="bolder">{{ row.name }}</p>
                </div>
                <div class="home__body-item-price">
                  <p class="">
                    $ <span class="text-dark">{{ row.price }}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="col-md-12 col-lg-4 ms-auto">
      <Cart :items="cart" :total="total" @deleteItem="deleteItem" />
    </div>
    <!-- Modal -->
    <div
      class="modal fade"
      id="exampleModal"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
      tabindex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel"></h5>
            <button
              @click="resetToping()"
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <div class="d-flex flex-wrap justify-content-between">
              <div
                v-for="(row, index) in topingList"
                :key="index"
                class="form-check"
              >
                <input
                  @click="addToping(row.id)"
                  class="form-check-input"
                  type="checkbox"
                  :id="row.id"
                  :value="row"
                />
                <label class="form-check-label ms-1" :for="row.id">
                  {{ row.name }} (${{ row.price }})
                </label>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button
              @click.prevent="addToCart"
              type="button"
              class="btn btn-primary"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import $ from "jquery";
import swal from "sweetalert";
import Cart from "../../components/Cart.vue";
export default {
  name: "HomePage",
  components: {
    Cart,
  },
  mounted() {
    this.showMenu();
    this.showToping();
    this.getCart();
  },
  data() {
    return {
      pizzaList: [],
      topingList: [],
      orderList: [],
      cart: [],
      subTotal: 0,
      total: 0,
    };
  },
  methods: {
    async getCart() {
      try {
        const response = await this.$http.get(`${this.$api_url}/cart`);
        if (response) {
          this.cart = response.data;
          this.total = this.cart.reduce(
            (total, item) => total + item.subTotal,
            0
          );
        }
      } catch (error) {
        console.log(error);
      }
    },
    chooseToping(id) {
      $("#exampleModal").modal("show");
      $(".modal-title").html("Topings");

      this.orderList = this.pizzaList.filter((row) => row.id == id);
      this.orderList[0].toping = [];
      this.subTotal = this.orderList[0].price;
    },
    async addToping(id) {
      try {
        const orderList = this.orderList[0];
        let topingPrice;
        const check = orderList.toping.filter((row) => row.id == id);
        if (check.length > 0) {
          const index = this.orderList[0].toping.findIndex(
            (row) => row.id === id
          );
          this.orderList[0].toping.splice(index, 1);
          topingPrice = 0;
        } else {
          this.orderList[0].toping.push(
            this.topingList.filter((row) => row.id === id)[0]
          );
        }
        topingPrice = orderList.toping.reduce(
          (subTotal, row) => subTotal + row.price,
          0
        );
        let calculate = orderList.price + topingPrice;
        this.subTotal = calculate;
      } catch (error) {
        console.log(error);
      }
    },
    resetToping() {
      this.orderList = [];
      this.subTotal = 0;
      $(".form-check-input").prop("checked", false);
    },
    async addToCart() {
      try {
        const response = await this.$http.post(`${this.$api_url}/cart`, {
          item: this.orderList[0],
          subTotal: this.subTotal,
        });

        if (response) {
          swal({
            title: "Success",
            text: "Add to cart success",
            icon: "success",
            buttons: "OK",
            closeOnClickOutside: false,
          }).then(() => {
            this.getCart();
            $("#exampleModal").modal("hide");
          });
          this.resetToping();
          return;
        }
      } catch (error) {
        console.log(error);
      }
    },
    async deleteItem(id) {
      swal({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        if (willDelete) {
          this.$http
            .delete(`${this.$api_url}/cart/${id}`)
            .then(() => {
              swal({
                title: "Sukses!",
                text: `Data deleted`,
                icon: "success",
                button: "OK",
                closeOnClickOutside: false,
              }).then((status) => {
                if (status == true) {
                  this.getCart();
                }
              });
            })
            .catch((err) => {
              console.log(err);
            });
        }
      });
    },
    async showMenu() {
      try {
        const response = await this.$http.get(`${this.$api_url}/data`);
        if (response) {
          this.pizzaList = response.data;
        }
      } catch (error) {
        console.log(error);
      }
    },
    async showToping() {
      try {
        const response = await this.$http.get(`${this.$api_url}/toping`);
        if (response) {
          this.topingList = response.data;
        }
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>