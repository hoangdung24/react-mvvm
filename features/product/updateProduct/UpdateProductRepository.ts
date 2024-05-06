import axios from "axios";

const GetUpdateProductRepository = () => {
  return {
    getProduct: async (id: string) => {
      try {
        const { data: resData } = await axios.get(`https://dummyjson.com/products/${id}`);

        return resData;
      } catch (err) {
        throw err;
      }
    },
    updateProduct: async (id: string, data: any) => {
      try {
        const { data: resData } = await axios.put(
          `https://dummyjson.com/products/${id}`,
          data
        );

        return resData;
      } catch (err) {
        throw err;
      }
    },
  };
};

export default GetUpdateProductRepository;
