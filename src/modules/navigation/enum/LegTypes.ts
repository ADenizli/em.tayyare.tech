enum ELegTypes {
  AF = 'AF', //'Constant DME Arc to Fix',
  AI = 'AI', // Approach initial fix,
  CA = 'CA', //'Course to an altitude (position unspecified)',
  CD = 'CD', //'Course to DME distance',
  CF = 'CF', //'Course to a fix',
  CI = 'CI', //'Course to next leg following by course oriented leg (interception point unspecified)',
  CR = 'CR', //'Course to a radial termination (intercept point unspecified)',
  DF = 'DF', //'Computed track direct to a fix',
  DS = 'DS', //'DISCONTINUITY',
  FA = 'FA', //'Course from a fix to an altitude',
  FC = 'FC', //'Course from a fix to a distance',
  FD = 'FD', //'Course from a fix to DME distance',
  FM = 'FM', //'Course from a fix to manual termination',
  HA = 'HA', //'Automatically at the fix after reaching an altitude',
  HF = 'HF', //'Automatically at the fix after one full circuit',
  HM = 'HM', //'Manually',
  IF = 'IF', //'Initial Fix',
  PI = 'PI', //'Procedure turn followed by a course to a fix (CF)',
  RF = 'RF', //'Constant radius to a fix',
  TF = 'TF', //'Track between two fixes (great circle)',
  VA = 'VA', //'Heading to an altitude (position unspecified)',
  VC = 'VC',
  VD = 'VD', //'Heading to a DME Distance (position unspecified)',
  VI = 'VI', //'Heading to a next leg (position unspecified)',
  VM = 'VM', //'Heading to a manual termination',
  VR = 'VR', //'Heading to a radial termination',
  DP = 'DP', // Departure Runway
  AR = 'AR', // Arrvival Runway
}

export default ELegTypes;
