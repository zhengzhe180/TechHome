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
          v-else-if="item.type === 'multiple_select'"
          :key="item.key"
          v-model="listQuery[item.key]"
          :placeholder="item.placeholder"
          clearable
          multiple
          collapse-tags
          class="filter-item"
          style="width: 200px; margin-right: 8px;"
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
import { fetchListManualJudgmentRedYellowOrders, exportListManualJudgmentRedYellowOrders } from '@/api/installation'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'InstallationManualJudgmentRedYellowOrders',
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
        form_no: undefined,
        form_title: undefined,
        broadband_account: undefined,
        flow_name: undefined,
        send_time: undefined
      },
      filterConfig: [
        { key: 'county_name', placeholder: '区县', type: 'input' },
        { key: 'form_no', placeholder: '工单编号', type: 'input' },
        { key: 'form_title', placeholder: '工单标题', type: 'input' },
        { key: 'broadband_account', placeholder: '宽带账号', type: 'input' },
        { key: 'flow_name', placeholder: '流程名称', type: 'multiple_select', options: [{ label: '手写判断流程', value: '手写判断流程' }, { label: '地址建设流程', value: '地址建设流程' }, { label: '分光器扩容流程', value: '分光器扩容流程' }] },
        { key: 'send_time', start: '派单开始时间', end: '派单结束时间', type: 'date' }
      ],
      tableColumns: [
        { prop: 'county_name', label: '区县', width: '110', align: 'center' },
        { prop: 'form_no', label: '工单编号', width: '160', align: 'center' },
        { prop: 'form_title', label: '工单标题', minWidth: '150', align: 'center' },
        { prop: 'current_state', label: '工单状态', width: '100', align: 'center', type: 'status' },
        { prop: 'broadband_account', label: '宽带账号', width: '120', align: 'center' },
        { prop: 'flow_name', label: '流程名称', width: '130', align: 'center' },
        { prop: 'send_time', label: '派单时间', width: '160', align: 'center', type: 'datetime' }
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
      fetchListManualJudgmentRedYellowOrders(this.listQuery).then(response => {
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
      const { send_time } = this.listQuery
      if (!send_time) {
        this.$message.error('必须选择派单时间')
        return
      }

      const startDate = new Date(send_time[0])
      const endDate = new Date(send_time[1])
      const timeDiff = endDate.getTime() - startDate.getTime()
      const dayDiff = timeDiff / (1000 * 3600 * 24)

      if (dayDiff > 40) {
        this.$message.error('导出Excel时，期望&最后预约时间最大跨度为40天')
        return
      }

      this.downloadLoading = true
      try {
        const queryForAll = { ...this.listQuery }
        delete queryForAll.page
        delete queryForAll.limit

        const response = await exportListManualJudgmentRedYellowOrders(queryForAll)
        const allData = response.data

        if (!allData || allData.length === 0) {
          this.$message.warning('没有可导出的数据')
          return // Exit if there's no data to export
        }

        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = ['区县', '工单编号', '工单标题', '宽带账号', '流程名称', '派单开始时间']
          const filterVal = ['county_name', 'form_no', 'form_title', 'broadband_account', 'flow_name', 'send_time']
          const data = this.formatJson(filterVal, allData)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: `手写判断/红黄单-${new Date().toLocaleString()}`,
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
