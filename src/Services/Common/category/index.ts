export const get_all_categories = async () => {
  try {
    const res = await fetch('/api/common/category', {
      method: 'GET',
    });
    const data = await res.json();

    return data;
  } catch (error) {
    console.log('Error in getting all Categories (service) =>', error);
  }
}

export const get_category_by_id = async (id:string) => {
  try {
    const res = await fetch(`/api/common/category/get-category?id=${id}`, {
      method: 'GET',
    });

    const data = await res.json();

    return data;
  } catch (error) {
    console.log('Error in getting Categories by ID (service) =>', error);
  }
}
