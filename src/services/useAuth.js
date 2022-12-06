import Cookies from "js-cookie";

export function useAuth() {
  const isLogged = Cookies.get("userAuth");
  return new Promise((resolve) => {
    if (isLogged !== undefined) {
      resolve(true);
    } else {
      resolve(false);
    }
  });
}
