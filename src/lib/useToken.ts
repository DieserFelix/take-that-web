export async function useToken() {
  if (!localStorage.getItem("token")) {
    let token: string = await (
      await fetch("http://localhost:8000/api/")
    ).json();
    localStorage.setItem("token", token);
  }
  return localStorage.getItem("token");
}
