import Cookies from "js-cookie";

export function useAuth() {
  const isLogged = Cookies.get("userAuth");
  return new Promise((resolve) => {
    if (isLogged !== undefined) {
      console.log("Usuario", JSON.parse(isLogged).idUsuario);
      console.log("Estaaaa");
      resolve(true);
    } else {
      console.log("No Estaaaa");
      resolve(false);
    }
  });
}
