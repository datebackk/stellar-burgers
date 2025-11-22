import { FC, useEffect, useMemo, useState } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient, TOrder } from '@utils-types';
import { useSelector, useDispatch } from '../../services/store';
import { selectIngredients } from '../../services/slices/ingredientsSlice/ingredientsSlice';
import { useParams } from 'react-router-dom';
import {
  fetchOrderByNumber,
  selectOrdersInfoDataByNumber
} from '../../services/slices/profileOrdersSlice/profileOrdersSlice';

export const OrderInfo: FC = () => {
  const { number } = useParams<{ number: string }>();
  const dispatch = useDispatch();

  const ingredients: TIngredient[] = useSelector(selectIngredients);

  const [orderData, setOrderData] = useState<TOrder | null>(null);

  const orderFromStore = useSelector(
    selectOrdersInfoDataByNumber(number ?? '')
  );

  useEffect(() => {
    if (!orderFromStore && number) {
      dispatch(fetchOrderByNumber(+number))
        .unwrap()
        .then((order) => {
          setOrderData(order);
        });
    }
  }, [dispatch, number, orderFromStore]);

  useEffect(() => {
    if (orderFromStore) {
      setOrderData(orderFromStore);
    }
  }, [orderFromStore]);

  /* Готовим данные для отображения */
  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
