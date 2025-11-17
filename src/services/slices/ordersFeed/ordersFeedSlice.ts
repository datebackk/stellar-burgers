import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { TOrder, TOrdersData } from '@utils-types';
import { getFeedsApi } from '@api';
import { RootState } from '../../store';

type TFeedState = {
  orders: TOrder[];
  total: number;
  totalToday: number;
  isLoading: boolean;
};

const initialState: TFeedState = {
  orders: [],
  total: 0,
  totalToday: 0,
  isLoading: false
};

export const fetchFeed = createAsyncThunk<
  TOrdersData,
  void,
  { rejectValue: string }
>('feed/fetchFeedOrders', async (_, { rejectWithValue }) => {
  try {
    return await getFeedsApi();
  } catch (err: unknown) {
    return rejectWithValue('Не удалось загрузить ленту');
  }
});

const ordersFeedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeed.pending, (state) => ({
        ...state,
        isLoading: true
      }))
      .addCase(
        fetchFeed.fulfilled,
        (
          state,
          { payload: { orders, total, totalToday } }: PayloadAction<TOrdersData>
        ) => ({
          ...state,
          orders,
          total,
          totalToday
        })
      )
      .addCase(fetchFeed.rejected, (state) => ({
        ...state,
        isLoading: false
      }));
  }
});

export const selectFeedOrders = (state: RootState) => state.feed.orders;
export const selectFeedTotal = (state: RootState) => state.feed.total;
export const selectFeedTotalToday = (state: RootState) => state.feed.totalToday;

export default ordersFeedSlice.reducer;
