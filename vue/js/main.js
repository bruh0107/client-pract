let product = "Socks"
let description = 'A pair of warm, fuzzy socks'
let eventBus = new Vue()

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
        <product-tabs 
            :reviews="reviews"
            :shipping="shipping"
            :details="details"
        ></product-tabs>
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
            reviews: [],
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
        }
    },
    methods: {
        addToCart() {
            this.$emit('add-to-cart', this.variants[this.selectedVariant].variantId)
        },
        removeFromCart() {
            this.$emit('remove-from-cart', this.variants[this.selectedVariant].variantId)
        },
        updateProduct(index) {
            this.selectedVariant = index
            console.log(index)
        },
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
    },
    mounted() {
        eventBus.$on('review-submitted', productReview => {
            this.reviews.push(productReview)
        })
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

Vue.component('product-review', {
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
       <input id="name" v-model="name" placeholder="name">
     </p>
    
     <p>
       <label for="review">Review:</label>
       <textarea id="review" v-model="review"></textarea>
     </p>
     
     <div>
        <p>Would you recommend this product?</p>
        <p>
            <label for="yes">yes</label>
            <input type="radio" name="answer" v-model="recommend" id="yes" value="yes">
        </p>
        <p>
            <label for="no">no</label>
            <input type="radio" name="answer" v-model="recommend" id="no" value="no">
        </p>
     </div>
    
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
            recommend: null,
            errors: []
        }
    },
    methods: {
        onSubmit() {
            if(this.name && this.review && this.rating){
                let productReview = {
                    name: this.name,
                    review: this.review,
                    rating: this.rating,
                    recommend: this.recommend
                }
                eventBus.$emit('review-submitted', productReview)
                this.name = null
                this.review = null
                this.rating = null
                this.recommend = null
            }
            else {
                if(!this.name) this.errors.push("Name required.")
                if(!this.review) this.errors.push("Review required.")
                if(!this.rating) this.errors.push("Rating required.")
                if(!this.recommend) this.errors.push('Recommended required')
            }
        }
    }
})

Vue.component('product-tabs', {
    props: {
        reviews: {
            type: Array,
            required: false,
        },
        shipping: {
            type: String,
            required: true,
        },
        details: {
            type: Array,
            required: true,
        }
    },
    template: `
   <div>   
       <ul>
         <span class="tab"
               :class="{ activeTab: selectedTab === tab }"
               v-for="(tab, index) in tabs"
               @click="selectedTab = tab"
         >{{ tab }}</span>
       </ul>
       <div v-show="selectedTab === 'Reviews'">
         <p v-if="!reviews.length">There are no reviews yet.</p>
         <ul>
           <li v-for="review in reviews">
               <p>{{ review.name }}</p>
               <p>Rating: {{ review.rating }}</p>
               <p>{{ review.review }}</p>
           </li>
         </ul>
       </div>
       <div v-show="selectedTab === 'Make a Review'">
         <product-review></product-review>
       </div>
       <div v-show="selectedTab === 'Shipping'">
         <p>Shipping cost: {{ shipping }}</p>
       </div>
       <div v-show="selectedTab === 'Details'">
         <ul>
            <li v-for="detail in details">{{ detail }}</li>
         </ul>
       </div>
     </div>

 `,
    data() {
        return {
            tabs: ['Reviews', 'Make a Review', 'Shipping', 'Details'],
            selectedTab: 'Reviews'
        }
    },
    methods: {
        addReview(productReview) {
            this.reviews.push()
        }
    }
})


let app = new Vue({
    el: '#app',
    data: {
        premium: true,
        cart: []
    },
    methods: {
        updateCart(id) {
            this.cart.push(id)
        },
        removeFromCart(id) {
            this.cart.splice(this.cart.indexOf(id), 1)
        },
        addReview(productReview) {
            this.reviews.push()
        }
    }
})
