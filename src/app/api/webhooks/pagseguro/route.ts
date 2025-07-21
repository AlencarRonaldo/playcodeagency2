import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { OnboardingService } from '@/lib/services/onboarding';
import { EmailService } from '@/lib/services/email';
import { WhatsAppService } from '@/lib/services/whatsapp';

// Types
interface PagSeguroWebhookData {
  id: string;
  reference_id: string;
  status: 'PAID' | 'DECLINED' | 'CANCELED' | 'PENDING';
  created_at: string;
  customer: {
    name: string;
    email: string;
    tax_id: string;
    phones?: Array<{
      country: string;
      area: string;
      number: string;
    }>;
  };
  items: Array<{
    reference_id: string;
    name: string;
    quantity: number;
    unit_amount: number;
  }>;
  charges: Array<{
    id: string;
    status: string;
    amount: {
      value: number;
      currency: string;
    };
    payment_method: {
      type: string;
    };
  }>;
}

interface OnboardingData {
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  serviceType: 'website' | 'ecommerce' | 'mobile' | 'marketing' | 'automation';
  planType: 'starter' | 'pro' | 'enterprise';
  paymentId: string;
  amount: number;
  status: 'paid';
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('x-pagseguro-signature');
    
    // Verify webhook signature
    if (!verifyWebhookSignature(body, signature)) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const webhookData: PagSeguroWebhookData = JSON.parse(body);
    
    // Process only paid orders
    if (webhookData.status !== 'PAID') {
      return NextResponse.json({ message: 'Payment not completed' }, { status: 200 });
    }

    // Extract service type from reference_id (format: service_plan_timestamp)
    const referenceId = webhookData.reference_id;
    const [serviceType, planType] = referenceId.split('_');
    
    if (!isValidServiceType(serviceType) || !isValidPlanType(planType)) {
      console.error('Invalid service or plan type:', { serviceType, planType });
      return NextResponse.json({ error: 'Invalid service configuration' }, { status: 400 });
    }

    // Extract customer phone
    const customerPhone = webhookData.customer.phones?.[0] 
      ? `+${webhookData.customer.phones[0].country}${webhookData.customer.phones[0].area}${webhookData.customer.phones[0].number}`
      : undefined;

    // Prepare onboarding data
    const onboardingData: OnboardingData = {
      customerId: webhookData.customer.tax_id,
      customerName: webhookData.customer.name,
      customerEmail: webhookData.customer.email,
      customerPhone,
      serviceType: serviceType as OnboardingData['serviceType'],
      planType: planType as OnboardingData['planType'],
      paymentId: webhookData.id,
      amount: webhookData.charges[0]?.amount.value || 0,
      status: 'paid'
    };

    // Initialize services
    const onboardingService = new OnboardingService();
    const emailService = new EmailService();
    const whatsappService = new WhatsAppService();

    // Create onboarding record
    const onboardingRecord = await onboardingService.createOnboarding(onboardingData);
    
    // Send welcome email
    await emailService.sendWelcomeEmail({
      to: onboardingData.customerEmail,
      customerName: onboardingData.customerName,
      serviceType: onboardingData.serviceType,
      planType: onboardingData.planType,
      onboardingUrl: `${process.env.NEXT_PUBLIC_APP_URL}/onboarding/${onboardingRecord.id}`
    });

    // Send WhatsApp message (if phone available)
    if (customerPhone) {
      await whatsappService.sendWelcomeMessage({
        to: customerPhone,
        customerName: onboardingData.customerName,
        serviceType: onboardingData.serviceType,
        onboardingUrl: `${process.env.NEXT_PUBLIC_APP_URL}/onboarding/${onboardingRecord.id}`
      });
    }

    // Schedule follow-up reminders
    await onboardingService.scheduleFollowUpReminders(onboardingRecord.id);

    return NextResponse.json({ 
      message: 'Webhook processed successfully',
      onboardingId: onboardingRecord.id 
    });

  } catch (error) {
    console.error('PagSeguro webhook error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

function verifyWebhookSignature(body: string, signature: string | null): boolean {
  if (!signature || !process.env.PAGSEGURO_WEBHOOK_SECRET) {
    return false;
  }

  const expectedSignature = crypto
    .createHmac('sha256', process.env.PAGSEGURO_WEBHOOK_SECRET)
    .update(body)
    .digest('hex');

  return crypto.timingSafeEqual(
    Buffer.from(signature, 'hex'),
    Buffer.from(expectedSignature, 'hex')
  );
}

function isValidServiceType(type: string): boolean {
  return ['website', 'ecommerce', 'mobile', 'marketing', 'automation'].includes(type);
}

function isValidPlanType(type: string): boolean {
  return ['starter', 'pro', 'enterprise'].includes(type);
}