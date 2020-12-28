<template>
  <div style="">
    <dateTimeRange
      style="margin: 20px auto; text-align: center"
      :type="'datetimerange'"
      :startTime.sync="filter.dailyStartTime"
      :endTime.sync="filter.dailyEndTime"
      :clearable="true"
      :start-placeholder="'开始时间'"
      :rangeSeparator="'至'"
      :end-placeholder="'结束时间'"
      :picker-options="liveTimeOptions"
      :value-format="'yyyy-MM-dd HH:mm:ss'"
      :default-time="['00:00:00', '23:59:59']"
      @change="handleChange"
    ></dateTimeRange>

    <div style="text-align: center">
      开始时间：{{ filter.dailyStartTime }}-结束时间：{{ filter.dailyEndTime }}
    </div>
  </div>
</template>

<script>
import dateTimeRange from './index.vue'
import moment from 'moment'
export default {
  name: 'ButtonDemo',
  data() {
    return {
      filter: {
        dailyStartTime: '2020-09-26 00:00:00',
        dailyEndTime: '2020-10-20 23:59:59'
      },
      type: 'primary'
    }
  },
  components: {
    dateTimeRange
  },
  computed: {
    // 上下线时间
    liveTimeOptions: function() {
      return {
        disabledDate: (time) => {
          const itemTime = moment(time).format('YYYY-MM-DD')
          const now = moment(new Date()).format('YYYY-MM-DD')
          return itemTime < now
        }
      }
    }
  },
  mounted(){
    // this.filter.dailyStartTime = '2020-09-26 00:00:00'
    // this.filter.dailyEndTime = '2020-10-20 23:59:59'

    // this.$set(this.filter, 'dailyStartTime', '2020-09-26 00:00:00')
    // this.$set(this.filter, 'dailyEndTime', '2020-10-20 23:59:59')
  },
  methods: {
    handleChange(start, end) {
      console.log(start, end)
    }
  }
}
</script>
