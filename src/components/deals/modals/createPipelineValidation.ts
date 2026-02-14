export type CreatePipelineStagePayload = {
  name: string;
  color?: string | null;
};

export type CreatePipelinePayload = {
  name: string;
  stages: CreatePipelineStagePayload[];
};

type ValidationSuccess = {
  success: true;
  payload: CreatePipelinePayload;
};

type ValidationError = {
  success: false;
  message: string;
};

export type CreatePipelineValidationResult = ValidationSuccess | ValidationError;

export const validateCreatePipelinePayload = (
  form: CreatePipelinePayload,
): CreatePipelineValidationResult => {
  const name = form.name.trim();
  if (!name.length) {
    return { success: false, message: 'Pipeline name is required.' };
  }
  if (name.length > 80) {
    return { success: false, message: 'Pipeline name must be 80 characters or less.' };
  }

  if (!Array.isArray(form.stages)) {
    return { success: false, message: 'Stages must be an array.' };
  }
  if (form.stages.length < 1) {
    return { success: false, message: 'At least one stage is required.' };
  }
  if (form.stages.length > 30) {
    return { success: false, message: 'You can add up to 30 stages.' };
  }

  const seenNames = new Set<string>();
  const stages: CreatePipelineStagePayload[] = [];

  for (let index = 0; index < form.stages.length; index += 1) {
    const stage = form.stages[index];
    const stagePosition = index + 1;

    const trimmedStageName = stage.name.trim();
    if (!trimmedStageName.length) {
      return { success: false, message: `Stage ${stagePosition} name is required.` };
    }
    if (trimmedStageName.length > 50) {
      return {
        success: false,
        message: `Stage ${stagePosition} name must be 50 characters or less.`,
      };
    }

    const normalizedStageName = trimmedStageName.toLowerCase();
    if (seenNames.has(normalizedStageName)) {
      return { success: false, message: 'Stage names must be unique (case-insensitive).' };
    }
    seenNames.add(normalizedStageName);

    let normalizedColor: string | null | undefined = undefined;
    if (typeof stage.color === 'string') {
      const trimmedColor = stage.color.trim();
      if (trimmedColor.length > 20) {
        return {
          success: false,
          message: `Stage ${stagePosition} color must be 20 characters or less.`,
        };
      }
      normalizedColor = trimmedColor.length ? trimmedColor : null;
    } else if (stage.color === null) {
      normalizedColor = null;
    }

    stages.push({
      name: trimmedStageName,
      ...(normalizedColor !== undefined ? { color: normalizedColor } : {}),
    });
  }

  return {
    success: true,
    payload: {
      name,
      stages,
    },
  };
};
