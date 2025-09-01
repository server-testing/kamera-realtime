
import API_ENDPOINT from '../global'
import { api } from '../global/config'

const { 
  ADD_CAMERA,
  GET_CAMERA,
  UPDATE_STATUS_USER,
  DELETE_USER,
} = API_ENDPOINT

class ServiceCamera {
  static async addCam(data) {
    const response = await api.post(ADD_CAMERA, data)
    return response.data
  }
  static async updateStatus(id, data , token) {
    const response = await api.put(UPDATE_STATUS_USER(id), data, {
      headers: {
        "Authorization": `Bearer ${token}`  
      }
    })
    return response.data
  }
  static async getCam() {
    const response  = await api.get(GET_CAMERA)
    return response.data
  }
  static async deleteCam(id) {
    const response = await api.delete(DELETE_USER(id))
    return response.data
  }
}

export default ServiceCamera