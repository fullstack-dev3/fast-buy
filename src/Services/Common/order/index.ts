import Cookies from "js-cookie";

export const create_a_new_order = async (formData: any) => {
  try {
    const res = await fetch(`/api/common/order/create-order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Cookies.get('token')}`
      },
      body: JSON.stringify(formData)
    });
  
    const data = await res.json();

    return data;
  } catch (error) {
    console.log('Error in creating Order (service) => ', error);
  }
}

export const get_customer_orders = async (id: any) => {
  try {
    const res = await fetch(`/api/common/order/get-customer-order?id=${id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${Cookies.get('token')}`
      }
    });

    const data = await res.json();

    return data;
  } catch (error) {
    console.log('Error in getting order by ID (service) =>', error);
  }
}

export const get_order_by_id= async (id: any) => {
  try {
    const res = await fetch(`/api/common/order/get-order?id=${id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${Cookies.get('token')}`
      }
    });

    const data = await res.json();

    return data;
  } catch (error) {
    console.log('Error in getting order by ID (service) =>', error);
  }
}