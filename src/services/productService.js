export const fetchProducts = async () => {
    const response = await fetch("http://localhost:8080/api/productos");
    if (!response.ok) throw new Error("Error al cargar productos");
    return response.json();
  };


export const fetchProductsByCategoryId = async (categoryId) => {
    const response = await fetch(`http://localhost:3000/api/products?categoryId=${categoryId}`); // ¡Usa TU URL correcta!
    if (!response.ok) throw new Error('Error al obtener productos');
    return await response.json();
  };