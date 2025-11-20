import { createSlice, PayloadAction, nanoid } from '@reduxjs/toolkit';
import { TIngredient, TConstructorIngredient } from '@utils-types';
import { RootState } from '../../store';

type TBurgerConstructorState = {
  bun: TConstructorIngredient | null;
  ingredients: TConstructorIngredient[];
};

const initialState: TBurgerConstructorState = {
  bun: null,
  ingredients: []
};

const burgerConstructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    addToConstructor: {
      reducer: (state, { payload }: PayloadAction<TConstructorIngredient>) => {
        if (payload.type === 'bun') {
          state.bun = payload;
        } else {
          state.ingredients.push(payload);
        }
      },
      prepare: (ingredient: TIngredient) => ({
        payload: { ...ingredient, id: nanoid() }
      })
    },
    removeFromConstructor: (state, { payload }: PayloadAction<number>) => {
      state.ingredients.splice(payload, 1);
    },
    reorderConstructor: (
      state,
      { payload }: PayloadAction<{ from: number; to: number }>
    ) => {
      const { from, to } = payload;
      const [moved] = state.ingredients.splice(from, 1);
      state.ingredients.splice(to, 0, moved);
    },
    resetConstructor: () => initialState
  }
});

export const constructorSelector = (state: RootState) =>
  state.burgerConstructor;

export const {
  addToConstructor,
  removeFromConstructor,
  reorderConstructor,
  resetConstructor
} = burgerConstructorSlice.actions;

export default burgerConstructorSlice.reducer;
