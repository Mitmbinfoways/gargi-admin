import { useState } from 'react';
import { Button, Label, Spinner, TextInput } from 'flowbite-react';
import {  useNavigate } from 'react-router-dom';
import { Login } from 'src/AxiosConfig/AxiosConfig';
import { login } from 'src/Store/Slices/AdminUser.Slice';
import { useDispatch } from 'react-redux';
import { HiEye, HiEyeOff } from 'react-icons/hi';

const AuthLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // const [rememberMe, setRememberMe] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formErrors, setFormErrors] = useState<{ email?: string; password?: string }>({});
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const validateForm = () => {
    const errors: { email?: string; password?: string } = {};
    if (!email.trim()) errors.email = 'Email is required';
    if (!password.trim()) errors.password = 'Password is required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMsg('');
    if (!validateForm()) return;
    try {
      setIsLoading(true);
      const trimmedEmail = email.trim();
      const trimmedPassword = password.trim();
      const response = await Login({ email: trimmedEmail.toLocaleLowerCase(), password: trimmedPassword });
      const { token, admin } = response.data.data;
      dispatch(login(response.data.data));
      sessionStorage.setItem('token', token);
      sessionStorage.setItem('admin', JSON.stringify(admin));
      navigate('/');
    } catch (error: any) {
      setErrorMsg('Incorrect email or password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <div className="mb-2 block">
          <Label value="Email" />
        </div>
        <TextInput
          id="email"
          sizing="md"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (formErrors.email) {
              setFormErrors((prev) => ({ ...prev, email: undefined }));
            }
          }}
        />
        {formErrors.email && <p className="text-red-600">{formErrors.email}</p>}
      </div>

      <div className="mb-4">
        <div className="mb-2 block">
          <Label value="Password" />
        </div>
        <div className="relative">
          <TextInput
            id="userpwd"
            type={showPassword ? 'text' : 'password'}
            sizing="md"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (formErrors.password) {
                setFormErrors((prev) => ({ ...prev, password: undefined }));
              }
            }}
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <HiEye className="h-5 w-5 text-gray-500" />
            ) : (
              <HiEyeOff className="h-5 w-5 text-gray-500" />
            )}
          </button>
        </div>
        {formErrors.password && <p className="text-red-600">{formErrors.password}</p>}
      </div>

      <div className="flex justify-end my-5">
        {/* <div className="flex items-center gap-2">
          <Checkbox
            id="accept"
            checked={rememberMe}
            className="border-gray-500"
            onChange={(e) => setRememberMe(e.target.checked)}
          />
          <Label htmlFor="accept" className="opacity-90 font-normal cursor-pointer">
            Remember Me
          </Label>
        </div> */}
        {/* <Link to="/auth/forgot-password" className="text-primary text-sm font-medium">
          Forgot Password?
        </Link> */}
      </div>
      {errorMsg && <p className="text-red-600 mb-5">{errorMsg}</p>}

      <Button
        type="submit"
        className="w-full bg-primary text-white rounded-xl flex justify-center items-center gap-2"
        disabled={isLoading}
      >
        {isLoading && <Spinner size="sm" light />}
        {isLoading ? 'Signing...' : 'Sign in'}
      </Button>
    </form>
  );
};

export default AuthLogin;
