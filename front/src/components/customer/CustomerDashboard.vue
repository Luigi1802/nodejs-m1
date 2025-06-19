<template>
  <v-container>
    <br>
    <v-row align="center" class="mb-4" justify="space-between">
      <h1>Available Equipment</h1>
      <v-btn color="primary" @click="goToRequests">
        Manage my requests
        <v-icon end>mdi-arrow-right</v-icon>
      </v-btn>
    </v-row>

    <v-row>
      <v-col
        v-for="availableEquipment in availableEquipments"
        :key="availableEquipment._id"
        cols="12"
        lg="3"
        md="4"
        sm="6"
      >
        <v-card>
          <v-img cover height="200px" :src="getImage(availableEquipment.picture)" />

          <v-card-title>{{ availableEquipment.name }}</v-card-title>
          <v-card-subtitle>Condition: {{ availableEquipment.state }}</v-card-subtitle>

          <v-card-text>
            <div class="description-clamp">
              {{ availableEquipment.description }}
            </div>
            <br>
            <div><strong>Serial Number:</strong> {{ availableEquipment.serial_number }}</div>
          </v-card-text>

          <v-card-actions>
            <v-btn color="primary" @click="rentEquipment(availableEquipment)">Rent</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <br>
    <br>
    <v-row align="center" class="mb-4" justify="space-between">
      <h1>Back in store soon</h1>
    </v-row>
    <v-row>
      <p>List of unavailable equipments - already rented or pending approval.</p>
    </v-row>

    <v-row>
      <v-col
        v-for="unavailableEquipment in unavailableEquipments"
        :key="unavailableEquipment._id"
        cols="12"
        lg="3"
        md="4"
        sm="6"
      >
        <v-card>
          <v-img cover height="200px" :src="getImage(unavailableEquipment.picture)" />

          <v-card-title>{{ unavailableEquipment.name }}</v-card-title>
          <v-card-subtitle>Condition: {{ unavailableEquipment.state }}</v-card-subtitle>

          <v-card-text>
            <div class="description-clamp">
              {{ unavailableEquipment.description }}
            </div>
            <br>
            <div><strong>Serial Number:</strong> {{ unavailableEquipment.serial_number }}</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Rent Dialog -->
    <v-dialog v-model="dialog" max-width="600px">
      <v-card>
        <v-card-title>
          'Rent Equipment'
        </v-card-title>
        <v-card-text>
          <v-form ref="formRef">
            <v-text-field v-model="form.name" label="Name" readonly />
            <v-textarea v-model="form.description" label="Description" readonly/>
            <v-text-field v-model="form.serial_number" label="Serial Number" readonly/>
            <v-text-field v-model="form.state" label="Condition" readonly/>
            <v-text-field v-model="form.status" label="Status" readonly/>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="dialog = false">Cancel</v-btn>
          <v-btn color="primary" @click="submitForm">Confirm rent request</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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
  import { onMounted, ref } from 'vue'
  import { getAllAvailableEquipments, getAllUnavailableEquipments } from '../../services/equipmentService'
  import { createRequest } from '../../services/requestService'
  import router from '../../router/index.js'
  import { logout } from '../../utils/auth.js'

  const availableEquipments = ref([])
  const unavailableEquipments = ref([])
  const dialog = ref(false)
  const selectedEquipment = ref(null)
  const formRef = ref(null)
  const form = ref({
    name: '',
    description: '',
    serial_number: '',
    status: '',
    state: '',
    picture: '',
  })

  const getImage = picture => {
    if (picture === '') {
      return '/images/no-image-icon.png'
    }
    return picture;
  };

  const goToRequests = () => {
    router.push('/customer/requests')
  }

  const fetchEquipments = async () => {
    try {
      const data = await getAllAvailableEquipments()
      const data2 = await getAllUnavailableEquipments()

      availableEquipments.value = data
      unavailableEquipments.value = data2
    } catch (err) {
      console.error('Failed to load equipment lists', err)
    }
  }

  const rentEquipment = availableEquipment => {
    selectedEquipment.value = availableEquipment
    form.value = { ...availableEquipment }
    dialog.value = true
  }

  const submitForm = async () => {
    try {
      await createRequest({
      equipment: selectedEquipment.value._id,
      request_type: 'rental',
    })
      dialog.value = false
      fetchEquipments()
    } catch (err) {
      console.error('Rent request error', err)
    }
  }

  const resetForm = () => {
    form.value = {
      name: '',
      description: '',
      serial_number: '',
      status: '',
      state: '',
      picture: '',
    }
  }

  const handleLogout = () => {
    logout()
    router.push('/login')
  }


  onMounted(fetchEquipments)
</script>
<style scoped>
.description-clamp {
  display: -webkit-box;
  -webkit-line-clamp: 3; /* Nombre de lignes */
  line-clamp: 3; /* Nombre de lignes */
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  height: 4.5em; /* ~1.5em x 3 lignes */
}
.fab {
  position: fixed;
  bottom: 85px;
  right: 24px;
  z-index: 100;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}
.logout-btn {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 100;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}
</style>
