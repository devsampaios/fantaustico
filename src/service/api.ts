import {
  createCampaign as createCampaignFs,
  createPet as createPetFs,
  createReport as createReportFs,
  getCampaigns as getCampaignsFs,
  getPets as getPetsFs,
  getReports as getReportsFs,
  type CampaignInput,
  type PetInput,
  type ReportInput,
} from '../api/firestore';

class ApiService {
  // Pets
  async getPets() {
    return getPetsFs();
  }

  async createPet(payload: PetInput) {
    return createPetFs(payload);
  }

  // Campaigns
  async getCampaigns() {
    return getCampaignsFs();
  }

  async createCampaign(payload: CampaignInput) {
    return createCampaignFs(payload);
  }

  // Reports
  async getReports() {
    return getReportsFs();
  }

  async createReport(payload: ReportInput) {
    return createReportFs(payload);
  }
}

export default new ApiService();
