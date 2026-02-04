<template>
  <div class="app-container">
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column label="technician_name" align="center">
        <template slot-scope="{row}">
          <span>{{ row.technician_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="technician_id" align="center">
        <template slot-scope="{row}">
          <el-button type="text" @click="handleTechnicianClick(row)">{{ row.technician_id }}</el-button>
        </template>
      </el-table-column>
      <el-table-column label="form_no" align="center">
        <template slot-scope="{row}">
          <span>{{ row.form_no }}</span>
        </template>
      </el-table-column>
      <el-table-column label="title" align="center">
        <template slot-scope="{row}">
          <span>{{ row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column label="phone" align="center">
        <template slot-scope="{row}">
          <span>{{ row.phone }}</span>
        </template>
      </el-table-column>    </el-table>
  </div>
</template>

<script>
import { fetchList } from '@/api/complaint'

export default {
  name: 'FlatSchedulingTable',
  data() {
    return {
      tableKey: 0,
      list: null,
      listLoading: true
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchList().then(response => {
        this.list = response.data.items
        this.listLoading = false
      })
    },
    handleTechnicianClick(row) {
      this.$router.push(`/technician_detail/index/${row.technician_id}`)
    }
  }
}
</script>
