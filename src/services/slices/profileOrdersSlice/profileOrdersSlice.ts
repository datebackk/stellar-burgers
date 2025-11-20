import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import { getOrderByNumberApi, getOrdersApi } from '@api';
import { RootState } from '../../store';

export type TProfileOrdersState = {
  orders: TOrder[];
  currentOrder: TOrder | null;
  isLoading: boolean;
};

const initialState: TProfileOrdersState = {
  orders: [],
  currentOrder: null,
  isLoading: false
};

export const fetchProfileOrders = createAsyncThunk<
  TOrder[],
  void,
  { rejectValue: string }
>('profileOrders/fetchProfileOrders', async (_, { rejectWithValue }) => {
  try {
    return await getOrdersApi();
  } catch (err: unknown) {
    return rejectWithValue('Не удалось загрузить историю заказов');
  }
});

export const fetchOrderByNumber = createAsyncThunk<
  TOrder,
  number,
  { rejectValue: string }
>('order/fetchOrderByNumber', async (orderNumber, { rejectWithValue }) => {
  try {
    const response = await getOrderByNumberApi(orderNumber);

    if (!response.orders || response.orders.length === 0) {
      return rejectWithValue('Заказ не найден');
    }

    return response.orders[0];
  } catch (err: unknown) {
    return rejectWithValue('Не удалось загрузить заказ');
  }
});

const profileOrdersSlice = createSlice({
  name: 'profileOrders',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfileOrders.pending, (state) => ({
        ...state,
        isLoading: true
      }))
      .addCase(
        fetchProfileOrders.fulfilled,
        (state, { payload }: PayloadAction<TOrder[]>) => ({
          ...state,
          isLoading: false,
          orders: payload
        })
      )
      .addCase(fetchProfileOrders.rejected, (state) => ({
        ...state,
        isLoading: false
      }));

    builder
      .addCase(fetchOrderByNumber.pending, (state) => ({
        ...state,
        currentOrder: null
      }))
      .addCase(
        fetchOrderByNumber.fulfilled,
        (state, action: PayloadAction<TOrder>) => ({
          ...state,
          currentOrder: action.payload,
          orderNumber: action.payload.number
        })
      )
      .addCase(fetchOrderByNumber.rejected, (state) => ({
        ...state,
        currentOrder: null
      }));
  }
});

export const selectProfileOrders = (state: RootState) =>
  state.profileOrders.orders;

export const selectOrdersInfoDataByNumber =
  (id: string) => (state: RootState) => {
    const profileOrder = state.profileOrders.orders.find(
      ({ number }) => number.toString() === id
    );

    const feedOrder = state.feed.orders.find(
      ({ number }) => number.toString() === id
    );

    return profileOrder || feedOrder;
  };

export default profileOrdersSlice.reducer;
