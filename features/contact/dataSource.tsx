import axios from "axios";

const dataSource = () => {
  return {
    create: async (data: any) => {
      try {
        const { data: resData } = await axios.post(
          "https://dummyjson.com/products/add",
          data
        );

        return resData;
      } catch (err) {
        throw err;
      }
    },
  };
};

export default dataSource;
