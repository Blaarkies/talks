type StepValues = (string | number)[];

export interface AnimationStep {
  movePane1?: StepValues;
  movePane2?: StepValues;
  movePane3?: StepValues;
  scalePane1?: StepValues;
  scalePane2?: StepValues;
  scalePane3?: StepValues;
}