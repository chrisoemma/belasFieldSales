import styled from 'styled-components/native';
import {colors} from '../utils/colors';

export const TextInputField = styled.TextInput`
  font-family: 'Prompt-Regular';
  height: 60px;
  background-color: ${colors.white};
  border-radius: 25px;
  font-size: 14px;
  elevation:2;
  padding-horizontal: 10px;
`;
