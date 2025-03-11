let product = "Socks"
let description = 'A pair of warm, fuzzy socks'

Vue.component('product', {
    props: {
        premium: {
            type: Boolean,
            required: true,
        },
    },
    template: `
   <div class="product">
        <div class="product-image">
            <img :alt="altText" :src="image"/>
        </div>
        <div class="product-info">
            <h1>{{ title }}</h1>
            <a v-bind:href="link">More products like this</a>
            <p v-show="inventory <= 10 && inventory > 0">Almost sold out!</p>
            <p v-if="inStock">In Stock</p>
            <p v-else :style="{ textDecoration: inStock ? 'none' : 'line-through' }">Out of Stock</p>
            <span>{{ sale }}</span>
            <product-details :details="details"></product-details>
            <p>Shipping: {{ shipping }}</p>
            <div class="color-box"
                 :style="{ backgroundColor: variant.variantColor }"
                 v-for="(variant, index) in variants"
                 :key="variant.variantId"
                 @mouseover="updateProduct(index)"
            >
            </div>
            <ul>
                <li v-for="size in sizes">{{ size }}</li>
            </ul>
            <div class="cart">
                <p>Cart({{ cart }})</p>
            </div>
            <button
                    v-on:click="addToCart"
                    :disabled="!inStock"
                    :class="{ disabledButton: !inStock }"
            >
                Add to cart</button>
            <button
                    v-on:click="removeFromCart"
                    :disabled="!inStock"
                    :class="{ disabledButton: !inStock }"
            >
                Remove from cart</button>
        </div>
    </div>
    `,
    data() {
        return {
            product: "Socks",
            brand: 'Vue Mastery',
            selectedVariant: 0,
            altText: "A pair of socks",
            link: 'https://www.amazon.com/s/ref=nb_sb_noss?url=search-alias%3Daps&field-keywords=socks',
            inventory: 50,
            onSale: true,
            details: ['80% cotton', '20% polyester', 'Gender-neutral'],
            variants: [
                {
                    variantId: 2234,
                    variantColor: 'green',
                    variantImage: "./assets/vmSocks-green-onWhite.jpg",
                    variantQuantity: 10,
                },
                {
                    variantId: 2235,
                    variantColor: 'blue',
                    variantImage: "./assets/vmSocks-blue-onWhite.jpg",
                    variantQuantity: 0,
                },
            ],
            sizes: ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
            cart: 0,
        }
    },
    methods: {
        addToCart() {
            this.cart += 1
        },
        removeFromCart() {
            this.cart -= 1
        },
        updateProduct(index) {
            this.selectedVariant = index
            console.log(index)
        }
    },
    computed: {
        title() {
            return this.brand + ' ' + this.product
        },
        image() {
            return this.variants[this.selectedVariant].variantImage
        },
        inStock() {
            return this.variants[this.selectedVariant].variantQuantity
        },
        sale() {
            if (this.onSale) {
                return `${this.brand} ${this.product} are on sale`
            }
            else {
                return `${this.brand} ${this.product} are not on sale`
            }
        },
        shipping () {
            if (this.premium) {
                return "Free"
            }
            else {
                return 2.99
            }
        }
    }
})

Vue.component('product-details', {
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
    `

})

let app = new Vue({
    el: '#app',
    data: {
        premium: true
    }
})
