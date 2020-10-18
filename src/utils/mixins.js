export const formatPrice = {
  filters: {
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
    }
  }
}