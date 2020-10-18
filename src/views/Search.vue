<template>
  <div class="search">
    <div class="banner">
      <img class="banner-image" :src="bannerImage" alt="search-page-banner" />
    </div>
    <div class="search-content">
      <div class="search-info">
        <span class="title">團體旅遊</span>
        <span class="info">{{ totalTours }}</span>
        個行程 ，平均團費
        <span class="info">{{ averagePrice | price }} </span>
        元
      </div>

      <div class="sort-tab">
        <span>
          排序
        </span>
        <button
          :class="[
            'sort-item',
            { active: sortBy === '' || sortBy === 'rating_desc' }
          ]"
          @click="sortByRating"
        >
          精選評分
        </button>
        <div
          :class="[
            'sort-item',
            'price-dropdown',
            { active: sortBy === 'price_asc' || sortBy === 'price_desc' }
          ]"
        >
          <span class="price-label">{{ sortBy | sortTag }}</span>

          <div v-if="priceDropdownToggle" class="dropdown-content">
            <button class="dropdown-item" @click="sortByPrice('price_asc')">
              價格 低-高
            </button>
            <button class="dropdown-item" @click="sortByPrice('price_desc')">
              價格 高-低
            </button>
          </div>
        </div>

        <button class="sort-item" disabled>
          天數
        </button>
        <button class="sort-item" disabled>
          出發日期
        </button>
      </div>

      <TourCard :tours="tours" />

      <!--pagination-->
      <div class="pagination">
        <button
          class="prev page"
          :disabled="pageNow === 1"
          @click="changePage('prev')"
        >
          <i class="fas fa-chevron-left"></i>
        </button>

        <router-link
          class="page-link"
          :to="{ name: 'Search', query: { page, sort: sortBy } }"
          v-for="(page, index) in pages"
          :key="index"
        >
          <span class="page" :class="{ active: pageNow === page }">
            {{ page }}
          </span>
        </router-link>

        <button
          class="next page"
          :disabled="pageNow === pages[pages.length - 1]"
          @click="changePage('next')"
        >
          <i class="fas fa-chevron-right"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import TourCard from '@/components/TourCard.vue'
import { formatPrice } from '@/utils/mixins'

const bannerImage = 'https://dszfbyatv8d2t.cloudfront.net/curatorial/twtrip/sr_4000x520_x05.jpg'
const baseUrl = 'https://interview.tripresso.com/tour/search'

