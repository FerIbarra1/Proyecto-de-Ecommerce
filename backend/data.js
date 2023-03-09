import bcrypt from 'bcryptjs';

const data = {
  users: [
    {
      name: 'Administrador',
      email: 'admin@admin.com',
      password: bcrypt.hashSync('123456'),
      isAdmin: true,
    },
  ],
  products: [
    {
      // _id: '1',
      name: 'Prueba',
      slug: 'prueba',
      category: 'prueba',
      image: '/images/p1.jpg', // 679px × 829px
      price: 1,
      countInStock: 10,
      brand: 'Nike',
      rating: 4.5,
      numReviews: 10,
      description: 'Esto es una Prueba',
    },
  ],
};
export default data;
