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
          <span>{{ row[col.prop] }}</span>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

  </div>
</template>

<script>
import { fetchListZhuangWeiXuanZhiZhuangWeiHeShi, exportListZhuangWeiXuanZhiZhuangWeiHeShi } from '@/api/installation'
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
        county: undefined,
        yidongGrid: undefined,
        flowNo: undefined,
        flowTitle: undefined,
        zwAccount: undefined,
        formState: undefined,
        activityinstname: undefined,
        sendTime: undefined
      },
      filterConfig: [
        { key: 'county', placeholder: '区县', type: 'input' },
        { key: 'yidongGrid', placeholder: '网格', type: 'input' },
        { key: 'flowNo', placeholder: '工单编号', type: 'input' },
        { key: 'flowTitle', placeholder: '主题', type: 'input' },
        { key: 'zwAccount', placeholder: '装维账号', type: 'input' },
        { key: 'formState', placeholder: '工单状态', type: 'select', options: [{ label: '运行中', value: '运行中' }, { label: '已归档', value: '已归档' }] },
        { key: 'activityinstname', placeholder: '当前环节', type: 'select', options: [{ label: '装维核实', value: '装维核实' }, { label: '装维选址', value: '装维选址' }] },
        { key: 'sendTime', start: '派单时间', end: '派单时间', type: 'date' }
      ],
      tableColumns: [
        { prop: 'county', label: '区县', width: '110', align: 'center' },
        { prop: 'yidongGrid', label: '网格', width: '170', align: 'center' },
        { prop: 'flowNo', label: '工单编号', width: '140', align: 'center' },
        { prop: 'flowTitle', label: '主题', width: '160', align: 'center' },
        { prop: 'formState', label: '工单状态', width: '100', align: 'center' },
        { prop: 'activityinstname', label: '当前环节', width: '100', align: 'center' },
        { prop: 'flowName', label: '工单分类', width: '140', align: 'center' },
        { prop: 'sendTime', label: '派单时间', width: '160', align: 'center' },
        { prop: 'inDdPoolTime', label: '进入待调度池时间', width: '160', align: 'center' },
        { prop: 'zwAccount', label: '装维账号', width: '160', align: 'center' },
        { prop: 'technicianName', label: '装维姓名', width: '160', align: 'center' },
        { prop: 'technicianPhone', label: '装维电话', width: '160', align: 'center' }
      ]
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
      fetchListZhuangWeiXuanZhiZhuangWeiHeShi(this.listQuery).then(response => {
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
      const { sendTime } = this.listQuery
      if (!sendTime) {
        this.$message.error('必须选择派单时间')
        return
      }

      const startDate = new Date(sendTime[0])
      const endDate = new Date(sendTime[1])
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

        const response = await exportListZhuangWeiXuanZhiZhuangWeiHeShi(queryForAll)
        const allData = response.data

        if (!allData || allData.length === 0) {
          this.$message.warning('没有可导出的数据')
          return // Exit if there's no data to export
        }

        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = ['区县', '网格', '工单编号', '主题', '工单状态', '当前环节', '工单分类', '派单时间', '进入待调度池时间', '装维账号', '装维姓名', '装维电话']
          const filterVal = ['county', 'yidongGrid', 'flowNo', 'flowTitle', 'formState', 'activityinstname', 'flowName', 'sendTime', 'inDdPoolTime', 'zwAccount', 'technicianName', 'technicianPhone']
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
        return v[j]
      }))
    }
  }
}
</script>
