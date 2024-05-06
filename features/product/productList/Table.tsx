import React from "react";
import { flexRender } from "@tanstack/react-table";
import { TableContainer, Table, Thead, Tr, Th, Tbody, Td } from "@chakra-ui/react";

import { useMergeStore } from "./ProductListModelView";

const ProductListTable = () => {
  useMergeStore((state) => state.storeData);
  const table = useMergeStore((state) => state.table);

  const { getHeaderGroups, getRowModel } = table;

  return (
    <TableContainer>
      <Table variant="simple">
        <Thead>
          {getHeaderGroups().map((headerGroup) => (
            <Tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <Th key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </Th>
              ))}
            </Tr>
          ))}
        </Thead>
        <Tbody>
          {getRowModel().rows.map((row) => (
            <Tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <Td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </Td>
              ))}
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
};

export default ProductListTable;
