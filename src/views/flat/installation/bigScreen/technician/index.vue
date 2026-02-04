<template>
  <div class="app-container">
    <!-- 筛选区 -->
    <div class="filter-container" style="margin-bottom: 12px;">
      <el-input
        v-model="listQuery.county"
        placeholder="请输入区县"
        clearable
        class="filter-item"
        style="width: 160px; margin-right: 8px;"
        @keyup.enter.native="handleFilter"
        @clear="handleFilter"
      />
      <el-input
        v-model="listQuery.grid"
        placeholder="请输入网格"
        clearable
        class="filter-item"
        style="width: 220px; margin-right: 8px;"
        @keyup.enter.native="handleFilter"
        @clear="handleFilter"
      />
      <el-input
        v-model="listQuery.technicianId"
        placeholder="请输入装维ID"
        clearable
        class="filter-item"
        style="width: 180px; margin-right: 8px;"
        @keyup.enter.native="handleFilter"
        @clear="handleFilter"
      />
      <el-input
        v-model="listQuery.technicianName"
        placeholder="请输入装维姓名"
        clearable
        class="filter-item"
        style="width: 160px; margin-right: 12px;"
        @keyup.enter.native="handleFilter"
        @clear="handleFilter"
      />
      <el-button type="primary" icon="el-icon-search" class="filter-item" @click="handleFilter">
        {{ $t('table.search') || '搜索' }}
      </el-button>
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
            v-if="column.prop === '当日应装(清零)'"
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
import { getInstallationTechnician } from '@/api/flat'
import { parseTime } from '@/utils'

const columnOrder = [
  '区县',
  '网格',
  '装维ID',
  '装维姓名',
  '当日应装(清零)',
  '当日实装(清零)',
  '当日未装(清零)',
  '当日未装占比(清零)',
  '催装工单(未归档)',
  '装维选址',
  '装维核实',
  '当日应装(清零)-FTTR',
  '当日实装(清零)-FTTR',
  '当日未装(清零)-FTTR',
  '当日未装占比(清零)-FTTR',
  '催装工单(未归档)-FTTR'
]

// 列预设（按列名映射到列配置）
const columnPresets = {
  '区县': { width: 80 },
  '网格': { width: 220, align: 'left', showOverflowTooltip: true },
  '装维ID': { width: 180, showOverflowTooltip: true },
  '装维姓名': { width: 90 },
  '当日应装(清零)': { width: 100 },
  '当日实装(清零)': { width: 100 },
  '当日未装(清零)': { width: 100 },
  '当日未装占比(清零)': { width: 120 },
  '催装工单(未归档)': { width: 110 },
  '装维选址': { width: 100 },
  '装维核实': { width: 100 },
  '当日应装(清零)-FTTR': { width: 140 },
  '当日实装(清零)-FTTR': { width: 140 },
  '当日未装(清零)-FTTR': { width: 140 },
  '当日未装占比(清零)-FTTR': { width: 160 },
  '催装工单(未归档)-FTTR': { width: 160 }
}

