"use client";

import * as React from "react";
import { Text, Card, Stack } from "@mantine/core";

interface ItemMenuProps {
  value: string;
}

const ItemMenu: React.FC<ItemMenuProps> = ({ value }) => {
  return (
    <Card pos="absolute">
      <Stack>
        <Text>value: {value}</Text>
        <Text>Item Menu</Text>
        <Text>Item Menu</Text>
        <Text>Item Menu</Text>
      </Stack>
    </Card>
  );
};

export default ItemMenu;
