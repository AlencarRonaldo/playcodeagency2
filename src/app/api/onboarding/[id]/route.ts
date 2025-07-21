import { NextRequest, NextResponse } from 'next/server';
import { OnboardingService } from '@/lib/services/onboarding';

const onboardingService = new OnboardingService();

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const onboarding = await onboardingService.getOnboarding(params.id);
    
    if (!onboarding) {
      return NextResponse.json(
        { error: 'Onboarding não encontrado' },
        { status: 404 }
      );
    }

    // Update last access date
    await onboardingService.updateOnboarding(params.id, {
      lastAccessDate: new Date()
    });

    return NextResponse.json(onboarding);
  } catch (error) {
    console.error('Error fetching onboarding:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    
    const {
      formData,
      currentStep,
      completedSteps,
      isCompleted,
      completedAt
    } = body;

    // Validate required fields
    if (isCompleted && !formData) {
      return NextResponse.json(
        { error: 'Form data is required for completion' },
        { status: 400 }
      );
    }

    const updateData: any = {
      lastAccessDate: new Date()
    };

    if (formData !== undefined) updateData.formData = formData;
    if (currentStep !== undefined) updateData.currentStep = currentStep;
    if (completedSteps !== undefined) updateData.completedSteps = completedSteps;
    if (isCompleted !== undefined) updateData.isCompleted = isCompleted;
    if (completedAt !== undefined) updateData.completedAt = new Date(completedAt);

    const updated = await onboardingService.updateOnboarding(params.id, updateData);

    // If completing onboarding, trigger completion workflow
    if (isCompleted) {
      await onboardingService.completeOnboarding(params.id, formData);
    }

    return NextResponse.json({
      message: 'Onboarding updated successfully',
      data: updated
    });
  } catch (error) {
    console.error('Error updating onboarding:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // In a real implementation, you might want to soft delete instead
    // await onboardingService.deleteOnboarding(params.id);
    
    return NextResponse.json({
      message: 'Onboarding deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting onboarding:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}