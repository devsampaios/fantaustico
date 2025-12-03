import {
  createCampaign,
  createPet,
  createReport,
  getCampaigns,
  getPets,
  getReports,
  uploadCampaignImage,
  uploadPetImage,
} from '../api/firestore';

const api = {
  getPets,
  createPet,
  getCampaigns,
  createCampaign,
  getReports,
  createReport,
  uploadPetImage,
  uploadCampaignImage,
};

export default api;
export {
  getPets,
  createPet,
  getCampaigns,
  createCampaign,
  getReports,
  createReport,
  uploadPetImage,
  uploadCampaignImage,
};
