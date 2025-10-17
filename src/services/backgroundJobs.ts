/**
 * Background Jobs Service
 * Handles periodic AI enhancement of locations
 */

import { fetchLocations } from './api';
import { enhanceLocation } from './locationAI';

export interface JobStatus {
  id: string;
  name: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress: number;
  total: number;
  startedAt?: Date;
  completedAt?: Date;
  error?: string;
}

class BackgroundJobService {
  private jobs: Map<string, JobStatus> = new Map();
  private intervalId: NodeJS.Timeout | null = null;

  /**
   * Start background job processing
   */
  start() {
    if (this.intervalId) {
      console.log('Background jobs already running');
      return;
    }

    console.log('Starting background job service...');
    this.intervalId = setInterval(() => {
      this.processPendingJobs();
    }, 30000); // Check every 30 seconds
  }

  /**
   * Stop background job processing
   */
  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      console.log('Background job service stopped');
    }
  }

  /**
   * Create a job to enhance all locations with low confidence scores
   */
  async createLocationEnhancementJob() {
    const jobId = `enhance-locations-${Date.now()}`;

    this.jobs.set(jobId, {
      id: jobId,
      name: 'Enhance Low Confidence Locations',
      status: 'pending',
      progress: 0,
      total: 0,
    });

    return jobId;
  }

  /**
   * Process pending jobs
   */
  private async processPendingJobs() {
    for (const [jobId, job] of this.jobs) {
      if (job.status === 'pending') {
        await this.processJob(jobId);
      }
    }
  }

  /**
   * Process a specific job
   */
  private async processJob(jobId: string) {
    const job = this.jobs.get(jobId);
    if (!job) return;

    try {
      job.status = 'running';
      job.startedAt = new Date();
      this.jobs.set(jobId, job);

      console.log(`Starting job: ${job.name}`);

      // Different job types would be handled here
      if (job.name.includes('Enhance')) {
        await this.enhanceLowConfidenceLocations(jobId);
      }

      job.status = 'completed';
      job.completedAt = new Date();
      this.jobs.set(jobId, job);

      console.log(`Job completed: ${job.name}`);
    } catch (error) {
      job.status = 'failed';
      job.error = (error as Error).message;
      job.completedAt = new Date();
      this.jobs.set(jobId, job);

      console.error(`Job failed: ${job.name}`, error);
    }
  }

  /**
   * Enhance locations with confidence scores below threshold
   */
  private async enhanceLowConfidenceLocations(jobId: string, threshold: number = 0.8) {
    try {
      // In a real implementation, this would fetch from the database
      // For now, we'll use the mock API
      const locations = await fetchLocations();
      
      const lowConfidenceLocations = locations.filter(
        loc => loc.confidenceScore === undefined || loc.confidenceScore < threshold
      );

      const job = this.jobs.get(jobId);
      if (!job) return;

      job.total = lowConfidenceLocations.length;
      job.progress = 0;
      this.jobs.set(jobId, job);

      console.log(`Found ${lowConfidenceLocations.length} locations to enhance`);

      // Process locations in batches to avoid overwhelming the API
      const batchSize = 5;
      for (let i = 0; i < lowConfidenceLocations.length; i += batchSize) {
        const batch = lowConfidenceLocations.slice(i, i + batchSize);
        
        await Promise.all(
          batch.map(async (location) => {
            try {
              const enhancement = await enhanceLocation(location);
              console.log(`Enhanced location: ${location.name}`, enhancement);
              
              // In a real implementation, this would update the database
              // For now, we just log the results
            } catch (error) {
              console.error(`Failed to enhance location: ${location.name}`, error);
            }
          })
        );

        job.progress = Math.min(i + batchSize, lowConfidenceLocations.length);
        this.jobs.set(jobId, job);
        
        // Small delay between batches
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    } catch (error) {
      throw new Error(`Failed to enhance locations: ${(error as Error).message}`);
    }
  }

  /**
   * Get job status
   */
  getJobStatus(jobId: string): JobStatus | undefined {
    return this.jobs.get(jobId);
  }

  /**
   * Get all job statuses
   */
  getAllJobs(): JobStatus[] {
    return Array.from(this.jobs.values());
  }

  /**
   * Cancel a job
   */
  cancelJob(jobId: string): boolean {
    const job = this.jobs.get(jobId);
    if (job && job.status === 'pending') {
      this.jobs.delete(jobId);
      return true;
    }
    return false;
  }
}

// Export singleton instance
export const backgroundJobService = new BackgroundJobService();

// Auto-start background jobs in browser environment
if (typeof window !== 'undefined') {
  // Start background jobs when the service is loaded
  backgroundJobService.start();
  
  // Stop background jobs when the page is unloaded
  window.addEventListener('beforeunload', () => {
    backgroundJobService.stop();
  });
}

export default backgroundJobService;