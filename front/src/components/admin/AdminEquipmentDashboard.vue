<template>
  <v-container>
    <br>
    <v-row align="center" class="mb-4" justify="space-between">
      <h1>Equipment Management</h1>
      <v-btn color="primary" @click="goToRequests">
        Manage customer requests
        <v-icon end>mdi-arrow-right</v-icon>
      </v-btn>
    </v-row>

    <v-row>
      <v-col
        v-for="equipment in equipments"
        :key="equipment._id"
        cols="12"
        lg="3"
        md="4"
        sm="6"
      >
        <v-card>
          <v-img cover height="200px" :src="getImage(equipment.picture)" />

          <v-card-title>{{ equipment.name }}</v-card-title>
          <v-card-subtitle>Status: {{ equipment.status }}</v-card-subtitle>
          <v-card-subtitle>Condition: {{ equipment.state }}</v-card-subtitle>

          <v-card-text>
            <div class="description-clamp">
              {{ equipment.description }}
            </div>
            <br>
            <div><strong>Serial Number:</strong> {{ equipment.serial_number }}</div>
          </v-card-text>

          <v-card-actions>
            <v-btn color="primary" @click="editEquipment(equipment)">Edit</v-btn>
            <v-btn color="error" @click="removeEquipment(equipment._id)">Delete</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- Add/Edit Dialog -->
    <v-dialog v-model="dialog" max-width="600px">
      <v-card>
        <v-card-title>
          {{ editingEquipment ? 'Edit Equipment' : 'Add Equipment' }}
        </v-card-title>
        <v-card-text>
          <v-form ref="formRef">
            <v-text-field v-model="form.name" label="Name" required />
            <v-textarea v-model="form.description" label="Description" />
            <v-text-field v-model="form.serial_number" label="Serial Number" />
            <!-- State select -->
            <v-select
              v-model="form.state"
              :items="['new', 'good', 'used', 'damaged', 'broken']"
              label="Condition"
              required
            />

            <!-- Status field: select in create, readonly in edit -->
            <template v-if="editingEquipment">
              <v-text-field
                v-model="form.status"
                label="Status"
                readonly
              />
            </template>
            <template v-else>
              <v-select
                v-model="form.status"
                :items="['available', 'unavailable']"
                label="Status"
                required
              />
            </template>

            <v-text-field
              v-model="form.picture"
              label="Image URL"
              placeholder="https://example.com/image.jpg"
            />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="dialog = false">Cancel</v-btn>
          <v-btn color="primary" @click="submitForm">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
  <v-btn
    class="fab"
    color="primary"
    icon
    @click="openAddDialog"
  >
    <v-icon>mdi-plus</v-icon>
  </v-btn>
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
  import { deleteEquipment, getAllEquipments, postEquipment, putEquipment } from '../../services/equipmentService'
  import router from '../../router/index.js'
  import { logout } from '../../utils/auth.js'

  const equipments = ref([])
  const dialog = ref(false)
  const editingEquipment = ref(null)
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
    router.push('/admin/requests')
  }

  const fetchEquipments = async () => {
    try {
      const data = await getAllEquipments()

      equipments.value = data
    } catch (err) {
      console.error('Failed to load equipment list', err)
    }
  }

  const openAddDialog = () => {
    editingEquipment.value = null
    resetForm()
    dialog.value = true
  }

  const editEquipment = equipment => {
    editingEquipment.value = equipment
    form.value = { ...equipment }
    dialog.value = true
  }

  const submitForm = async () => {
    try {
      if (editingEquipment.value) {
        console.log(form.value);

        await putEquipment(editingEquipment.value._id, form.value)
      } else {
        await postEquipment(form.value)
      }
      dialog.value = false
      fetchEquipments()
    } catch (err) {
      console.error('Save error', err)
    }
  }

  const removeEquipment = async id => {
    if (!confirm('Are you sure you want to delete this equipment?')) return
    try {
      await deleteEquipment(id)
      fetchEquipments()
    } catch (err) {
      console.error('Delete error', err)
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
