import Cookies from "js-cookie";

export const add_to_favorite = async (formData: any) => {
  try {
    const res = await fetch(`/api/common/favorite/add-to-favorite`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Cookies.get('token')}`
      },
      body: JSON.stringify(formData),
    });

    const data = await res.json();

    return data;
  } catch (error) {
    console.log('Error in Add product to favorite (service) =>', error);
  }
}

export const get_all_favorites = async (id: any) => {
  try {
    const res = await fetch(`/api/common/favorite?id=${id}`, {
      method: 'GET',
      headers  : {
        'Authorization': `Bearer ${Cookies.get('token')}`
      }
    });

    const data = await res.json();

    return data;
  } catch (error) {
    console.log('Error in getting all favorites for specific User (service) =>', error)
  }
}

export const remove_favorite_item = async (id: string) => {
  try {
    const res = await fetch(`/api/common/favorite/remove-favorite?id=${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${Cookies.get('token')}`
      },
    })

    const data = await res.json();

    return data;
  } catch (error) {
    console.log('Error in deleting Bookmark Item (service) =>', error)
  }
}
