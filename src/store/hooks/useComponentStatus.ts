import { useAppSelector } from '../store';
import { useCurrentStep } from '../../routes';
import { TrialRecord, TrialResult } from '../types';
import { useCurrentTrial } from './useCurrentTrial';

/**
 *
 * @param trialId Trial id for which to get status
 * @returns TrialResult object with complete status and any answer if present. Returns null if not in trial step
 */

export function useComponentStatus(): TrialResult | null {
  const config = useAppSelector((state) => state.unTrrackedSlice.config);
  const study = useAppSelector((state) => state.trrackedSlice);

  const currentStep = useCurrentStep();
  const currentTrial = useCurrentTrial();

  const type = config.components[currentStep]?.type;

  let status: TrialResult | null = null;

  if (type === 'container' && currentTrial !== null) {
    status = (study[currentStep] as TrialRecord)[currentTrial];
  } else {
    status = (study[currentStep] as any as TrialResult);
  }

  return status;
}
