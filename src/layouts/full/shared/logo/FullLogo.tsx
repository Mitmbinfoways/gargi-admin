import Logo from '../../../../../public/logo.png';

const FullLogo = () => {
  return (
  <div className="flex justify-center items-center">
    <img
      src={Logo}
      alt="logo"
      className="w-full max-w-[230px] h-auto max-h-24 object-cover rounded-sm p-3"
    />
  </div>
  );
};

export default FullLogo;
