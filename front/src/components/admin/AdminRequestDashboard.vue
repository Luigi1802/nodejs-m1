<template>
  <v-container>
    <br>
    <v-row align="center" class="mb-4" justify="space-between">
      <v-btn color="primary" @click="goToEquipments">
        <v-icon start>mdi-arrow-left</v-icon>
        Manage equipments
      </v-btn>
      <h1>Customer Requests Management</h1>
    </v-row>

    <h2 class="mb-2">Pending Requests</h2>
    <v-table>
      <thead>
        <tr>
          <th>Type</th>
          <th>Customer Email</th>
          <th>Equipment</th>
          <th>Current State</th>
          <th>Update State</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="req in pendingRequests" :key="req._id">
          <td>
            {{ req.request_type }}
            <v-icon
              class="ms-1"
              :icon="req.request_type === 'rental' ? 'mdi-hand-coin' : 'mdi-login'"
              size="small"
            />
          </td>
          <td>{{ req.customer.email }}</td>
          <td>{{ req.equipment.name }} ({{ req.equipment.serial_number }})</td>
          <td style="vertical-align: middle;">
            <v-avatar
              class="me-2"
              :color="getStateColor(req.equipment.state)"
              size="12"
            />
            {{ req.equipment.state }}
          </td>
          <td style="vertical-align: middle; padding-bottom: 10px;">
            <v-select
              v-model="updatedStates[req._id]"
              density="compact"
              hide-details
              :items="states"
              style="max-width: 120px;"
              variant="underlined"
            />
          </td>
          <td style="vertical-align: middle;">
            <v-btn class="me-2" color="success" size="small" @click="acceptRequest(req)">
              Accept
            </v-btn>
            <v-btn color="error" size="small" @click="denyRequest(req)">
              Deny
            </v-btn>
          </td>
        </tr>
      </tbody>
    </v-table>

    <h2 class="mt-8 mb-2">Processed Requests</h2>
    <v-table>
      <thead>
        <tr>
          <th>Type</th>
          <th>Customer Email</th>
          <th>Equipment</th>
          <th>Final State</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="req in processedRequests" :key="req._id">
          <td>
            {{ req.request_type }}
            <v-icon
              class="ms-1"
              :icon="req.request_type === 'rental' ? 'mdi-hand-coin' : 'mdi-login'"
              size="small"
            />
          </td>
          <td>{{ req.customer.email }}</td>
          <td>{{ req.equipment.name }} ({{ req.equipment.serial_number }})</td>
          <td>
            <v-avatar
              class="me-2"
              :color="getStateColor(req.equipment_state)"
              size="12"
            />
            {{ req.equipment_state }}
          </td>
          <td class="d-flex align-center">
            <v-icon
              class="me-1"
              :color="req.status === 'accepted' ? '#4CAF50' : '#F44336'"
              size="18"
            >
              {{ req.status === 'accepted' ? 'mdi-check-circle' : 'mdi-close-circle' }}
            </v-icon>
            {{ req.status }}
          </td>
        </tr>
      </tbody>
    </v-table>
  </v-container>
  <v-btn
    class="logout-btn"
    color="error"
    icon
    @click="handleLogout"
  >
    <v-icon size="20">mdi-logout</v-icon>
  </v-btn>
</template>

<script setup>
  import { computed, onMounted, ref } from 'vue'
  import router from '../../router/index.js'
  import { logout } from '../../utils/auth.js'
  import {
    getAllRequests,
    updateRequestStatus,
  } from '../../services/requestService' // à créer si pas encore

  const requests = ref([])
  const states = ['new', 'good', 'used', 'damaged', 'broken']
  const updatedStates = ref({})

  const getStateColor = state => {
    switch (state) {
      case 'new':
        return '#4CAF50'; // vert
      case 'good':
        return '#8BC34A'; // vert clair
      case 'used':
        return '#FFC107'; // jaune/orangé
      case 'damaged':
        return '#FF9800'; // orange
      case 'broken':
        return '#F44336'; // rouge
      default:
        return '#9E9E9E'; // gris pour inconnus
    }
  }

  const pendingRequests = computed(() =>
    requests.value.filter(r => r.status === 'pending')
  )
  const processedRequests = computed(() =>
    requests.value.filter(r => r.status === 'accepted' || r.status === 'denied')
  )

  const goToEquipments = () => {
    router.push('/admin/equipments')
  }

  const fetchRequests = async () => {
    try {
      const data = await getAllRequests()
      requests.value = data

      // init les valeurs de mise à jour d'état
      data.forEach(r => {
        updatedStates.value[r._id] = r.equipment.state
      })
    } catch (err) {
      console.error('Error loading requests:', err)
    }
  }

  const acceptRequest = async req => {
    try {
      const newState = updatedStates.value[req._id]
      await updateRequestStatus(req._id, 'accepted', newState)
      fetchRequests()
    } catch (err) {
      console.error('Error accepting request:', err)
    }
  }

  const denyRequest = async req => {
    try {
      const newState = updatedStates.value[req._id]
      await updateRequestStatus(req._id, 'denied', newState)
      fetchRequests()
    } catch (err) {
      console.error('Error denying request:', err)
    }
  }

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  onMounted(fetchRequests)
</script>
<style scoped>
.logout-btn {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 100;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}
</style>
