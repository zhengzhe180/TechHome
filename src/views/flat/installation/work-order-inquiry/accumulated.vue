<template>
  <div class="app-container">
    <div class="filter-container">
      <template v-for="item in filterConfig">
        <el-input
          v-if="item.type === 'input'"
          :key="item.key"
          v-model="listQuery[item.key]"
          :placeholder="item.placeholder"
          style="width: 120px; margin-right: 8px;"
          clearable
          class="filter-item"
        />
        <el-date-picker
          v-else-if="item.type === 'date'"
          :key="item.key"
          v-model="listQuery[item.key]"
          type="datetimerange"
          value-format="yyyy-MM-dd HH:mm:ss"
          range-separator="至"
          :start-placeholder="item.start"
          :end-placeholder="item.end"
          class="filter-item"
          style="margin-right: 8px;"
          clearable
        />
        <el-select
          v-else-if="item.type === 'select'"
          :key="item.key"
          v-model="listQuery[item.key]"
          :placeholder="item.placeholder"
          clearable
          class="filter-item"
          style="width: 130px; margin-right: 8px;"
        >
          <el-option
            v-for="option in item.options"
            :key="option.value"
            :label="option.label"
            :value="option.value"
          />
        </el-select>
      </template>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>

      <el-button :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-document" @click="handleDownload">
        导出 Excel
      </el-button>
    </div>
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column
        v-for="col in tableColumns"
        :key="col.prop"
        :prop="col.prop"
        :label="col.label"
        :width="col.width"
        :min-width="col.minWidth"
        :align="col.align"
      >
        <template slot-scope="{row}">
          <span v-if="col.type === 'status'">{{ statusMap[row[col.prop]] }}</span>
          <span v-else>{{ row[col.prop] }}</span>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

  </div>
</template>

