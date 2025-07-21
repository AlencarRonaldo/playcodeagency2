import { z } from 'zod';

// Validation schemas
const OnboardingDataSchema = z.object({
  customerId: z.string(),
  customerName: z.string(),
  customerEmail: z.string().email(),
  customerPhone: z.string().optional(),
  serviceType: z.enum(['website', 'ecommerce', 'mobile', 'marketing', 'automation']),
  planType: z.enum(['starter', 'pro', 'enterprise']),
  paymentId: z.string(),
  amount: z.number(),
  status: z.enum(['paid', 'pending', 'failed'])
});

const OnboardingUpdateSchema = z.object({
  formData: z.record(z.any()).optional(),
  currentStep: z.number().optional(),
  completedSteps: z.array(z.number()).optional(),
  isCompleted: z.boolean().optional(),
  lastAccessDate: z.date().optional()
});

export type OnboardingData = z.infer<typeof OnboardingDataSchema>;
export type OnboardingUpdate = z.infer<typeof OnboardingUpdateSchema>;

interface OnboardingRecord {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  serviceType: 'website' | 'ecommerce' | 'mobile' | 'marketing' | 'automation';
  planType: 'starter' | 'pro' | 'enterprise';
  paymentId: string;
  amount: number;
  status: 'paid' | 'pending' | 'failed';
  formData: Record<string, any>;
  currentStep: number;
  completedSteps: number[];
  isCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastAccessDate?: Date;
  completedAt?: Date;
}

interface FollowUpReminder {
  id: string;
  onboardingId: string;
  customerEmail: string;
  customerPhone?: string;
  reminderType: 'email' | 'whatsapp' | 'both';
  scheduledFor: Date;
  sentAt?: Date;
  status: 'pending' | 'sent' | 'failed';
}

export class OnboardingService {
  private db: any; // Replace with your database connection

  constructor() {
    // Initialize database connection
    // this.db = new DatabaseConnection();
  }

