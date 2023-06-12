export const get_all_products = async () => {
  try {
    const res = await fetch('/api/common/product', {
      method: 'GET',
    });

    const data = await res.json();

    return data;
  } catch (error) {
    console.log('Error in getting all products (service) =>', error);
  }
}

export const get_product_by_id = async (id:string) => {
  try {
    const res = await fetch(`/api/common/product/get-product?id=${id}`, {
      method: 'GET',
    });

    const data = await res.json();

    return data;
  } catch (error) {
    console.log('Error in getting product by ID (service) =>', error);
  }
}
