import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import { getOrdersApi } from '@api';
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
