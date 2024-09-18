import { Page } from "playwright";
import { CompetitionData } from "../types/TypeCompetition";
import { CreateListCompetitions } from "../scraper/CreateListCompetitions";

export class Scraper {
  private page: Page;
  private configId: string;
  private interval: number;
  private intervalId: NodeJS.Timeout | null = null;
  private competitionsData: { [configId: string]: CompetitionData } = {};

  constructor(page: Page, configId: string, interval: number) {
    this.page = page;
    this.configId = configId;
    this.interval = interval;
  }

  async start() {
    await this.collectData();
    this.intervalId = setInterval(() => this.collectData(), this.interval);
  }

  async stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      console.log('Scraping interrompido.');
    }
  }

  private async collectData() {
    try {
      const listCompetitions = await CreateListCompetitions(this.page);
      this.competitionsData[this.configId] = {
        configId: this.configId,
        lista: listCompetitions
      };
    } catch (error) {
      console.error('Erro ao coletar dados:', error);
    }
  }

  getCompetitionsData() {
    return this.competitionsData;
  }
}
