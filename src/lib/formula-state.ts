export type FormulaState = { step1?: 'h1' | 'd1'; step2?: 'c2' | 'l2' };
export type FormulaAction =
  | { type: 'select-step1'; value: 'h1' | 'd1' }
  | { type: 'select-step2'; value: 'c2' | 'l2' }
  | { type: 'reset' };

export function formulaReducer(state: FormulaState, action: FormulaAction): FormulaState {
  if (action.type === 'reset') return {};
  return action.type === 'select-step1'
    ? { ...state, step1: action.value }
    : { ...state, step2: action.value };
}
