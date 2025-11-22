import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import { orderBurgerApi } from '@api';
import { RootState } from '../../store';

type TOrderState = {
  currentOrder: TOrder | null;
  orderNumber: number | null;
  isLoading: boolean;
};

const initialState: TOrderState = {
  currentOrder: null,
  orderNumber: null,
  isLoading: false
};

export const createOrder = createAsyncThunk<
  TOrder,
  string[],
  { rejectValue: string }
>('order/createOrder', async (ingredientsIds, { rejectWithValue }) => {
  try {
    if (ingredientsIds?.length === 0) {
      return rejectWithValue('Отсутсвуют ингридиенты');
    }
    const response = await orderBurgerApi(ingredientsIds);

    return response.order;
  } catch (err: unknown) {
    return rejectWithValue('Не удалось создать заказ');
  }
});

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    closeOrder: () => initialState
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => ({
        ...state,
        isLoading: true
      }))
      .addCase(
        createOrder.fulfilled,
        (state, { payload }: PayloadAction<TOrder>) => ({
          ...state,
          isLoading: false,
          currentOrder: payload,
          orderNumber: payload.number
        })
      )
      .addCase(createOrder.rejected, (state) => ({
        ...state,
        isLoading: false
      }));
  }
});

export const selectCurrentOrder = (state: RootState) =>
  state.order.currentOrder;
export const selectIsOrderLoading = (state: RootState) => state.order.isLoading;

export const { closeOrder } = orderSlice.actions;

export default orderSlice.reducer;