export default {
  name: 'InstallationTechnicianTable',
  data() {
    return {
      list: [],
      listLoading: false,
      columns: [],
      // 查询条件（四个筛选字段）
      listQuery: {
        county: '', // 区县
        grid: '', // 网格
        technicianId: '', // 装维工号（装维ID）
        technicianName: '' // 装维姓名
        // 如需分页，可在此加 page/limit，并让后端支持
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    // 仅服务端查询：把非空条件传给后端
    async fetchData() {
      this.listLoading = true
      try {
        // 只传非空字段，避免后端收到空串参与筛选
        const cleaned = {}
        Object.entries(this.listQuery).forEach(([k, v]) => {
          const val = (v || '').trim()
          if (val) cleaned[k] = val
        })

        const resp = await getInstallationTechnician(cleaned)
        const payload = resp && resp.data ? resp.data : []

        // 兼容两种返回结构
        const rows = Array.isArray(payload?.items) ? payload.items
          : (Array.isArray(payload) ? payload : [])

        this.list = rows

        if (!this.list.length) {
          this.columns = []
          return
        }

        // 动态列：按 columnOrder + 预设生成
        const keySet = new Set()
        this.list.forEach(row => Object.keys(row || {}).forEach(k => keySet.add(k)))

        this.columns = columnOrder
          .filter(key => keySet.has(key))
          .map(key => ({
            prop: key,
            label: key,
            align: 'center',
            showOverflowTooltip: true,
            ...(columnPresets[key] || {})
          }))
      } catch (err) {
        this.$message?.error('获取装维数据失败：' + (err.message || '未知错误'))
        console.error(err)
      } finally {
        this.listLoading = false
      }
    },
    handleFilter() {
      // 如果做分页，这里可重置到第1页
      // this.listQuery.page = 1
      this.fetchData()
    },
    handleNavigateDangRiYingZhuangQingLing(row) {
      const startTime = parseTime(new Date().setHours(0, 0, 0, 0), '{y}-{m}-{d} {h}:{i}:{s}')
      const endTime = parseTime(new Date(new Date().getTime() + 24 * 60 * 60 * 1000).setHours(0, 0, 0, 0), '{y}-{m}-{d} {h}:{i}:{s}')
      const filters = {
        technician_id: row['装维ID'],
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
        technician_id: row['装维ID'],
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
        technician_id: row['装维ID'],
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
        technician_id: row['装维ID'],
        form_type_custom: 'fttr',
        current_date_custom: [startTime, endTime]
      }
      this.$store.commit('crossPageSearch/SET_INITIAL_FILTERS', filters)
      this.$router.push({ path: '/flat/installation/work-order-inquiry/urgent' })
    },
    handleNavigateTechnicianSite(row) {
      const startTime = parseTime(new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000).setHours(0, 0, 0, 0), '{y}-{m}-{d} {h}:{i}:{s}')
      const endTime = parseTime(new Date(new Date().getTime() + 24 * 60 * 60 * 1000).setHours(0, 0, 0, 0), '{y}-{m}-{d} {h}:{i}:{s}')
      const filters = {
        zwAccount: row['装维ID'],
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
        zwAccount: row['装维ID'],
        activityinstname: '装维核实',
        sendTime: [startTime, endTime]
      }
      this.$store.commit('crossPageSearch/SET_INITIAL_FILTERS', filters)
      this.$router.push({ path: '/flat/installation/work-order-inquiry/site-verification' })
    },
    async handleDownload() {
      this.downloadLoading = true
      try {
        // 只传非空字段，避免后端收到空串参与筛选
        const cleaned = {}
        Object.entries(this.listQuery).forEach(([k, v]) => {
          const val = (v || '').trim()
          if (val) cleaned[k] = val
        })
        const response = await getInstallationTechnician(cleaned)
        const allData = response.data

        if (!allData || allData.length === 0) {
          this.$message.warning('没有可导出的数据')
          return // Exit if there's no data to export
        }

        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = ['区县', '网格', '装维ID', '装维姓名', '当日应装(清零)', '当日实装(清零)', '当日未装(清零)', '当日未装占比(清零)', '催装工单(未归档)', '装维选址', '装维核实', '当日应装(清零)-FTTR', '当日实装(清零)-FTTR', '当日未装(清零)-FTTR', '当日未装占比(清零)-FTTR', '催装工单(未归档)-FTTR']
          const filterVal = ['区县', '网格', '装维ID', '装维姓名', '当日应装(清零)', '当日实装(清零)', '当日未装(清零)', '当日未装占比(清零)', '催装工单(未归档)', '装维选址', '装维核实', '当日应装(清零)-FTTR', '当日实装(清零)-FTTR', '当日未装(清零)-FTTR', '当日未装占比(清零)-FTTR', '催装工单(未归档)-FTTR']
          const data = this.formatJson(filterVal, allData)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: `大屏-装维粒度-${new Date().toLocaleString()}`,
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