  async createOnboarding(data: OnboardingData): Promise<OnboardingRecord> {
    // Validate input data
    const validatedData = OnboardingDataSchema.parse(data);

    const onboardingRecord: OnboardingRecord = {
      id: this.generateId(),
      ...validatedData,
      formData: {},
      currentStep: 0,
      completedSteps: [],
      isCompleted: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // In a real implementation, save to database
    // await this.db.onboarding.create(onboardingRecord);
    
    console.log('Onboarding record created:', onboardingRecord);
    return onboardingRecord;
  }

  async getOnboarding(id: string): Promise<OnboardingRecord | null> {
    // In a real implementation, fetch from database
    // return await this.db.onboarding.findUnique({ where: { id } });
    
    console.log('Fetching onboarding record:', id);
    return null; // Placeholder
  }

  async updateOnboarding(id: string, updates: OnboardingUpdate): Promise<OnboardingRecord> {
    // Validate update data
    const validatedUpdates = OnboardingUpdateSchema.parse(updates);

    const updateData = {
      ...validatedUpdates,
      updatedAt: new Date(),
      lastAccessDate: new Date()
    };

    // If completing the onboarding
    if (validatedUpdates.isCompleted) {
      updateData.completedAt = new Date();
    }

    // In a real implementation, update in database
    // const updated = await this.db.onboarding.update({
    //   where: { id },
    //   data: updateData
    // });

    console.log('Onboarding record updated:', { id, updates: updateData });
    return {} as OnboardingRecord; // Placeholder
  }

  async saveFormProgress(id: string, formData: Record<string, any>, currentStep: number): Promise<void> {
    await this.updateOnboarding(id, {
      formData,
      currentStep,
      lastAccessDate: new Date()
    });
  }

  async markStepCompleted(id: string, stepIndex: number): Promise<void> {
    const onboarding = await this.getOnboarding(id);
    if (!onboarding) return;

    const completedSteps = [...onboarding.completedSteps];
    if (!completedSteps.includes(stepIndex)) {
      completedSteps.push(stepIndex);
    }

    await this.updateOnboarding(id, {
      completedSteps,
      currentStep: Math.max(onboarding.currentStep, stepIndex + 1)
    });
  }

  async completeOnboarding(id: string, finalFormData: Record<string, any>): Promise<OnboardingRecord> {
    const updated = await this.updateOnboarding(id, {
      formData: finalFormData,
      isCompleted: true,
      completedAt: new Date()
    });

    // Trigger post-completion workflows
    await this.triggerProjectKickoff(id);
    
    return updated;
  }

  async scheduleFollowUpReminders(onboardingId: string): Promise<void> {
    const onboarding = await this.getOnboarding(onboardingId);
    if (!onboarding) return;

    const reminders = [
      { days: 1, type: 'email' as const },
      { days: 3, type: 'both' as const },
      { days: 5, type: 'both' as const },
      { days: 7, type: 'both' as const }
    ];

    for (const reminder of reminders) {
      const scheduledFor = new Date();
      scheduledFor.setDate(scheduledFor.getDate() + reminder.days);

      const reminderRecord: FollowUpReminder = {
        id: this.generateId(),
        onboardingId,
        customerEmail: onboarding.customerEmail,
        customerPhone: onboarding.customerPhone,
        reminderType: reminder.type,
        scheduledFor,
        status: 'pending'
      };

      // In a real implementation, save to database
      // await this.db.followUpReminders.create(reminderRecord);
      
      console.log('Follow-up reminder scheduled:', reminderRecord);
    }
  }

  async processScheduledReminders(): Promise<void> {
    const now = new Date();
    
    // In a real implementation, fetch pending reminders
    // const pendingReminders = await this.db.followUpReminders.findMany({
    //   where: {
    //     status: 'pending',
    //     scheduledFor: { lte: now }
    //   },
    //   include: { onboarding: true }
    // });

    // Process each reminder
    // for (const reminder of pendingReminders) {
    //   await this.sendFollowUpReminder(reminder);
    // }
  }

  private async sendFollowUpReminder(reminder: FollowUpReminder): Promise<void> {
    try {
      const onboarding = await this.getOnboarding(reminder.onboardingId);
      if (!onboarding || onboarding.isCompleted) {
        // Mark as sent if onboarding is completed
        await this.updateReminderStatus(reminder.id, 'sent');
        return;
      }

      const daysElapsed = Math.floor(
        (new Date().getTime() - onboarding.createdAt.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (reminder.reminderType === 'email' || reminder.reminderType === 'both') {
        const emailService = await import('./email');
        await emailService.EmailService.prototype.sendFollowUpEmail({
          to: reminder.customerEmail,
          customerName: onboarding.customerName,
          serviceType: onboarding.serviceType,
          onboardingUrl: `${process.env.NEXT_PUBLIC_APP_URL}/onboarding/${onboarding.id}`,
          daysElapsed
        });
      }

      if ((reminder.reminderType === 'whatsapp' || reminder.reminderType === 'both') && reminder.customerPhone) {
        const whatsappService = await import('./whatsapp');
        await whatsappService.WhatsAppService.prototype.sendFollowUpMessage({
          to: reminder.customerPhone,
          customerName: onboarding.customerName,
          serviceType: onboarding.serviceType,
          onboardingUrl: `${process.env.NEXT_PUBLIC_APP_URL}/onboarding/${onboarding.id}`,
          daysElapsed
        });
      }

      await this.updateReminderStatus(reminder.id, 'sent');
    } catch (error) {
      console.error('Error sending follow-up reminder:', error);
      await this.updateReminderStatus(reminder.id, 'failed');
    }
  }

  private async updateReminderStatus(id: string, status: 'sent' | 'failed'): Promise<void> {
    // In a real implementation, update in database
    // await this.db.followUpReminders.update({
    //   where: { id },
    //   data: { status, sentAt: new Date() }
    // });
    
    console.log('Reminder status updated:', { id, status });
  }

  private async triggerProjectKickoff(onboardingId: string): Promise<void> {
    const onboarding = await this.getOnboarding(onboardingId);
    if (!onboarding) return;

    // Create project record
    const projectData = {
      customerId: onboarding.customerId,
      serviceType: onboarding.serviceType,
      planType: onboarding.planType,
      onboardingData: onboarding.formData,
      status: 'pending_kickoff',
      createdAt: new Date()
    };

    // In a real implementation, create project and notify team
    // await this.db.projects.create(projectData);
    // await this.notifyTeam(onboarding);
    
    console.log('Project kickoff triggered:', projectData);
  }

  // Utility methods
  private generateId(): string {
    return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
  }

  // Analytics methods
  async getOnboardingStats(dateRange?: { start: Date; end: Date }): Promise<{
    total: number;
    completed: number;
    byService: Record<string, number>;
    averageCompletionTime: number;
    conversionRate: number;
  }> {
    // In a real implementation, query database for analytics
    return {
      total: 0,
      completed: 0,
      byService: {},
      averageCompletionTime: 0,
      conversionRate: 0
    };
  }

  async getIncompleteOnboardings(daysOld: number = 7): Promise<OnboardingRecord[]> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    // In a real implementation, query database
    // return await this.db.onboarding.findMany({
    //   where: {
    //     isCompleted: false,
    //     createdAt: { lte: cutoffDate }
    //   }
    // });

    return []; // Placeholder
  }
}

// Database schema (for reference - implement with your preferred ORM)
/*
Table: onboarding_records
- id: string (primary key)
- customer_id: string
- customer_name: string
- customer_email: string
- customer_phone: string (nullable)
- service_type: enum('website', 'ecommerce', 'mobile', 'marketing', 'automation')
- plan_type: enum('starter', 'pro', 'enterprise')
- payment_id: string
- amount: decimal
- status: enum('paid', 'pending', 'failed')
- form_data: json
- current_step: integer
- completed_steps: json (array of integers)
- is_completed: boolean
- created_at: timestamp
- updated_at: timestamp
- last_access_date: timestamp (nullable)
- completed_at: timestamp (nullable)

Table: follow_up_reminders
- id: string (primary key)
- onboarding_id: string (foreign key)
- customer_email: string
- customer_phone: string (nullable)
- reminder_type: enum('email', 'whatsapp', 'both')
- scheduled_for: timestamp
- sent_at: timestamp (nullable)
- status: enum('pending', 'sent', 'failed')
- created_at: timestamp

Indexes:
- onboarding_records: customer_email, service_type, created_at, is_completed
- follow_up_reminders: onboarding_id, scheduled_for, status
*/