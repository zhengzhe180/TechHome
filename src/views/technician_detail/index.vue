<template>
  <div class="app-container">
    <div class="technician-info">
      <h3>Technician ID: {{ technicianId }}</h3>
    </div>

    <div class="table-container">
      <h4>Complaint Tickets</h4>
      <el-table v-loading="complaintsLoading" :data="complaintsList" border fit highlight-current-row style="width: 100%">
        <el-table-column prop="form_no" label="Form No" />
        <el-table-column prop="title" label="Title" />
        <el-table-column prop="technician_name" label="Technician Name" />
        <el-table-column prop="technician_id" label="Technician ID" />
        <el-table-column prop="phone" label="Phone" />
      </el-table>
    </div>

    <div class="table-container" style="margin-top: 30px;">
      <h4>Installation Tickets</h4>
      <el-table v-loading="installationsLoading" :data="installationsList" border fit highlight-current-row style="width: 100%">
        <el-table-column prop="form_no" label="Form No" />
        <el-table-column prop="title" label="Title" />
        <el-table-column prop="technician_name" label="Technician Name" />
        <el-table-column prop="technician_id" label="Technician ID" />
        <el-table-column prop="phone" label="Phone" />
      </el-table>
    </div>

  </div>
</template>

<script>
import { fetchComplaints, fetchInstallations } from '@/api/technician'

export default {
  name: 'TechnicianDetail',
  data() {
    return {
      technicianId: null,
      complaintsList: [],
      installationsList: [],
      complaintsLoading: true,
      installationsLoading: true
    }
  },
  created() {
    this.technicianId = this.$route.params.technician_id
    this.getLists()
  },
  methods: {
    getLists() {
      this.complaintsLoading = true
      this.installationsLoading = true

      const params = { technician_id: this.technicianId }

      Promise.all([fetchComplaints(params), fetchInstallations(params)])
        .then(([complaintsResponse, installationsResponse]) => {
          this.complaintsList = complaintsResponse.data.items
          this.installationsList = installationsResponse.data.items
        })
        .catch(error => {
          console.error('Failed to fetch technician data', error)
          this.$message({
            message: 'Failed to load data',
            type: 'error',
            duration: 5 * 1000
          })
        })
        .finally(() => {
          this.complaintsLoading = false
          this.installationsLoading = false
        })
    }
  }
}
</script>

<style scoped>
.table-container {
  margin-bottom: 20px;
}
.technician-info {
  margin-bottom: 20px;
}
</style>
