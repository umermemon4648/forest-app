import { useSelector } from "react-redux";

export const useAuth = () => {
  const { isAuthenticated } = useSelector((state) => state.user);

  if (isAuthenticated) {
    return true;
  } else {
    return false;
  }
};
