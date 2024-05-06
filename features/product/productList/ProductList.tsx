"use client";

import { Fragment, memo } from "react";
import {
  Container,
  HStack,
  Button,
  VStack,
  Select,
  SimpleGrid,
  Box,
  Image,
  Text,
} from "@chakra-ui/react";
import ProductListModelView, { useMergeStore } from "./ProductListModelView";
import Table from "./Table";
import useFetch from "@/hooks/useFetch";

const ProductList = () => {
  const isReady = useMergeStore((state) => state.isReady);

  if (!isReady) return null;

  return (
    <Container maxWidth="container.lg">
      <VStack spacing={8}>
        <PaginationTable />
        <Filter />
        <Table />
        <ListCard />
      </VStack>
    </Container>
  );
};

const ListCard = () => {
  const storeData = useMergeStore((state) => state.storeData || {});

  const { data, error, isLoading } = storeData;

  if (error) return "Error";

  if (data == undefined && isLoading) return "Loading...";

  return (
    <Fragment>
      <Pagination />
      <SimpleGrid columns={4} spacing={8}>
        {data?.products.map((el) => {
          return (
            <Box key={el.id}>
              <Box aspectRatio={"1/1"} overflow="hidden">
                <Image src={el.thumbnail} alt={el.description} />
              </Box>
              <Text fontSize="lg" fontWeight="700">
                {el.title}
              </Text>
              <Text>{el.description}</Text>
            </Box>
          );
        })}
      </SimpleGrid>
    </Fragment>
  );
};

function PaginationTable() {
  const storeData = useMergeStore((state) => state.storeData);

  const { data, error, changeUrl, isLoading } = storeData;

  if (error) return "Error";

  if (data == undefined && isLoading) return "Loading...";

  const { skip, limit, total } = data!;

  return (
    <HStack>
      <Button
        isDisabled={skip == 0 || isLoading}
        onClick={() => {
          if (skip - limit >= 0) {
            changeUrl(`https://dummyjson.com/products?skip=${skip - limit}`);
          }
        }}
      >
        {"<"}
      </Button>
      <Button
        isDisabled={skip + limit >= total || isLoading}
        onClick={() => {
          if (skip + limit < total) {
            changeUrl(`https://dummyjson.com/products?skip=${skip + limit}`);
          }
        }}
      >
        {">"}
      </Button>
    </HStack>
  );
}

function Filter() {
  const { data } = useFetch<string[]>("https://dummyjson.com/products/categories");

  const categoryValue = useMergeStore((state) => state.filter.category);
  const setFilter = useMergeStore((state) => state.setFilter);

  if (data == undefined) return null;

  return (
    <HStack>
      <Select
        placeholder="Select option"
        onChange={(e) => {
          setFilter({ category: e.target.value });
        }}
        value={categoryValue}
      >
        {data.map((el) => {
          return (
            <option key={el} value={el}>
              {el}
            </option>
          );
        })}
      </Select>
    </HStack>
  );
}

function Pagination() {
  const { data, error, changeUrl, refreshData, isLoading } = useMergeStore(
    (state) => state.storeData
  );

  if (error) return "Error";

  if (data == undefined && isLoading) return "Loading...";

  const { skip, limit, total } = data!;

  return (
    <HStack>
      <Button
        isDisabled={skip == 0 || isLoading}
        onClick={() => {
          if (skip - limit >= 0) {
            changeUrl(`https://dummyjson.com/products?skip=${skip - limit}`);
          }
        }}
      >
        Fetch Previous Page
      </Button>
      <Button
        isDisabled={skip + limit >= total || isLoading}
        onClick={() => {
          if (skip + limit < total) {
            changeUrl(`https://dummyjson.com/products?skip=${skip + limit}`);
          }
        }}
      >
        Fetch Next Page
      </Button>
      <Button
        onClick={() => {
          refreshData();
        }}
      >
        Refresh Data
      </Button>
    </HStack>
  );
}

export default ProductListModelView(ProductList);
