import Cookies from "js-cookie";

export const get_admin_data = async () => {
  try {
    const res = await fetch(`/api/Admin`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${Cookies.get('token')}`
      }
    });

    const data = await res.json();

    return data;
  } catch (error) {
    console.log('Error in getting admin data (service) =>', error);
  }
}