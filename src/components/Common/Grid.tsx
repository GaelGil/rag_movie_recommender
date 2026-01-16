import { SimpleGrid, Box } from "@mantine/core";
import ItemMenu from "./ItemMenu";

interface GridProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  hoveredId: string | null;
  handleClick: (index: number) => void;
}

const Grid: React.FC<GridProps> = ({
  isOpen,
  setIsOpen,
  hoveredId,
  handleClick,
}) => {
  const n = 10000;
  const grid = Array.from({ length: n }, () => Array(50).fill(" ")); // generate array
  return (
    <SimpleGrid cols={100} spacing={0} verticalSpacing={0}>
      {grid.map((_, idx) => (
        <Box
          key={idx}
          bd={"1px solid black"}
          h={10}
          w={10}
          p={0}
          m={0}
          onClick={() => handleClick(idx)}
        >
          {isOpen && hoveredId === String(idx) && (
            <ItemMenu value={String(idx)} onClose={() => setIsOpen(false)} />
          )}
        </Box>
      ))}
    </SimpleGrid>
  );
};

export default Grid;
