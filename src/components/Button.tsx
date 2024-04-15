import React from "react";
import { TouchableOpacityProps } from "react-native";

import { FontAwesome } from "@expo/vector-icons";
import styled from "styled-components/native";

interface Props extends TouchableOpacityProps {
  title: string;
  icon: React.ComponentProps<typeof FontAwesome>["name"];
}

const Container = styled.TouchableOpacity`
  width: 100%;
  height: 50px;
  padding: 10px;
  align-items: center;
  justify-content: center;
  background-color: red;
  margin-bottom: 8px;
  flex-direction: row;
`;

const Title = styled.Text`
  font-size: 15px;
  color: #ffffff;
  margin-left: 7px;
`;

export function Button({ title, icon, ... rest }: Props) {
  return (
    <Container {... rest}>
      <FontAwesome name={icon} color="#FFF" size={30} />
      <Title>{title}</Title>
    </Container>
  );
}
