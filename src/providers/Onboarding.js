import React, { useCallback, useContext, useState } from 'react'
import PropTypes from 'prop-types'
import { Screens as steps } from '@components/Onboarding/Screens/config'
import { DAY_IN_HOURS, DAY_IN_SECONDS } from '../utils/kit-utils'
import {
  calculateDecay,
  calculateWeight,
} from '../utils/conviction-modelling-helpers'

const OnboardingContext = React.createContext()

const DEFAULT_CONFIG = {
  garden: {
    name: '',
    description: '',
    logo: null,
    logotype: null,
    forum: '',
    links: {
      documentation: [],
      community: [],
    },
    type: -1,
  },
  agreement: {
    title: '',
    content: '',
    challengePeriod: 0,
    actionAmount: 0,
    challengeAmount: 0,
    actionAmountsStable: [],
    challengeAmountsStable: [],
  },
  conviction: {
    decay: calculateDecay(DAY_IN_HOURS * 2),
    halflifeHours: DAY_IN_HOURS * 2,
    maxRatio: 0.1,
    minThreshold: 0.02,
    minThresholdStakePct: 20,
    requestToken: '0',
    weight: calculateWeight(0.02, 0.1),
  },
  issuance: {
    maxAdjustmentRatioPerSecond: 0,
    targetRatio: 0,
  },
  liquidity: {
    honeyTokenLiquidityStable: 0,
    tokenLiquidity: 0,
  },
  tokens: {
    address: '', // Only used in BYOT
    name: '',
    symbol: '',
    holders: [], // Only used in NATIVE
    commonPool: 0, // Only used in NATIVE
  },
  voting: {
    voteDuration: DAY_IN_SECONDS * 5,
    voteSupportRequired: 50,
    voteMinAcceptanceQuorum: 10,
    voteDelegatedVotingPeriod: DAY_IN_SECONDS * 2,
    voteQuietEndingPeriod: DAY_IN_SECONDS * 1,
    voteQuietEndingExtension: DAY_IN_SECONDS * 0.5,
    voteExecutionDelay: DAY_IN_SECONDS * 1,
  },
}

function OnboardingProvider({ children }) {
  const [step, setStep] = useState(0)
  const [config, setConfig] = useState(DEFAULT_CONFIG)

  const handleConfigChange = useCallback(
    (key, data) =>
      setConfig(config => ({
        ...config,
        [key]: {
          ...config[key],
          ...data,
        },
      })),
    []
  )

  // Navigation
  const handleBack = useCallback(() => {
    setStep(index => Math.max(0, index - 1))
  }, [])

  const handleNext = useCallback(() => {
    setStep(index => Math.min(steps.length - 1, index + 1))
  }, [])

  return (
    <OnboardingContext.Provider
      value={{
        config,
        onBack: handleBack,
        onConfigChange: handleConfigChange,
        onNext: handleNext,
        step,
        steps,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  )
}

OnboardingProvider.propTypes = {
  children: PropTypes.node,
}

function useOnboardingState() {
  return useContext(OnboardingContext)
}

export { OnboardingProvider, useOnboardingState }
