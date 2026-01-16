"use client";

import * as React from "react";
import { Text, Card, Stack, Button } from "@mantine/core";
import { FiX } from "react-icons/fi";

interface ItemMenuProps {
  value: string;
  onClose: () => void;
}

const ItemMenu: React.FC<ItemMenuProps> = ({ value, onClose }) => {
  return (
    <Card pos="absolute">
      <Stack>
        <Text>value: {value}</Text>
        <Text>Item Menu</Text>
        <Text>Item Menu</Text>
        <Text>Item Menu</Text>
        <Button onClick={onClose}>
          <FiX />
        </Button>
      </Stack>
    </Card>
  );
};

export default ItemMenu;
