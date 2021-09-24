import styled from "styled-components";

interface GridWrapperProps {
  columns: number,
}

const GridWrapper = styled.div<GridWrapperProps>`
  display: grid;
  grid-template-columns: repeat(${ props => props.columns ? props.columns : 4 }, minmax(0, 1fr));
  grid-gap: 1rem;
  margin-bottom: 1rem;
`;

export default GridWrapper;