export default {
  name: 'Search',
  components: { TourCard },
  mixins: [formatPrice],
  data() {
    return {
      pages: [],
      tours: [],
      sortBy: '',
      averagePrice: 0,
      totalTours: 0,
      priceDropdownToggle: false,
      active: true,
      bannerImage,
      pageNow: null
    }
  },
  created() {
    const page = this.$route.query.page
    const sort = this.$route.query.sort
    this.sortBy = sort
    !page ? this.pageNow = 1 : this.pageNow = Number(page)
    this.fetchTours(page, sort)
  },
  watch: {
    $route(to) {
      this.fetchTours(to.query.page, to.query.sort)
      this.pageNow = Number(to.query.page)
    }
  },
  mounted() {
    document.addEventListener('click', e => {
      let className = e.target.className
      if (className.includes('price-dropdown') || className.includes('price-label')) {
        this.priceDropdownToggle = !this.priceDropdownToggle
        return
      }
      if (!className.includes('dropdown-content')) {
        this.priceDropdownToggle = false
      }
    })
  },
  methods: {
    async fetchTours(page, sort) {
      if (!sort) {
        sort = 'rating_desc'
        this.sortBy = 'rating_desc'
      }

      try {
        const res = await axios.get(`${baseUrl}?page=${page}&row_per_page=10&sort=${sort}`)
        this.tours = res.data.data.tour_list

        //取得資料總筆數、平均價格與頁數
        const all = await axios.get(`${baseUrl}?row_per_page=1000000`)
        const allTours = all.data.data.tour_list
        let totalPrice = 0
        allTours.forEach(i => totalPrice += Number(i.min_price))

        this.totalTours = allTours.length
        this.averagePrice = Math.floor(totalPrice / allTours.length)
        this.pages = Array.from({ length: allTours.length / 10 }, (_, i) => i + 1)
      } catch (e) {
        console.error(e)
      }
    },
    sortByRating() {
      const sort = this.$route.query.sort
      this.sortBy = 'rating_desc'
      if (sort !== 'rating_desc') {
        this.$router.push({ name: 'Search', query: { sort: 'rating_desc' } })
      }
    },
    sortByPrice(sortBy) {
      const sort = this.$route.query.sort
      if (sort !== sortBy) {
        this.sortBy = sortBy
        this.$router.push({ name: 'Search', query: { sort: sortBy } })
      }
    },
    dropdownToggle() {
      this.priceDropdownToggle = !this.priceDropdownToggle
    },
    changePage(e) {
      const sort = this.$route.query.sort
      const page = Number(this.$route.query.page)
      const switchPage = e === 'prev' ? page - 1 : page + 1
      this.$router.push({ name: 'Search', query: { page: switchPage, sort } })
    }
  },
  filters: {
    sortTag(val) {
      if (val === '' || val === 'rating_desc') {
        return '價格'
      } else {
        return val === 'price_asc' ? '價格 低-高' : '價格 高-低'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.banner {
  width: 100%;
}

.banner-image {
  width: inherit;
  height: 260px;
  object-fit: cover;
}

.search-content {
  padding: 10px;
}

.search-info {
  border-radius: 4px;
  width: 100%;
  height: 35px;
  display: flex;
  align-items: center;
  background-color: #fff;
  font-weight: 600;
  font-size: 0.6rem;

  .title {
    margin-left: 10px;
  }

  .info {
    padding: 0 5px;
    font-weight: 900;
    color: #0277bd;
  }
}

.sort-tab {
  border-radius: 4px;
  margin: 15px 0;
  background-color: #fff;
  text-align: center;
  display: grid;
  grid-template-columns: 60px repeat(4, 1fr);
  align-items: center;
  font-weight: 500;
  font-size: 0.8rem;
  margin-bottom: 30px;
}

.sort-item {
  color: #666;
  height: 35px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.6rem;
  background-color: #fff;

  &:disabled {
    color: #eee;
    background-color: #fff;
    cursor: unset;
  }

  &:hover {
    cursor: pointer;
  }

  &.active {
    background-color: #aaa;
    color: #fff;

    &:hover {
      background-color: #aaa;
    }
  }

  .price-label::after {
    content: '';
    position: relative;
    top: -2.5px;
    left: 5px;
    display: inline-block;
    border-top: 6px solid #eee;
    border-left: 4px solid transparent;
    border-right: 4px solid transparent;
  }
}

.dropdown-content {
  position: absolute;
  z-index: 1;
  top: 35px;
  left: 0;
  height: 100px;
  width: 100%;

  .dropdown-item {
    height: 50px;
    display: block;
    width: 100%;
    background-color: #fff;

    &:hover {
      background-color: #f8f8f8;
      cursor: pointer;
    }
  }
}

.pagination {
  display: flex;
  justify-content: center;
  margin: 50px 0 200px 0;

  .page {
    display: inline-block;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #aaa;
    width: 20px;
    height: 15px;
    font-size: 0.7rem;
    font-weight: 600;

    &:hover {
      cursor: pointer;
    }

    &:disabled {
      cursor: unset;
      opacity: 0;
    }

    &.active {
      background-color: #888;
      color: #fff;
    }
  }
}

@media screen and (min-width: 470px) {
  .search-content {
    padding: 15px 30px;
  }

  .search-info {
    font-size: 1rem;
    height: 60px;

    .title {
      margin-left: 15px;
      font-size: 1.3rem;
    }

    .info {
      font-size: 1.2rem;
    }
  }

  .sort-tab {
    font-size: 0.9rem;
  }

  .sort-item {
    font-size: 0.9rem;
    height: 50px;
  }

  .dropdown-content {
    top: 50px;
  }

  .pagination .page {
    width: 40px;
    height: 35px;
    font-size: 1rem;
  }
}
</style>