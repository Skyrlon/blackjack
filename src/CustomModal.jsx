import styled from "styled-components";

const StyledCustomModal = styled.dialog`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  box-sizing: border-box;
  width: 20rem;
  height: 15rem;
  border-radius: 10%;
`;

export default function CustomModal({ className, children }) {
  return (
    <StyledCustomModal className={className} open>
      {children}
    </StyledCustomModal>
  );
}