<script>
import { fetchListAccumulated, exportListAccumulated } from '@/api/installation'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'InstallationAccumulated',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 50,
        county_name: undefined,
        grid_name: undefined,
        form_no: undefined,
        form_title: undefined,
        broadband_account: undefined,
        send_time: undefined,
        end_time: undefined,
        ywsl_date: undefined,
        custom_expect_time: undefined,
        latest_expect_time: undefined,
        current_state: undefined,
        technician_id: undefined,
        technician_name: undefined,
        current_date_custom: undefined,
        form_type_custom: undefined
      },
      filterConfig: [
        { key: 'county_name', placeholder: '区县', type: 'input' },
        { key: 'grid_name', placeholder: '网格', type: 'input' },
        { key: 'form_no', placeholder: '工单编号', type: 'input' },
        { key: 'form_title', placeholder: '工单标题', type: 'input' },
        { key: 'current_state', placeholder: '工单状态', type: 'select', options: [{ label: '运行中', value: '2' }, { label: '已归档', value: '3' }] },
        { key: 'form_type_custom', placeholder: '工单类型', type: 'select', options: [{ label: 'FTTR工单', value: 'fttr' }, { label: '宽带工单(不含FTTR)', value: 'not_fttr' }] },
        { key: 'broadband_account', placeholder: '宽带账号', type: 'input' },
        { key: 'technician_id', placeholder: '装维账号', type: 'input' },
        { key: 'technician_name', placeholder: '装维姓名', type: 'input' },
        { key: 'send_time', start: '派单开始时间', end: '派单结束时间', type: 'date' },
        { key: 'end_time', start: '归档开始时间', end: '归档结束时间', type: 'date' },
        { key: 'ywsl_date', start: '业务受理开始时间', end: '业务受理结束时间', type: 'date' },
        { key: 'custom_expect_time', start: '客户期望安装开始时间', end: '客户期望安装结束时间', type: 'date' },
        { key: 'latest_expect_time', start: '最后一次预约开始时间', end: '最后一次预约结束时间', type: 'date' },
        { key: 'current_date_custom', start: '期望&最后预约时间', end: '期望&最后预约时间', type: 'date' }
      ],
      tableColumns: [
        { prop: 'county_name', label: '区县', width: '110', align: 'center' },
        { prop: 'grid_name', label: '网格', width: '110', align: 'center' },
        { prop: 'form_no', label: '工单编号', width: '160', align: 'center' },
        { prop: 'form_title', label: '工单标题', minWidth: '150', align: 'center' },
        { prop: 'current_state', label: '工单状态', width: '100', align: 'center', type: 'status' },
        { prop: 'send_time', label: '派单时间', width: '160', align: 'center', type: 'datetime' },
        { prop: 'end_time', label: '归档时间', width: '160', align: 'center', type: 'datetime' },
        { prop: 'ywsl_date', label: '业务受理时间', width: '160', align: 'center', type: 'datetime' },
        { prop: 'custom_expect_time', label: '客户期望安装时间', width: '160', align: 'center', type: 'datetime' },
        { prop: 'latest_expect_time', label: '最后一次预约时间', width: '160', align: 'center', type: 'datetime' },
        { prop: 'broadband_account', label: '宽带账号', width: '120', align: 'center' },
        { prop: 'technician_id', label: '装维账号', width: '160', align: 'center' },
        { prop: 'technician_name', label: '装维姓名', width: '120', align: 'center' },
        { prop: 'technician_phone', label: '装维电话', width: '120', align: 'center' },
        { prop: 'zone_id', label: '小区ID', width: '100', align: 'center' },
        { prop: 'zone_name', label: '小区名称', width: '120', align: 'center' }
      ],
      statusMap: {
        '2': '运行中',
        '3': '已归档'
      }
    }
  },
  created() {
    // Check for cross-page search filters in Vuex
    const initialFilters = this.$store.state.crossPageSearch.initialFilters
    if (initialFilters) {
      // Merge the filters into the local query object
      this.listQuery = { ...this.listQuery, ...initialFilters }
      // Clear the filters in Vuex so they are not used again
      this.$store.commit('crossPageSearch/CLEAR_INITIAL_FILTERS')
    }
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchListAccumulated(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    async handleDownload() {
      const { current_date_custom } = this.listQuery
      if (!current_date_custom || current_date_custom.length !== 2) {
        this.$message.error('请先选择期望&最后预约时间')
        return
      }

      const startDate = new Date(current_date_custom[0])
      const endDate = new Date(current_date_custom[1])
      const timeDiff = endDate.getTime() - startDate.getTime()
      const dayDiff = timeDiff / (1000 * 3600 * 24)

      if (dayDiff > 7) {
        this.$message.error('导出Excel时，期望&最后预约时间最大跨度为7天')
        return
      }

      this.downloadLoading = true
      try {
        const queryForAll = { ...this.listQuery }
        delete queryForAll.page
        delete queryForAll.limit

        const response = await exportListAccumulated(queryForAll)
        const allData = response.data

        if (!allData || allData.length === 0) {
          this.$message.warning('没有可导出的数据')
          return // Exit if there's no data to export
        }

        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = ['区县', '网格', '工单编号', '工单标题', '工单状态', '派单时间', '归档时间', '业务受理时间', '客户期望安装时间', '最后一次预约时间', '宽带账号', '装维账号', '装维姓名', '装维电话', '小区ID', '小区名称']
          const filterVal = ['county_name', 'grid_name', 'form_no', 'form_title', 'current_state', 'send_time', 'end_time', 'ywsl_date', 'custom_expect_time', 'latest_expect_time', 'broadband_account', 'technician_id', 'technician_name', 'technician_phone', 'zone_id', 'zone_name']
          const data = this.formatJson(filterVal, allData)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: `装机工单(累计)-${new Date().toLocaleString()}`,
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
        if (j === 'current_state') {
          return this.statusMap[v[j]]
        } else {
          return v[j]
        }
      }))
    }
  }
}
</script>
