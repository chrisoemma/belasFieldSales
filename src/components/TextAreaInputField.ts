import styled from 'styled-components/native';
import { colors } from '../utils/colors';

export const TextAreaInputField = styled.TextInput.attrs({
  multiline: true, // Enable multiline
})`
  font-family: 'Prompt-Regular';
  height: auto; /* Set height to auto to allow the component to expand vertically as needed */
  min-height: 100px; /* Set a minimum height to ensure the component is initially visible */
  background-color: ${colors.white};
  border-radius: 20px;
  font-size: 14px;
  padding-horizontal: 10px;
  border-width: 1px;
  border-color: ${colors.alsoLightGrey};
`;
