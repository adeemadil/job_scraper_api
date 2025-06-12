export interface Job {
  title: string;
  company: string;
  link: string;
  source: string;
  description?: string;
}

export interface RecentSearch {
  query: string;
  jobs: Job[];
  timestamp: number;
  location?: string;
  jobType?: string;
  experienceLevel?: string;
} 