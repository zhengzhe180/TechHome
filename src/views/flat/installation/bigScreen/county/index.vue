<template>
  <div class="app-container">
    <!-- 筛选区 -->
    <div class="filter-container">
      <el-button :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-document" @click="handleDownload">
        导出 Excel
      </el-button>
    </div>

    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <!-- 使用 v-bind 展开列配置 -->
      <el-table-column
        v-for="column in columns"
        :key="column.prop"
        v-bind="column"
        align="center"
      >
        <template slot-scope="{ row }">
          <span
            v-if="column.prop === '当日应装(累计)'"
            style="cursor: pointer; color: #409EFF;"
            @click="handleNavigateDangRiYingZhuangLeiJi(row)"
          >
            {{ row[column.prop] }}
          </span>
          <span
            v-else-if="column.prop === '当日应装(累计)-FTTR'"
            style="cursor: pointer; color: #409EFF;"
            @click="handleNavigateDangRiYingZhuangLeiJiFTTR(row)"
          >
            {{ row[column.prop] }}
          </span>
          <span
            v-else-if="column.prop === '当日应装(清零)'"
            style="cursor: pointer; color: #409EFF;"
            @click="handleNavigateDangRiYingZhuangQingLing(row)"
          >
            {{ row[column.prop] }}
          </span>
          <span
            v-else-if="column.prop === '当日应装(清零)-FTTR'"
            style="cursor: pointer; color: #409EFF;"
            @click="handleNavigateDangRiYingZhuangQingLingFTTR(row)"
          >
            {{ row[column.prop] }}
          </span>
          <span
            v-else-if="column.prop === '催装工单(未归档)'"
            style="cursor: pointer; color: #409EFF;"
            @click="handleNavigateCuiZhuangGongDanWeiGuiDang(row)"
          >
            {{ row[column.prop] }}
          </span>
          <span
            v-else-if="column.prop === '催装工单(未归档)-FTTR'"
            style="cursor: pointer; color: #409EFF;"
            @click="handleNavigateCuiZhuangGongDanWeiGuiDangFTTR(row)"
          >
            {{ row[column.prop] }}
          </span>
          <span
            v-else-if="column.prop === '手写判断单'"
            style="cursor: pointer; color: #409EFF;"
            @click="handleNavigateManualJudgment(row)"
          >
            {{ row[column.prop] }}
          </span>
          <span
            v-else-if="column.prop === '红黄单'"
            style="cursor: pointer; color: #409EFF;"
            @click="handleNavigateRedYellow(row)"
          >
            {{ row[column.prop] }}
          </span>
          <span
            v-else-if="column.prop === '装维选址'"
            style="cursor: pointer; color: #409EFF;"
            @click="handleNavigateTechnicianSite(row)"
          >
            {{ row[column.prop] }}
          </span>
          <span
            v-else-if="column.prop === '装维核实'"
            style="cursor: pointer; color: #409EFF;"
            @click="handleNavigateTechnicianCheck(row)"
          >
            {{ row[column.prop] }}
          </span>
          <span v-else>{{ row[column.prop] }}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getInstallationCounty } from '@/api/flat'
import { parseTime } from '@/utils'

const columnOrder = [
  '区县',
  '当日应装(累计)',
  '当日实装(累计)',
  '当日装机率(累计)',
  '当日应装(清零)',
  '当日实装(清零)',
  '当日未装(清零)',
  '当日未装占比(清零)',
  '催装工单(未归档)',
  '手写判断单',
  '红黄单',
  '装维选址',
  '装维核实',
  '当日应装(累计)-FTTR',
  '当日实装(累计)-FTTR',
  '当日装机率(累计)-FTTR',
  '当日应装(清零)-FTTR',
  '当日实装(清零)-FTTR',
  '当日未装(清零)-FTTR',
  '当日未装占比(清零)-FTTR',
  '催装工单(未归档)-FTTR'
]

