import styled from "styled-components";

const StyledCustomModal = styled.dialog`
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  box-sizing: border-box;
  width: 35rem;
  height: 20rem;
  border-radius: 5rem;
`;

export default function CustomModal({ className, children }) {
  return (
    <StyledCustomModal className={className} open>
      {children}
    </StyledCustomModal>
  );
}
