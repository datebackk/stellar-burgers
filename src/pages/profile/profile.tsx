import { ProfileUI } from '@ui-pages';
import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import {
  selectUser,
  updateUser
} from '../../services/slices/userSlice/userSlice';

export const Profile: FC = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  let initialFormValue = {
    name: user?.name || '',
    email: user?.email || '',
    password: ''
  };

  const [formValue, setFormValue] = useState(initialFormValue);
  const [isFormChanged, setIsFormChanged] = useState(false);

  useEffect(() => {
    setFormValue((prevState) => {
      const formValue = {
        ...prevState,
        name: user?.name || '',
        email: user?.email || ''
      };

      initialFormValue = formValue;

      return formValue;
    });
  }, [user]);

  useEffect(() => {
    setIsFormChanged(
      () => JSON.stringify(formValue) !== JSON.stringify(initialFormValue)
    );
  }, [formValue]);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    if (!isFormChanged) return;

    const user: Partial<{ name: string; email: string; password?: string }> = {
      name: formValue.name,
      email: formValue.email
    };

    if (formValue.password) user.password = formValue.password;

    dispatch(updateUser(user));
    setFormValue((prev) => ({ ...prev, password: '' }));
  };

  const handleCancel = (e: SyntheticEvent) => {
    e.preventDefault();
    setFormValue({
      name: user?.name || '',
      email: user?.email || '',
      password: ''
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValue((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <ProfileUI
      formValue={formValue}
      isFormChanged={isFormChanged}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
      handleInputChange={handleInputChange}
    />
  );
};
