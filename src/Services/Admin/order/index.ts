import Cookies from "js-cookie";

export const get_all_orders = async () => {
  try {
    const res = await fetch(`/api/Admin/order`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${Cookies.get('token')}`
      }
    });

    const data = await res.json();

    return data;
  } catch (error) {
    console.log('Error in getting all orders Item (service) =>', error);
  }
}

export const update_order_status = async (id: string) => {
  try {
    const res = await fetch(`/api/Admin/order/update-order-status`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${Cookies.get('token')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(id),
    })

    const data = await res.json();

    return data;
  } catch (error) {
    console.log('Error in updating order status (service) =>', error);
  }
}