// 列预设
const columnPresets = {
  '区县': { width: 120, align: 'left' },
  '当日应装(累计)': { width: 90 },
  '当日实装(累计)': { width: 90 },
  '当日装机率(累计)': { width: 100 },
  '当日应装(清零)': { width: 90 },
  '当日实装(清零)': { width: 90 },
  '当日未装(清零)': { width: 90 },
  '当日未装占比(清零)': { width: 110 },
  '催装工单(未归档)': { width: 90 },
  '手写判断单': { width: 100 },
  '红黄单': { width: 100 },
  '装维选址': { width: 90 },
  '装维核实': { width: 90 },
  '当日应装(累计)-FTTR': { width: 120 },
  '当日实装(累计)-FTTR': { width: 120 },
  '当日装机率(累计)-FTTR': { width: 140 },
  '当日应装(清零)-FTTR': { width: 120 },
  '当日实装(清零)-FTTR': { width: 120 },
  '当日未装(清零)-FTTR': { width: 120 },
  '当日未装占比(清零)-FTTR': { width: 150 },
  '催装工单(未归档)-FTTR': { width: 140 }
}

export default {
  name: 'InstallationCountyTable',
  data() {
    return {
      list: [],
      listLoading: false,
      columns: []
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    sortByCounty(list) {
      const countySortOrder = [
        '城阳区', '高新区', '黄岛区', '即墨区', '胶州市',
        '开发区', '莱西市', '崂山区', '李沧区', '平度市',
        '市北区', '市南区', '全市'
      ]

      return (list || []).sort((a, b) => {
        let indexA = countySortOrder.indexOf(a['区县'])
        let indexB = countySortOrder.indexOf(b['区县'])
        if (indexA === -1) indexA = Infinity
        if (indexB === -1) indexB = Infinity
        return indexA - indexB
      })
    },
    async fetchData() {
      this.listLoading = true
      try {
        const resp = await getInstallationCounty()
        const data = resp && resp.data ? resp.data : []
        const rawList = Array.isArray(data) ? data : []
        this.list = this.sortByCounty(rawList)

        if (!this.list.length) {
          this.columns = []
          return
        }

        // 收集所有字段（所有行的并集）
        const keySet = new Set()
        this.list.forEach(row => {
          Object.keys(row || {}).forEach(k => keySet.add(k))
        })

        // 构造列配置
        this.columns = columnOrder
          .filter(key => keySet.has(key))
          .map(key => ({
            prop: key,
            label: key,
            align: 'center',
            ...(columnPresets[key] || {})
          }))
      } catch (err) {
        this.$message?.error('获取区县数据失败：' + (err.message || '未知错误'))
        console.error(err)
      } finally {
        this.listLoading = false
      }
    },
    handleNavigateDangRiYingZhuangLeiJi(row) {
      const startTime = parseTime(new Date().setHours(0, 0, 0, 0), '{y}-{m}-{d} {h}:{i}:{s}')
      const endTime = parseTime(new Date(new Date().getTime() + 24 * 60 * 60 * 1000).setHours(0, 0, 0, 0), '{y}-{m}-{d} {h}:{i}:{s}')
      const filters = {
        county_name: row['区县'],
        form_type_custom: 'not_fttr',
        current_date_custom: [startTime, endTime]
      }
      this.$store.commit('crossPageSearch/SET_INITIAL_FILTERS', filters)
      this.$router.push({ path: '/flat/installation/work-order-inquiry/accumulated' })
    },
    handleNavigateDangRiYingZhuangLeiJiFTTR(row) {
      const startTime = parseTime(new Date().setHours(0, 0, 0, 0), '{y}-{m}-{d} {h}:{i}:{s}')
      const endTime = parseTime(new Date(new Date().getTime() + 24 * 60 * 60 * 1000).setHours(0, 0, 0, 0), '{y}-{m}-{d} {h}:{i}:{s}')
      const filters = {
        county_name: row['区县'],
        form_type_custom: 'fttr',
        current_date_custom: [startTime, endTime]
      }
      this.$store.commit('crossPageSearch/SET_INITIAL_FILTERS', filters)
      this.$router.push({ path: '/flat/installation/work-order-inquiry/accumulated' })
    },
    handleNavigateDangRiYingZhuangQingLing(row) {
      const startTime = parseTime(new Date().setHours(0, 0, 0, 0), '{y}-{m}-{d} {h}:{i}:{s}')
      const endTime = parseTime(new Date(new Date().getTime() + 24 * 60 * 60 * 1000).setHours(0, 0, 0, 0), '{y}-{m}-{d} {h}:{i}:{s}')
      const filters = {
        county_name: row['区县'],
        form_type_custom: 'not_fttr',
        current_date_custom: [startTime, endTime]
      }
      this.$store.commit('crossPageSearch/SET_INITIAL_FILTERS', filters)
      this.$router.push({ path: '/flat/installation/work-order-inquiry/cleared' })
    },
    handleNavigateDangRiYingZhuangQingLingFTTR(row) {
      const startTime = parseTime(new Date().setHours(0, 0, 0, 0), '{y}-{m}-{d} {h}:{i}:{s}')
      const endTime = parseTime(new Date(new Date().getTime() + 24 * 60 * 60 * 1000).setHours(0, 0, 0, 0), '{y}-{m}-{d} {h}:{i}:{s}')
      const filters = {
        county_name: row['区县'],
        form_type_custom: 'fttr',
        current_date_custom: [startTime, endTime]
      }
      this.$store.commit('crossPageSearch/SET_INITIAL_FILTERS', filters)
      this.$router.push({ path: '/flat/installation/work-order-inquiry/cleared' })
    },
    handleNavigateCuiZhuangGongDanWeiGuiDang(row) {
      const startTime = parseTime(new Date().setHours(0, 0, 0, 0), '{y}-{m}-{d} {h}:{i}:{s}')
      const endTime = parseTime(new Date(new Date().getTime() + 24 * 60 * 60 * 1000).setHours(0, 0, 0, 0), '{y}-{m}-{d} {h}:{i}:{s}')
      const filters = {
        county: row['区县'],
        form_type_custom: 'not_fttr',
        current_date_custom: [startTime, endTime]
      }
      this.$store.commit('crossPageSearch/SET_INITIAL_FILTERS', filters)
      this.$router.push({ path: '/flat/installation/work-order-inquiry/urgent' })
    },
    handleNavigateCuiZhuangGongDanWeiGuiDangFTTR(row) {
      const startTime = parseTime(new Date().setHours(0, 0, 0, 0), '{y}-{m}-{d} {h}:{i}:{s}')
      const endTime = parseTime(new Date(new Date().getTime() + 24 * 60 * 60 * 1000).setHours(0, 0, 0, 0), '{y}-{m}-{d} {h}:{i}:{s}')
      const filters = {
        county: row['区县'],
        form_type_custom: 'fttr',
        current_date_custom: [startTime, endTime]
      }
      this.$store.commit('crossPageSearch/SET_INITIAL_FILTERS', filters)
      this.$router.push({ path: '/flat/installation/work-order-inquiry/urgent' })
    },
    handleNavigateManualJudgment(row) {
      const startTime = parseTime(new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000).setHours(0, 0, 0, 0), '{y}-{m}-{d} {h}:{i}:{s}')
      const endTime = parseTime(new Date(new Date().getTime() + 24 * 60 * 60 * 1000).setHours(0, 0, 0, 0), '{y}-{m}-{d} {h}:{i}:{s}')
      const filters = {
        county_name: row['区县'],
        flow_name: ['手写判断流程'],
        send_time: [startTime, endTime]
      }
      this.$store.commit('crossPageSearch/SET_INITIAL_FILTERS', filters)
      this.$router.push({ path: '/flat/installation/work-order-inquiry/manual-judgment-red-yellow' })
    },
    handleNavigateRedYellow(row) {
    // 30天-今天+1天
      const startTime = parseTime(new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000).setHours(0, 0, 0, 0), '{y}-{m}-{d} {h}:{i}:{s}')
      const endTime = parseTime(new Date(new Date().getTime() + 24 * 60 * 60 * 1000).setHours(0, 0, 0, 0), '{y}-{m}-{d} {h}:{i}:{s}')
      const filters = {
        county_name: row['区县'],
        flow_name: ['分光器扩容流程', '地址建设流程'],
        send_time: [startTime, endTime]
      }
      this.$store.commit('crossPageSearch/SET_INITIAL_FILTERS', filters)
      this.$router.push({ path: '/flat/installation/work-order-inquiry/manual-judgment-red-yellow' })
    },
    handleNavigateTechnicianSite(row) {
      const startTime = parseTime(new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000).setHours(0, 0, 0, 0), '{y}-{m}-{d} {h}:{i}:{s}')
      const endTime = parseTime(new Date(new Date().getTime() + 24 * 60 * 60 * 1000).setHours(0, 0, 0, 0), '{y}-{m}-{d} {h}:{i}:{s}')
      const filters = {
        county: row['区县'],
        activityinstname: '装维选址',
        sendTime: [startTime, endTime]
      }
      this.$store.commit('crossPageSearch/SET_INITIAL_FILTERS', filters)
      this.$router.push({ path: '/flat/installation/work-order-inquiry/site-verification' })
    },
    handleNavigateTechnicianCheck(row) {
      const startTime = parseTime(new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000).setHours(0, 0, 0, 0), '{y}-{m}-{d} {h}:{i}:{s}')
      const endTime = parseTime(new Date(new Date().getTime() + 24 * 60 * 60 * 1000).setHours(0, 0, 0, 0), '{y}-{m}-{d} {h}:{i}:{s}')
      const filters = {
        county: row['区县'],
        activityinstname: '装维核实',
        sendTime: [startTime, endTime]
      }
      this.$store.commit('crossPageSearch/SET_INITIAL_FILTERS', filters)
      this.$router.push({ path: '/flat/installation/work-order-inquiry/site-verification' })
    },
    async handleDownload() {
      this.downloadLoading = true
      try {
        const response = await getInstallationCounty()
        let allData = response.data

        if (!allData || allData.length === 0) {
          this.$message.warning('没有可导出的数据')
          return // Exit if there's no data to export
        }
        // 统一调用排序函数
        allData = this.sortByCounty(allData)

        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = ['区县', '当日应装(累计)', '当日实装(累计)', '当日装机率(累计)', '当日应装(清零)', '当日实装(清零)', '当日未装(清零)', '当日未装占比(清零)', '催装工单(未归档)', '手写判断单', '红黄单', '装维选址', '装维核实', '当日应装(累计)-FTTR', '当日实装(累计)-FTTR', '当日装机率(累计)-FTTR', '当日应装(清零)-FTTR', '当日实装(清零)-FTTR', '当日未装(清零)-FTTR', '当日未装占比(清零)-FTTR', '催装工单(未归档)-FTTR']
          const filterVal = ['区县', '当日应装(累计)', '当日实装(累计)', '当日装机率(累计)', '当日应装(清零)', '当日实装(清零)', '当日未装(清零)', '当日未装占比(清零)', '催装工单(未归档)', '手写判断单', '红黄单', '装维选址', '装维核实', '当日应装(累计)-FTTR', '当日实装(累计)-FTTR', '当日装机率(累计)-FTTR', '当日应装(清零)-FTTR', '当日实装(清零)-FTTR', '当日未装(清零)-FTTR', '当日未装占比(清零)-FTTR', '催装工单(未归档)-FTTR']
          const data = this.formatJson(filterVal, allData)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: `大屏-区县粒度-${new Date().toLocaleString()}`,
            autoWidth: true,
            bookType: 'xlsx'
          })
        })
      } catch (error) {
        console.error('导出Excel时发生错误:', error)
        this.$message.error('导出失败，请稍后重试')
      } finally {
        this.downloadLoading = false
      }
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        return v[j]
      }))
    }
  }
}
</script>
