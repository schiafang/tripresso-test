<template>
  <div>
    <div class="tour-card" v-for="tour in tours" :key="tour.id">
      <div class="tour-card-image-wrapper">
        <a :href="tour.tour_detail_url" target="_blank">
          <img
            :src="tour.image_url"
            alt="tour-card-image"
            class="tour-card-image"
          />
        </a>
      </div>

      <div class="tour-card-info">
        <a :href="tour.tour_detail_url" target="_blank">
          <div class="card-top">
            <div class="agency-rating">
              <span class="agency"> {{ tour.agency }}</span>
              <i
                class="fas fa-star"
                v-for="(n, index) in tour.rating"
                :key="index"
              >
              </i>
            </div>

            <i class="far fa-heart"></i>
          </div>

          <div class="tour-title">
            {{ tour.title }}
          </div>

          <div class="tour-tags">
            <span class="tag" v-for="(tag, index) in tour.tags" :key="index">
              {{ tag }}
            </span>
          </div>
        </a>
      </div>

      <div class="card-bottom">
        <div class="tour-dates">
          <div
            class="group"
            v-for="group in tour.group.slice(0, 4)"
            :key="group.id"
          >
            <span class="date">{{ group.date | groupDate }}</span>
            <span class="left">可售 {{ group.quantity }} 位</span>
          </div>
          <span class="group">更多日期</span>
        </div>

        <div class="tour-day-price">
          <span>{{ tour.tour_days }}</span> 天
          <span>{{ tour.min_price | price }}</span> 元起
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TourCard',
  props: {
    tours: {
      type: Array,
      required: true
    }
  },
  mounted() {
    console.log(this.tours)
  },
  filters: {
    groupDate(val) {
      return val.slice(5, 10).replace('-', '/')
    },
    price(val) {
      function format(val) {
        let result = []
        let counter = 0
        val = (val || 0).toString().split('')
        for (var i = val.length - 1;i >= 0;i--) {
          counter++
          result.unshift(val[i])
          if (!(counter % 3) && i !== 0) {
            result.unshift(',')
          }
        }
        return result.join('')
      }

      return format(val)
    },
  }
}
</script>

<style lang="scss" scoped>
$main-blue: #3a95c0;
$orange: #ff9800;

.tour-card {
  border-radius: 4px;
  background-color: #fff;
  margin-bottom: 15px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: all 0.4s ease-in-out;

  &:hover {
    box-shadow: rgba(50, 50, 93, 0.25) 0px 13px 27px -5px,
      rgba(0, 0, 0, 0.3) 0px 8px 16px -8px;
    cursor: pointer;

    .tour-card-image-wrapper .tour-card-image {
      transform: scale(1.1);
    }
  }
}

.tour-card-image-wrapper {
  overflow: hidden;
  height: 250px;
}

.tour-card-image {
  height: 250px;
  width: 100%;
  object-position: center;
  object-fit: cover;
  transition: all 0.6s ease-in-out;
}

.tour-card-info {
  padding: 15px;

  .card-top {
    display: flex;
    justify-content: space-between;
  }

  .agency-rating {
    display: flex;
    align-items: center;
  }

  .agency {
    margin-right: 5px;
    font-weight: 500;
    color: #333;
  }

  .fa-star {
    font-size: 0.7rem;
    color: $orange;
  }

  .tour-title {
    font-weight: 600;
    text-align: left;
    margin: 15px 0;
  }

  .tour-tags {
    color: $main-blue;
    display: flex;
    justify-content: start;
    flex-wrap: wrap;

    .tag {
      display: inline-block;
      border: 1px solid $main-blue;
      border-radius: 50px;
      font-size: 0.7rem;
      padding: 2px 6px;
      margin: 0 5px 5px 0;
    }
  }
}

.card-bottom {
  padding: 15px;
  border-top: 1px solid #eee;

  .tour-dates {
    color: $main-blue;
    text-align: left;
    font-size: 0.8rem;
    pointer-events: none;

    .group {
      display: inline-block;
      margin: 10px 15px 0 0;
    }

    .date {
      display: inline-block;
      margin-right: 5px;
    }

    .left {
      font-size: 0.6rem;
      color: #bbb;
      border: 1px solid #bbb;
      border-radius: 3px;
      padding: 1px 2px;
    }
  }

  .tour-day-price {
    text-align: right;
    font-weight: 500;
    font-size: 0.9rem;

    span {
      color: $orange;
      font-size: 1.5rem;
      font-weight: 900;
    }
  }
}

@media screen and (min-width: 700px) {
  .tour-card {
    display: grid;
    grid-template-columns: 260px 1fr;
    grid-template-rows: auto auto;

    grid-template-areas:
      'img info'
      'img bottom';
  }

  .tour-card-image-wrapper {
    grid-area: img;
  }

  .tour-card-image {
    height: 260px;
    width: 100%;
  }

  .tour-card-info {
    grid-area: info;
  }

  .card-bottom {
    padding: 0 15px 15px 15px;
    grid-area: bottom;
    display: grid;
    grid-template-columns: auto auto;
    align-items: center;

    .tour-dates {
      grid-column: 1 / 2;
    }

    .tour-day-price {
      grid-column: 2 / 3;
      justify-content: flex-end;
    }
  }
}
</style>