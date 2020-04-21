const eventBus = new Vue();

Vue.component("product-details", {
  props: {
    details: {
      type: Array,
      required: true,
    },
  },
  template: `
<ul>
 <li v-for="detail in details">{{ detail }}</li>
</ul>
 `,
});

Vue.component("product", {
  props: {
    premium: {
      type: Boolean,
      required: true,
    },
  },
  template: `
  <div class="product">
        <div class="product-image">
          <img v-bind:src="image" />
        </div>

        <div class="product-info">
          <h1>{{ title }}</h1>
          <p>{{ onSales }}</p>
          <p v-if="inStock">In Stock</p>
          <p v-else>Out of Stock</p>
          <p>Shipping: {{ shipping }}</p>          
          <product-details :details="details"></product-details>
          

         

          <div 
            v-for="(variant, index) in variants"
            :key="variant.variantId"
            class="color-box"
            :style="{ backgroundColor: variant.variantColor}"
            @mouseover="updateProduct(index)"
          ></div>

          <button
            v-on:click="addToCart"
            :disabled="!inStock"
            :class="{ disabledButton: !inStock }"
          >
            Add to Card
          </button>

          <button
            v-on:click="removeFromCart"
          >
            Remove from cart
          </button>

        </div>
      <product-tabs :reviews="reviews"></product-tabs>

        
      </div>
      
  `,
  data() {
    return (
      {
        onSale: true,
        brand: "Vue Mastery",
        product: "Socks",
        selecledVariant: 0,
        details: ["80% cotton", "20% polyester", "Gender-neutral"],
        variants: [
          {
            variantId: 2234,
            variantColor: "green",
            variantImage: "./assets/IMG_20171017_201311.jpg",
            variantQuantity: 5,
          },
        ],
        reviews: [],
      },
      {
        onSale: true,
        brand: "Vue Mastery",
        product: "Socks",
        selecledVariant: 0,
        details: ["80% cotton", "20% polyester", "Gender-neutral"],
        variants: [
          {
            variantId: 2235,
            variantColor: "blue",
            variantImage: "./assets/Haricot vert beans fried.jpg",
            variantQuantity: 10,
          },
        ],
        reviews: [],
      }
    );
  },
  methods: {
    addToCart() {
      this.$emit("add-to-cart", this.variants[this.selecledVariant].variantId);
    },
    updateProduct(index) {
      this.selecledVariant = index;
    },
    removeFromCart() {
      this.$emit(
        "remove-from-cart",
        this.variants[this.selecledVariant].variantId
      );
    },
  },
  computed: {
    title() {
      return `${this.brand}${this.product}`;
    },
    image() {
      return this.variants[this.selecledVariant].variantImage;
    },
    inStock() {
      return this.variants[this.selecledVariant].variantQuantity;
    },
    onSales() {
      if (this.onSale) {
        return `${this.brand}${this.product} are on sale`;
      }
    },
    shipping() {
      if (this.premium) {
        return "Free";
      }
      return 2.99;
    },
  },
  mounted() {
    eventBus.$on("review-submitted", (productReview) => {
      this.reviews.push(productReview);
    });
  },
});

Vue.component("product-review", {
  template: `
  <form class="review-form" @submit.prevent="onSubmit">

<p v-if="errors.length">
<b>Please correct the following error(s):</b>
<ul>
 <li v-for="error in errors">{{ error }}</li>
</ul>
</p>
  <p>
  <label for="name">Name:</label>
  <input id="name" v-model="name">
  </p>
  
  <p>
  <label for="review">Review:</label>
  <textarea id="review" v-model="review"></textarea>
  </p>

  <p>
  <label for="rating">Rating:</label>
  <select id="rating" v-model.number="rating">
  <option>5</option>
  <option>4</option>
  <option>3</option>
  <option>2</option>
  <option>1</option>
  </select>
  </p>

  <p>
  <input type="submit" value="Submit">
  </p>
  
  </form>
  `,
  data() {
    return {
      name: null,
      review: null,
      rating: null,
      errors: [],
    };
  },
  methods: {
    onSubmit() {
      if (this.name && this.review && this.rating) {
        const productReview = {
          name: this.name,
          review: this.review,
          rating: this.rating,
        };
        eventBus.$emit("review-submitted", productReview);
        this.name = null;
        this.review = null;
        this.rating = null;
      } else {
        if (!this.name) this.errors.push("Name required.");
        if (!this.review) this.errors.push("Review required.");
        if (!this.rating) this.errors.push("Rating required.");
      }
    },
  },
});

Vue.component("product-tabs", {
  props: {
    reviews: {
      type: Array,
      required: true,
    },
  },
  template: `
  <div>
   <span class="tab"
   :class="{activeTab: selectedTab === tab}"
   v-for="(tab,index) in tabs" :key="index"
   @click="selectedTab=tab">
   {{ tab }}</span>

   <div v-show="selectedTab === 'Reviews'">
         <h2>Reviews</h2>

         <p v-if="!reviews.length">There are no reviews yet</p>
         <ul>
          <li v-for="review in reviews">
          <p>{{ review.name }}</p>
          <p>Rating: {{ review.rating }}</p>
          <p>{{ review.review }}</p>
          </li>
          </ul>
         </div>

        <product-review  v-show="selectedTab === 'Make a Review'"></product-review>
  </div>

  `,
  data() {
    return {
      tabs: ["Reviews", "Make a Review"],
      selectedTab: "Reviews",
    };
  },
});

const app = new Vue({
  el: "#app",
  data: {
    premium: false,
    cart: [],
  },
  methods: {
    updateCart(id) {
      this.cart.push(id);
    },
    deleteCart(id) {
      for (let i = this.cart.length - 1; i >= 0; i--) {
        if (this.cart[i] === id) {
          this.cart.splice(i, 1);
        }
      }
    },
  },
});
