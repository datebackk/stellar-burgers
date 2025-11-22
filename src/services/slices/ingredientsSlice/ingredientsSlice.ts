import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { TIngredient } from '@utils-types';
import { getIngredientsApi } from '@api';
import { RootState } from '../../store';

type TIngredientsState = {
  ingredients: TIngredient[];
  isLoading: boolean;
};

const initialState: TIngredientsState = {
  ingredients: [],
  isLoading: false
};

export const fetchIngredients = createAsyncThunk<
  TIngredient[],
  void,
  { rejectValue: string }
>('ingredients/fetchIngredients', async (_, { rejectWithValue }) => {
  try {
    return await getIngredientsApi();
  } catch (err: unknown) {
    return rejectWithValue('Не удалось загрузить ингридиенты');
  }
});

const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => ({
        ...state,
        isLoading: true
      }))
      .addCase(
        fetchIngredients.fulfilled,
        (state, { payload }: PayloadAction<TIngredient[]>) => ({
          ...state,
          isLoading: false,
          ingredients: payload
        })
      )
      .addCase(fetchIngredients.rejected, (state) => ({
        ...state,
        isLoading: false
      }));
  }
});

export const selectIngredients = (state: RootState) =>
  state.ingredients.ingredients;

export const selectIngredientById =
  (id: string | undefined) => (state: RootState) =>
    state.ingredients.ingredients.find(({ _id }) => _id === id);

export const selectIsIngredientsLoading = (state: RootState) =>
  state.ingredients.isLoading;

export default ingredientsSlice.reducer;
