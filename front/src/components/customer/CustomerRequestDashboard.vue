<template>
  <v-container>
    <br>
    <v-row align="center" class="mb-4" justify="space-between">
      <v-btn color="primary" @click="goToEquipments">
        <v-icon start>mdi-arrow-left</v-icon>
        Rent Equipments
      </v-btn>
      <h1>My Requests</h1>
    </v-row>

    <h2 class="mb-2">Pending Requests</h2>
    <v-table>
      <thead>
        <tr>
          <th>Type</th>
          <th>Equipment</th>
          <th>State</th>
          <th>Status</th>
          <th>Action</th>
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
            <v-icon
              class="me-1"
              color="#fcba03"
              size="18"
            >
              mdi-radiobox-marked
            </v-icon>
            {{ req.equipment.status }}
          </td>
          <td style="vertical-align: middle;">
            <v-btn color="error" size="small" @click="handleCancelRequest(req)">
              Cancel
            </v-btn>
          </td>
        </tr>
      </tbody>
    </v-table>

    <h2 class="mb-2">Equipment to return</h2>
    <v-table>
      <thead>
        <tr>
          <th>Type</th>
          <th>Equipment</th>
          <th>State</th>
          <th>Status</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="req in requestsToReturn" :key="req._id">
          <td>
            {{ req.request_type }}
            <v-icon
              class="ms-1"
              :icon="req.request_type === 'rental' ? 'mdi-hand-coin' : 'mdi-login'"
              size="small"
            />
          </td>
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
            <v-icon
              class="me-1"
              color="#fcba03"
              size="18"
            >
              mdi-radiobox-marked
            </v-icon>
            {{ req.equipment.status }}
          </td>
          <td style="vertical-align: middle;">
            <v-btn color="warning" size="small" @click="handleReturnRequest(req)">
              Return
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
    getMyRequests,
    getMyRequestsToReturn,
    cancelRequest,
    createRequest
  } from '../../services/requestService'

  const requests = ref([])
  const requestsToReturn = ref([])
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
    router.push('/customer/dashboard');
  }

  const fetchRequests = async () => {
    try {
      const data = await getMyRequests()
      requests.value = data

      // init les valeurs de mise à jour d'état
      data.forEach(r => {
        updatedStates.value[r._id] = r.equipment.state
      })
    } catch (err) {
      console.error('Error loading requests:', err)
    }

    try {
      const data = await getMyRequestsToReturn()
      requestsToReturn.value = data
    } catch (err) {
      console.error('Error loading requests to return:', err)
    }

  }

  const handleCancelRequest = async req => {
    try {
        await cancelRequest(req._id)
        await fetchRequests()
    } catch (err) {
        console.error('Error cancelling request:', err)
    }
  }

  const handleReturnRequest = async req => {
    try {
        await createRequest({
            equipment: req.equipment._id,
            request_type: 'return',
        });
        await fetchRequests();
    } catch (err) {
        console.error('Error creating request:', err);
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
